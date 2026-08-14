const { z } = require("zod");
require("dotenv").config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535)
        .default(5000),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string(),

    JWT_SECRET: z.string().min(
        32,
        "JWT_SECRET must be at least 32 characters long",
    ),

    CLIENT_URL: z.string().url(),
}).superRefine((env, ctx) => {
    if (
        env.NODE_ENV === "production" &&
        env.DB_PASSWORD.length === 0
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["DB_PASSWORD"],
            message:
                "DB_PASSWORD is required in production",
        });
    }
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error(
        "Invalid environment configuration:",
    );

    result.error.issues.forEach((issue) => {
        console.error(
            `- ${issue.path.join(".")}: ${issue.message}`,
        );
    });

    process.exit(1);
}

module.exports = result.data;