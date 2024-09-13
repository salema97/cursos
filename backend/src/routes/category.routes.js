const express = require("express");
const CategoryController = require("../controllers/category.controllers");
const { verifyRole } = require("../middlewares/auth.jwt");

const router = express.Router();

router.post(
  "/create-category",
  verifyRole("Admin"),
  CategoryController.createCategory
);
router.get("/get-all-categories", CategoryController.getAllCategories);
router.get("/get-category-by-id", CategoryController.getCategoryById);
router.put(
  "/update-category",
  verifyRole("Admin"),
  CategoryController.updateCategory
);
router.delete(
  "/delete-category",
  verifyRole("Admin"),
  CategoryController.deleteCategory
);

module.exports = router;
