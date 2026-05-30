const express = require("express");
const router = express.Router();
const Order = require("../Models/orderSchema");

// Save Order
router.post("/order", async (req, res) => {
  try {
    const {
      userId,
      items,
      address,
      amount,
      paymentId,
    } = req.body;

    const formattedItems = items.map((item) => ({
      // Common
      productType: item.productType || "normal",
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,

      // Normal Product
      productId: item.productId,

      // Custom Product
      baseProductId: item.baseProductId,
      printDesignId: item.printDesignId,
      uploadedDesign: item.uploadedDesign,
      previewImage: item.previewImage,
      size: item.size,
      color: item.color,
      printPosition: item.printPosition,
      designConfig: item.designConfig,
    }));

    const newOrder = new Order({
      userId,
      items: formattedItems,
      address,
      amount,
      paymentId,
      orderStatus: "Paid",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error saving order",
    });
  }
});


// 🔥 Get Orders of User (optional but useful)
router.get("/order/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;