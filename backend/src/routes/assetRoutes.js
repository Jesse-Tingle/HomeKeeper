const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

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

const {createAssetSchema, updateAssetSchema} = require("../validators/assetSchemas");

const {createMaintenanceEventSchema, updateMaintenanceEventSchema} = require("../validators/maintenanceEventSchemas");

router.post("/", authenticateUser, validateRequest(createAssetSchema), createAsset);

router.post("/maintenance-events", authenticateUser, validateRequest(createMaintenanceEventSchema), createMaintenanceEvent);

router.put("/maintenance-events/:id", authenticateUser, validateRequest(updateMaintenanceEventSchema), updateMaintenanceEvent);

router.delete("/maintenance-events/:id", authenticateUser, deleteMaintenanceEvent);

router.get("/:id/maintenance-events", authenticateUser, getMaintenanceEventsByAssetId);

router.get("/:id", authenticateUser, getAssetById);

router.put("/:id", authenticateUser, validateRequest(updateAssetSchema), updateAsset);

router.delete("/:id", authenticateUser, deleteAsset);

module.exports = router;
