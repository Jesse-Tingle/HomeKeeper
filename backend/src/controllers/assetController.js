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

module.exports = {
	getAssetById,
	getMaintenanceEventsByAssetId
};
