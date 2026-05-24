const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
        name: String,
        price: Number,
        quantity: Number,
        image: String,
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