const { User } = require("../models/associations");

const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllUsers = async (_, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).json({
      message: "Usuario eliminado",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { addUser, getAllUsers, deleteUser };
