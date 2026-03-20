import { Button, Card, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <Card style={{ borderRadius: 24 }}>
        <Result
          status="warning"
          title="Bạn đã hủy thanh toán"
          subTitle="Giao dịch chưa hoàn tất. Bạn có thể thử lại bất cứ lúc nào."
          extra={[
            <Button
              key="courses"
              type="primary"
              onClick={() => navigate("/courses")}
            >
              Quay lại khóa học
            </Button>,
            <Button key="my-courses" onClick={() => navigate("/my-courses")}>
              Đi tới My Courses
            </Button>,
          ]}
        />
      </Card>
    </div>
  );
}
