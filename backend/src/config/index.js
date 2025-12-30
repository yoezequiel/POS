import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",

    db: {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },

    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:4321",
    },
};
