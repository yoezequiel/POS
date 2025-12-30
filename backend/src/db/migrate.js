import { getDb } from "./connection.js";

const migrations = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

    // Businesses table
    `CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    currency TEXT DEFAULT 'USD',
    tax_rate REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

    // User-Business relationship (multi-tenant)
    `CREATE TABLE IF NOT EXISTS user_business (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    business_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('ADMIN', 'EMPLEADO')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    UNIQUE(user_id, business_id)
  )`,

    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
  )`,

    // Products table
    `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    category_id TEXT,
    name TEXT NOT NULL,
    sku TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  )`,

    // Stock movements table
    `CREATE TABLE IF NOT EXISTS stock_movements (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('IN', 'OUT', 'ADJUSTMENT')),
    reason TEXT,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

    // Customers table
    `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    name TEXT NOT NULL,
    document TEXT,
    email TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
  )`,

    // Cash registers table
    `CREATE TABLE IF NOT EXISTS cash_registers (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    opening_amount REAL NOT NULL,
    closing_amount REAL,
    expected_amount REAL,
    opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME,
    status TEXT NOT NULL CHECK(status IN ('OPEN', 'CLOSED')),
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

    // Sales table
    `CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    customer_id TEXT,
    cash_register_id TEXT,
    subtotal REAL NOT NULL,
    discount REAL DEFAULT 0,
    tax REAL DEFAULT 0,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('EFECTIVO', 'DEBITO', 'CREDITO', 'TRANSFERENCIA')),
    status TEXT NOT NULL CHECK(status IN ('COMPLETED', 'CANCELLED', 'PENDING')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (cash_register_id) REFERENCES cash_registers(id)
  )`,

    // Sale items table
    `CREATE TABLE IF NOT EXISTS sale_items (
    id TEXT PRIMARY KEY,
    sale_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`,

    // Refresh tokens table
    `CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

    // Create indexes
    `CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id)`,
    `CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`,
    `CREATE INDEX IF NOT EXISTS idx_sales_business ON sales(business_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_user_business ON user_business(user_id, business_id)`,
];

export const migrate = async () => {
    const db = getDb();

    try {
        console.log("🚀 Starting database migrations...");

        for (const [index, migration] of migrations.entries()) {
            await db.execute(migration);
            console.log(
                `✅ Migration ${index + 1}/${migrations.length} completed`
            );
        }

        console.log("✨ All migrations completed successfully!");
    } catch (error) {
        console.error("❌ Migration error:", error);
        throw error;
    }
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrate()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
