import { getDb } from "../db/connection.js";

export const getSalesReport = async (req, res) => {
    try {
        const {
            business_id,
            start_date,
            end_date,
            group_by = "day",
        } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let dateFormat;

        switch (group_by) {
            case "month":
                dateFormat = "%Y-%m";
                break;
            case "week":
                dateFormat = "%Y-%W";
                break;
            case "day":
            default:
                dateFormat = "%Y-%m-%d";
        }

        let sql = `
      SELECT 
        strftime('${dateFormat}', created_at) as period,
        COUNT(*) as sales_count,
        SUM(total) as total_sales,
        SUM(subtotal) as total_subtotal,
        SUM(discount) as total_discount,
        SUM(tax) as total_tax,
        AVG(total) as average_sale
      FROM sales
      WHERE business_id = ? AND status = 'COMPLETED'
    `;
        const args = [business_id];

        if (start_date) {
            sql += " AND created_at >= ?";
            args.push(start_date);
        }

        if (end_date) {
            sql += " AND created_at <= ?";
            args.push(end_date);
        }

        sql += " GROUP BY period ORDER BY period DESC";

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get sales report error:", error);
        res.status(500).json({ error: "Failed to fetch sales report" });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        const { business_id, start_date, end_date, limit = 10 } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        SUM(si.quantity) as total_quantity,
        SUM(si.subtotal) as total_revenue,
        COUNT(DISTINCT si.sale_id) as sales_count
      FROM sale_items si
      INNER JOIN products p ON si.product_id = p.id
      INNER JOIN sales s ON si.sale_id = s.id
      WHERE s.business_id = ? AND s.status = 'COMPLETED'
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

        sql +=
            " GROUP BY p.id, p.name, p.sku ORDER BY total_quantity DESC LIMIT ?";
        args.push(parseInt(limit));

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get top products error:", error);
        res.status(500).json({ error: "Failed to fetch top products" });
    }
};

export const getPaymentMethodsReport = async (req, res) => {
    try {
        const { business_id, start_date, end_date } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();
        let sql = `
      SELECT 
        payment_method,
        COUNT(*) as sales_count,
        SUM(total) as total_amount
      FROM sales
      WHERE business_id = ? AND status = 'COMPLETED'
    `;
        const args = [business_id];

        if (start_date) {
            sql += " AND created_at >= ?";
            args.push(start_date);
        }

        if (end_date) {
            sql += " AND created_at <= ?";
            args.push(end_date);
        }

        sql += " GROUP BY payment_method ORDER BY total_amount DESC";

        const result = await db.execute({ sql, args });
        res.json(result.rows);
    } catch (error) {
        console.error("Get payment methods report error:", error);
        res.status(500).json({
            error: "Failed to fetch payment methods report",
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const { business_id } = req.query;

        if (!business_id) {
            return res.status(400).json({ error: "Business ID required" });
        }

        const db = getDb();

        // Today's sales
        const todaySales = await db.execute({
            sql: `
        SELECT 
          COUNT(*) as count,
          COALESCE(SUM(total), 0) as total
        FROM sales
        WHERE business_id = ? 
          AND status = 'COMPLETED'
          AND DATE(created_at) = DATE('now')
      `,
            args: [business_id],
        });

        // This month's sales
        const monthSales = await db.execute({
            sql: `
        SELECT 
          COUNT(*) as count,
          COALESCE(SUM(total), 0) as total
        FROM sales
        WHERE business_id = ? 
          AND status = 'COMPLETED'
          AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
      `,
            args: [business_id],
        });

        // Low stock products
        const lowStock = await db.execute({
            sql: `
        SELECT COUNT(*) as count
        FROM products
        WHERE business_id = ? AND is_active = 1 AND stock <= 10
      `,
            args: [business_id],
        });

        // Active products
        const activeProducts = await db.execute({
            sql: `
        SELECT COUNT(*) as count
        FROM products
        WHERE business_id = ? AND is_active = 1
      `,
            args: [business_id],
        });

        res.json({
            today: {
                sales_count: todaySales.rows[0]?.count || 0,
                total: todaySales.rows[0]?.total || 0,
            },
            month: {
                sales_count: monthSales.rows[0]?.count || 0,
                total: monthSales.rows[0]?.total || 0,
            },
            low_stock_count: lowStock.rows[0]?.count || 0,
            active_products_count: activeProducts.rows[0]?.count || 0,
        });
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};
