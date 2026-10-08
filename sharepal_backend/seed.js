const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/product_model');
const products = require('./data/product');

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected');

        // Remove existing products
        await Product.deleteMany({});

        // Insert all products
        const insertedProducts = await Product.insertMany(products);

        console.log(
            `${insertedProducts.length} products inserted successfully`
        );

        await mongoose.connection.close();

        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedProducts();