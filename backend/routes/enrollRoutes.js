import express from "express";
import {
  enrollCourse,
  getMyCourses,
  cancelEnroll,
} from "../controllers/enrollController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/courses/:courseId/enroll", protect, enrollCourse);
router.delete("/courses/:courseId/enroll", protect, cancelEnroll);
router.get("/my-courses", protect, getMyCourses);

export default router;
