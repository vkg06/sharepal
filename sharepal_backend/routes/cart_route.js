const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/cart_controller");

const {
  requireAuth
} = require("../middleware/auth_middleware");

router.get(
  "/",
  requireAuth,
  controller.getCart
);

router.post(
  "/items/:id",
  requireAuth,
  controller.addToCart
);

router.put(
  "/items/:id",
  requireAuth,
  controller.updateCartItem
);

router.delete(
  "/items/:id",
  requireAuth,
  controller.removeFromCart
);

router.delete(
  "/",
  requireAuth,
  controller.clearCart
);

module.exports = router;