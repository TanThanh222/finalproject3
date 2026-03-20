import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Empty,
  message,
  Popconfirm,
  Spin,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import axiosClient from "../../config/axiosClient";
import PageContainer from "../../components/layout/PageContainer";

const { Title, Text, Paragraph } = Typography;

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.get("/enroll/my-courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load my courses error:", err);
      const msg = err?.response?.data?.message || "Failed to load your courses";
      setError(msg);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelEnroll = async (id) => {
    try {
      setCancelingId(id);
      await axiosClient.delete(`/enroll/courses/${id}/enroll`);

      message.success("Enrollment cancelled");
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Cancel enrollment error:", error);
      message.error(
        error?.response?.data?.message || "Cancel enrollment failed",
      );
    } finally {
      setCancelingId(null);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return (
      <PageContainer>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ paddingTop: 24, paddingBottom: 40 }}>
        <Title level={2}>My Courses</Title>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" onClick={fetchCourses}>
                Retry
              </Button>
            }
          />
        )}

        {!loading && courses.length === 0 && (
          <Card style={{ borderRadius: 20 }}>
            <Empty
              description="You do not own any courses yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Link to="/courses">
                <Button type="primary">Browse Courses</Button>
              </Link>
            </Empty>
          </Card>
        )}

        <Row gutter={[24, 24]}>
          {courses.map((course) => {
            const totalDuration =
              course?.lessonList?.reduce(
                (sum, l) => sum + (Number(l?.duration) || 0),
                0,
              ) || 0;

            const price = Number(course?.price) || 0;
            const oldPrice = Number(course?.oldPrice) || 0;
            const isFreeCourse = price <= 0;

            const discount =
              oldPrice > price && oldPrice > 0
                ? Math.round(((oldPrice - price) / oldPrice) * 100)
                : 0;

            return (
              <Col xs={24} sm={12} xl={8} key={course._id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    height: "100%",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
                  }}
                  cover={
                    <img
                      src={
                        course.image ||
                        "https://via.placeholder.com/800x500?text=Course"
                      }
                      alt={course.title}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <div style={{ marginBottom: 10 }}>
                    <Tag color="blue">{course.category || "General"}</Tag>
                    <Tag color="purple">{course.level || "All Levels"}</Tag>

                    {discount > 0 && (
                      <Tag color="orange" icon={<FireOutlined />}>
                        {discount}% OFF
                      </Tag>
                    )}

                    {isFreeCourse ? (
                      <Tag color="green" icon={<GiftOutlined />}>
                        Free
                      </Tag>
                    ) : (
                      <Tag color="gold" icon={<CreditCardOutlined />}>
                        Purchased
                      </Tag>
                    )}
                  </div>

                  <Title level={4} style={{ marginBottom: 10 }}>
                    {course.title}
                  </Title>

                  <Paragraph ellipsis={{ rows: 2 }} style={{ minHeight: 44 }}>
                    {course.overview || "No overview available."}
                  </Paragraph>

                  <Divider />

                  <div style={{ display: "grid", gap: 8 }}>
                    <Text>
                      <UserOutlined /> {course.instructor || "Updating..."}
                    </Text>
                    <Text>
                      <BookOutlined /> {course.lessons || 0} lessons
                    </Text>
                    <Text>
                      <CalendarOutlined /> {course.weeks || 0} weeks
                    </Text>
                    <Text>
                      <ClockCircleOutlined /> {totalDuration} mins
                    </Text>
                  </div>

                  <Divider />

                  <div style={{ marginBottom: 14 }}>
                    <Text strong style={{ fontSize: 16 }}>
                      {isFreeCourse ? "Free" : `$${price.toFixed(2)}`}
                    </Text>
                    {!isFreeCourse && oldPrice > price && (
                      <Text delete type="secondary" style={{ marginLeft: 8 }}>
                        ${oldPrice.toFixed(2)}
                      </Text>
                    )}
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <Link to={`/courses/${course._id}`}>
                      <Button block type="primary" icon={<EyeOutlined />}>
                        View Course
                      </Button>
                    </Link>

                    {isFreeCourse ? (
                      <Popconfirm
                        title="Cancel free enrollment?"
                        description="You can enroll again later."
                        onConfirm={() => cancelEnroll(course._id)}
                      >
                        <Button
                          danger
                          block
                          icon={<DeleteOutlined />}
                          loading={cancelingId === course._id}
                        >
                          Cancel Enrollment
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Button
                        block
                        disabled
                        icon={<CheckCircleOutlined />}
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        Purchased Course
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </PageContainer>
  );
}

export default MyCourses;
