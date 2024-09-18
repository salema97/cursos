const express = require("express");
const ProductController = require("../controllers/product.controllers");
const { validateProductData } = require("../utils/product.utils");
const uploadProduct = require("../utils/multer.config");

const router = express.Router();

router.get("/get-all-products", ProductController.getAllProducts);
router.post(
  "/create-product",
  uploadProduct.single("image"),
  validateProductData,
  ProductController.createProduct
);
router.get("/get-product-by-id/:id", ProductController.getProductById);
//router.put("/update-product", ProductController.updateProduct);
router.delete("/delete-product/:id", ProductController.deleteProduct);

router.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

module.exports = router;
