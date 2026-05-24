// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./DatabaseConnect/db");
const cors = require("cors");


dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());  

// Serve Images 
app.use("/uploads", express.static("uploads"))

// Routers User
const auth = require('./Router/auth');
app.use('/api', auth);

// Routers product
const productRoutes = require('./Router/product');
app.use('/api', productRoutes);

// Routers product
const cartRoutes = require('./Router/cartRoutes');
app.use('/api', cartRoutes);

// Routers Address
const addressRoutes = require('./Router/addressRoutes');
app.use('/api', addressRoutes);

// Payment Route 
const paymentRoutes = require('./Router/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Order Route 
const orderRoutes = require('./Router/orderRoutes');
app.use('/api', orderRoutes);

// favorite Route 
const favoriteRoutes = require('./Router/favoriteRoutes');
app.use('/api', favoriteRoutes);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
