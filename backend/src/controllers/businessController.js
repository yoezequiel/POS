import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";

export const createBusiness = async (req, res) => {
    try {
        const { name, address, currency = "USD", tax_rate = 0 } = req.body;
        const userId = req.user.userId;

        if (!name) {
            return res.status(400).json({ error: "Business name is required" });
        }

        const db = getDb();
        const businessId = uuidv4();

        // Create business
        await db.execute({
            sql: "INSERT INTO businesses (id, name, address, currency, tax_rate) VALUES (?, ?, ?, ?, ?)",
            args: [businessId, name, address, currency, tax_rate],
        });

        // Assign user as ADMIN
        const userBusinessId = uuidv4();
        await db.execute({
            sql: "INSERT INTO user_business (id, user_id, business_id, role) VALUES (?, ?, ?, ?)",
            args: [userBusinessId, userId, businessId, "ADMIN"],
        });

        res.status(201).json({
            id: businessId,
            name,
            address,
            currency,
            tax_rate,
            role: "ADMIN",
        });
    } catch (error) {
        console.error("Create business error:", error);
        res.status(500).json({ error: "Failed to create business" });
    }
};

export const getBusinesses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const db = getDb();

        const result = await db.execute({
            sql: `
        SELECT b.id, b.name, b.address, b.currency, b.tax_rate, ub.role
        FROM businesses b
        INNER JOIN user_business ub ON b.id = ub.business_id
        WHERE ub.user_id = ?
      `,
            args: [userId],
        });

        res.json(result.rows);
    } catch (error) {
        console.error("Get businesses error:", error);
        res.status(500).json({ error: "Failed to fetch businesses" });
    }
};

export const getBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const db = getDb();

        const result = await db.execute({
            sql: `
        SELECT b.id, b.name, b.address, b.currency, b.tax_rate, ub.role
        FROM businesses b
        INNER JOIN user_business ub ON b.id = ub.business_id
        WHERE b.id = ? AND ub.user_id = ?
      `,
            args: [id, userId],
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Business not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Get business error:", error);
        res.status(500).json({ error: "Failed to fetch business" });
    }
};

export const updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, currency, tax_rate } = req.body;
        const userId = req.user.userId;
        const db = getDb();

        // Check if user is ADMIN
        const accessCheck = await db.execute({
            sql: "SELECT role FROM user_business WHERE user_id = ? AND business_id = ?",
            args: [userId, id],
        });

        if (
            accessCheck.rows.length === 0 ||
            accessCheck.rows[0].role !== "ADMIN"
        ) {
            return res.status(403).json({ error: "Admin access required" });
        }

        // Update business
        const updates = [];
        const args = [];

        if (name !== undefined) {
            updates.push("name = ?");
            args.push(name);
        }
        if (address !== undefined) {
            updates.push("address = ?");
            args.push(address);
        }
        if (currency !== undefined) {
            updates.push("currency = ?");
            args.push(currency);
        }
        if (tax_rate !== undefined) {
            updates.push("tax_rate = ?");
            args.push(tax_rate);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        args.push(id);

        await db.execute({
            sql: `UPDATE businesses SET ${updates.join(", ")} WHERE id = ?`,
            args,
        });

        res.json({ message: "Business updated successfully" });
    } catch (error) {
        console.error("Update business error:", error);
        res.status(500).json({ error: "Failed to update business" });
    }
};
