/**
 * Seed script - Populate database with realistic demo data
 * Run: npm run seed
 */

import { getDb } from "./connection.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const DEMO_EMAIL = "demo@pos.com";
const DEMO_PASSWORD = "demo123";
const DEMO_NAME = "Usuario Demo";

async function seed() {
    const db = getDb();

    console.log("🌱 Starting seed...\n");

    try {
        // 1. Create demo user
        console.log("👤 Creating demo user...");
        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
        const userId = uuidv4();

        await db.execute({
            sql: `INSERT OR REPLACE INTO users (id, email, password, full_name, created_at) 
                  VALUES (?, ?, ?, ?, datetime('now'))`,
            args: [userId, DEMO_EMAIL, hashedPassword, DEMO_NAME],
        });
        console.log(`   ✓ User: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

        // 2. Create demo business
        console.log("\n🏪 Creating demo business...");
        const businessId = uuidv4();

        await db.execute({
            sql: `INSERT OR REPLACE INTO businesses (id, name, address, currency, tax_rate, created_at) 
                  VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            args: [
                businessId,
                "Tienda El Buen Precio",
                "Av. Principal 123, Centro Comercial Plaza Mayor, Local 45",
                "USD",
                0.21,
            ],
        });

        await db.execute({
            sql: `INSERT OR REPLACE INTO user_business (id, user_id, business_id, role, created_at) 
                  VALUES (?, ?, ?, ?, datetime('now'))`,
            args: [uuidv4(), userId, businessId, "ADMIN"],
        });
        console.log("   ✓ Business: Tienda El Buen Precio");

        // 3. Create categories
        console.log("\n📦 Creating categories...");
        const categories = [
            { id: uuidv4(), name: "Electrónicos" },
            { id: uuidv4(), name: "Hogar y Cocina" },
            { id: uuidv4(), name: "Deportes y Fitness" },
            { id: uuidv4(), name: "Libros y Papelería" },
            { id: uuidv4(), name: "Alimentos y Bebidas" },
            { id: uuidv4(), name: "Ropa y Accesorios" },
        ];

        for (const cat of categories) {
            await db.execute({
                sql: `INSERT OR REPLACE INTO categories (id, business_id, name, created_at) 
                      VALUES (?, ?, ?, datetime('now'))`,
                args: [cat.id, businessId, cat.name],
            });
            console.log(`   ✓ ${cat.name}`);
        }

        // 4. Create products
        console.log("\n📱 Creating products...");
        const products = [
            // Electrónicos
            {
                name: "Mouse Inalámbrico Logitech",
                sku: "ELE-MOU-001",
                price: 24.99,
                stock: 45,
                category: 0,
            },
            {
                name: "Teclado Mecánico RGB",
                sku: "ELE-TEC-002",
                price: 79.99,
                stock: 18,
                category: 0,
            },
            {
                name: "Auriculares Bluetooth Sony",
                sku: "ELE-AUR-003",
                price: 89.99,
                stock: 32,
                category: 0,
            },
            {
                name: "Webcam HD 1080p",
                sku: "ELE-WEB-004",
                price: 49.99,
                stock: 12,
                category: 0,
            },
            {
                name: "Cable USB-C 2 metros",
                sku: "ELE-CAB-005",
                price: 12.99,
                stock: 150,
                category: 0,
            },
            {
                name: "Cargador Rápido 65W",
                sku: "ELE-CAR-006",
                price: 34.99,
                stock: 28,
                category: 0,
            },

            // Hogar y Cocina
            {
                name: "Cafetera de Goteo 12 Tazas",
                sku: "HOG-CAF-001",
                price: 45.99,
                stock: 15,
                category: 1,
            },
            {
                name: "Juego de Sartenes Antiadherentes",
                sku: "HOG-SAR-002",
                price: 89.99,
                stock: 8,
                category: 1,
            },
            {
                name: "Licuadora 600W",
                sku: "HOG-LIC-003",
                price: 59.99,
                stock: 10,
                category: 1,
            },
            {
                name: "Set de Cuchillos de Cocina",
                sku: "HOG-CUC-004",
                price: 39.99,
                stock: 22,
                category: 1,
            },
            {
                name: "Tabla de Cortar Bambú",
                sku: "HOG-TAB-005",
                price: 18.99,
                stock: 35,
                category: 1,
            },

            // Deportes y Fitness
            {
                name: "Esterilla de Yoga Premium",
                sku: "DEP-EST-001",
                price: 29.99,
                stock: 40,
                category: 2,
            },
            {
                name: "Pesas Ajustables 20kg",
                sku: "DEP-PES-002",
                price: 129.99,
                stock: 6,
                category: 2,
            },
            {
                name: "Botella de Agua Térmica 1L",
                sku: "DEP-BOT-003",
                price: 22.99,
                stock: 55,
                category: 2,
            },
            {
                name: "Banda Elástica Resistencia",
                sku: "DEP-BAN-004",
                price: 14.99,
                stock: 68,
                category: 2,
            },
            {
                name: "Guantes de Gimnasio",
                sku: "DEP-GUA-005",
                price: 16.99,
                stock: 30,
                category: 2,
            },

            // Libros y Papelería
            {
                name: "Cuaderno A4 Espiral 200 Hojas",
                sku: "LIB-CUA-001",
                price: 8.99,
                stock: 120,
                category: 3,
            },
            {
                name: "Set de Bolígrafos Gel x12",
                sku: "LIB-BOL-002",
                price: 14.99,
                stock: 75,
                category: 3,
            },
            {
                name: "Marcadores Fluorescentes x6",
                sku: "LIB-MAR-003",
                price: 9.99,
                stock: 90,
                category: 3,
            },
            {
                name: "Carpeta Archivador A4",
                sku: "LIB-CAR-004",
                price: 6.99,
                stock: 50,
                category: 3,
            },

            // Alimentos y Bebidas
            {
                name: "Café Premium Molido 500g",
                sku: "ALI-CAF-001",
                price: 12.99,
                stock: 80,
                category: 4,
            },
            {
                name: "Té Verde Orgánico 100 Bolsitas",
                sku: "ALI-TE-002",
                price: 15.99,
                stock: 45,
                category: 4,
            },
            {
                name: "Galletas de Avena x300g",
                sku: "ALI-GAL-003",
                price: 5.99,
                stock: 100,
                category: 4,
            },
            {
                name: "Barras Energéticas x12",
                sku: "ALI-BAR-004",
                price: 18.99,
                stock: 60,
                category: 4,
            },

            // Ropa y Accesorios
            {
                name: "Camiseta Básica Algodón",
                sku: "ROP-CAM-001",
                price: 19.99,
                stock: 85,
                category: 5,
            },
            {
                name: "Gorra Deportiva Ajustable",
                sku: "ROP-GOR-002",
                price: 24.99,
                stock: 42,
                category: 5,
            },
            {
                name: "Calcetines Deportivos x3 Pares",
                sku: "ROP-CAL-003",
                price: 12.99,
                stock: 95,
                category: 5,
            },
            {
                name: "Mochila Urbana 25L",
                sku: "ROP-MOC-004",
                price: 49.99,
                stock: 18,
                category: 5,
            },
        ];

        const productIds = [];
        for (const product of products) {
            const productId = uuidv4();
            productIds.push({ id: productId, ...product });

            await db.execute({
                sql: `INSERT OR REPLACE INTO products (id, business_id, category_id, name, sku, price, stock, is_active, created_at, updated_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
                args: [
                    productId,
                    businessId,
                    categories[product.category].id,
                    product.name,
                    product.sku,
                    product.price,
                    product.stock,
                ],
            });
        }
        console.log(`   ✓ ${products.length} products created`);

        // 5. Create customers
        console.log("\n👥 Creating customers...");
        const customers = [
            {
                name: "María González",
                document: "12345678",
                email: "maria.gonzalez@email.com",
                phone: "+1234567890",
            },
            {
                name: "Carlos Rodríguez",
                document: "23456789",
                email: "carlos.rodriguez@email.com",
                phone: "+1234567891",
            },
            {
                name: "Ana Martínez",
                document: "34567890",
                email: "ana.martinez@email.com",
                phone: "+1234567892",
            },
            {
                name: "Luis Fernández",
                document: "45678901",
                email: "luis.fernandez@email.com",
                phone: "+1234567893",
            },
            {
                name: "Carmen López",
                document: "56789012",
                email: "carmen.lopez@email.com",
                phone: "+1234567894",
            },
            {
                name: "Roberto Sánchez",
                document: "67890123",
                email: "roberto.sanchez@email.com",
                phone: "+1234567895",
            },
            {
                name: "Elena Torres",
                document: "78901234",
                email: "elena.torres@email.com",
                phone: "+1234567896",
            },
            {
                name: "Diego Ramírez",
                document: "89012345",
                email: "diego.ramirez@email.com",
                phone: "+1234567897",
            },
        ];

        const customerIds = [];
        for (const customer of customers) {
            const customerId = uuidv4();
            customerIds.push(customerId);

            await db.execute({
                sql: `INSERT OR REPLACE INTO customers (id, business_id, name, document, email, phone, created_at, updated_at) 
                      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                args: [
                    customerId,
                    businessId,
                    customer.name,
                    customer.document,
                    customer.email,
                    customer.phone,
                ],
            });
        }
        console.log(`   ✓ ${customers.length} customers created`);

        // 6. Create cash register history (closed)
        console.log("\n💰 Creating cash register...");
        const registerId = uuidv4();

        await db.execute({
            sql: `INSERT OR REPLACE INTO cash_registers (id, business_id, user_id, opening_amount, closing_amount, expected_amount, opened_at, closed_at, status) 
                  VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 day', 'start of day', '+9 hours'), datetime('now', '-1 day', 'start of day', '+21 hours'), 'CLOSED')`,
            args: [registerId, businessId, userId, 100.0, 1547.5, 1545.8],
        });
        console.log("   ✓ Previous cash register (closed)");

        // 7. Create sales from yesterday
        console.log("\n💳 Creating sales...");
        const salesData = [
            {
                customerId: customerIds[0],
                items: [
                    { productIdx: 0, qty: 2 },
                    { productIdx: 4, qty: 3 },
                ],
                payment: "EFECTIVO",
                discount: 5,
            },
            {
                customerId: customerIds[1],
                items: [
                    { productIdx: 2, qty: 1 },
                    { productIdx: 5, qty: 1 },
                ],
                payment: "DEBITO",
                discount: 0,
            },
            {
                customerId: customerIds[2],
                items: [{ productIdx: 6, qty: 1 }],
                payment: "CREDITO",
                discount: 10,
            },
            {
                customerId: null,
                items: [
                    { productIdx: 16, qty: 5 },
                    { productIdx: 17, qty: 2 },
                    { productIdx: 18, qty: 3 },
                ],
                payment: "EFECTIVO",
                discount: 0,
            },
            {
                customerId: customerIds[4],
                items: [{ productIdx: 11, qty: 2 }],
                payment: "TRANSFERENCIA",
                discount: 5,
            },
            {
                customerId: customerIds[5],
                items: [
                    { productIdx: 24, qty: 3 },
                    { productIdx: 26, qty: 2 },
                ],
                payment: "EFECTIVO",
                discount: 0,
            },
            {
                customerId: customerIds[6],
                items: [
                    { productIdx: 20, qty: 4 },
                    { productIdx: 21, qty: 2 },
                ],
                payment: "DEBITO",
                discount: 0,
            },
            {
                customerId: customerIds[7],
                items: [{ productIdx: 1, qty: 1 }],
                payment: "CREDITO",
                discount: 15,
            },
        ];

        for (let i = 0; i < salesData.length; i++) {
            const saleData = salesData[i];
            const saleId = uuidv4();

            // Calculate totals
            let subtotal = 0;
            const items = [];

            for (const item of saleData.items) {
                const product = productIds[item.productIdx];
                const itemSubtotal = product.price * item.qty;
                subtotal += itemSubtotal;

                items.push({
                    productId: product.id,
                    productName: product.name,
                    quantity: item.qty,
                    unitPrice: product.price,
                    subtotal: itemSubtotal,
                });
            }

            const afterDiscount = subtotal - saleData.discount;
            const tax = afterDiscount * 0.21;
            const total = afterDiscount + tax;

            // Create sale (yesterday at different times)
            await db.execute({
                sql: `INSERT OR REPLACE INTO sales (id, business_id, user_id, customer_id, cash_register_id, subtotal, discount, tax, total, payment_method, status, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', datetime('now', '-1 day', 'start of day', '+${
                          10 + i * 2
                      } hours'))`,
                args: [
                    saleId,
                    businessId,
                    userId,
                    saleData.customerId,
                    registerId,
                    subtotal.toFixed(2),
                    saleData.discount,
                    tax.toFixed(2),
                    total.toFixed(2),
                    saleData.payment,
                ],
            });

            // Create sale items
            for (const item of items) {
                await db.execute({
                    sql: `INSERT OR REPLACE INTO sale_items (id, sale_id, product_id, quantity, unit_price, subtotal) 
                          VALUES (?, ?, ?, ?, ?, ?)`,
                    args: [
                        uuidv4(),
                        saleId,
                        item.productId,
                        item.quantity,
                        item.unitPrice,
                        item.subtotal,
                    ],
                });

                // Create stock movement
                await db.execute({
                    sql: `INSERT OR REPLACE INTO stock_movements (id, business_id, product_id, quantity, type, reason, user_id, created_at) 
                          VALUES (?, ?, ?, ?, 'OUT', ?, ?, datetime('now', '-1 day', 'start of day', '+${
                              10 + i * 2
                          } hours'))`,
                    args: [
                        uuidv4(),
                        businessId,
                        item.productId,
                        -item.quantity,
                        `Sale #${saleId.substring(0, 8)}`,
                        userId,
                    ],
                });
            }
        }
        console.log(`   ✓ ${salesData.length} sales created`);

        // 8. Create some stock movements (adjustments and incoming)
        console.log("\n📦 Creating stock movements...");
        const stockMovements = [
            {
                productIdx: 12,
                qty: 50,
                type: "IN",
                reason: "Restock from supplier - Batch #001",
            },
            {
                productIdx: 13,
                qty: -2,
                type: "ADJUSTMENT",
                reason: "Damaged units - Quality check",
            },
            {
                productIdx: 20,
                qty: 100,
                type: "IN",
                reason: "New inventory - Batch #002",
            },
            {
                productIdx: 7,
                qty: 15,
                type: "IN",
                reason: "Restock from supplier - Batch #003",
            },
        ];

        for (const movement of stockMovements) {
            const product = productIds[movement.productIdx];
            await db.execute({
                sql: `INSERT OR REPLACE INTO stock_movements (id, business_id, product_id, quantity, type, reason, user_id, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-${Math.floor(
                          Math.random() * 7
                      )} days'))`,
                args: [
                    uuidv4(),
                    businessId,
                    product.id,
                    movement.qty,
                    movement.type,
                    movement.reason,
                    userId,
                ],
            });
        }
        console.log(`   ✓ ${stockMovements.length} stock movements created`);

        console.log("\n✅ Seed completed successfully!\n");
        console.log("📝 Demo credentials:");
        console.log(`   Email: ${DEMO_EMAIL}`);
        console.log(`   Password: ${DEMO_PASSWORD}`);
        console.log("\n🚀 You can now login and explore the system!\n");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
}

// Run seed
seed()
    .then(() => {
        console.log("Done! Press Ctrl+C to exit.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Failed:", error);
        process.exit(1);
    });
