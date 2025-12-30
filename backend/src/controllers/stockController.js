import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";

export const adjustStock = async (req, res) => {
    try {
        const { business_id, product_id, quantity, reason } = req.body;

        if (!business_id || !product_id || quantity === undefined) {
            return res
                .status(400)
                .json({
                    error: "Business ID, product ID and quantity are required",
                });
        }

        const db = getDb();

        // Get current stock
        const productResult = await db.execute({
            sql: "SELECT stock FROM products WHERE id = ? AND business_id = ?",
            args: [product_id, business_id],
        });

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const currentStock = productResult.rows[0].stock;
        const newStock = currentStock + quantity;

        if (newStock < 0) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        // Update stock
        await db.execute({
            sql: "UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            args: [newStock, product_id],
        });

        // Record movement
        const movementId = uuidv4();
        const type = quantity > 0 ? "IN" : quantity < 0 ? "OUT" : "ADJUSTMENT";

        await db.execute({
            sql: `INSERT INTO stock_movements (id, business_id, product_id, quantity, type, reason, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [
                movementId,
                business_id,
                product_id,
                quantity,
                type,
                reason || "Manual adjustment",
                req.user.userId,
            ],
        });

        res.json({
            product_id,
            previous_stock: currentStock,
            new_stock: newStock,
            quantity,
        });
    } catch (error) {
        console.error("Adjust stock error:", error);
        res.status(500).json({ error: "Failed to adjust stock" });
    }
};

export const getStockMovements = async (req, res) => {
    try {
        const { business_id, product_id, limit = 50 } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = `
      SELECT sm.*, p.name as product_name, u.full_name as user_name
      FROM stock_movements sm
      INNER JOIN products p ON sm.product_id = p.id
      INNER JOIN users u ON sm.user_id = u.id
      WHERE sm.business_id = ?
    `;
        const args = [business_id];

        if (product_id) {
            sql += " AND sm.product_id = ?";
            args.push(product_id);
        }

        sql += " ORDER BY sm.created_at DESC LIMIT ?";
        args.push(parseInt(limit));

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get stock movements error:", error);
        res.status(500).json({ error: "Failed to fetch stock movements" });
    }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const { business_id, threshold = 10 } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        const result = await db.execute({
            sql: `
        SELECT id, name, sku, stock, price
        FROM products
        WHERE business_id = ? AND is_active = 1 AND stock <= ?
        ORDER BY stock ASC
      `,
            args: [business_id, parseInt(threshold)],
        });

        res.json(result.rows);
    } catch (error) {
        console.error("Get low stock error:", error);
        res.status(500).json({ error: "Failed to fetch low stock products" });
    }
};
