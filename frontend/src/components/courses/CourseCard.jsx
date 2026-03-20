import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaClock, FaSignal, FaUserGraduate } from "react-icons/fa";

function formatPrice(value) {
  const number = Number(value) || 0;
  return `$${number.toFixed(2)}`;
}

export default function CourseCard({ course, variant = "grid" }) {
  const navigate = useNavigate();

  const imageUrl = course?.image
    ? course.image.startsWith("http")
      ? course.image
      : `http://localhost:5000/${course.image.replace(/^\/+/, "")}`
    : "/images/course-placeholder.png";

  const studentsCount = course?.students?.length || 0;
  const totalMinutes =
    course?.lessonList?.reduce(
      (sum, lesson) => sum + (Number(lesson?.duration) || 0),
      0,
    ) || 0;

  const price = Number(course?.price) || 0;
  const oldPrice = Number(course?.oldPrice) || 0;
  const hasDiscount = oldPrice > price && oldPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const isOwned = Boolean(course?.isOwned);
  const isFree = price <= 0;

  const actionLabel = isOwned ? "Owned" : isFree ? "Free Course" : "Buy Now";

  const actionClass = isOwned
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none"
    : "bg-linear-to-r from-blue-600 to-violet-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.22)]";

  if (variant === "list") {
    return (
      <div
        onClick={() => navigate(`/courses/${course._id}`)}
        className="group flex cursor-pointer flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.10)] md:flex-row md:p-5"
      >
        <div className="shrink-0 rounded-[20px] border border-slate-200 bg-slate-50 p-3 md:w-[280px]">
          <img
            src={imageUrl}
            alt={course.title}
            className="h-44 w-full rounded-2xl object-cover"
            onError={(e) => (e.target.src = "/images/course-placeholder.png")}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {course?.category && (
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                  {course.category}
                </span>
              )}

              {course?.level && (
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {course.level}
                </span>
              )}

              {hasDiscount && (
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                  Save {discountPercent}%
                </span>
              )}

              {isOwned && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Owned
                </span>
              )}
            </div>

            <h3 className="mb-2 text-2xl font-extrabold tracking-[-0.02em] text-slate-900 transition group-hover:text-blue-700">
              {course.title}
            </h3>

            <p className="mb-3 text-sm text-slate-500">
              Instructor:{" "}
              <span className="font-semibold text-slate-700">
                {course.instructor || "Updating..."}
              </span>
            </p>

            <p className="line-clamp-2 text-sm leading-7 text-slate-500">
              {course.overview || "No overview available for this course yet."}
            </p>
          </div>

          <div className="mt-5">
            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                  <FaBookOpen />
                </span>
                <span>{course.lessons || 0} lessons</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                  <FaClock />
                </span>
                <span>{course.weeks || 0} weeks</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                  <FaSignal />
                </span>
                <span>{course.level || "All Levels"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                  <FaUserGraduate />
                </span>
                <span>{studentsCount} students</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
                  <FaClock />
                </span>
                <span>{totalMinutes} mins</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                {hasDiscount && (
                  <span className="mr-2 text-sm text-slate-400 line-through">
                    {formatPrice(oldPrice)}
                  </span>
                )}

                <span className="text-xl font-extrabold tracking-[-0.02em] text-slate-900">
                  {price > 0 ? formatPrice(price) : "Free"}
                </span>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-bold ${actionClass}`}
              >
                {actionLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.12)]"
    >
      <div className="border-b border-slate-200 bg-slate-50 p-3">
        <img
          src={imageUrl}
          alt={course.title}
          className="h-52 w-full rounded-2xl object-cover"
          onError={(e) => (e.target.src = "/images/course-placeholder.png")}
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {course?.category && (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              {course.category}
            </span>
          )}

          {course?.level && (
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {course.level}
            </span>
          )}

          {hasDiscount && (
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
              Save {discountPercent}%
            </span>
          )}

          {isOwned && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Owned
            </span>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-lg font-extrabold tracking-[-0.02em] text-slate-900 transition group-hover:text-blue-700">
            {course.title}
          </h3>

          <p className="text-sm text-slate-500">
            Instructor:{" "}
            <span className="font-semibold text-slate-700">
              {course.instructor || "Updating..."}
            </span>
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-7 text-slate-500">
          {course.overview || "No overview available for this course yet."}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
              <FaBookOpen />
            </span>
            <span>{course.lessons || 0} lessons</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
              <FaClock />
            </span>
            <span>{course.weeks || 0} weeks</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
              <FaSignal />
            </span>
            <span>{course.level || "All Levels"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-50 text-blue-600">
              <FaUserGraduate />
            </span>
            <span>{studentsCount} students</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            {hasDiscount && (
              <span className="mr-2 text-sm text-slate-400 line-through">
                {formatPrice(oldPrice)}
              </span>
            )}

            <span className="text-lg font-extrabold tracking-[-0.02em] text-slate-900">
              {price > 0 ? formatPrice(price) : "Free"}
            </span>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-xs font-bold ${actionClass}`}
          >
            {actionLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
