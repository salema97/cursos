const { User, Role, Device } = require("../models/associations");
const Auth = require("../middlewares/auth.jwt");
const sequelize = require("../database");
const { sendVerifyEmail } = require("../utils/email.utils");

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

    await transaction.commit();

    const token = await Auth.createToken(newUser);

    sendVerifyEmail(email, token);

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

const login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message:
          "No se encontró el usuario con eel correo electrónico proporcionado.",
      });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        message: "El correo electrónico no ha sido verificado.",
      });
    }

    const passwordMatch = await Auth.verifyPassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "La contraseña proporcionada es incorrecta.",
      });
    }

    if (deviceId) {
      const existingDevice = await Device.findOne({ where: { deviceId } });
      if (existingDevice && existingDevice.userId !== user.id) {
        await existingDevice.destroy();
      }

      const newDevice = await Device.findOne({
        where: { deviceId, userId: user.id },
      });

      if (!newDevice) {
        await Device.create({ deviceId, userId: user.id });
      }
    }

    const token = await Auth.createToken(user);

    res.status(200).json({
      displayName: user.displayName,
      email: user.email,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al iniciar sesión: ${error.message}`,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const payload = Auth.verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        message: "El token proporcionado no es válido.",
      });
    }

    const email = payload.email;
    const user = await User.findOne({ where: { email } });
    if (user.emailVerified) {
      return res.status(400).json({
        message: "El correo electrónico ya ha sido verificado.",
      });
    }

    await user.update({ emailVerified: true });

    res.status(200).json({
      message: "Correo electrónico verificado correctamente.",
    });
  } catch (error) {
    res.status(400).json({
      message: `Ocurrió un error al verificar el correo electrónico: ${error.message}`,
    });
  }
};

module.exports = { register, login, verifyEmail };
