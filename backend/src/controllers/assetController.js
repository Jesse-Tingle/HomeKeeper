const pool = require("../config/database");
const { userBelongsToHome } = require("../utils/homePermissions");

const getAssetById = async (req, res) => {
	try {
		const { id } = req.params;


		const result = await pool.query(`
    SELECT *
    FROM assets
    WHERE id = $1;
  `, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Asset not found" });
		}

		return res.status(200).json(result.rows[0]);


	} catch (error) {
		console.error("Error fetching asset:", error);


		return res.status(500).json({ error: "Failed to retrieve asset" });


	}
};

const getMaintenanceEventsByAssetId = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(`
			SELECT *
			FROM maintenance_events
			WHERE asset_id = $1
			ORDER BY event_date DESC;
		`, [id]);

		return res.status(200).json(result.rows);
	} catch (error) {
		console.error("Error fetching maintenance events:", error);

		return res.status(500).json({ error: "Failed to retrieve maintenance events" });
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
			return res.status(400).json({ error: "Missing required fields" });
		}

		const membership = await userBelongsToHome(created_by_user_id, home_id);

		if (!membership) {
			return res.status(403).json({ error: "You do not have access to this home" });
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

		return res.status(500).json({ error: "Failed to create asset" });
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
			return res.status(400).json({ error: "Missing required fields" });
		}

		const assetCheck = await pool.query(`
			  SELECT id, home_id
			  FROM assets
			  WHERE id = $1;
			`, [asset_id]);

		if (assetCheck.rows.length === 0) {
			return res.status(404).json({ error: "Asset not found" });
		}

		const asset = assetCheck.rows[0];

		const membership = await userBelongsToHome(req.user.userId, asset.home_id);

		if (!membership) {
			return res.status(403).json({ error: "You do not have access to this asset" });
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

		return res.status(500).json({ error: "Failed to create maintenance event" });
	}
};

const updateAsset = async (req, res) => {
	try {
		const { id } = req.params;

		const assetCheck = await pool.query(
			`
			SELECT *
			FROM assets
			WHERE id = $1;
			`,
			[id],
		);

		if (assetCheck.rows.length === 0) {
			return res.status(404).json({
				error: "Asset not found",
			});
		}

		const existingAsset = assetCheck.rows[0];

		const membership = await userBelongsToHome(
			req.user.userId,
			existingAsset.home_id,
		);

		if (!membership) {
			return res.status(403).json({
				error: "You do not have access to this asset",
			});
		}

		const {
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
		} = req.body;

		const result = await pool.query(
			`
			UPDATE assets
			SET
				name = $1,
				category = $2,
				manufacturer = $3,
				model_number = $4,
				serial_number = $5,
				location = $6,
				install_date = $7,
				warranty_expiration_date = $8,
				expected_lifespan_years = $9,
				purchase_cost = $10,
				notes = $11,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = $12
			RETURNING *;
			`,
			[
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
				id,
			],
		);

		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error updating asset:", error);

		return res.status(500).json({
			error: "Failed to update asset",
		});
	}
};

const updateMaintenanceEvent = async (req, res) => {
	try {
		const { id } = req.params;

		const eventCheck = await pool.query(
			`
            SELECT
                maintenance_events.id,
                maintenance_events.asset_id,
                assets.home_id
            FROM maintenance_events
            INNER JOIN assets
                ON maintenance_events.asset_id = assets.id
            WHERE maintenance_events.id = $1;
            `,
			[id],
		);

		if (eventCheck.rows.length === 0) {
			return res.status(404).json({
				error: "Maintenance event not found",
			});
		}

		const existingEvent = eventCheck.rows[0];

		const membership = await userBelongsToHome(
			req.user.userId,
			existingEvent.home_id,
		);

		if (!membership) {
			return res.status(403).json({
				error:
					"You do not have access to this maintenance event",
			});
		}

		const {
			event_type,
			event_date,
			cost,
			notes,
		} = req.body;

		const result = await pool.query(
			`
            UPDATE maintenance_events
            SET
                event_type = $1,
                event_date = $2,
                cost = $3,
                notes = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
            `,
			[
				event_type,
				event_date,
				cost ?? null,
				notes || null,
				id,
			],
		);

		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error(
			"Error updating maintenance event:",
			error,
		);

		return res.status(500).json({
			error: "Failed to update maintenance event",
		});
	}
};

const deleteMaintenanceEvent = async (req, res) => {
	try {
		const { id } = req.params;

		const eventCheck = await pool.query(`
			  SELECT
				maintenance_events.id,
				maintenance_events.asset_id,
				assets.home_id
			  FROM maintenance_events
			  INNER JOIN assets
				ON maintenance_events.asset_id = assets.id
			  WHERE maintenance_events.id = $1;
			`, [id]);

		if (eventCheck.rows.length === 0) {
			return res.status(404).json({ error: "Maintenance event not found" });
		}

		const existingEvent = eventCheck.rows[0];

		const membership = await userBelongsToHome(req.user.userId, existingEvent.home_id);

		if (!membership) {
			return res.status(403).json({ error: "You do not have access to this maintenance event" });
		}


		const result = await pool.query(`
		  DELETE FROM maintenance_events
		  WHERE id = $1
		  RETURNING *;
		`, [id]);

		return res.status(200).json({ message: "Maintenance event deleted successfully", deletedMaintenanceEvent: result.rows[0] });
	} catch (error) {
		console.error("Error deleting maintenance event:", error);

		return res.status(500).json({ error: "Failed to delete maintenance event" });
	}
};

const deleteAsset = async (req, res) => {
	try {
		const { id } = req.params;

		const assetCheck = await pool.query(`
			  SELECT id, home_id
			  FROM assets
			  WHERE id = $1;
			`, [id]);

		if (assetCheck.rows.length === 0) {
			return res.status(404).json({ error: "Asset not found" });
		}

		const existingAsset = assetCheck.rows[0];

		const membership = await userBelongsToHome(req.user.userId, existingAsset.home_id);

		if (!membership) {
			return res.status(403).json({ error: "You do not have access to this asset" });
		}

		const maintenanceCheck = await pool.query(`
		  SELECT id
		  FROM maintenance_events
		  WHERE asset_id = $1
		  LIMIT 1;
		`, [id]);

		if (maintenanceCheck.rows.length > 0) {
			return res.status(400).json({ error: "Cannot delete asset with existing maintenance events" });
		}

		const result = await pool.query(`
		  DELETE FROM assets
		  WHERE id = $1
		  RETURNING *;
		`, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Asset not found" });
		}

		return res.status(200).json({ message: "Asset deleted successfully", deletedAsset: result.rows[0] });
	} catch (error) {
		console.error("Error deleting asset:", error);

		return res.status(500).json({ error: "Failed to delete asset" });
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
