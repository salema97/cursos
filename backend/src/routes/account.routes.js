const express = require("express");
const AuthControllers = require("../controllers/auth.controllers");
const { validateRegister, validateLogin } = require("../utils/user.utils");

const router = express.Router();

router.post("/register", validateRegister, AuthControllers.register);
router.post("/login", validateLogin, AuthControllers.login);
router.get("/verify-email", AuthControllers.verifyEmail);

module.exports = router;
