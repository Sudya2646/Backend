import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Product } from "../entities/Product";
import { Express } from "express"; // ✅ Import Express to extend types

// ✅ Define a custom request type to include the file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class ProductController {
  // ✅ Fetch All Products
  static async getProducts(req: Request, res: Response) {
    try {
      console.log("🔄 Fetching all products...");
      const productRepo = AppDataSource.getRepository(Product);
      const products = await productRepo.find();
      console.log("📝 Products:", products);
      res.json(products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      res.status(500).json({ error: "Database query failed" });
    }
  }

  // ✅ Fetch Product by ID
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`🔍 Fetching product with ID: ${id}`);

      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: Number(id) } });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      res.status(500).json({ error: "Database query failed" });
    }
  }

  // ✅ Search Products
  static async searchProducts(req: Request, res: Response) {
    try {
      const { sku, name, price } = req.query;
      console.log("🔍 Searching products with filters:", req.query);

      const productRepo = AppDataSource.getRepository(Product);
      const queryBuilder = productRepo.createQueryBuilder("product");

      if (sku) {
        queryBuilder.andWhere("product.sku LIKE :sku", { sku: `%${sku}%` });
      }
      if (name) {
        queryBuilder.andWhere("product.name LIKE :name", { name: `%${name}%` });
      }
      if (price) {
        queryBuilder.andWhere("product.price = :price", { price: Number(price) });
      }

      const products = await queryBuilder.getMany();
      console.log("🔍 Search Results:", products);
      res.json(products);
    } catch (error) {
      console.error("❌ Error searching products:", error);
      res.status(500).json({ error: "Database search failed" });
    }
  }

  // ✅ Add Product (Updated to Handle File Upload)
  static async addProduct(req: MulterRequest, res: Response): Promise<void> {
    try {
      const { sku, name, price } = req.body;
  
      // ✅ Retrieve two images from request
      const image = req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).image
        ? req.files["image"][0].filename
        : null;
  
      const image1 = req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).image1
        ? req.files["image1"][0].filename
        : null;
  
      const productRepo = AppDataSource.getRepository(Product);
  
      // ✅ Save both images in the database
      const newProduct = productRepo.create({ sku, name, price, image, image1 });
      await productRepo.save(newProduct);
  
      res.status(201).json({ message: "✅ Product added!", product: newProduct });
    } catch (error) {
      console.error("❌ Error adding product:", error);
      res.status(500).json({ message: "❌ Error adding product", error });
    }
  }
  

  // ✅ Update Product
  static async updateProduct(req: MulterRequest, res: Response) {
    try {
      const { id } = req.params;
      console.log(`✏️ Updating product with ID: ${id}`);
  
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: Number(id) } });
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Extract updated fields from request
      const { sku, name, price } = req.body;
      
      // ✅ Keep existing image if no new file is uploaded
      const image = req.file ? req.file.filename : product.image;
  
      // ✅ Update the product
      await productRepo.update(id, { sku, name, price, image });
  
      // ✅ Fetch updated product and return it
      const updatedProduct = await productRepo.findOne({ where: { id: Number(id) } });
  
      res.json({ message: `✅ Product ID ${id} updated successfully`, product: updatedProduct });
    } catch (error) {
      console.error("❌ Error updating product:", error);
      res.status(500).json({ error: "Database update failed" });
    }
  }
  


  // ✅ Delete Product by ID
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`🗑️ Deleting product with ID: ${id}`);

      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({ where: { id: Number(id) } });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      await productRepo.remove(product);
      console.log(`✅ Product ID ${id} deleted successfully`);
      res.json({ message: `✅ Product ID ${id} deleted successfully` });
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      res.status(500).json({ error: "Database delete failed" });
    }
  }
}
