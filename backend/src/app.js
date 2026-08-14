const express = require("express");
const cors = require("cors");
require("dotenv").config();
const homeRoutes = require("./routes/homeRoutes");
const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Home Maintenance Tracker API is running");
});

app.use("/auth", authRoutes);
app.use("/homes", homeRoutes);
app.use("/assets", assetRoutes);
app.use("/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
