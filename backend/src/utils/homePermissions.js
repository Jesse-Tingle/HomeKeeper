const pool = require("../config/database");

const userBelongsToHome = async (userId, homeId) => {
	const result = await pool.query(`
      SELECT id, role
      FROM home_memberships
      WHERE user_id = $1
      AND home_id = $2;
    `, [userId, homeId]);

	return result.rows[0] || null;
};

module.exports = {
	userBelongsToHome
};
