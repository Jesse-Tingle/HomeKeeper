const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				error: "Authorization header missing",
			});
		}

		const parts = authHeader.trim().split(/\s+/);

		if (
			parts.length !== 2 ||
			parts[0].toLowerCase() !== "bearer"
		) {
			return res.status(401).json({
				error: "Invalid authorization header",
			});
		}

		const token = parts[1];

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET,
		);

		req.user = decoded;

		next();
	} catch (error) {
		return res.status(401).json({
			error: "Invalid token",
		});
	}
};

module.exports = authenticateUser;