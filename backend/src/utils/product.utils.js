const { Op } = require("sequelize");

const getPagination = (pageNumber, pageSize) => {
  const limit = Math.min(pageSize, 50);
  const offset = (pageNumber - 1) * limit;
  return { limit, offset };
};

const getFilters = (search, categoryId) => {
  const filters = {
    name: {
      [Op.like]: `%${search.toLowerCase()}%`,
    },
  };

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  return filters;
};

const formattedProducts = (products) => {
  return products.rows.map((product) => {
    const { id, name, description, image, stock, price, category } = product;
    return {
      id,
      name,
      description,
      price: parseFloat(price),
      image,
      stock: parseInt(stock),
      category: category.name,
    };
  });
};

const validateProductData = (req, res, next) => {
  const { name, price, stock, categoryId } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "El campos name es obligatorio",
    });
  }

  if (!price) {
    return res.status(400).json({
      message: "El campos price es obligatorio",
    });
  }

  if (!stock) {
    return res.status(400).json({
      message: "El campos stock es obligatorio",
    });
  }

  if (!categoryId) {
    return res.status(400).json({
      message: "El ID de la categoría es obligatorio",
    });
  }

  if (typeof name !== "string" || name.length < 3) {
    return res.status(400).json({
      message: "El campo name debe ser un string con al menos 3 caracteres",
    });
  }

  if (isNaN(price.replace(",", "."))) {
    return res.status(400).json({
      message: "El precio no es un número valido",
    });
  }

  if (isNaN(stock)) {
    return res.status(400).json({
      message: "El stock no es un número valido",
    });
  }

  if (isNaN(price.replace(",", ".")) || price <= 0) {
    return res.status(400).json({
      message: "El campo price debe ser un número mayor a 0",
    });
  }

  if (isNaN(stock) || stock < 0) {
    return res.status(400).json({
      message: "El campo stock debe ser un número mayor o igual a 0",
    });
  }

  const priceRegex = /^\d{1,10}(\.\d{1,2})?$/;
  if (!priceRegex.test(price.replace(",", "."))) {
    return res.status(400).json({
      message: "El precio no puede tener mas de 2 decimales",
    });
  }

  next();
};

module.exports = {
  getPagination,
  getFilters,
  formattedProducts,
  validateProductData,
};
