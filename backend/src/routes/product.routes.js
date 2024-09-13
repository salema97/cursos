const express = require("express");
const ProductController = require("../controllers/product.controllers");

const router = express.Router();

router.get("/get-all-products", ProductController.getAllProducts);

module.exports = router;
