const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const assetRoutes = require("./routes/assetRoutes");

const pool = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home Maintenance Tracker API is running");
});

app.get("/db-test", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.json(result.rows[0]);
});

app.use("/users", userRoutes);
app.use("/homes", homeRoutes);
app.use("/assets", assetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});