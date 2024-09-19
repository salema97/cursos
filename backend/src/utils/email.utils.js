const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerifyEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationURL = `${process.env.BASE_URL}/api/account/verify-email?token=${token}`;

    const mailOptions = {
      from: `"KAIZEN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifica tu cuenta de correo",
      text: `Haz click en el siguiente enlace para verificar tu cuenta de correo: ${verificationURL}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${email}: ${info.messageId}`);
  } catch (error) {
    console.error(
      `Error al enviar el correo de verificación: ${error.message}`
    );
  }
};

const sendResetPasswordEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetPasswordURL = `${process.env.BASE_URL}/api/account/reset-password?token=${token}`;

    const mailOptions = {
      from: `"KAIZEN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablece tu contraseña",
      text: `Haz click en el siguiente enlace para restablecer tu contraseña: ${resetPasswordURL}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Correo de restablecimiento de contraseña enviado a ${email}: ${info.messageId}`
    );
  } catch (error) {
    console.error(
      `Error al enviar el correo de restablecimiento de contraseña: ${error.message}`
    );
  }
};

module.exports = { sendVerifyEmail, sendResetPasswordEmail };
