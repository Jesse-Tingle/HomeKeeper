const express = require("express");
const router = express.Router();

const { getHome, getHomes } = require("../controllers/homeController.js");

router.get("/", getHomes);

module.exports = router;