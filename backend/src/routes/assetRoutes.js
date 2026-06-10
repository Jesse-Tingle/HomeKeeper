const express = require("express");
const router = express.Router();

const {getAssetById, getMaintenanceEventsByAssetId} = require("../controllers/assetController");

router.get("/:id/maintenance-events", getMaintenanceEventsByAssetId);
router.get("/:id", getAssetById);


module.exports = router;
