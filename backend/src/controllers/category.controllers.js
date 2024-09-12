const { Category } = require("../models/associations");

const streamGetAllCategories = (socket) => async (req, _) => {
  try {
    const categories = await Category.findAll();

    socket.emit("get-all-categories", categories);
  } catch (error) {
    socket.emit("get-all-categories", { error: error.message });
  }
};

module.exports = { streamGetAllCategories };
