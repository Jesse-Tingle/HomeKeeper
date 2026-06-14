const express = require("express");
const router = express.Router();

const {
	getHome,
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome,
	updateHome
} = require("../controllers/homeController.js");

router.get("/", getHomes);
router.post("/", createHome);

router.get("/:id/assets", getAssetsByHomeId)

router.get("/:id", getHomeById);
router.put("/:id", updateHome);


module.exports = router;
