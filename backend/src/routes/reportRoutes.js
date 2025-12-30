import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    getSalesReport,
    getTopProducts,
    getPaymentMethodsReport,
    getDashboardStats,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(authenticate);

router.get("/sales", getSalesReport);
router.get("/top-products", getTopProducts);
router.get("/payment-methods", getPaymentMethodsReport);
router.get("/dashboard", getDashboardStats);

export default router;
