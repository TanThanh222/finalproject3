import { useContext } from "react";
import PageContainer from "../../components/layout/PageContainer.jsx";
import HeroBG from "../../assets/home/hero-student.png";
import PrimaryButton from "../../components/common/PrimaryButton.jsx";
import {
  ArtIcon,
  DevelopmentIcon,
  CommunicationtIcon,
  VideoIcon,
  PhotoIcon,
  MarketingIcon,
  ContentIcon,
  FinanceIcon,
  ScienceIcon,
  NetworkIcon,
} from "../../assets/icons/category.jsx";
import CourseList from "../../components/courses/CourseList.jsx";
import { CourseContext } from "../../context/CourseContext";
import AddonsBanner from "../../assets/home/addons.png";
import SkillIllustration from "../../assets/home/skill.png";
import LmsBanner from "../../assets/home/academylms.png";
import StudentIcon from "../../assets/home/student.png";
import article1 from "../../assets/home/article1.png";
import article2 from "../../assets/home/article2.png";
import article3 from "../../assets/home/article3.png";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, title: "Art & Design", courses: 38, Icon: ArtIcon },
  { id: 2, title: "Development", courses: 38, Icon: DevelopmentIcon },
  { id: 3, title: "Communication", courses: 38, Icon: CommunicationtIcon },
  { id: 4, title: "Videography", courses: 38, Icon: VideoIcon },
  { id: 5, title: "Photography", courses: 38, Icon: PhotoIcon },
  { id: 6, title: "Marketing", courses: 38, Icon: MarketingIcon },
  { id: 7, title: "Content Writing", courses: 38, Icon: ContentIcon },
  { id: 8, title: "Finance", courses: 38, Icon: FinanceIcon },
  { id: 9, title: "Science", courses: 38, Icon: ScienceIcon },
  { id: 10, title: "Network", courses: 38, Icon: NetworkIcon },
];

const articles = [
  {
    id: "a1",
    title: "Best LearnPress WordPress Theme Collection For 2023",
    date: "Jan 24, 2023",
    category: "Photography",
    excerpt:
      "Looking for an amazing & well-functional LearnPress WordPress Theme?",
    thumbnail: article1,
  },
  {
    id: "a2",
    title: "Best LearnPress WordPress Theme Collection For 2023",
    date: "Jan 24, 2023",
    category: "Photography",
    excerpt:
      "Looking for an amazing & well-functional LearnPress WordPress Theme?",
    thumbnail: article2,
  },
  {
    id: "a3",
    title: "Best LearnPress WordPress Theme Collection For 2023",
    date: "Jan 24, 2023",
    category: "Photography",
    excerpt:
      "Looking for an amazing & well-functional LearnPress WordPress Theme?",
    thumbnail: article3,
  },
];

function CategoryCard({ title, courses, Icon }) {
  return (
    <div className="group cursor-pointer flex flex-col items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white px-6 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(255,120,45,0.20)] hover:border-[#FF782D]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1E8] text-[#FF782D]">
        {Icon && <Icon />}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-[#FF782D]">
        {title}
      </h3>
      <p className="text-xs text-slate-500 transition-colors duration-300 group-hover:text-[#FF782D]">
        {courses} Courses
      </p>
    </div>
  );
}

function ArticleCard({ article }) {
  const { title, date, category, excerpt, thumbnail } = article;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      <div className="relative">
        <img src={thumbnail} alt={title} className="h-52 w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-medium text-white">
          {category}
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="mb-1 text-[11px] text-slate-500">{date}</p>
        <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-500">{excerpt}</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[#e5e7eb] px-5 py-3 text-xs">
        <button className="font-semibold text-slate-900 transition-colors hover:text-[#FF782D]">
          View More
        </button>
      </div>
    </article>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { courses, courseLoading } = useContext(CourseContext);

  return (
    <>
      <section
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(${HeroBG})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <PageContainer className="py-20 lg:py-28">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl lg:text-[48px] font-bold leading-tight text-slate-900">
              Build Skills With <br /> Online Course
            </h1>
            <p className="text-slate-600 text-base">
              We denounce with righteous indignation and dislike men who are so
              beguiled and demoralized that cannot trouble.
            </p>
            <PrimaryButton size="lg">Posts Comment</PrimaryButton>
          </div>
        </PageContainer>
      </section>
      <section className="bg-white py-16">
        <PageContainer>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[32px] font-semibold text-slate-900">
                Top Categories
              </h2>
              <p className="text-base text-slate-500">
                Explore our Popular Categories
              </p>
            </div>
            <PrimaryButton variant="outline" size="sm">
              All Categories
            </PrimaryButton>
          </div>

          <div className="grid gap-4 md:grid-cols-5 md:gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} {...cat} />
            ))}
          </div>
        </PageContainer>
      </section>
      <section className="bg-white py-16">
        <PageContainer>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[24px] font-semibold text-slate-900 leading-tight">
                Featured Courses
              </h2>
              <p className="text-sm text-slate-500">
                Explore our Popular Courses
              </p>
            </div>
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/courses")}
            >
              All Courses
            </PrimaryButton>
          </div>
          {courseLoading ? (
            <p className="text-sm text-slate-500">Loading courses...</p>
          ) : (
            <CourseList courses={courses} limit={6} />
          )}
        </PageContainer>
      </section>
      <section className="bg-white pb-16">
        <PageContainer className="space-y-10">
          <div className="overflow-hidden rounded-4xl shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <img
              src={AddonsBanner}
              alt="LearnPress Add-Ons"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Active Students", value: "25K+" },
              { label: "Total Courses", value: "899" },
              { label: "Instructor", value: "158" },
              { label: "Satisfaction Rate", value: "100%" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              >
                <p className="text-2xl font-semibold text-[#FF782D]">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-10 items-center lg:grid-cols-2">
            <div className="flex justify-center">
              <img
                src={SkillIllustration}
                alt="Grow your skill"
                className="w-full max-w-md lg:max-w-none"
              />
            </div>

            <div>
              <h2 className="mb-3 text-[24px] font-semibold text-slate-900">
                Grow Us Your Skill
                <br />
                With LearnPress LMS
              </h2>
              <p className="mb-4 text-sm text-slate-600">
                We denounce with righteous indignation and dislike men who are
                so beguiled and demoralized that cannot trouble.
              </p>

              <ul className="mb-6 space-y-2 text-sm text-slate-600">
                {[
                  "Certification",
                  "Certification",
                  "Certification",
                  "Certification",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF782D] text-[10px] text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <PrimaryButton size="md">Explorer Course</PrimaryButton>
            </div>
          </div>
        </PageContainer>
      </section>
      <section className="bg-white py-16">
        <PageContainer>
          <div className="mb-10 text-center">
            <h2 className="text-[24px] font-semibold text-slate-900">
              Student Feedbacks
            </h2>
            <p className="text-sm text-slate-500">
              What Students Say About Academy LMS
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-[#e5e7eb] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              >
                <span className="text-5xl leading-none text-slate-300">“</span>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  I must explain to you how all this mistaken idea of denouncing
                  pleasure and praising pain was born and I will give you a
                  complete account of the system and expound.
                </p>

                <div className="mt-4">
                  <p className="font-semibold text-[13px] text-slate-900">
                    Roe Smith
                  </p>
                  <p className="text-[11px] text-slate-500">Designer</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>
      <section className="py-16">
        <PageContainer>
          <div
            className="relative w-full overflow-hidden rounded-[30px] px-10 py-12"
            style={{
              backgroundImage: `url(${LmsBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-xl">
                <img
                  src={StudentIcon}
                  alt="Student"
                  className="h-20 w-20 object-contain"
                />
              </div>

              <div>
                <h3 className="text-[26px] font-semibold text-slate-900">
                  Let’s Start With Academy LMS
                </h3>
                <p className="text-[15px] text-slate-600">
                  Get started now — it's free
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 md:absolute md:right-10 md:top-1/2 md:-translate-y-1/2">
              <PrimaryButton
                variant="outline"
                size="md"
                className="rounded-full px-7 py-2.5"
              >
                I'm A Student
              </PrimaryButton>

              <PrimaryButton size="md" className="rounded-full px-7 py-2.5">
                Become An Instructor
              </PrimaryButton>
            </div>
          </div>
        </PageContainer>
      </section>
      <section className="bg-white py-16">
        <PageContainer>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[24px] font-semibold leading-tight text-slate-900">
                Latest Articles
              </h2>
              <p className="text-sm text-slate-500">
                Explore our Free Articles
              </p>
            </div>
            <PrimaryButton variant="outline" size="sm">
              All Articles
            </PrimaryButton>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </PageContainer>
      </section>
    </>
  );
}
