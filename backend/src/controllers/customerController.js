import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";

export const createCustomer = async (req, res) => {
    try {
        const { business_id, name, document, email, phone } = req.body;

        if (!business_id || !name) {
            return res
                .status(400)
                .json({ error: "Business ID and name are required" });
        }

        const db = getDb();
        const customerId = uuidv4();

        await db.execute({
            sql: "INSERT INTO customers (id, business_id, name, document, email, phone) VALUES (?, ?, ?, ?, ?, ?)",
            args: [
                customerId,
                business_id,
                name,
                document || null,
                email || null,
                phone || null,
            ],
        });

        res.status(201).json({
            id: customerId,
            business_id,
            name,
            document,
            email,
            phone,
        });
    } catch (error) {
        console.error("Create customer error:", error);
        res.status(500).json({ error: "Failed to create customer" });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const { business_id, search } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = "SELECT * FROM customers WHERE business_id = ?";
        const args = [business_id];

        if (search) {
            sql += " AND (name LIKE ? OR document LIKE ? OR email LIKE ?)";
            const searchPattern = `%${search}%`;
            args.push(searchPattern, searchPattern, searchPattern);
        }

        sql += " ORDER BY name";

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get customers error:", error);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};

export const getCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        const result = await db.execute({
            sql: "SELECT * FROM customers WHERE id = ?",
            args: [id],
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Get customer error:", error);
        res.status(500).json({ error: "Failed to fetch customer" });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, document, email, phone } = req.body;
        const db = getDb();

        const updates = [];
        const args = [];

        if (name !== undefined) {
            updates.push("name = ?");
            args.push(name);
        }
        if (document !== undefined) {
            updates.push("document = ?");
            args.push(document);
        }
        if (email !== undefined) {
            updates.push("email = ?");
            args.push(email);
        }
        if (phone !== undefined) {
            updates.push("phone = ?");
            args.push(phone);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        args.push(id);

        await db.execute({
            sql: `UPDATE customers SET ${updates.join(", ")} WHERE id = ?`,
            args,
        });

        res.json({ message: "Customer updated successfully" });
    } catch (error) {
        console.error("Update customer error:", error);
        res.status(500).json({ error: "Failed to update customer" });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        await db.execute({
            sql: "DELETE FROM customers WHERE id = ?",
            args: [id],
        });

        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Delete customer error:", error);
        res.status(500).json({ error: "Failed to delete customer" });
    }
};
