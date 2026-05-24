const mongoose = require('mongoose');

// Database Connection 
const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongo DB connected");
    } 
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = ConnectDB;
