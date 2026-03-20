import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Empty,
  Image,
  Row,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axiosClient from "../../config/axiosClient";
import PageContainer from "../../components/layout/PageContainer";

const { Title, Text } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case "paid":
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Paid
        </Tag>
      );
    case "pending":
    case "requires_payment":
      return (
        <Tag color="processing" icon={<ClockCircleOutlined />}>
          Pending
        </Tag>
      );
    case "failed":
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          Failed
        </Tag>
      );
    case "cancelled":
      return <Tag color="default">Cancelled</Tag>;
    case "refunded":
      return <Tag color="warning">Refunded</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosClient.get("/payments/my-payments");
        setPayments(res?.data?.data || []);
      } catch (error) {
        console.error(error);
        message.error(
          error?.response?.data?.message || "Không tải được lịch sử thanh toán",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <PageContainer>
      <div style={{ padding: "24px 0 40px" }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          Payment History
        </Title>
        <Text type="secondary">
          Theo dõi tất cả giao dịch thanh toán khóa học của bạn.
        </Text>

        <div style={{ marginTop: 24 }}>
          {loading ? (
            <div
              style={{ minHeight: 300, display: "grid", placeItems: "center" }}
            >
              <Spin size="large" />
            </div>
          ) : payments.length === 0 ? (
            <Card style={{ borderRadius: 24 }}>
              <Empty description="Chưa có giao dịch nào" />
            </Card>
          ) : (
            <Row gutter={[20, 20]}>
              {payments.map((payment) => (
                <Col xs={24} key={payment._id}>
                  <Card
                    style={{
                      borderRadius: 24,
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} md={5}>
                        <Image
                          src={
                            payment?.course?.image ||
                            "https://via.placeholder.com/300x180?text=Course"
                          }
                          alt={payment?.course?.title || "course"}
                          style={{
                            width: "100%",
                            borderRadius: 16,
                            objectFit: "cover",
                          }}
                          preview={false}
                        />
                      </Col>

                      <Col xs={24} md={13}>
                        <Title level={4} style={{ marginBottom: 10 }}>
                          {payment?.course?.title || "Khóa học"}
                        </Title>

                        <div style={{ marginBottom: 8 }}>
                          {getStatusTag(payment.status)}
                        </div>

                        <div
                          style={{ display: "flex", gap: 20, flexWrap: "wrap" }}
                        >
                          <Text>
                            <DollarOutlined style={{ marginRight: 8 }} />
                            {payment.amount}{" "}
                            {String(payment.currency || "usd").toUpperCase()}
                          </Text>

                          <Text type="secondary">
                            <CalendarOutlined style={{ marginRight: 8 }} />
                            {new Date(payment.createdAt).toLocaleString()}
                          </Text>
                        </div>
                      </Col>

                      <Col xs={24} md={6}>
                        <div
                          style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: 16,
                          }}
                        >
                          <Text strong>Provider:</Text>
                          <div style={{ marginBottom: 8 }}>
                            {payment.provider}
                          </div>

                          <Text strong>Paid at:</Text>
                          <div>
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleString()
                              : "--"}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
