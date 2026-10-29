const { Router } = require("express");
const razorpay = require("razorpay");
const crypto = require("crypto");
const asyncHandler = require("../asyncHandler");

const paymentRouter = Router();

// Create Orders
paymentRouter.post("/orders", asyncHandler(async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: "Payment service is not configured" });
    }
    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "A positive payment amount is required" });
    }

    const instance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
      amount: Math.round(amount),
      currency: "UGX",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({ data: order });
  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(502).json({ error: "Payment provider could not create the order" });
  }
}));

// Payment Verifying
paymentRouter.post("/verify", asyncHandler(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Order ID, payment ID, and signature are required" });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: "Payment service is not configured" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSign, "hex");
    const signatureBuffer = Buffer.from(razorpay_signature, "hex");
    if (expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
      return res.status(200).json({ message: "Payment verified successfully" });
    }
    return res.status(400).json({ message: "Invalid payment signature" });
  } catch (err) {
    console.error("Payment verification failed:", err);
    return res.status(500).json({ error: "Could not verify payment" });
  }
}));
module.exports = paymentRouter;
