const express = require("express");
const router = express.Router();

const {
	getAssetById,
	getMaintenanceEventsByAssetId,
	createAsset,
	createMaintenanceEvent,
	updateAsset,
	updateMaintenanceEvent,
	deleteMaintenanceEvent
} = require("../controllers/assetController");

router.get("/:id/maintenance-events", getMaintenanceEventsByAssetId);

router.post("/", createAsset);
router.post("/maintenance-events", createMaintenanceEvent);

router.put("/maintenance-events/:id", updateMaintenanceEvent);
router.delete("/maintenance-events/:id", deleteMaintenanceEvent);

router.put("/:id", updateAsset);

router.get("/:id", getAssetById);


module.exports = router;
