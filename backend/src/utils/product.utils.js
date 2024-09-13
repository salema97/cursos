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
      price: parseFloat(price.toFixed(2)),
      image,
      stock: parseInt(stock),
      category: category.name,
    };
  });
};

module.exports = { getPagination, getFilters, formattedProducts };
