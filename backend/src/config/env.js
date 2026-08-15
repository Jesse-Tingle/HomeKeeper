const { z } = require("zod");
require("dotenv").config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    DATABASE_URL: z.string().min(1).optional(),

    DB_HOST: z.string().min(1).optional(),

    DB_PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535)
        .optional(),

    DB_NAME: z.string().min(1).optional(),
    DB_USER: z.string().min(1).optional(),
    DB_PASSWORD: z.string().optional(),

    JWT_SECRET: z.string().min(
        32,
        "JWT_SECRET must be at least 32 characters long",
    ),

    CLIENT_URL: z.string().url(),
}).superRefine((env, ctx) => {
    if (!env.DATABASE_URL) {
        const requiredDatabaseVariables = [
            "DB_HOST",
            "DB_PORT",
            "DB_NAME",
            "DB_USER",
        ];

        requiredDatabaseVariables.forEach((variable) => {
            if (env[variable] === undefined) {
                ctx.addIssue({
                    code: "custom",
                    path: [variable],
                    message:
                        `${variable} is required when DATABASE_URL is not configured`,
                });
            }
        });

        if (
            env.NODE_ENV === "production" &&
            !env.DB_PASSWORD
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["DB_PASSWORD"],
                message:
                    "DB_PASSWORD is required in production when DATABASE_URL is not configured",
            });
        }
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