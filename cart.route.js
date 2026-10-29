const { Router } = require("express");
const Cart = require("../model/cartSchema");
const asyncHandler = require("../asyncHandler");
const cartRouter = Router();

cartRouter.post("/cart", asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [req.body];
  const hasInvalidItem = items.length === 0 || items.some((item) =>
    !item || typeof item !== "object" || Array.isArray(item) ||
    !String(item.title || "").trim() || !Number.isInteger(Number(item.qty)) || Number(item.qty) < 1
  );
  if (hasInvalidItem) return res.status(400).json({ error: "Each cart item requires a title and a positive integer quantity" });

  const addedItems = await Cart.insertMany(items);
  return res.status(201).json(Array.isArray(req.body) ? addedItems : addedItems[0]);
}));

cartRouter.get("/cart", asyncHandler(async (req, res) => {
  const cart = await Cart.find();
  return res.json(cart);
}));

cartRouter.delete("/cart/:id", asyncHandler(async (req, res) => {
  const result = await Cart.deleteOne({ _id: req.params.id });
  if (!result.deletedCount) return res.status(404).json({ error: "Cart item not found" });
  return res.json({ message: "Cart item deleted" });
}));

cartRouter.put("/cart/:id", asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Cart item updates are required" });
  }
  const { id } = req.params;
  if (req.body.qty === 0) {
    const result = await Cart.deleteOne({ _id: id });
    if (!result.deletedCount) return res.status(404).json({ error: "Cart item not found" });
    return res.json({ message: "Cart item deleted" });
  }
  const cartItem = await Cart.findByIdAndUpdate(id, { $set: req.body }, { new: true });
  if (!cartItem) return res.status(404).json({ error: "Cart item not found" });
  return res.json(cartItem);
}));
module.exports = cartRouter;
