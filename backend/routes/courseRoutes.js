import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.get("/", optionalAuth, getCourses);
router.get("/:id", optionalAuth, getCourseById);

router.post("/", protect, adminOnly, upload.single("image"), createCourse);
router.put("/:id", protect, adminOnly, upload.single("image"), updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

export default router;
