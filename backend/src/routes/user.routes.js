const express = require("express");
const UserControllers = require("../controllers/user.controllers");

const router = express.Router();

router.post("/create-user", UserControllers.addUser);
router.get("/get-users", UserControllers.getAllUsers);
router.delete("/delete-user/:id", UserControllers.deleteUser);

module.exports = router;
