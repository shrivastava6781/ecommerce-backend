const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      require: true
    },
    price: {
      type: Number,
      require: true
    },
    discount: {
      type: Number,
      require: true
    },
    rating: {
      type: Number,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    },
    category: {
      type: String,
      require: true
    },
    image: {
      type: String,
    },
}, 
{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);
