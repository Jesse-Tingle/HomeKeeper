const pool = require("../config/database");

const getHomes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        street_address,
        city,
        state,
        postal_code,
        country,
        type,
        created_at
      FROM homes
      ORDER BY name;
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching homes:", error);

    return res.status(500).json({
      error: "Failed to retrieve homes",
    });
  }
};

module.exports = {
  getHomes,
};