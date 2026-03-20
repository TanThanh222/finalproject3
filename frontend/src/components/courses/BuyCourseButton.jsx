import { useState } from "react";
import { Button, message } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import axiosClient from "../../config/axiosClient";

export default function BuyCourseButton({ courseId, owned = false }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;

    if (!courseId) {
      message.error("Thiếu courseId để thanh toán");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosClient.post("/payments/create-checkout-session", {
        courseId,
      });

      if (res?.data?.success && res?.data?.url) {
        window.location.assign(res.data.url);
        return;
      }

      message.error(res?.data?.message || "Không tạo được phiên thanh toán");
    } catch (error) {
      console.error("Checkout error:", error);

      message.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Thanh toán thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  if (owned) {
    return (
      <Button
        block
        disabled
        size="large"
        style={{ borderRadius: 12, height: 46 }}
      >
        Bạn đã sở hữu khóa học này
      </Button>
    );
  }

  return (
    <Button
      type="primary"
      block
      size="large"
      icon={<CreditCardOutlined />}
      loading={loading}
      onClick={handleCheckout}
      style={{ borderRadius: 12, height: 46, fontWeight: 700 }}
    >
      Mua ngay
    </Button>
  );
}
