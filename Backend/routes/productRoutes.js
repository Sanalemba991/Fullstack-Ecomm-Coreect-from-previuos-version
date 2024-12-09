import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

// Get all products
productRouter.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: "Error fetching products" });
  }
});

// Get a product by slug
productRouter.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching product by slug" });
  }
});

// Get a product by ID
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching product by ID" });
  }
});

export default productRouter;
