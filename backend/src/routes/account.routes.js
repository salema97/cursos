const express = require("express");
const AuthControllers = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);
router.get("/verify-email", AuthControllers.verifyEmail);

module.exports = router;
