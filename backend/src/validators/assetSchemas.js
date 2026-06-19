const {z} = require("zod");

const createAssetSchema = z.object({
	home_id: z.string().uuid("Invalid home ID"),
	name: z.string().trim().min(1, "Asset name is required").max(255),
	category: z.string().trim().min(1, "Category is required").max(100),

	manufacturer: z.string().trim().max(255).optional(),
	model_number: z.string().trim().max(255).optional(),
	serial_number: z.string().trim().max(255).optional(),
	location: z.string().trim().max(255).optional(),

	install_date: z.string().optional(),
	warranty_expiration_date: z.string().optional(),

	expected_lifespan_years: z.number().int().positive().optional(),
	purchase_cost: z.number().nonnegative().optional(),

	notes: z.string().trim().optional()
});

const updateAssetSchema = createAssetSchema;

module.exports = {
	createAssetSchema,
	updateAssetSchema
};
