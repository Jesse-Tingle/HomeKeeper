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

const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT *
        FROM homes
        WHERE id = $1;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Home not found",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching home:", error);

    return res.status(500).json({
      error: "Failed to retrieve home by ID",
    });
  }
};

const getAssetsByHomeId = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT *
        FROM assets
        WHERE home_id = $1
        ORDER BY name;
      `,
      [id]
    )
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching home assets:", error);

    return res.status(500).json({
      error: "Failed to retrieve assets for home",
    });
  }
}

module.exports = {
  getHomes,
  getHomeById,
  getAssetsByHomeId,
};