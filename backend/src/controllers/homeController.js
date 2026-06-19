const pool = require("../config/database");
const {z} = require("zod");
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

		if (membership.role !== "owner") {
			return res.status(403).json({error: "Only owners can delete homes"});
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

const getHomeMembers = async (req, res) => {
	try {
		const {id} = req.params;

		const membership = await userBelongsToHome(req.user.userId, id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		const result = await pool.query(`
		  SELECT
			users.id,
			users.name,
			users.email,
			home_memberships.role,
			home_memberships.joined_at
		  FROM home_memberships
		  INNER JOIN users
			ON home_memberships.user_id = users.id
		  WHERE home_memberships.home_id = $1
		  ORDER BY users.name;
		`, [id]);

		return res.status(200).json(result.rows);
	} catch (error) {
		console.error("Error fetching home members:", error);

		return res.status(500).json({error: "Failed to retrieve home members"});
	}
};

const addHomeMember = async (req, res) => {
	try {
		const {id} = req.params;
		const {email, role} = req.body;

		if (!email) {
			return res.status(400).json({error: "Email is required"});
		}

		const membership = await userBelongsToHome(req.user.userId, id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		if (membership.role !== "owner") {
			return res.status(403).json({error: "Only owners can add home members"});
		}

		const userResult = await pool.query(`
		  SELECT id, name, email
		  FROM users
		  WHERE email = $1;
		`, [email]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({error: "User not found"});
		}

		const userToAdd = userResult.rows[0];

		const newMember = await pool.query(`
		  INSERT INTO home_memberships (
			user_id,
			home_id,
			role
		  )
		  VALUES ($1, $2, $3)
		  RETURNING *;
		`, [
			userToAdd.id,
			id,
			role || "member"
		]);

		return res.status(201).json({
			message: "Home member added successfully",
			member: {
				id: userToAdd.id,
				name: userToAdd.name,
				email: userToAdd.email,
				role: newMember.rows[0].role,
				joined_at: newMember.rows[0].joined_at
			}
		});
	} catch (error) {
		console.error("Error adding home member:", error);

		return res.status(500).json({error: "Failed to add home member"});
	}
};

const removeHomeMember = async (req, res) => {
	try {
		const {id, userId} = req.params;

		const membership = await userBelongsToHome(req.user.userId, id);

		if (! membership) {
			return res.status(403).json({error: "You do not have access to this home"});
		}

		if (membership.role !== "owner") {
			return res.status(403).json({error: "Only owners can remove members"});
		}

		const targetMembership = await pool.query(`
		  SELECT *
		  FROM home_memberships
		  WHERE home_id = $1
		  AND user_id = $2;
		`, [id, userId]);

		if (targetMembership.rows.length === 0) {
			return res.status(404).json({error: "Member not found"});
		}

		// Prevent deleting the last owner
		if (targetMembership.rows[0].role === "owner") {
			const ownerCount = await pool.query(`
			SELECT COUNT(*) AS count
			FROM home_memberships
			WHERE home_id = $1
			AND role = 'owner';
		  `, [id]);

			if (parseInt(ownerCount.rows[0].count) === 1) {
				return res.status(400).json({error: "Cannot remove the last owner"});
			}
		}

		const result = await pool.query(`
		  DELETE FROM home_memberships
		  WHERE home_id = $1
		  AND user_id = $2
		  RETURNING *;
		`, [id, userId]);

		return res.status(200).json({message: "Member removed successfully", removedMember: result.rows[0]});
	} catch (error) {
		console.error("Error removing home member:", error);

		return res.status(500).json({error: "Failed to remove home member"});
	}
};

module.exports = {
	getHomes,
	getHomeById,
	getAssetsByHomeId,
	createHome,
	updateHome,
	deleteHome,
	getHomeMembers,
	addHomeMember,
	removeHomeMember
};
