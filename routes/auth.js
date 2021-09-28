const express = require("express");

const router = express.Router();

// controllers
const { requireSignin } = require("../middlewares");

// controller
const { createOrUpdateUser, register, login, logout, currentUser } = require("../controllers/auth");

router.post("/register", register)
router.post("/create-or-update-user", createOrUpdateUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);

module.exports = router;