import { useEffect, useMemo, useState } from "react";
import { Card, Form, Input, Tabs, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PageContainer from "../../components/layout/PageContainer";
import PrimaryButton from "../../components/common/PrimaryButton";
import useAuth from "../../hook/useAuth";

const Wrapper = styled.section`
  padding: 56px 0 88px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
`;

const Center = styled.div`
  min-height: calc(100vh - 220px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  border-radius: 24px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08) !important;
  overflow: hidden;

  .ant-card-head {
    min-height: 72px;
    border-bottom: 1px solid #eef2f7;
  }

  .ant-card-head-title {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    padding: 18px 0;
  }

  .ant-card-body {
    padding: 28px;
  }

  .ant-tabs-nav {
    margin-bottom: 24px !important;
  }

  .ant-tabs-tab {
    font-weight: 700;
    font-size: 15px;
    padding: 8px 0;
  }

  .ant-form-item-label > label {
    font-weight: 700;
    color: #334155;
  }

  .ant-input,
  .ant-input-password {
    min-height: 48px;
    border-radius: 14px;
  }
`;

const SubmitWrap = styled.div`
  margin-top: 8px;
`;

const FooterText = styled.p`
  margin: 18px 0 0;
  color: #64748b;
  font-size: 14px;
  text-align: center;
`;

export default function AuthPage() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("login");
  const [submitting, setSubmitting] = useState(false);

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const initialTab = useMemo(() => {
    if (location.pathname === "/register") return "register";
    return "login";
  }, [location.pathname]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin/courses", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleTabChange = (key) => {
    setTab(key);
    navigate(key === "register" ? "/register" : "/auth", { replace: true });
  };

  const onLogin = async (values) => {
    try {
      setSubmitting(true);

      const result = await login(values.email, values.password);

      if (!result?.success) {
        message.error(result?.message || "Đăng nhập thất bại");
        return;
      }

      message.success("Đăng nhập thành công");
    } catch (error) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const onRegister = async (values) => {
    try {
      setSubmitting(true);

      const result = await register(values.name, values.email, values.password);

      if (!result?.success) {
        message.error(result?.message || "Đăng ký thất bại");
        return;
      }

      message.success(result?.message || "Đăng ký thành công");
      registerForm.resetFields();
      setTab("login");
      navigate("/auth", { replace: true });
    } catch (error) {
      message.error(error?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <PageContainer>
          <Center>Đang tải...</Center>
        </PageContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageContainer>
        <Center>
          <AuthCard title="Login / Register">
            <Tabs
              activeKey={tab}
              onChange={handleTabChange}
              items={[
                {
                  key: "login",
                  label: "Login",
                  children: (
                    <Form
                      form={loginForm}
                      layout="vertical"
                      onFinish={onLogin}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          {
                            type: "email",
                            message: "Email không đúng định dạng",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập email" />
                      </Form.Item>

                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          { required: true, message: "Vui lòng nhập mật khẩu" },
                        ]}
                      >
                        <Input.Password placeholder="Nhập mật khẩu" />
                      </Form.Item>

                      <SubmitWrap>
                        <PrimaryButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={submitting}
                          style={{ width: "100%" }}
                        >
                          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </PrimaryButton>
                      </SubmitWrap>
                    </Form>
                  ),
                },
                {
                  key: "register",
                  label: "Register",
                  children: (
                    <Form
                      form={registerForm}
                      layout="vertical"
                      onFinish={onRegister}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input placeholder="Nhập họ tên" />
                      </Form.Item>

                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          {
                            type: "email",
                            message: "Email không đúng định dạng",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập email" />
                      </Form.Item>

                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          { required: true, message: "Vui lòng nhập mật khẩu" },
                          {
                            min: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự",
                          },
                        ]}
                      >
                        <Input.Password placeholder="Nhập mật khẩu" />
                      </Form.Item>

                      <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Mật khẩu xác nhận không khớp"),
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password placeholder="Nhập lại mật khẩu" />
                      </Form.Item>

                      <SubmitWrap>
                        <PrimaryButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={submitting}
                          style={{ width: "100%" }}
                        >
                          {submitting ? "Đang đăng ký..." : "Đăng ký"}
                        </PrimaryButton>
                      </SubmitWrap>
                    </Form>
                  ),
                },
              ]}
            />

            <FooterText>
              {tab === "login"
                ? "Đăng nhập để học khóa học và truy cập khu vực của bạn."
                : "Tạo tài khoản mới để bắt đầu học ngay."}
            </FooterText>
          </AuthCard>
        </Center>
      </PageContainer>
    </Wrapper>
  );
}
