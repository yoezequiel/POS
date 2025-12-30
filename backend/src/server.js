import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { errorHandler } from "./utils/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { logger } from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import cashRoutes from "./routes/cashRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
if (config.nodeEnv === "development") {
    app.use(requestLogger);
}

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/cash", cashRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reports", reportRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    logger.info(`POS Backend started`, {
        port: PORT,
        environment: config.nodeEnv,
        corsOrigin: config.cors.origin,
    });
    console.log(`🚀 POS Backend running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS enabled for: ${config.cors.origin}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Promise Rejection", err);
    // Close server & exit process
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception", err);
    process.exit(1);
});

export default app;
