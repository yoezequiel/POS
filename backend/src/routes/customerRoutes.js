import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
