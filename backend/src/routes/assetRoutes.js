const express = require("express");
const router = express.Router();

const {getAssetById, getMaintenanceEventsByAssetId, createAsset, createMaintenanceEvent} = require("../controllers/assetController");

router.get("/:id/maintenance-events", getMaintenanceEventsByAssetId);
router.get("/:id", getAssetById);
router.post("/maintenance-events", createMaintenanceEvent);
router.post("/", createAsset);


module.exports = router;
