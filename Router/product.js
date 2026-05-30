const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
const upload = require('../middlewares/multer');

router.post('/products', upload.single('image'), async (req, res) => {
    try {   
        const { name, price, discount, rating, description, type ,category } = req.body;

        const newProduct = await Product.create({
            name, 
            price, 
            discount, 
            rating, 
            description,
            type ,
            category,
            image: req.file ? req.file.path : null,
        });

        res.status(201).json({
            message: "Added Successfully",
            product: newProduct
        });
    } 
    catch (error) {
        res.status(500).json({ error: 'Error creating product', details: error.message });
    }
});

// Get all products
router.get('/get/products', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.status(200).json({
            message: "All Products",
            product: allProducts
        });
    } 
    catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
});

// Get a single product by its ID
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product",
            product: product
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product details", error: err });
    }
});


module.exports = router;
