import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    adjustStock,
    getStockMovements,
    getLowStockProducts,
} from "../controllers/stockController.js";

const router = express.Router();

router.use(authenticate);

router.post("/adjust", adjustStock);
router.get("/movements", getStockMovements);
router.get("/low-stock", getLowStockProducts);

export default router;
