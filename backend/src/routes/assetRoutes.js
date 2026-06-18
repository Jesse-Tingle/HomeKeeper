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

router.get("/:id/maintenance-events", getMaintenanceEventsByAssetId);

router.post("/", authenticateUser, createAsset);
router.post("/maintenance-events", authenticateUser, createMaintenanceEvent);
router.post("/maintenance-events", authenticateUser, createMaintenanceEvent);

router.put("/maintenance-events/:id", updateMaintenanceEvent);
router.delete("/maintenance-events/:id", deleteMaintenanceEvent);
router.delete("/:id", deleteAsset);

router.put("/:id", updateAsset);

router.get("/:id", getAssetById);


module.exports = router;
