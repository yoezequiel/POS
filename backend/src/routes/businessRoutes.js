import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
    createBusiness,
    getBusinesses,
    getBusiness,
    updateBusiness,
} from "../controllers/businessController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createBusiness);
router.get("/", getBusinesses);
router.get("/:id", getBusiness);
router.put("/:id", updateBusiness);

export default router;
