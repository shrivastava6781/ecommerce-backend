const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      // NORMAL OR CUSTOM
      productType: {
        type: String,
        enum: ["normal", "custom"],
        default: "normal",
      },

      // BASIC DETAILS
      name: String,
      price: Number,
      quantity: Number,
      image: String,

      // CUSTOM PRODUCT FIELDS
      baseProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      printDesignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      uploadedDesign: {
        type: String,
      },

      // Final Generated Preview
      previewImage: {
        type: String,
      },

      // Selected Size
      size: {
        type: String,
      },

      // Selected Color
      color: {
        type: String,
      },

      // Print Position
      printPosition: {
        type: String,
        enum: ["front", "back", "leftSleeve", "rightSleeve"],
        default: "front",
      },
    },
  ],

  totalAmount: Number,
});

module.exports = mongoose.model("Cart", cartSchema);