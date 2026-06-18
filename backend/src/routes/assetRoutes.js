const express = require("express");
const router = express.Router();

const {
	getAssetById,
	getMaintenanceEventsByAssetId,
	createAsset,
	createMaintenanceEvent,
	updateAsset,
	updateMaintenanceEvent,
	deleteMaintenanceEvent,
	deleteAsset
} = require("../controllers/assetController");

const authenticateUser = require("../middleware/authMiddleware");

router.get("/:id/maintenance-events", authenticateUser, getMaintenanceEventsByAssetId);

router.post("/", authenticateUser, createAsset);
router.post("/maintenance-events", authenticateUser, createMaintenanceEvent);
router.post("/maintenance-events", authenticateUser, createMaintenanceEvent);

router.put("/maintenance-events/:id", authenticateUser, updateMaintenanceEvent);
router.delete("/maintenance-events/:id", authenticateUser, deleteMaintenanceEvent);
router.delete("/:id", authenticateUser, deleteAsset);

router.put("/:id", authenticateUser, updateAsset);

router.get("/:id", authenticateUser, getAssetById);


module.exports = router;
