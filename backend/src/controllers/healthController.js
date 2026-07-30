const pool = require("../config/database");

async function getHealth(req, res) {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "ok",
            service: "HomeKeeper API",
            database: "connected",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            status: "error",
            service: "HomeKeeper API",
            database: "disconnected",
            timestamp: new Date().toISOString(),
        });
    }
}

module.exports = {
    getHealth,
};