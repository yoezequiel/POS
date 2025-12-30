import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Authentication failed" });
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }

        next();
    };
};

export const requireBusinessAccess = async (req, res, next) => {
    try {
        const businessId =
            req.params.businessId ||
            req.body.business_id ||
            req.query.business_id;

        if (!businessId) {
            return res.status(400).json({ error: "Business ID required" });
        }

        // Check if user has access to this business
        const { getDb } = await import("../db/connection.js");
        const db = getDb();

        const result = await db.execute({
            sql: "SELECT role FROM user_business WHERE user_id = ? AND business_id = ?",
            args: [req.user.userId, businessId],
        });

        if (result.rows.length === 0) {
            return res
                .status(403)
                .json({ error: "No access to this business" });
        }

        req.businessRole = result.rows[0].role;
        req.businessId = businessId;
        next();
    } catch (error) {
        return res
            .status(500)
            .json({ error: "Failed to verify business access" });
    }
};
