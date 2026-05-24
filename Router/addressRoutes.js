const express = require('express');
const addressSchema = require('../Models/addressSchema');
const router = express.Router();

// Add product to cart
router.post('/address/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, phone, pincode, state, city, house, area, landmark, addressType } = req.body;
    console.log(userId, fullName, phone, pincode, state, city, house, area, landmark, addressType)

    // 🔍 Find existing user address document
    let userAddress = await addressSchema.findOne({ userId });
    console.log("userAddress", userAddress)

    if (userAddress) {
      // ➕ Add new address
      userAddress.addressData.push({ fullName, phone, pincode, state, city, house, area, landmark, addressType});

      await userAddress.save();

      return res.status(200).json({
        message: "Address added successfully",
        data: userAddress,
      });
    } else {
      // 🆕 Create new document
      const newAddress = new addressSchema({
        userId,
        addressData: [
          { fullName, phone, pincode, state, city, house, area, landmark, addressType },
        ],
      });

      await newAddress.save();

      return res.status(201).json({
        message: "Address created successfully",
        data: newAddress,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

router.get("/get/address/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const addressData = await addressSchema.findOne({ userId });

    if (!addressData) {
      return res.status(404).json({ message: "addressSchema not found" });
    }

    res.status(200).json({
      message: "addressSchema fetched successfully",
      addressData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch addressSchema",
      error: error.message,
    });
  }
});

module.exports = router;
