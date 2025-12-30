import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    createSale,
    getSales,
    getSale,
    cancelSale,
} from "../controllers/saleController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createSale);
router.get("/", getSales);
router.get("/:id", getSale);
router.post("/:id/cancel", cancelSale);

export default router;
