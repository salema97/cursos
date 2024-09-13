const { Category } = require("../models/associations");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExist = await Category.findOne({ where: { name } });

    if (categoryExist) {
      return res.status(400).json({
        message: "La categoría ya existe",
      });
    }

    const newCategory = await Category.create({ name, description });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al crear la categoría: ${error.message}`,
    });
  }
};

const getAllCategories = async (_, res) => {
  try {
    const categories = await Category.findAll();

    if (categories.length <= 0) {
      res.status(400).json({ message: "No existe ninguna categoría" });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al obtener las categorías: ${error.message}`,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.query;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(400).json({
        message: "La categoría no existe",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al obtener la categoría: ${error.message}`,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(400).json({
        message: "La categoría no existe",
      });
    }

    const categoryExist = await Category.findOne({ where: { name } });

    if (categoryExist) {
      return res.status(400).json({
        message: "La categoría ya existe",
      });
    }

    await category.update({ name, description });

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al actualizar la categoría: ${error.message}`,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.query;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(400).json({
        message: "La categoría no existe",
      });
    }

    await category.destroy();

    res.status(200).json({ message: `Categoría ${id} eliminada` });
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al eliminar la categoría: ${error.message}`,
    });
  }
};

const streamGetAllCategories = (socket) => async (req, _) => {
  try {
    const categories = await Category.findAll();

    socket.emit("get-all-categories", categories);
  } catch (error) {
    socket.emit("get-all-categories", { error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  streamGetAllCategories,
};
