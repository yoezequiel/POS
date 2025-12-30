import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/connection.js";

export const createProduct = async (req, res) => {
    try {
        const {
            business_id,
            name,
            sku,
            price,
            stock = 0,
            category_id,
            is_active = 1,
        } = req.body;

        if (!business_id || !name || price === undefined) {
            return res
                .status(400)
                .json({ error: "Business ID, name and price are required" });
        }

        const db = getDb();
        const productId = uuidv4();

        await db.execute({
            sql: `INSERT INTO products (id, business_id, category_id, name, sku, price, stock, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                productId,
                business_id,
                category_id || null,
                name,
                sku || null,
                price,
                stock,
                is_active,
            ],
        });

        // Record initial stock movement if stock > 0
        if (stock > 0) {
            const movementId = uuidv4();
            await db.execute({
                sql: `INSERT INTO stock_movements (id, business_id, product_id, quantity, type, reason, user_id)
              VALUES (?, ?, ?, ?, 'IN', 'Initial stock', ?)`,
                args: [
                    movementId,
                    business_id,
                    productId,
                    stock,
                    req.user.userId,
                ],
            });
        }

        res.status(201).json({
            id: productId,
            business_id,
            name,
            sku,
            price,
            stock,
            category_id,
            is_active,
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { business_id, search, is_active } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.business_id = ?
    `;
        const args = [business_id];

        if (search) {
            sql += " AND (p.name LIKE ? OR p.sku LIKE ?)";
            args.push(`%${search}%`, `%${search}%`);
        }

        if (is_active !== undefined) {
            sql += " AND p.is_active = ?";
            args.push(is_active === "true" ? 1 : 0);
        }

        sql += " ORDER BY p.name";

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        const result = await db.execute({
            sql: `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `,
            args: [id],
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, price, category_id, is_active } = req.body;
        const db = getDb();

        const updates = [];
        const args = [];

        if (name !== undefined) {
            updates.push("name = ?");
            args.push(name);
        }
        if (sku !== undefined) {
            updates.push("sku = ?");
            args.push(sku);
        }
        if (price !== undefined) {
            updates.push("price = ?");
            args.push(price);
        }
        if (category_id !== undefined) {
            updates.push("category_id = ?");
            args.push(category_id);
        }
        if (is_active !== undefined) {
            updates.push("is_active = ?");
            args.push(is_active ? 1 : 0);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        updates.push("updated_at = CURRENT_TIMESTAMP");
        args.push(id);

        await db.execute({
            sql: `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
            args,
        });

        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDb();

        // Soft delete
        await db.execute({
            sql: "UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            args: [id],
        });

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};

// Categories
export const createCategory = async (req, res) => {
    try {
        const { business_id, name } = req.body;

        if (!business_id || !name) {
            return res
                .status(400)
                .json({ error: "Business ID and name are required" });
        }

        const db = getDb();
        const categoryId = uuidv4();

        await db.execute({
            sql: "INSERT INTO categories (id, business_id, name) VALUES (?, ?, ?)",
            args: [categoryId, business_id, name],
        });

        res.status(201).json({ id: categoryId, business_id, name });
    } catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const { business_id } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        const result = await db.execute({
            sql: "SELECT * FROM categories WHERE business_id = ? ORDER BY name",
            args: [business_id],
        });

        res.json(result.rows);
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};
