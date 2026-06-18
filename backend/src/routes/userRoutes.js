const express = require("express");
const router = express.Router();

const {getUsers} = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, getUsers);

module.exports = router;
