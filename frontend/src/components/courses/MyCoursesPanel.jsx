import { useContext, useMemo } from "react";
import { Empty, Spin } from "antd";

import CourseCard from "./CourseCard";
import { CourseContext } from "../../context/CourseContext";
import useAuth from "../../hook/useAuth";
import useCourseRegister from "../../hook/useCourseRegister";

export default function MyCoursesPanel({ viewMode = "grid" }) {
  const { courses, courseLoading } = useContext(CourseContext);
  const { user } = useAuth();
  const { registers, regLoading } = useCourseRegister();

  const userId = user?.email || user?._id;

  const myCourseIds = useMemo(() => {
    if (!userId) return [];
    return registers
      .filter((r) => String(r?.userId) === String(userId))
      .map((r) => String(r?.courseId));
  }, [registers, userId]);

  const myCourses = useMemo(() => {
    if (!myCourseIds.length) return [];
    return courses.filter((c) => myCourseIds.includes(String(c?._id || c?.id)));
  }, [courses, myCourseIds]);

  const loading = courseLoading || regLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spin />
      </div>
    );
  }

  if (!myCourses.length) {
    return (
      <div className="rounded-3xl bg-white p-8">
        <Empty description="You haven't enrolled any course yet." />
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {myCourses.map((course) => (
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
      {myCourses.map((course) => (
        <CourseCard
          key={course?._id || course?.id}
          course={course}
          variant="grid"
        />
      ))}
    </div>
  );
}
