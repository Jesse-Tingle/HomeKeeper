const validateRequest = (schema) => {
	return (req, res, next) => {
		try {
			console.log("Request body:", req.body);

			req.body = schema.parse(req.body);

			next();
		} catch (error) {
			console.error("Full validation error:", error);

			return res.status(400).json({
				error: "Validation failed",
				message: error.message,
				name: error.name,
				details: error.issues || error.errors || []
			});
		}
	};
};

module.exports = validateRequest;