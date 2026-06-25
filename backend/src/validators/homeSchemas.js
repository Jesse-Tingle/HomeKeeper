const { z } = require("zod");

const createHomeSchema = z.object({
    name: z.string().trim().min(1, "Home name is required").max(255),
    street_address: z.string().trim().min(1, "Street address is required").max(255),
    city: z.string().trim().min(1, "City is required").max(100),
    state: z.string().trim().min(1, "State is required").max(100),
    postal_code: z.string().trim().min(1, "Postal code is required").max(20),
    country: z.string().trim().max(100).optional(),
    type: z.string().trim().max(100).optional()
});

const updateHomeSchema = createHomeSchema;

module.exports = {
    createHomeSchema,
    updateHomeSchema
};