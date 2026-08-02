const { z } = require("zod");

const optionalText = (maximumLength) =>
	z
		.string()
		.trim()
		.max(maximumLength)
		.optional();

const optionalDate = z
	.string()
	.optional();

const createAssetSchema = z.object({
	home_id: z
		.string()
		.uuid("Invalid home ID"),

	name: z
		.string()
		.trim()
		.min(1, "Asset name is required")
		.max(255),

	category: z
		.string()
		.trim()
		.min(1, "Category is required")
		.max(100),

	manufacturer: optionalText(255),
	model_number: optionalText(255),
	serial_number: optionalText(255),
	location: optionalText(255),

	install_date: optionalDate,
	warranty_expiration_date: optionalDate,

	expected_lifespan_years: z
		.number()
		.int()
		.nonnegative()
		.optional(),

	purchase_cost: z
		.number()
		.nonnegative()
		.optional(),

	notes: z
		.string()
		.trim()
		.optional(),
});

const updateAssetSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Asset name is required")
		.max(255),

	category: z
		.string()
		.trim()
		.min(1, "Category is required")
		.max(100),

	manufacturer: optionalText(255),
	model_number: optionalText(255),
	serial_number: optionalText(255),
	location: optionalText(255),

	install_date: optionalDate,
	warranty_expiration_date: optionalDate,

	expected_lifespan_years: z
		.number()
		.int()
		.nonnegative()
		.optional(),

	purchase_cost: z
		.number()
		.nonnegative()
		.optional(),

	notes: z
		.string()
		.trim()
		.optional(),
});

module.exports = {
	createAssetSchema,
	updateAssetSchema,
};