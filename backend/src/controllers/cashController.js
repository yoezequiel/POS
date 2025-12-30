import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";

export const openCashRegister = async (req, res) => {
    try {
        const { business_id, opening_amount } = req.body;

        if (!business_id || opening_amount === undefined) {
            return res
                .status(400)
                .json({ error: "Business ID and opening amount are required" });
        }

        const db = getDb();

        // Check if there's already an open register for this user and business
        const existingResult = await db.execute({
            sql: 'SELECT id FROM cash_registers WHERE business_id = ? AND user_id = ? AND status = "OPEN"',
            args: [business_id, req.user.userId],
        });

        if (existingResult.rows.length > 0) {
            return res
                .status(400)
                .json({ error: "You already have an open cash register" });
        }

        const registerId = uuidv4();

        await db.execute({
            sql: `INSERT INTO cash_registers (id, business_id, user_id, opening_amount, status)
            VALUES (?, ?, ?, ?, 'OPEN')`,
            args: [registerId, business_id, req.user.userId, opening_amount],
        });

        res.status(201).json({
            id: registerId,
            business_id,
            opening_amount,
            status: "OPEN",
        });
    } catch (error) {
        console.error("Open cash register error:", error);
        res.status(500).json({ error: "Failed to open cash register" });
    }
};

export const closeCashRegister = async (req, res) => {
    try {
        const { id } = req.params;
        const { closing_amount } = req.body;

        if (closing_amount === undefined) {
            return res
                .status(400)
                .json({ error: "Closing amount is required" });
        }

        const db = getDb();

        // Get register
        const registerResult = await db.execute({
            sql: "SELECT business_id, user_id, opening_amount, status FROM cash_registers WHERE id = ?",
            args: [id],
        });

        if (registerResult.rows.length === 0) {
            return res.status(404).json({ error: "Cash register not found" });
        }

        const register = registerResult.rows[0];

        if (register.user_id !== req.user.userId) {
            return res
                .status(403)
                .json({ error: "Not authorized to close this register" });
        }

        if (register.status === "CLOSED") {
            return res
                .status(400)
                .json({ error: "Cash register already closed" });
        }

        // Calculate expected amount from sales
        const salesResult = await db.execute({
            sql: `
        SELECT 
          SUM(CASE WHEN payment_method = 'EFECTIVO' THEN total ELSE 0 END) as cash_sales,
          SUM(total) as total_sales,
          COUNT(*) as sales_count
        FROM sales
        WHERE cash_register_id = ? AND status = 'COMPLETED'
      `,
            args: [id],
        });

        const salesData = salesResult.rows[0] || {
            cash_sales: 0,
            total_sales: 0,
            sales_count: 0,
        };
        const expected_amount =
            register.opening_amount + (salesData.cash_sales || 0);
        const difference = closing_amount - expected_amount;

        // Close register
        await db.execute({
            sql: `UPDATE cash_registers 
            SET closing_amount = ?, expected_amount = ?, closed_at = CURRENT_TIMESTAMP, status = 'CLOSED'
            WHERE id = ?`,
            args: [closing_amount, expected_amount, id],
        });

        res.json({
            id,
            opening_amount: register.opening_amount,
            closing_amount,
            expected_amount,
            difference,
            total_sales: salesData.total_sales || 0,
            cash_sales: salesData.cash_sales || 0,
            sales_count: salesData.sales_count || 0,
        });
    } catch (error) {
        console.error("Close cash register error:", error);
        res.status(500).json({ error: "Failed to close cash register" });
    }
};

export const getCurrentCashRegister = async (req, res) => {
    try {
        const { business_id } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();

        const result = await db.execute({
            sql: 'SELECT * FROM cash_registers WHERE business_id = ? AND user_id = ? AND status = "OPEN" ORDER BY opened_at DESC LIMIT 1',
            args: [business_id, req.user.userId],
        });

        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "No open cash register found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Get current cash register error:", error);
        res.status(500).json({ error: "Failed to fetch cash register" });
    }
};

export const getCashRegisters = async (req, res) => {
    try {
        const { business_id, status, limit = 50 } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = `
      SELECT cr.*, u.full_name as user_name
      FROM cash_registers cr
      INNER JOIN users u ON cr.user_id = u.id
      WHERE cr.business_id = ?
    `;
        const args = [business_id];

        if (status) {
            sql += " AND cr.status = ?";
            args.push(status);
        }

        sql += " ORDER BY cr.opened_at DESC LIMIT ?";
        args.push(parseInt(limit));

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get cash registers error:", error);
        res.status(500).json({ error: "Failed to fetch cash registers" });
    }
};
