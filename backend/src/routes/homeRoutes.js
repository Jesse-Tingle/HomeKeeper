const express = require("express");
const router = express.Router();

const {
	getHome,
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome
} = require("../controllers/homeController.js");

router.get("/", getHomes);
router.post("/", createHome);

router.get("/:id/assets", getAssetsByHomeId)
router.get("/:id", getHomeById);


module.exports = router;
