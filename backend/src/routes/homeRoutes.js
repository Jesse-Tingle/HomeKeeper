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
router.get("/", authenticateUser, getHomes);
router.post("/", authenticateUser, createHome);

router.get("/:id/assets", authenticateUser, getAssetsByHomeId)

router.get("/:id", authenticateUser, getHomeById);
router.put("/:id", authenticateUser, updateHome);


router.delete("/:id", authenticateUser, deleteHome);


module.exports = router;
