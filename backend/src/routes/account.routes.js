const express = require("express");
const AuthControllers = require("../controllers/auth.controllers");
const {
  validateRegister,
  validateLogin,
  validatePassword,
} = require("../utils/user.utils");

const router = express.Router();

router.post("/register", validateRegister, AuthControllers.register);
router.post("/login", validateLogin, AuthControllers.login);
router.get("/verify-email", AuthControllers.verifyEmail);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post("/reset-password", validatePassword, AuthControllers.resetPassword);

module.exports = router;
