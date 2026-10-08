const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },

    name: {
      type: String,
      trim: true,
      default: ""
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },

    otpHash: {
      type: String,
      default: "",
      select: false
    },

    otpExpiresAt: {
      type: Date,
      default: null,
      select: false
    },

    otpAttempts: {
      type: Number,
      default: 0,
      select: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);