const express = require("express");
const router = express.Router();

const {
	getAssetById,
	getMaintenanceEventsByAssetId,
	createAsset,
	createMaintenanceEvent,
	updateAsset
} = require("../controllers/assetController");

router.get("/:id/maintenance-events", getMaintenanceEventsByAssetId);
router.get("/:id", getAssetById);
router.post("/maintenance-events", createMaintenanceEvent);
router.post("/", createAsset);

router.put("/:id", updateAsset);


module.exports = router;
