const express = require("express");
const router = express.Router();

const {
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome,
	updateHome,
	deleteHome
} = require("../controllers/homeController.js");

const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, createHome);
router.get("/", getHomes);
router.post("/", authenticateUser, createHome);

router.get("/:id/assets", getAssetsByHomeId)

router.get("/:id", getHomeById);
router.put("/:id", updateHome);


router.delete("/:id", deleteHome);


module.exports = router;
