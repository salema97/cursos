const { User, Role, Device } = require("../models/associations");
const Auth = require("../middlewares/auth.jwt");
const sequelize = require("../database");

const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { displayName, name, email, password, deviceId } = req.body;

    const userExist = await User.findOne({ where: { email } }, { transaction });

    if (userExist) {
      await transaction.rollback();
      return res.status(400).json({
        message: "El correo electrónico proporcionado ya esta en uso",
      });
    }

    const hashedPassword = await Auth.encryptPassword(password);

    const newUser = await User.create(
      {
        displayName,
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
      },
      { transaction }
    );

    const roleUser = await Role.findOne(
      { where: { name: "User" } },
      { transaction }
    );

    if (roleUser) {
      await newUser.setRoles([roleUser.id], { transaction });
    }

    if (deviceId) {
      const existingDevice = await Device.findOne(
        { where: { deviceId } },
        { transaction }
      );

      if (existingDevice) {
        await existingDevice.destroy({ transaction });
      }

      const newDevice = await Device.create({ deviceId }, { transaction });
      await newUser.addDevice(newDevice, { transaction });
    }

    const token = await Auth.createToken(newUser);

    await transaction.commit();
    res.status(201).json({
      displayName: newUser.displayName,
      email: newUser.email,
      token: token,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      message: `Ocurrió un error al registrar el usuario: ${error.message}`,
    });
  }
};

module.exports = { register };
