import Course from "../models/Course.js";
import Enroll from "../models/Enroll.js";

const syncCourseStudents = async (courseId) => {
  const activeEnrolls = await Enroll.find({
    course: courseId,
    status: "active",
  }).select("user");

  const studentIds = activeEnrolls.map((item) => item.user);

  await Course.findByIdAndUpdate(courseId, {
    students: studentIds,
  });
};

export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrolls = await Enroll.find({
      user: userId,
      status: "active",
    })
      .populate({
        path: "course",
      })
      .sort({ createdAt: -1 });

    const courses = enrolls.map((item) => item.course).filter(Boolean);

    return res.json(courses);
  } catch (error) {
    console.error("Get My Courses Error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingEnroll = await Enroll.findOne({
      user: userId,
      course: courseId,
      status: "active",
    });

    if (existingEnroll) {
      return res.status(400).json({
        message: "You already enrolled in this course",
      });
    }

    const price = Number(course.price || 0);

    if (price > 0) {
      return res.status(403).json({
        message: "This is a paid course. Please complete payment first.",
      });
    }

    await Enroll.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
      },
      {
        user: userId,
        course: courseId,
        payment: null,
        status: "active",
        enrolledAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    await syncCourseStudents(courseId);

    return res.json({
      message: "Enroll success",
    });
  } catch (error) {
    console.error("Enroll Error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelEnroll = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const enroll = await Enroll.findOne({
      user: userId,
      course: courseId,
      status: "active",
    });

    if (!enroll) {
      return res.status(400).json({
        message: "You are not enrolled in this course",
      });
    }

    const price = Number(course.price || 0);

    if (price > 0) {
      return res.status(403).json({
        message: "Paid courses cannot be cancelled from this action.",
      });
    }

    enroll.status = "cancelled";
    await enroll.save();

    await syncCourseStudents(courseId);

    return res.json({
      message: "Enrollment cancelled",
    });
  } catch (error) {
    console.error("Cancel Enroll Error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
