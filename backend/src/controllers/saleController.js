import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";

export const createSale = async (req, res) => {
    try {
        const {
            business_id,
            customer_id,
            items, // [{ product_id, quantity, unit_price }]
            discount = 0,
            payment_method,
            cash_register_id,
        } = req.body;

        if (!business_id || !items || items.length === 0 || !payment_method) {
            return res
                .status(400)
                .json({
                    error: "Business ID, items and payment method are required",
                });
        }

        const db = getDb();

        // Calculate totals
        let subtotal = 0;
        const processedItems = [];

        for (const item of items) {
            if (!item.product_id || !item.quantity || !item.unit_price) {
                return res.status(400).json({ error: "Invalid item data" });
            }

            // Verify product exists and has stock
            const productResult = await db.execute({
                sql: "SELECT stock FROM products WHERE id = ? AND business_id = ? AND is_active = 1",
                args: [item.product_id, business_id],
            });

            if (productResult.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: `Product ${item.product_id} not found` });
            }

            const currentStock = productResult.rows[0].stock;
            if (currentStock < item.quantity) {
                return res
                    .status(400)
                    .json({
                        error: `Insufficient stock for product ${item.product_id}`,
                    });
            }

            const itemSubtotal = item.quantity * item.unit_price;
            subtotal += itemSubtotal;

            processedItems.push({
                ...item,
                subtotal: itemSubtotal,
            });
        }

        // Get business tax rate
        const businessResult = await db.execute({
            sql: "SELECT tax_rate FROM businesses WHERE id = ?",
            args: [business_id],
        });

        const taxRate = businessResult.rows[0]?.tax_rate || 0;
        const tax = (subtotal - discount) * taxRate;
        const total = subtotal - discount + tax;

        // Create sale
        const saleId = uuidv4();
        await db.execute({
            sql: `INSERT INTO sales (id, business_id, user_id, customer_id, cash_register_id, subtotal, discount, tax, total, payment_method, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED')`,
            args: [
                saleId,
                business_id,
                req.user.userId,
                customer_id || null,
                cash_register_id || null,
                subtotal,
                discount,
                tax,
                total,
                payment_method,
            ],
        });

        // Create sale items and update stock
        for (const item of processedItems) {
            // Insert sale item
            const itemId = uuidv4();
            await db.execute({
                sql: "INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
                args: [
                    itemId,
                    saleId,
                    item.product_id,
                    item.quantity,
                    item.unit_price,
                    item.subtotal,
                ],
            });

            // Update product stock
            await db.execute({
                sql: "UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                args: [item.quantity, item.product_id],
            });

            // Record stock movement
            const movementId = uuidv4();
            await db.execute({
                sql: `INSERT INTO stock_movements (id, business_id, product_id, quantity, type, reason, user_id)
              VALUES (?, ?, ?, ?, 'OUT', ?, ?)`,
                args: [
                    movementId,
                    business_id,
                    item.product_id,
                    -item.quantity,
                    `Sale ${saleId}`,
                    req.user.userId,
                ],
            });
        }

        res.status(201).json({
            id: saleId,
            business_id,
            subtotal,
            discount,
            tax,
            total,
            payment_method,
            items: processedItems,
        });
    } catch (error) {
        console.error("Create sale error:", error);
        res.status(500).json({ error: "Failed to create sale" });
    }
};

export const getSales = async (req, res) => {
    try {
        const { business_id, start_date, end_date, limit = 50 } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = `
      SELECT s.*, u.full_name as user_name, c.name as customer_name
      FROM sales s
      INNER JOIN users u ON s.user_id = u.id
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.business_id = ?
    `;
        const args = [business_id];

        if (start_date) {
            sql += " AND s.created_at >= ?";
            args.push(start_date);
        }

        if (end_date) {
            sql += " AND s.created_at <= ?";
            args.push(end_date);
        }

        sql += " ORDER BY s.created_at DESC LIMIT ?";
        args.push(parseInt(limit));

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get sales error:", error);
        res.status(500).json({ error: "Failed to fetch sales" });
    }
};

export const getSale = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        // Get sale
        const saleResult = await db.execute({
            sql: `
        SELECT s.*, u.full_name as user_name, c.name as customer_name
        FROM sales s
        INNER JOIN users u ON s.user_id = u.id
        LEFT JOIN customers c ON s.customer_id = c.id
        WHERE s.id = ?
      `,
            args: [id],
        });

        if (saleResult.rows.length === 0) {
            return res.status(404).json({ error: "Sale not found" });
        }

        const sale = saleResult.rows[0];

        // Get sale items
        const itemsResult = await db.execute({
            sql: `
        SELECT si.*, p.name as product_name
        FROM sale_items si
        INNER JOIN products p ON si.product_id = p.id
        WHERE si.sale_id = ?
      `,
            args: [id],
        });

        sale.items = itemsResult.rows;

        res.json(sale);
    } catch (error) {
        console.error("Get sale error:", error);
        res.status(500).json({ error: "Failed to fetch sale" });
    }
};

export const cancelSale = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        // Get sale
        const saleResult = await db.execute({
            sql: "SELECT business_id, status FROM sales WHERE id = ?",
            args: [id],
        });

        if (saleResult.rows.length === 0) {
            return res.status(404).json({ error: "Sale not found" });
        }

        const sale = saleResult.rows[0];

        if (sale.status === "CANCELLED") {
            return res.status(400).json({ error: "Sale already cancelled" });
        }

        // Get sale items to restore stock
        const itemsResult = await db.execute({
            sql: "SELECT product_id, quantity FROM sale_items WHERE sale_id = ?",
            args: [id],
        });

        // Update sale status
        await db.execute({
            sql: 'UPDATE sales SET status = "CANCELLED" WHERE id = ?',
            args: [id],
        });

        // Restore stock
        for (const item of itemsResult.rows) {
            await db.execute({
                sql: "UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                args: [item.quantity, item.product_id],
            });

            // Record stock movement
            const movementId = uuidv4();
            await db.execute({
                sql: `INSERT INTO stock_movements (id, business_id, product_id, quantity, type, reason, user_id)
              VALUES (?, ?, ?, ?, 'IN', ?, ?)`,
                args: [
                    movementId,
                    sale.business_id,
                    item.product_id,
                    item.quantity,
                    `Sale ${id} cancelled`,
                    req.user.userId,
                ],
            });
        }

        res.json({ message: "Sale cancelled successfully" });
    } catch (error) {
        console.error("Cancel sale error:", error);
        res.status(500).json({ error: "Failed to cancel sale" });
    }
};
