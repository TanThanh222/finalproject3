import { useContext, useEffect, useState } from "react";
import { Button, Card, Result, Spin, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../../config/axiosClient";
import { CourseContext } from "../../context/CourseContext";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const { refreshCoursesSilently } = useContext(CourseContext);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = params.get("session_id");

        if (!sessionId) {
          message.error("Thiếu session thanh toán");
          setLoading(false);
          return;
        }

        const res = await axiosClient.get(
          `/payments/verify-session?sessionId=${sessionId}`,
        );

        if (res?.data?.success) {
          setCourse(res.data.course || null);
          await refreshCoursesSilently?.();
        }
      } catch (error) {
        console.error(error);
        message.error(
          error?.response?.data?.message || "Xác minh thanh toán thất bại",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params, refreshCoursesSilently]);

  if (loading) {
    return (
      <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <Card style={{ borderRadius: 24 }}>
        <Result
          status="success"
          title="Thanh toán thành công"
          subTitle={
            course
              ? `Bạn đã mua khóa học: ${course.title}`
              : "Giao dịch của bạn đã hoàn tất"
          }
          extra={[
            <Button
              key="my-courses"
              type="primary"
              onClick={() => navigate("/my-courses")}
            >
              Đi tới My Courses
            </Button>,
            <Button key="courses" onClick={() => navigate("/courses")}>
              Xem thêm khóa học
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
}
