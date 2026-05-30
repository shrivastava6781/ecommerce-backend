const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        // NORMAL PRODUCT
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

        // COMMON
        name: String,
        price: Number,
        quantity: Number,
        image: String,

        // CUSTOM PRODUCT
        baseProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        printDesignId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        uploadedDesign: String,

        previewImage: String,

        size: String,

        color: String,

        printPosition: {
          type: String,
          enum: ["front", "back", "leftSleeve", "rightSleeve"],
          default: "front",
        },

        designConfig: {
          x: Number,
          y: Number,
          width: Number,
          rotation: Number,
        },
      },
    ],

    address: {
      fullName: String,
      phone: String,
      pincode: String,
      state: String,
      city: String,
      house: String,
      area: String,
      landmark: String,
      addressType: String,
    },

    amount: Number,

    paymentId: String, // Razorpay payment id

    orderStatus: {
      type: String,
      default: "Pending", // Pending, Paid, Shipped, Delivered
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);