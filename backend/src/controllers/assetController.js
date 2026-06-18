const pool = require("../config/database");
const {userBelongsToHome} = require("../utils/homePermissions");

const getAssetById = async (req, res) => {
	try {
		const {id} = req.params;


		const result = await pool.query(`
    SELECT *
    FROM assets
    WHERE id = $1;
  `, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Asset not found"});
		}

		return res.status(200).json(result.rows[0]);


	} catch (error) {
		console.error("Error fetching asset:", error);


		return res.status(500).json({error: "Failed to retrieve asset"});


	}
};

const getMaintenanceEventsByAssetId = async (req, res) => {
	try {
		const {id} = req.params;


		const result = await pool.query(`
        SELECT *
        FROM maintenance_events
        WHERE asset_id = $1
        ORDER BY event_date DESC;
  `, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Maintenance event not found"});
		}

		return res.status(200).json(result.rows);


	} catch (error) {
		console.error("Error fetching maintenance event:", error);


		return res.status(500).json({error: "Failed to retrieve maintenance event"});


	}
};

const createAsset = async (req, res) => {
	try {
		const {
			home_id,
			name,
			category,
			manufacturer,
			model_number,
			serial_number,
			location,
			install_date,
			warranty_expiration_date,
			expected_lifespan_years,
			purchase_cost,
			notes
		} = req.body;

		const created_by_user_id = req.user.userId;

		if (!home_id || !name || !category) {
			return res.status(400).json({error: "Missing required fields"});
		}

		const membership = await userBelongsToHome(created_by_user_id, home_id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		const result = await pool.query(`
		  INSERT INTO assets (
			home_id,
			name,
			category,
			manufacturer,
			model_number,
			serial_number,
			location,
			install_date,
			warranty_expiration_date,
			expected_lifespan_years,
			purchase_cost,
			notes,
			created_by_user_id
		  )
		  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		  RETURNING *;
		`, [
			home_id,
			name,
			category,
			manufacturer || null,
			model_number || null,
			serial_number || null,
			location || null,
			install_date || null,
			warranty_expiration_date || null,
			expected_lifespan_years || null,
			purchase_cost || null,
			notes || null,
			created_by_user_id,
		]);

		return res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating asset:", error);

		return res.status(500).json({error: "Failed to create asset"});
	}
};

const createMaintenanceEvent = async (req, res) => {
	try {
		const {
			asset_id,
			event_type,
			event_date,
			cost,
			notes
		} = req.body;

		const created_by_user_id = req.user.userId;

		if (!asset_id || !event_type || !event_date) {
			return res.status(400).json({error: "Missing required fields"});
		}

		const result = await pool.query(`
		  INSERT INTO maintenance_events (
			asset_id,
			event_type,
			event_date,
			cost,
			notes,
			created_by_user_id
		  )
		  VALUES ($1, $2, $3, $4, $5, $6)
		  RETURNING *;
		`, [
			asset_id,
			event_type,
			event_date,
			cost || null,
			notes || null,
			created_by_user_id,
		]);

		return res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating maintenance event:", error);

		return res.status(500).json({error: "Failed to create maintenance event"});
	}
};

const updateAsset = async (req, res) => {
	try {
		const {id} = req.params;

		const {
			home_id,
			name,
			category,
			manufacturer,
			model_number,
			serial_number,
			location,
			install_date,
			warranty_expiration_date,
			expected_lifespan_years,
			purchase_cost,
			notes,
			created_by_user_id
		} = req.body;

		const result = await pool.query(`
		  UPDATE assets
		  SET
			home_id = $1,
			name = $2,
			category = $3,
			manufacturer = $4,
			model_number = $5,
			serial_number = $6,
			location = $7,
			install_date = $8,
			warranty_expiration_date = $9,
			expected_lifespan_years = $10,
			purchase_cost = $11,
			notes = $12,
			created_by_user_id = $13,
			updated_at = CURRENT_TIMESTAMP
		  WHERE id = $14
		  RETURNING *;
		`, [
			home_id,
			name,
			category,
			manufacturer,
			model_number,
			serial_number,
			location,
			install_date,
			warranty_expiration_date,
			expected_lifespan_years,
			purchase_cost,
			notes,
			created_by_user_id,
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Asset not found"});
		}

		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error updating asset:", error);

		return res.status(500).json({error: "Failed to update asset"});
	}
};

const updateMaintenanceEvent = async (req, res) => {
	try {
		const {id} = req.params;

		const {
			asset_id,
			event_type,
			event_date,
			cost,
			notes,
			created_by_user_id
		} = req.body;

		const result = await pool.query(`
		  UPDATE maintenance_events
		  SET
			asset_id = $1,
			event_type = $2,
			event_date = $3,
			cost = $4,
			notes = $5,
			created_by_user_id = $6,
			updated_at = CURRENT_TIMESTAMP
		  WHERE id = $7
		  RETURNING *;
		`, [
			asset_id,
			event_type,
			event_date,
			cost,
			notes,
			created_by_user_id,
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Maintenance event not found"});
		}

		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error updating maintenance event:", error);

		return res.status(500).json({error: "Failed to update maintenance event"});
	}
};

const deleteMaintenanceEvent = async (req, res) => {
	try {
		const {id} = req.params;

		const result = await pool.query(`
		  DELETE FROM maintenance_events
		  WHERE id = $1
		  RETURNING *;
		`, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Maintenance event not found"});
		}

		return res.status(200).json({message: "Maintenance event deleted successfully", deletedMaintenanceEvent: result.rows[0]});
	} catch (error) {
		console.error("Error deleting maintenance event:", error);

		return res.status(500).json({error: "Failed to delete maintenance event"});
	}
};

const deleteAsset = async (req, res) => {
	try {
		const {id} = req.params;

		const maintenanceCheck = await pool.query(`
		  SELECT id
		  FROM maintenance_events
		  WHERE asset_id = $1
		  LIMIT 1;
		`, [id]);

		if (maintenanceCheck.rows.length > 0) {
			return res.status(400).json({error: "Cannot delete asset with existing maintenance events"});
		}

		const result = await pool.query(`
		  DELETE FROM assets
		  WHERE id = $1
		  RETURNING *;
		`, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Asset not found"});
		}

		return res.status(200).json({message: "Asset deleted successfully", deletedAsset: result.rows[0]});
	} catch (error) {
		console.error("Error deleting asset:", error);

		return res.status(500).json({error: "Failed to delete asset"});
	}
};

module.exports = {
	getAssetById,
	getMaintenanceEventsByAssetId,
	createAsset,
	createMaintenanceEvent,
	updateAsset,
	updateMaintenanceEvent,
	deleteMaintenanceEvent,
	deleteAsset
};
