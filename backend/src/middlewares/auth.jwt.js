const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const secretWord = process.env.SECRET_WORD_PASSWORD;

    const hashedPassword = await bcrypt.hash(secretWord + password, salt);

    return hashedPassword;
  } catch (error) {
    console.log("Ocurrió un error al encriptar la contraseña: ", error);
  }
};

const createToken = async (user) => {
  try {
    const roles = await user.getRoles();
    const rolesNames = roles.map((role) => role.name);

    const payload = {
      displayName: user.displayName,
      email: user.email,
      roles: rolesNames,
    };

    const secretWordToken = process.env.SECRET_WORD_TOKEN;
    const options = {
      expiresIn: process.env.EXPIRATION_TOKEN,
      issuer: process.env.ISSUER_TOKEN,
    };

    const token = jwt.sign(payload, secretWordToken, options);

    return token;
  } catch (error) {
    console.log("Ocurrió un error al crear el token: ", error);
  }
};

const verifyToken = (token) => {
  try {
    const secretWordToken = process.env.SECRET_WORD_TOKEN;
    const payload = jwt.verify(token, secretWordToken);

    return payload;
  } catch (error) {
    console.log("Ocurrió un error al verificar el token: ", error);
  }
};

const verifyRole =
  (...requireRoles) =>
  (req, res, next) => {
    try {
      let token = req.headers["Authorization"];

      if (!token) {
        return res.status(403).json({
          message: "No se proporcionó un token",
        });
      }

      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }

      const payload = verifyToken(token);

      if (!payload) {
        return res.status(403).json({
          message: "Token inválido",
        });
      }

      req.user = payload;

      const userRoles = payload.roles;
      const hasRequiredRole = requireRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({
          message: "No tienes permisos para realizar esta acción",
        });
      }

      next();
    } catch (error) {
      console.log("Ocurrió un error al verificar el rol: ", error);
    }
  };

const verifyPassword = async (password, hashedPassword) => {
  try {
    const secretWord = process.env.SECRET_WORD_PASSWORD;
    const result = await bcrypt.compare(secretWord + password, hashedPassword);

    return result;
  } catch (error) {
    console.log("Ocurrió un error al verificar la contraseña: ", error);
  }
};

module.exports = {
  encryptPassword,
  createToken,
  verifyToken,
  verifyRole,
  verifyPassword,
};
