const pool = require("../config/database");

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
			notes,
			created_by_user_id
		} = req.body;

		if (!home_id || !name || !category || !created_by_user_id) {
			return res.status(400).json({error: "Missing required fields"});
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
			notes,
			created_by_user_id
		} = req.body;

		if (!asset_id || !event_type || !event_date || !created_by_user_id) {
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

module.exports = {
	getAssetById,
	getMaintenanceEventsByAssetId,
	createAsset,
	createMaintenanceEvent
};
