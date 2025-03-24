import express from "express";
import cors from "cors";
import { AppDataSource } from "./database";
import multer from "multer";
import { ProductController } from "./controllers/ProductController";

const app = express();
app.use(express.json());
app.use(cors());

// Multer Configuration (File Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database Connected");

    // ✅ Routes
    app.get("/products", ProductController.getProducts.bind(ProductController));
    app.get("/products/:id", ProductController.getProductById.bind(ProductController)); // ✅ Get Product by ID
    app.get("/search", ProductController.searchProducts.bind(ProductController)); // ✅ Search Products
    app.post("/products/add",upload.single("image"), ProductController.addProduct.bind(ProductController));
    app.put("/products/:id", ProductController.updateProduct.bind(ProductController));
    app.delete("/products/:id", ProductController.deleteProduct.bind(ProductController));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
    process.exit(1);
  });
