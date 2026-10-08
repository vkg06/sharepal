const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/product_route");
const contentRoutes = require("./routes/content_route");
const interactionRoutes = require("./routes/interaction_route");
const authRoutes = require("./routes/auth_route");
const cartRoutes = require("./routes/cart_route");
const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


app.use(express.json());


app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    req.headers.origin || "*"
  );

  res.header("Vary", "Origin");

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-client-id"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to SharePal Backend Server!",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/cart", cartRoutes);
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Add it to backend/.env"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing. Add it to backend/.env"
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();