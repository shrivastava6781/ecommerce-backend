const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addressData: [
    {
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
  ],
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);