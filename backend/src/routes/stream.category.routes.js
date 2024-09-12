const express = require("express");
const CategoryController = require("../controllers/category.controllers");

function StreamCategoryRoutes(io) {
  const router = express.Router();

  router.get(
    "/get-all-categories",
    CategoryController.streamGetAllCategories(io)
  );

  return router;
}

module.exports = StreamCategoryRoutes;
