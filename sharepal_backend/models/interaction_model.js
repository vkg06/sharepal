const mongoose = require("mongoose");

const interactionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true
      },

      clientId: {
        type: String,
        default: "",
        index: true
      },

      type: {
        type: String,
        enum: [
          "wishlist",
          "notify",
          "vote",
          "rental"
        ],
        required: true
      },

      productId: {
        type: Number
      },

      payload: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    },
    {
      timestamps: true
    }
  );

interactionSchema.index({
  userId: 1,
  type: 1,
  productId: 1
});

module.exports =
  mongoose.model(
    "Interaction",
    interactionSchema
  );