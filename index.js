const express = require("express");
const connection = require("./Database/db");
const mongoose = require("mongoose");
const userAuthRouter = require("./routes/userAuth.route");
const paymentRouter = require("./routes/paymentIntegrate.route");
const menuRouter = require("./routes/menu.route");
const cartRouter = require("./routes/cart.route");
const searchRouter = require("./routes/serach.route");
const landingRouter = require("./routes/landing.route");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`KFC API Server started on localhost:${PORT}`);
});

server.use("/Auth", userAuthRouter);
server.use("/api/home", landingRouter);
server.use("/api/searchapi", searchRouter);
server.use("/api/product", menuRouter);
server.use("/api/productcart", cartRouter);
server.use("/api/payment", paymentRouter);

server.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

server.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  console.error("API request failed:", error);
  const status = error.status || error.statusCode || (error.name === "CastError" ? 400 : 500);
  res.status(status).json({
    error: status >= 500 ? "Internal server error" : error.message,
  });
});

const PORT = Number(process.env.PORT) || 8080;

const startServer = async () => {
  try {
    await connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
    return;
  }

  const httpServer = server.listen(PORT, () => {
    console.log("Connected to Database");
    console.log(`Started on http://localhost:${PORT}/`);
  });

  httpServer.on("error", async (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing backend or set a different PORT in Backend/.env.`);
    } else {
      console.error("Backend failed to start:", error.message);
    }
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  });
};

startServer();
