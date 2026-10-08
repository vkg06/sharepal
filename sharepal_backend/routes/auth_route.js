const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth_controller");
const { requireAuth } = require("../middleware/auth_middleware");

router.post(
  "/send-otp",
  authController.sendOtp
);

router.post(
  "/verify-otp",
  authController.verifyOtp
);

router.get(
  "/me",
  requireAuth,
  authController.me
);

module.exports = router;