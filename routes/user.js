const express = require("express");
const router = express.Router();

const { getUserById, getUser, getAllUser } = require("../controllers/user");
const { isLoggedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId", isLoggedIn, isAuthenticated, getUser);
router.get("/users", getAllUser);

module.exports = router;
