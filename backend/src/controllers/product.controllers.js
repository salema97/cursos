const { Product, Category } = require("../models/associations");
const {
  getPagination,
  getFilters,
  formattedProducts,
  deleteUploadProductImage,
} = require("../utils/product.utils");
const path = require("path");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const { categoryId } = req.body;
    var createProduct;

    const existCategory = await Category.findOne({ where: { id: categoryId } });

    if (!existCategory) {
      deleteUploadProductImage(req.file.path);
      return res.status(400).json({ message: "La categoría no existe" });
    }

    if (!req.file) {
      createProduct = req.body;
    } else {
      createProduct = {
        ...req.body,
        image: "/uploads/products/images/" + req.file.filename,
      };
    }

    const newProduct = await Product.create(createProduct);

    if (!newProduct) {
      deleteUploadProductImage(req.file.path);
      return res.status(400).json({ message: "No se pudo crear el producto" });
    }

    return res.status(201).json(createProduct);
  } catch (error) {
    deleteUploadProductImage(req.file.path);
    return res.status(400).json({
      message: `Ocurrió un error al crear el producto: ${error.message}`,
    });
  }
};

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
      return res.status(400).json({ message: "No existe ningún producto" });
    }

    const response = {
      pageSize: limit,
      pageNumber,
      pageCount,
      totalProducts,
      data: formattedProducts(products),
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      message: `Ocurrió un error al obtener los productos: ${error.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      message: `Ocurrió un error al obtener el producto: ${error.message}`,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findByPk(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    let newImagePath = existingProduct.image;
    if (req.file) {
      if (existingProduct.image) {
        const existingImagePatch = path.join(
          __dirname,
          "../..",
          existingProduct.image
        );
        if (fs.existsSync(existingImagePatch)) {
          fs.unlinkSync(existingImagePatch);
        }
      }
      newImagePath = "/uploads/products/images/" + req.file.filename;
    }

    const product = {
      ...req.body,
      image: newImagePath,
    };

    const updateProduct = await existingProduct.update(product);

    if (!updateProduct) {
      return res
        .status(400)
        .json({ message: "No se pudo actualizar el producto" });
    }

    return res.status(200).json(updateProduct);
  } catch (error) {
    return res.status(400).json({
      message: `Ocurrió un error al actualizar el producto: ${error.message}`,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.image) {
      const existingImagePatch = path.join(__dirname, "../..", product.image);
      if (fs.existsSync(existingImagePatch)) {
        fs.unlinkSync(existingImagePatch);
      }
    }

    await product.destroy();

    return res.status(200).json({ message: "Producto eliminado" });
  } catch (error) {
    return res.status(400).json({
      message: `Ocurrió un error al eliminar el producto: ${error.message}`,
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
