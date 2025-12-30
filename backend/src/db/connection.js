import { createClient } from "@libsql/client";
import { config } from "../config/index.js";

let db = null;

export const getDb = () => {
    if (!db) {
        db = createClient({
            url: config.db.url,
            authToken: config.db.authToken,
        });
    }
    return db;
};

export const closeDb = async () => {
    if (db) {
        await db.close();
        db = null;
    }
};
