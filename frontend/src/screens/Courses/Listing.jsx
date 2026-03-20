import { useContext, useState, useMemo, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer.jsx";
import CourseCard from "../../components/courses/CourseCard.jsx";
import { CourseContext } from "../../context/CourseContext";
import { SearchIcon } from "../../assets/icons/ui.jsx";

export default function Listing() {
  const { courses = [], courseLoading } = useContext(CourseContext);

  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const keyword = searchTerm.toLowerCase().trim();

      if (!keyword) return true;

      const inTitle = course?.title?.toLowerCase().includes(keyword);
      const inInstructor = course?.instructor?.toLowerCase().includes(keyword);
      const inCategory = course?.category?.toLowerCase().includes(keyword);
      const inLevel = course?.level?.toLowerCase().includes(keyword);

      return inTitle || inInstructor || inCategory || inLevel;
    });
  }, [courses, searchTerm]);

  useEffect(() => {
    setViewMode("list");
  }, []);

  return (
    <section className="bg-slate-50 py-8 md:py-10">
      <PageContainer>
        <div className="mb-7 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] md:p-7">
          <div className="mb-3 inline-flex items-center rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700">
            Explore Learning
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="mb-2 text-4xl font-extrabold tracking-[-0.03em] text-slate-900 md:text-5xl">
                All Courses
              </h1>

              <p className="text-base leading-8 text-slate-500">
                Discover professional courses designed to help you learn faster,
                build practical skills, and grow with confidence.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === "grid"
                      ? "bg-linear-to-r from-blue-600 to-violet-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.22)]"
                      : "text-slate-600"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  Grid View
                </button>

                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === "list"
                      ? "bg-linear-to-r from-blue-600 to-violet-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.22)]"
                      : "text-slate-600"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  List View
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses, instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-full border border-slate-200 bg-white pl-4 pr-11 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 sm:w-72"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <SearchIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {courseLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            No courses found
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      variant="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      variant="list"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </PageContainer>
    </section>
  );
}
