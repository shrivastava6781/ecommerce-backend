const express = require("express");
const FavoriteSchema = require("../Models/FavoriteSchema");

const router = express.Router();


// ================= ADD FAVORITE =================
router.post("/addFavorite", async (req, res) => {
  const { userId, id } = req.body;
  console.log("ADD HIT", userId, id);

  try {
    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or product id",
      });
    }

    let wishlist = await FavoriteSchema.findOne({ user: userId });

    if (wishlist) {
      const alreadyExists = wishlist.products.some(
        (item) => item.toString() === id
      );

      if (!alreadyExists) {
        wishlist.products.push(id);
      }
    } else {
      wishlist = new FavoriteSchema({
        user: userId,
        products: [id],
      });
    }

    await wishlist.save();

    // 🔥 IMPORTANT → return populated data
    const updatedWishlist = await FavoriteSchema.findOne({ user: userId })
      .populate("products");

    res.status(200).json({
      success: true,
      message: "Favorite added successfully",
      wishlist: updatedWishlist,
    });

  } catch (error) {
    console.log("ADD ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding favorite",
    });
  }
});


// ================= REMOVE FAVORITE =================
router.delete("/removeFavorite", async (req, res) => {
  const { userId, id } = req.body;
  console.log("DELETE HIT", userId, id);

  try {
    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or product id",
      });
    }

    let wishlist = await FavoriteSchema.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist already empty",
        wishlist: { products: [] },
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.toString() !== id
    );

    await wishlist.save();

    // 🔥 IMPORTANT → return populated data
    const updatedWishlist = await FavoriteSchema.findOne({ user: userId })
      .populate("products");

    res.status(200).json({
      success: true,
      message: "Favorite removed successfully",
      wishlist: updatedWishlist,
    });

  } catch (error) {
    console.log("DELETE ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Error removing favorite",
    });
  }
});


// ================= GET FAVORITES =================
router.get("/get/favorite/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await FavoriteSchema.findOne({ user: userId })
      .populate("products");

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: { products: [] },
      });
    }

    res.status(200).json({
      success: true,
      message: "Favorite fetched successfully",
      wishlist,
    });

  } catch (error) {
    console.log("GET ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching favorites",
    });
  }
});

module.exports = router;