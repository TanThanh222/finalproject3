import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { CourseRegisterProvider } from "./context/CourseRegisterContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {}
      <CourseProvider>
        {}
        <CourseRegisterProvider>
          {}
          <App /> {}
        </CourseRegisterProvider>
      </CourseProvider>
    </AuthProvider>
  </React.StrictMode>,
);
