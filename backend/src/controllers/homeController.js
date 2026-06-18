const pool = require("../config/database");
const {userBelongsToHome} = require("../utils/homePermissions");

const getHomes = async (req, res) => {
	try {
		const userId = req.user.userId;

		const result = await pool.query(`
		  SELECT
			homes.id,
			homes.name,
			homes.street_address,
			homes.city,
			homes.state,
			homes.postal_code,
			homes.country,
			homes.type,
			homes.created_at,
			home_memberships.role
		  FROM homes
		  INNER JOIN home_memberships
			ON homes.id = home_memberships.home_id
		  WHERE home_memberships.user_id = $1
		  ORDER BY homes.created_at DESC;
		`, [userId]);

		return res.status(200).json(result.rows);
	} catch (error) {
		console.error("Error fetching homes:", error);

		return res.status(500).json({error: "Failed to retrieve homes"});
	}
};

const getHomeById = async (req, res) => {
	try {
		const {id} = req.params;

		const membership = await userBelongsToHome(req.user.userId, id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		const result = await pool.query(`
        SELECT *
        FROM homes
        WHERE id = $1;
      `, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Home not found"});
		}

		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching home:", error);

		return res.status(500).json({error: "Failed to retrieve home by ID"});
	}
};

const getAssetsByHomeId = async (req, res) => {
	try {
		const {id} = req.params;

		const result = await pool.query(`
        SELECT *
        FROM assets
        WHERE home_id = $1
        ORDER BY name;
      `, [id])
		return res.status(200).json(result.rows);
	} catch (error) {
		console.error("Error fetching home assets:", error);

		return res.status(500).json({error: "Failed to retrieve assets for home"});
	}
}

const createHome = async (req, res) => {
	try {
		const {
			name,
			street_address,
			city,
			state,
			postal_code,
			country,
			type
		} = req.body;

		const created_by_user_id = req.user.userId;

		if (!name || !street_address || !city || !state || !postal_code) {
			return res.status(400).json({error: "Missing required fields"});
		}

		const result = await pool.query(`
        INSERT INTO homes (
          name,
          street_address,
          city,
          state,
          postal_code,
          country,
          type,
          created_by_user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `, [
			name,
			street_address,
			city,
			state,
			postal_code,
			country || "USA",
			type || null,
			created_by_user_id,
		]);

		const newHome = result.rows[0];

		await pool.query(`
				INSERT INTO home_memberships (
				user_id,
				home_id,
				role
				)
				VALUES ($1, $2, $3);
			`, [created_by_user_id, newHome.id, "owner"]);

		return res.status(201).json(newHome);
	} catch (error) {
		console.error("Error creating home:", error);

		return res.status(500).json({error: "Failed to create home"});
	}
};

const updateHome = async (req, res) => {
	try {
		const {id} = req.params;

		const membership = await userBelongsToHome(req.user.userId, id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		const {
			name,
			street_address,
			city,
			state,
			postal_code,
			country,
			type
		} = req.body;

		const result = await pool.query(`
        UPDATE homes
        SET
          name = $1,
          street_address = $2,
          city = $3,
          state = $4,
          postal_code = $5,
          country = $6,
          type = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *;
      `, [
			name,
			street_address,
			city,
			state,
			postal_code,
			country,
			type,
			id,
		]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Home not found"});
		}

		return res.status(200).json(result.rows[0]);
	} catch (error) {
		console.error("Error updating home:", error);

		return res.status(500).json({error: "Failed to update home"});
	}
};

const deleteHome = async (req, res) => {
	try {
		const {id} = req.params;

		const membership = await userBelongsToHome(req.user.userId, id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		const assetCheck = await pool.query(`
        SELECT id
        FROM assets
        WHERE home_id = $1
        LIMIT 1;
      `, [id]);

		if (assetCheck.rows.length > 0) {
			return res.status(400).json({error: "Cannot delete home with existing assets"});
		}

		await pool.query(`
			  DELETE FROM home_memberships
			  WHERE home_id = $1;
			`, [id]);

		const result = await pool.query(`
			  DELETE FROM homes
			  WHERE id = $1
			  RETURNING *;
			`, [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({error: "Home not found"});
		}

		return res.status(200).json({message: "Home deleted successfully", deletedHome: result.rows[0]});
	} catch (error) {
		console.error("Error deleting home:", error);

		return res.status(500).json({error: "Failed to delete home"});
	}
};

module.exports = {
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome,
	updateHome,
	deleteHome
};
