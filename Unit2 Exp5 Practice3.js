import mongoose from "mongoose";

// Define a nested schema for product variants
const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  stock: Number
});

// Define main Product schema with nested variants
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  variants: [variantSchema]
});

export default mongoose.model("Product", productSchema);
import express from "express";
import mongoose from "mongoose";
import Product from "./models/Product.js";

const app = express();
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce_catalog")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// 🧱 Insert Sample Products
app.post("/insert-sample", async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "T-Shirt",
        price: 799,
        category: "Clothing",
        variants: [
          { color: "Red", size: "M", stock: 15 },
          { color: "Blue", size: "L", stock: 10 }
        ]
      },
      {
        name: "Sneakers",
        price: 2999,
        category: "Footwear",
        variants: [
          { color: "White", size: "8", stock: 8 },
          { color: "Black", size: "9", stock: 5 }
        ]
      },
      {
        name: "Watch",
        price: 1999,
        category: "Accessories",
        variants: [
          { color: "Silver", size: "Standard", stock: 20 }
        ]
      }
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: "Sample products inserted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛒 Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🏷️ Filter by category
app.get("/products/category/:category", async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  res.json(products);
});

// 🎯 Project variant details (color and stock)
app.get("/products/variants/details", async (req, res) => {
  const products = await Product.find({}, { name: 1, "variants.color": 1, "variants.stock": 1 });
  res.json(products);
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
