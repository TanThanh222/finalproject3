import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  verifyCheckoutSession,
  stripeWebhook,
  getMyPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/verify-session", protect, verifyCheckoutSession);
router.get("/my-payments", protect, getMyPayments);

export default router;
export { stripeWebhook };
