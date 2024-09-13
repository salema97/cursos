const { Product, Category } = require("../models/associations");
const {
  getPagination,
  getFilters,
  formattedProducts,
} = require("../utils/product.utils");

const getAllProducts = async (req, res) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 8;
    const { limit, offset } = getPagination(pageNumber, pageSize);
    const search = req.query.search || "";
    const categoryId = Number(req.query.categoryId);
    const orderBy = req.query.orderBy || "name";
    const orderType = req.query.orderType || "ASC";

    const filters = getFilters(search, categoryId);
    const totalProducts = await Product.count({ where: filters });
    const pageCount = Math.ceil(totalProducts / limit);

    let includeOptions = [
      {
        model: Category,
        as: "category",
        attributes: ["name"],
      },
    ];

    const products = await Product.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [[orderBy, orderType]],
      include: includeOptions,
    });

    if (products.count <= 0) {
      res.status(400).json({ message: "No existe ningún producto" });
    }

    const response = {
      pageSize: limit,
      pageNumber,
      pageCount,
      totalProducts,
      data: formattedProducts(products),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al obtener los productos: ${error.message}`,
    });
  }
};

module.exports = { getAllProducts };
