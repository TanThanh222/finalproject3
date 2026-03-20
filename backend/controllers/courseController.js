import Course from "../models/Course.js";
import Enroll from "../models/Enroll.js";
import cloudinary from "../config/cloudinaryConfig.js";

const normalizeText = (value = "") => String(value || "").trim();

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const validateYoutubeUrl = (url = "") => {
  if (!url) return true;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);
};

const parseLessonList = (rawLessonList) => {
  if (!rawLessonList) return [];

  let parsed;

  try {
    parsed =
      typeof rawLessonList === "string"
        ? JSON.parse(rawLessonList)
        : rawLessonList;
  } catch (error) {
    throw new Error("Lesson list must be valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Lesson list must be an array");
  }

  return parsed.map((lesson, index) => {
    const title = normalizeText(lesson.title) || `Lesson ${index + 1}`;
    const description = normalizeText(lesson.description);
    const videoUrl = normalizeText(lesson.videoUrl);
    const duration = toNumber(lesson.duration, 0);
    const order = toNumber(lesson.order, index + 1);
    const isPreview = Boolean(
      lesson.isPreview !== undefined ? lesson.isPreview : lesson.preview,
    );

    if (!title) {
      throw new Error(`Lesson ${index + 1}: title is required`);
    }

    if (duration <= 0) {
      throw new Error(`Lesson ${index + 1}: duration must be greater than 0`);
    }

    if (order <= 0) {
      throw new Error(`Lesson ${index + 1}: order must be greater than 0`);
    }

    if (!validateYoutubeUrl(videoUrl)) {
      throw new Error(
        `Lesson ${index + 1}: video URL must be a valid YouTube link`,
      );
    }

    return {
      title,
      description,
      videoUrl,
      duration,
      order,
      isPreview,
    };
  });
};

const validateCoursePayload = (body, lessonList) => {
  const title = normalizeText(body.title);
  const category = normalizeText(body.category);
  const instructor = normalizeText(body.instructor);
  const level = normalizeText(body.level);
  const overview = normalizeText(body.overview);
  const courseLink = normalizeText(body.courseLink);

  if (!title) {
    throw new Error("Course title is required");
  }

  if (!category) {
    throw new Error("Category is required");
  }

  if (!instructor) {
    throw new Error("Instructor is required");
  }

  if (!level) {
    throw new Error("Level is required");
  }

  if (courseLink && !validateYoutubeUrl(courseLink)) {
    throw new Error("Course link must be a valid YouTube link");
  }

  if (!Array.isArray(lessonList)) {
    throw new Error("Lesson list is invalid");
  }

  return {
    title,
    category,
    instructor,
    level,
    weeks: Math.max(0, toNumber(body.weeks, 0)),
    price: Math.max(0, toNumber(body.price, 0)),
    oldPrice: Math.max(0, toNumber(body.oldPrice, 0)),
    rating: Math.min(5, Math.max(0, toNumber(body.rating, 0))),
    overview,
    courseLink,
    lessons: lessonList.length,
    lessonList,
  };
};

const uploadCourseImage = async (file) => {
  if (!file) return "";

  const base64 = file.buffer.toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64}`;

  const uploadResult = await cloudinary.uploader.upload(dataURI, {
    folder: "courses",
  });

  return uploadResult.secure_url;
};

const attachOwnership = async (courses, userId) => {
  if (!userId) {
    return courses.map((course) => ({
      ...course.toObject(),
      isOwned: false,
    }));
  }

  const enrolls = await Enroll.find({
    user: userId,
    status: "active",
  }).select("course");

  const ownedCourseIds = new Set(enrolls.map((item) => String(item.course)));

  return courses.map((course) => ({
    ...course.toObject(),
    isOwned: ownedCourseIds.has(String(course._id)),
  }));
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("students", "name email")
      .sort({ createdAt: -1 });

    const userId = req.user?._id || req.user?.id || null;
    const result = await attachOwnership(courses, userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Courses Error:", error);
    return res.status(500).json({
      message: "Failed to get courses",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "students",
      "name email",
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    let isOwned = false;

    if (req.user?._id || req.user?.id) {
      const userId = req.user?._id || req.user?.id;

      const existingEnroll = await Enroll.findOne({
        user: userId,
        course: course._id,
        status: "active",
      });

      isOwned = Boolean(existingEnroll);
    }

    return res.status(200).json({
      ...course.toObject(),
      isOwned,
    });
  } catch (error) {
    console.error("Get Course By Id Error:", error);
    return res.status(500).json({
      message: "Failed to get course",
      error: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const imageUrl = req.file ? await uploadCourseImage(req.file) : "";
    const lessonList = parseLessonList(req.body.lessonList);
    const payload = validateCoursePayload(req.body, lessonList);

    const course = await Course.create({
      ...payload,
      image: imageUrl,
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error:", error);

    const statusCode =
      error.message.includes("required") ||
      error.message.includes("invalid") ||
      error.message.includes("greater than 0") ||
      error.message.includes("valid YouTube")
        ? 400
        : 500;

    return res.status(statusCode).json({
      message: statusCode === 400 ? error.message : "Create course failed",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    let imageUrl = course.image;

    if (req.file) {
      imageUrl = await uploadCourseImage(req.file);
    }

    const lessonList =
      req.body.lessonList != null
        ? parseLessonList(req.body.lessonList)
        : course.lessonList || [];

    const payload = validateCoursePayload(
      {
        title: req.body.title ?? course.title,
        category: req.body.category ?? course.category,
        instructor: req.body.instructor ?? course.instructor,
        weeks: req.body.weeks ?? course.weeks,
        level: req.body.level ?? course.level,
        price: req.body.price ?? course.price,
        oldPrice: req.body.oldPrice ?? course.oldPrice,
        rating: req.body.rating ?? course.rating,
        overview: req.body.overview ?? course.overview,
        courseLink: req.body.courseLink ?? course.courseLink,
      },
      lessonList,
    );

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...payload,
        image: imageUrl,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Update Course Error:", error);

    const statusCode =
      error.message.includes("required") ||
      error.message.includes("invalid") ||
      error.message.includes("greater than 0") ||
      error.message.includes("valid YouTube")
        ? 400
        : 500;

    return res.status(statusCode).json({
      message: statusCode === 400 ? error.message : "Update course failed",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await course.deleteOne();

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete Course Error:", error);

    return res.status(500).json({
      message: "Delete course failed",
      error: error.message,
    });
  }
};
