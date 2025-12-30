import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    openCashRegister,
    closeCashRegister,
    getCurrentCashRegister,
    getCashRegisters,
} from "../controllers/cashController.js";

const router = express.Router();

router.use(authenticate);

router.post("/open", openCashRegister);
router.post("/:id/close", closeCashRegister);
router.get("/current", getCurrentCashRegister);
router.get("/", getCashRegisters);

export default router;
