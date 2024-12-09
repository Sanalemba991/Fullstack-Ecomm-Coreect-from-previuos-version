import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js'; // Assuming `data` is imported from a file where `products` is defined.
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    await Product.deleteMany({});  // Use deleteMany instead of remove
    const createdProducts = await Product.insertMany(data.products);
    await User.deleteMany({});  // Use deleteMany instead of remove
    const createdUser = await User.insertMany(data.users);
    res.status(201).json({ message: 'Products seeded successfully', createdProducts, createdUser });
});

export default seedRouter;
