const { z } = require("zod");

const eventTypeSchema = z.enum([
	"inspection",
	"service",
	"repair",
	"replacement",
]);

const createMaintenanceEventSchema = z.object({
	asset_id: z
		.string()
		.uuid("Invalid asset ID"),

	event_type: eventTypeSchema,

	event_date: z
		.string()
		.min(1, "Event date is required"),

	cost: z
		.number()
		.nonnegative("Cost cannot be negative")
		.optional(),

	notes: z
		.string()
		.trim()
		.optional(),
});

const updateMaintenanceEventSchema = z.object({
	event_type: eventTypeSchema,

	event_date: z
		.string()
		.min(1, "Event date is required"),

	cost: z
		.number()
		.nonnegative("Cost cannot be negative")
		.optional(),

	notes: z
		.string()
		.trim()
		.optional(),
});

module.exports = {
	createMaintenanceEventSchema,
	updateMaintenanceEventSchema,
};