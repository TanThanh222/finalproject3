import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
      minlength: [2, "Lesson title must be at least 2 characters"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Lesson description must be at most 1000 characters"],
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(
            value,
          );
        },
        message: "Lesson video URL must be a valid YouTube link",
      },
    },
    duration: {
      type: Number,
      required: [true, "Lesson duration is required"],
      min: [1, "Lesson duration must be greater than 0"],
    },
    order: {
      type: Number,
      required: [true, "Lesson order is required"],
      min: [1, "Lesson order must be greater than 0"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Course title must be at least 3 characters"],
      maxlength: [200, "Course title must be at most 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [100, "Category must be at most 100 characters"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor is required"],
      trim: true,
      maxlength: [100, "Instructor name must be at most 100 characters"],
    },
    weeks: {
      type: Number,
      default: 0,
      min: [0, "Weeks cannot be negative"],
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      trim: true,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced"],
        message: "Level must be Beginner, Intermediate, or Advanced",
      },
    },
    lessons: {
      type: Number,
      default: 0,
      min: [0, "Lessons cannot be negative"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      default: 0,
      min: [0, "Old price cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be greater than 5"],
    },
    overview: {
      type: String,
      default: "",
      trim: true,
      maxlength: [3000, "Overview must be at most 3000 characters"],
    },
    courseLink: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(
            value,
          );
        },
        message: "Course link must be a valid YouTube link",
      },
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    lessonList: {
      type: [lessonSchema],
      default: [],
      validate: {
        validator: function (value) {
          return Array.isArray(value);
        },
        message: "Lesson list must be an array",
      },
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

courseSchema.pre("save", function () {
  if (Array.isArray(this.lessonList)) {
    this.lessons = this.lessonList.length;
  } else {
    this.lessons = 0;
  }
});

courseSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update && Array.isArray(update.lessonList)) {
    update.lessons = update.lessonList.length;
    this.setUpdate(update);
  }
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
