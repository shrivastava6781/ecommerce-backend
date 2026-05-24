// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../Models/Product'); // Assuming you have a Product model
const User = require('../Models/user'); // User model
const Cart = require('../Models/Cart'); // Cart model

// Add product to cart
router.post('/add/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // 1. Find product
    const productData = await Product.findById(productId);

    if (!productData) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // 2. Find cart
    let cartItems = await Cart.findOne({ userId });

    if (cartItems) {
      // 3. Check if product exists
      const itemIndex = cartItems.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // ✅ Update quantity
        cartItems.items[itemIndex].quantity += quantity;
      } else {
        // ➕ Add new product
        cartItems.items.push({
          productId,
          name: productData.name,
          price: productData.price,
          quantity,
          image: productData.image,
        });
      }

      // 💰 Recalculate total
      cartItems.totalAmount = cartItems.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cartItems.save();

      return res.status(200).json({
        message: "Cart updated successfully",
        cart: cartItems,
      });

    } else {
      // 🆕 Create new cart
      const newCartData = await Cart.create({
        userId,
        items: [
          {
            productId,
            name: productData.name,
            price: productData.price,
            quantity,
            image: productData.image,
          },
        ],
        totalAmount: productData.price * quantity,
      });

      return res.status(200).json({
        message: "Cart created successfully",
        cart: newCartData,
      });
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});


router.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cartData = await Cart.findOne({ userId });

    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      cartData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
});

router.put("/cart/update", async (req, res) => {
  try {
    const {  userId, productId, quantity } = req.body;

    const cartData = await Cart.findOne({ userId });

    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cartData.items.findIndex((item)=>
      item.productId.toString() == productId
    )
    
    if(itemIndex == -1){
      return res.status(404).json({ message: "Product not in cart" });
    }
    // ❗ If quantity = 0 → remove item
    if (quantity <= 0) {
      cartData.items.splice(itemIndex, 1);
    } else {
      cartData.items[itemIndex].quantity = quantity;
    }
    cartData.totalAmount = cartData.items.reduce(
      (acc,item)=> acc + item.price * item.quantity,0
    )
    await cartData.save()
    res.status(200).json({
      message: "Cart update successfully",
      cartData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
});

router.delete("/cart/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cartData = await Cart.findOne({ userId });

    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log(cartData.items)
    cartData.items = cartData.items.filter(
      (item) => item.productId.toString() !== productId
    );
    console.log(cartData.items)


    // 💰 Recalculate total
    cartData.totalAmount = cartData.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cartData.save();

    res.status(200).json({
      message: "Item removed",
      cartData,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/cart/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cartData = await Cart.findOne({ userId });

    if (!cartData) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    // clear items
    cartData.items = [];

    // reset total
    cartData.totalAmount = 0;

    await cartData.save();

    res.status(200).json({
      message: "Cart cleared successfully",
      cartData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
});

module.exports = router;
