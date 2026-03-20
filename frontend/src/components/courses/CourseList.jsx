import { useContext } from "react";
import { CourseContext } from "../../context/CourseContext";
import CourseCard from "./CourseCard";

export default function CourseList({
  courses: propCourses,
  limit,
  variant = "grid",
}) {
  const { courses: contextCourses = [], courseLoading } =
    useContext(CourseContext);

  const courses = propCourses ?? contextCourses;

  if (courseLoading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  if (!courses || courses.length === 0) {
    return <p className="text-sm text-slate-500">No courses found.</p>;
  }

  const displayCourses = limit ? courses.slice(0, limit) : courses;

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {displayCourses.map((course) => (
          <CourseCard
            key={course?._id || course?.id}
            course={course}
            variant="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {displayCourses.map((course) => (
        <CourseCard
          key={course?._id || course?.id}
          course={course}
          variant="grid"
        />
      ))}
    </div>
  );
}
