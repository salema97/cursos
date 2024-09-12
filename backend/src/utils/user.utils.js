const validateRegister = (req, res, next) => {
  try {
    const { displayName, name, email, password, deviceId } = req.body;

    if (!displayName) {
      return res.status(400).json({
        message: "Falta el nombre de visualización del usuario",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Falta el nombre del usuario",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Falta el correo electrónico del usuario",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Falta la contraseña del usuario",
      });
    }

    const displayNameRegExp = new RegExp(/^[a-zA-Z0-9]{3,}$/);
    if (!displayNameRegExp.test(displayName)) {
      return res.status(400).json({
        message:
          "El nombre de visualización del usuario debe tener al menos 3 caracteres y solo puede contener letras y números",
      });
    }

    const nameRegExp = new RegExp(/^[a-zA-Z]{3,}$/);
    if (!nameRegExp.test(name)) {
      return res.status(400).json({
        message:
          "El nombre del usuario debe tener al menos 3 caracteres y solo puede contener letras",
      });
    }

    const emailRegExp = new RegExp(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );

    if (!emailRegExp.test(email)) {
      return res.status(400).json({
        message:
          "El correo electrónico proporcionado no es válido. El correo electrónico debe tener el formato 'nombre@dominio.com'",
      });
    }

    const passwordRegExp = new RegExp(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/);

    if (!passwordRegExp.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña proporcionada no es válida. La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.",
      });
    }

    if (deviceId) {
      const deviceIdRegExp = new RegExp(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );

      if (!deviceIdRegExp.test(deviceId)) {
        return res.status(400).json({
          message:
            "El identificador del dispositivo debe tener al menos 8 caracteres y solo puede contener letras y números",
        });
      }
    }

    next();
  } catch (error) {
    console.error(
      "Ocurrió un error en la validación de datos del usuario: ",
      error
    );
  }
};

const validateLogin = (req, res, next) => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Falta el correo electrónico del usuario",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Falta la contraseña del usuario",
      });
    }

    const emailRegExp = new RegExp(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );

    if (!emailRegExp.test(email)) {
      return res.status(400).json({
        message:
          "El correo electrónico proporcionado no es válido. El correo electrónico debe tener el formato 'nombre@dominio.com'",
      });
    }

    const passwordRegExp = new RegExp(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/);

    if (!passwordRegExp.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña proporcionada no es válida. La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.",
      });
    }

    if (deviceId) {
      const deviceIdRegExp = new RegExp(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );

      if (!deviceIdRegExp.test(deviceId)) {
        return res.status(400).json({
          message:
            "El identificador del dispositivo debe tener al menos 8 caracteres y solo puede contener letras y números",
        });
      }
    }

    next();
  } catch (error) {
    console.error(
      "Ocurrió un error en la validación de datos del usuario: ",
      error
    );
  }
};

module.exports = { validateRegister, validateLogin };
