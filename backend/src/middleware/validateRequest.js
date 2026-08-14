const validateRequest = (schema) => {
	return (req, res, next) => {
		try {
			req.body = schema.parse(req.body);

			next();
		} catch (error) {
			return res.status(400).json({
				error: "Validation failed",
				message: error.message,
				name: error.name,
				details:
					error.issues ||
					error.errors ||
					[],
			});
		}
	};
};

module.exports = validateRequest;