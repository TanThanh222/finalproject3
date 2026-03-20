import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  message,
  Spin,
  Card,
  Empty,
  Tag,
  Divider,
  Collapse,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  ReadOutlined,
  LoginOutlined,
  CheckCircleOutlined,
  FireOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import axiosClient from "../../config/axiosClient";
import PageContainer from "../../components/layout/PageContainer";
import useAuth from "../../hook/useAuth";
import BuyCourseButton from "../../components/courses/BuyCourseButton";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const styles = {
  pageBg: {
    background: "#f8fafc",
    minHeight: "100vh",
    paddingTop: 24,
    paddingBottom: 40,
  },

  heroWrap: {
    background: "#ffffff",
    borderRadius: 28,
    padding: 28,
    marginBottom: 28,
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
    border: "1px solid #edf2f7",
  },

  heroImageShell: {
    background: "#f8fafc",
    borderRadius: 24,
    padding: 14,
    border: "1px solid #eef2f7",
  },

  heroImage: {
    width: "100%",
    height: 290,
    objectFit: "cover",
    borderRadius: 18,
    display: "block",
    background: "#f8fafc",
  },

  title: {
    marginTop: 0,
    marginBottom: 14,
    fontSize: "clamp(34px, 4vw, 52px)",
    lineHeight: 1.08,
    fontWeight: 800,
    letterSpacing: "-1px",
    color: "#0f172a",
  },

  overviewText: {
    fontSize: 17,
    lineHeight: 1.9,
    color: "#475569",
    marginBottom: 0,
  },

  whiteCard: {
    borderRadius: 24,
    boxShadow: "0 12px 34px rgba(15, 23, 42, 0.06)",
    border: "1px solid #edf2f7",
    background: "#ffffff",
  },

  sidebarCard: {
    borderRadius: 24,
    position: "sticky",
    top: 96,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.10)",
    border: "1px solid #edf2f7",
    background: "#ffffff",
    overflow: "hidden",
  },

  sidebarTop: {
    margin: -24,
    marginBottom: 20,
    padding: "24px 24px 20px 24px",
    background: "#f8fafc",
    borderBottom: "1px solid #eef2f7",
  },

  priceText: {
    margin: 0,
    color: "#0f172a",
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  saveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#fff7ed",
    color: "#ea580c",
    border: "1px solid #fed7aa",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    marginTop: 10,
  },

  infoItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    color: "#334155",
    fontSize: 15,
  },

  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    color: "#2563eb",
    flexShrink: 0,
  },

  statLabel: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 4,
  },

  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
  },

  panelHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  lessonIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    color: "#2563eb",
    flexShrink: 0,
  },

  previewButton: {
    borderRadius: 10,
    fontWeight: 600,
  },

  freeEnrollBtn: {
    background: "linear-gradient(135deg, #16a34a, #059669)",
    border: "none",
    height: 48,
    fontWeight: 700,
    borderRadius: 12,
    boxShadow: "0 12px 24px rgba(5,150,105,0.22)",
  },
};

function CustomTag({ children, bg, color, icon }) {
  return (
    <Tag
      icon={icon}
      style={{
        background: bg,
        color,
        border: "none",
        padding: "6px 10px",
        borderRadius: 999,
        fontWeight: 600,
        marginInlineEnd: 0,
      }}
    >
      {children}
    </Tag>
  );
}

function HoverPanel({ lesson, index, isOwned }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Panel
      key={lesson._id || `${lesson.title}-${index}`}
      header={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            paddingRight: 8,
          }}
        >
          <div style={styles.panelHeaderLeft}>
            <div style={styles.lessonIcon}>
              <PlayCircleOutlined />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.35,
                }}
              >
                Lesson {lesson.order || index + 1}: {lesson.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#94a3b8",
                  marginTop: 2,
                }}
              >
                Structured video lesson
              </div>
            </div>
          </div>

          <Space wrap>
            <Tag
              style={{
                borderRadius: 999,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                padding: "4px 10px",
                marginInlineEnd: 0,
              }}
              icon={<ClockCircleOutlined />}
            >
              {lesson.duration || 0} mins
            </Tag>

            {lesson.isPreview && (
              <Tag
                style={{
                  borderRadius: 999,
                  background: "#ecfdf5",
                  border: "1px solid #bbf7d0",
                  color: "#15803d",
                  padding: "4px 10px",
                  marginInlineEnd: 0,
                  fontWeight: 600,
                }}
              >
                Preview
              </Tag>
            )}
          </Space>
        </div>
      }
      style={{
        marginBottom: 14,
        border: hovered ? "1px solid #bfdbfe" : "1px solid #e8eef5",
        borderRadius: 16,
        background: "#ffffff",
        boxShadow: hovered
          ? "0 12px 28px rgba(37, 99, 235, 0.08)"
          : "0 4px 14px rgba(15, 23, 42, 0.03)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Paragraph
        style={{ marginBottom: 12, color: "#475569", lineHeight: 1.8 }}
      >
        {lesson.description || "No lesson description."}
      </Paragraph>

      {lesson.videoUrl ? (
        lesson.isPreview || isOwned ? (
          <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
            <Button
              type="primary"
              ghost
              icon={<PlayCircleOutlined />}
              style={styles.previewButton}
            >
              Watch lesson video
            </Button>
          </a>
        ) : (
          <Tag
            style={{
              background: "#fff7ed",
              border: "1px solid #fdba74",
              color: "#c2410c",
              borderRadius: 999,
              padding: "6px 10px",
              fontWeight: 600,
            }}
          >
            Buy course to unlock this lesson video
          </Tag>
        )
      ) : (
        <Text type="secondary">No video link</Text>
      )}
    </Panel>
  );
}

export default function Single() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [freeEnrollLoading, setFreeEnrollLoading] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error("Fetch course error:", error);
      message.error(error?.response?.data?.message || "Cannot load course");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const isOwned = useMemo(() => Boolean(course?.isOwned), [course?.isOwned]);

  const sortedLessons = useMemo(() => {
    if (!Array.isArray(course?.lessonList)) return [];
    return [...course.lessonList].sort(
      (a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0),
    );
  }, [course?.lessonList]);

  const previewLessons = useMemo(() => {
    return sortedLessons.filter((lesson) => lesson?.isPreview);
  }, [sortedLessons]);

  const totalLessonMinutes = useMemo(() => {
    return sortedLessons.reduce(
      (sum, lesson) => sum + (Number(lesson?.duration) || 0),
      0,
    );
  }, [sortedLessons]);

  const imageUrl =
    course?.image && course.image.startsWith("http")
      ? course.image
      : "https://via.placeholder.com/1200x700?text=Course+Image";

  const price = Number(course?.price) || 0;
  const oldPrice = Number(course?.oldPrice) || 0;
  const isFreeCourse = price <= 0;

  const priceText = isFreeCourse ? "Free" : `$${price.toFixed(2)}`;
  const oldPriceText = oldPrice > 0 ? `$${oldPrice.toFixed(2)}` : null;

  const discountPercent =
    oldPrice > price && oldPrice > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const handleFreeEnroll = async () => {
    try {
      setFreeEnrollLoading(true);
      await axiosClient.post(`/enroll/courses/${id}/enroll`);
      message.success("Enrolled successfully");
      await fetchCourse();
    } catch (error) {
      console.error("Free enroll error:", error);
      message.error(error?.response?.data?.message || "Enroll failed");
    } finally {
      setFreeEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={styles.pageBg}>
          <div
            style={{
              minHeight: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!course) {
    return (
      <PageContainer>
        <div style={styles.pageBg}>
          <Empty description="Course not found" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={styles.pageBg}>
        <div style={styles.heroWrap}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Space wrap size={[10, 10]} style={{ marginBottom: 16 }}>
                <CustomTag bg="#e0f2fe" color="#0369a1">
                  {course.category || "General"}
                </CustomTag>

                <CustomTag bg="#f3e8ff" color="#7c3aed">
                  {course.level || "All Levels"}
                </CustomTag>

                <CustomTag bg="#eff6ff" color="#1d4ed8" icon={<BookOutlined />}>
                  {course.lessons || sortedLessons.length} lessons
                </CustomTag>

                <CustomTag
                  bg="#f8fafc"
                  color="#334155"
                  icon={<CalendarOutlined />}
                >
                  {course.weeks || 0} weeks
                </CustomTag>

                <CustomTag
                  bg="#f8fafc"
                  color="#334155"
                  icon={<ClockCircleOutlined />}
                >
                  {totalLessonMinutes} mins
                </CustomTag>

                {isFreeCourse && (
                  <CustomTag
                    bg="#ecfdf5"
                    color="#15803d"
                    icon={<GiftOutlined />}
                  >
                    Free Course
                  </CustomTag>
                )}
              </Space>

              <Title style={styles.title}>{course.title}</Title>

              <div style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 16, color: "#64748b" }}>
                  Instructor:{" "}
                  <Text style={{ color: "#0f172a", fontWeight: 700 }}>
                    {course.instructor || "Updating..."}
                  </Text>
                </Text>

                <Text style={{ fontSize: 16, color: "#94a3b8" }}>
                  {" "}
                  · {course.students?.length || 0} students enrolled
                </Text>
              </div>

              <Paragraph style={styles.overviewText}>
                {course.overview || "No course overview available."}
              </Paragraph>
            </Col>

            <Col xs={24} lg={10}>
              <div style={styles.heroImageShell}>
                <img
                  src={imageUrl}
                  alt={course.title}
                  style={styles.heroImage}
                />
              </div>
            </Col>
          </Row>
        </div>

        <Row gutter={[28, 28]} align="top">
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{ ...styles.whiteCard, marginBottom: 24 }}
            >
              <Title
                level={3}
                style={{
                  marginTop: 0,
                  marginBottom: 12,
                  color: "#0f172a",
                  fontWeight: 800,
                }}
              >
                About this course
              </Title>

              <Paragraph style={styles.overviewText}>
                {course.overview || "No course overview available."}
              </Paragraph>
            </Card>

            <Card
              bordered={false}
              style={{ ...styles.whiteCard, marginBottom: 24 }}
            >
              <Title
                level={3}
                style={{
                  marginTop: 0,
                  marginBottom: 22,
                  color: "#0f172a",
                  fontWeight: 800,
                }}
              >
                Course details
              </Title>

              <Row gutter={[18, 22]}>
                <Col xs={12} md={8}>
                  <div style={styles.statLabel}>Category</div>
                  <div style={styles.statValue}>{course.category || "-"}</div>
                </Col>

                <Col xs={12} md={8}>
                  <div style={styles.statLabel}>Level</div>
                  <div style={styles.statValue}>{course.level || "-"}</div>
                </Col>

                <Col xs={12} md={8}>
                  <div style={styles.statLabel}>Total lessons</div>
                  <div style={styles.statValue}>
                    {course.lessons || sortedLessons.length || 0}
                  </div>
                </Col>

                <Col xs={12} md={8}>
                  <div style={styles.statLabel}>Duration</div>
                  <div style={styles.statValue}>
                    {totalLessonMinutes} minutes
                  </div>
                </Col>

                <Col xs={12} md={8}>
                  <div style={styles.statLabel}>Study period</div>
                  <div style={styles.statValue}>{course.weeks || 0} weeks</div>
                </Col>

                <Col xs={12} md={8}>
                  <div style={styles.statLabel}>Students</div>
                  <div style={styles.statValue}>
                    {course.students?.length || 0}
                  </div>
                </Col>
              </Row>
            </Card>

            <Card
              bordered={false}
              style={{ ...styles.whiteCard, marginBottom: 24 }}
            >
              <Title
                level={3}
                style={{
                  marginTop: 0,
                  marginBottom: 18,
                  color: "#0f172a",
                  fontWeight: 800,
                }}
              >
                Course curriculum
              </Title>

              {sortedLessons.length === 0 ? (
                <Empty description="No lessons available yet" />
              ) : (
                <Collapse
                  accordion
                  bordered={false}
                  style={{ background: "transparent" }}
                >
                  {sortedLessons.map((lesson, index) => (
                    <HoverPanel
                      key={lesson._id || `${lesson.title}-${index}`}
                      lesson={lesson}
                      index={index}
                      isOwned={isOwned}
                    />
                  ))}
                </Collapse>
              )}
            </Card>

            {previewLessons.length > 0 && (
              <Card bordered={false} style={styles.whiteCard}>
                <Title
                  level={3}
                  style={{
                    marginTop: 0,
                    marginBottom: 18,
                    color: "#0f172a",
                    fontWeight: 800,
                  }}
                >
                  Free preview
                </Title>

                {previewLessons.map((lesson, index) => (
                  <div
                    key={lesson._id || `preview-${index}`}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        index !== previewLessons.length - 1
                          ? "1px solid #eef2f7"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#0f172a",
                            marginBottom: 4,
                          }}
                        >
                          {lesson.title}
                        </div>
                        <Text style={{ color: "#64748b" }}>
                          {lesson.description || "Preview lesson"}
                        </Text>
                      </div>

                      {lesson.videoUrl && (
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            icon={<PlayCircleOutlined />}
                            style={styles.previewButton}
                          >
                            Preview
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </Col>

          <Col xs={24} lg={8}>
            <Card bordered={false} style={styles.sidebarCard}>
              <div style={styles.sidebarTop}>
                <Title level={2} style={styles.priceText}>
                  {priceText}
                </Title>

                {oldPriceText && oldPrice > price && (
                  <div style={{ marginTop: 6 }}>
                    <Text
                      delete
                      style={{
                        fontSize: 16,
                        color: "#94a3b8",
                      }}
                    >
                      {oldPriceText}
                    </Text>
                  </div>
                )}

                {discountPercent > 0 && (
                  <div style={styles.saveBadge}>
                    <FireOutlined />
                    Save {discountPercent}%
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
                <div style={styles.infoItem}>
                  <div style={styles.infoIconBox}>
                    <ReadOutlined />
                  </div>
                  <Text style={{ color: "#334155", fontSize: 15 }}>
                    {course.lessons || sortedLessons.length || 0} lessons
                  </Text>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconBox}>
                    <ClockCircleOutlined />
                  </div>
                  <Text style={{ color: "#334155", fontSize: 15 }}>
                    {totalLessonMinutes} total minutes
                  </Text>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconBox}>
                    <CalendarOutlined />
                  </div>
                  <Text style={{ color: "#334155", fontSize: 15 }}>
                    {course.weeks || 0} weeks
                  </Text>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconBox}>
                    <UserOutlined />
                  </div>
                  <Text style={{ color: "#334155", fontSize: 15 }}>
                    {course.students?.length || 0} students
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: "18px 0" }} />

              <div style={{ display: "grid", gap: 12 }}>
                {user ? (
                  isOwned ? (
                    <Button
                      size="large"
                      block
                      disabled
                      icon={<CheckCircleOutlined />}
                      style={{
                        height: 46,
                        fontWeight: 700,
                        borderRadius: 12,
                      }}
                    >
                      You already own this course
                    </Button>
                  ) : isFreeCourse ? (
                    <Button
                      type="primary"
                      size="large"
                      block
                      loading={freeEnrollLoading}
                      icon={<GiftOutlined />}
                      onClick={handleFreeEnroll}
                      style={styles.freeEnrollBtn}
                    >
                      Enroll Free
                    </Button>
                  ) : (
                    <BuyCourseButton courseId={course._id} owned={false} />
                  )
                ) : (
                  <Button
                    size="large"
                    block
                    icon={<LoginOutlined />}
                    onClick={() => navigate("/auth")}
                    style={{
                      height: 46,
                      fontWeight: 700,
                      borderRadius: 12,
                    }}
                  >
                    {isFreeCourse ? "Login to enroll" : "Login to buy course"}
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
}
