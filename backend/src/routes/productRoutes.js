import express from "express";
import { authenticate, requireBusinessAccess } from "../middleware/auth.js";
import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    getCategories,
} from "../controllers/productController.js";

const router = express.Router();

router.use(authenticate);

// Categories
router.post("/categories", createCategory);
router.get("/categories", getCategories);

// Products
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
