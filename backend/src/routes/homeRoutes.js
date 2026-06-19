const express = require("express");
const router = express.Router();

const {
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome,
	updateHome,
	deleteHome,
	getHomeMembers,
	addHomeMember,
	removeHomeMember
} = require("../controllers/homeController.js");

const authenticateUser = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {createHomeSchema, updateHomeSchema} = require("../validators/homeSchemas");

router.get("/", authenticateUser, getHomes);

router.post("/", authenticateUser, validateRequest(createHomeSchema), createHome);

router.get("/:id/assets", authenticateUser, getAssetsByHomeId);
router.get("/:id/members", authenticateUser, getHomeMembers);
router.post("/:id/members", authenticateUser, addHomeMember);

router.get("/:id", authenticateUser, getHomeById);

router.put("/:id", authenticateUser, validateRequest(updateHomeSchema), updateHome);

router.delete("/:id/members/:userId", authenticateUser, removeHomeMember);
router.delete("/:id", authenticateUser, deleteHome);

module.exports = router;
