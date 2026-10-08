const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        default: 0
    },

    booked_count: {
        type: Number,
        default: 0
    },

    tag: {
        type: String,
        default: ""
    },

    per_day_rent: {
        type: Number,
        required: true
    },

    out_of_stock: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;