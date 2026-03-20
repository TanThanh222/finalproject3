import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

import HomePage from "./screens/Home";
import Listing from "./screens/Courses/Listing";
import Single from "./screens/Courses/Single";
import MyCourses from "./screens/Courses/MyCourses";
import CheckoutSuccess from "./screens/Courses/CheckoutSuccess";
import CheckoutCancel from "./screens/Courses/CheckoutCancel";
import PaymentHistory from "./screens/Courses/PaymentHistory";

import AuthPage from "./screens/Auth/AuthPage";
import AdminCourses from "./screens/Admin/AdminCourses";

import AdminRoute from "./routes/AdminRoute";
import PrivateRoute from "./routes/PrivateRoute";

import { CourseProvider } from "./context/CourseContext";
import { CourseRegisterProvider } from "./context/CourseRegisterContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <CourseRegisterProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<Listing />} />
                <Route path="/courses/:id" element={<Single />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/my-courses" element={<MyCourses />} />
                  <Route
                    path="/checkout/success"
                    element={<CheckoutSuccess />}
                  />
                  <Route path="/checkout/cancel" element={<CheckoutCancel />} />
                  <Route path="/payment-history" element={<PaymentHistory />} />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin/courses" element={<AdminCourses />} />
                </Route>
              </Route>
            </Routes>
          </CourseRegisterProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
