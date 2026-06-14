const express = require("express");
const router = express.Router();

const {
	getHome,
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome,
	updateHome,
	deleteHome
} = require("../controllers/homeController.js");

router.get("/", getHomes);
router.post("/", createHome);

router.get("/:id/assets", getAssetsByHomeId)

router.get("/:id", getHomeById);
router.put("/:id", updateHome);

router.delete("/:id", deleteHome);


module.exports = router;
