const express = require('express');
const router = express.Router();
const Wishlist = require('../Models/Wishlist');
const Product = require('../Models/Product');

// Get wishlist products for a user
router.get('/:userId', async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.params.userId }).populate('productId');
        const products = wishlistItems.map(item => item.productId);
        res.status(200).json({ wishlist: products });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
});

// Add product to wishlist
router.post('/add', async (req, res) => {
  console.log("wishlist add `1234")
    const { userId, productId } = req.body;

    try {
        const existing = await Wishlist.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        const newWishlistItem = new Wishlist({ userId, productId });
        await newWishlistItem.save();
        res.status(201).json({ message: "Product added to wishlist" });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ error: "Failed to add to wishlist" });
    }
});

// Remove product from wishlist
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        await Wishlist.findOneAndDelete({ userId, productId });
        res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ error: "Failed to remove from wishlist" });
    }
});

module.exports = router;
