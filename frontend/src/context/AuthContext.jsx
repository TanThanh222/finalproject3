import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../config/axiosClient";

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

const getStoredToken = () => {
  let token = localStorage.getItem("token");

  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token.replace(/^"|"$/g, "").trim();
};

const getStoredUser = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser || savedUser === "undefined" || savedUser === "null") {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    try {
      const savedToken = getStoredToken();
      const savedUser = getStoredUser();

      if (savedToken && savedUser) {
        setUser(savedUser);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Auth load error:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuthError = () => {
    setAuthError("");
  };

  const login = async (email, password) => {
    try {
      setLoggingIn(true);
      setAuthError("");

      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data || {};

      if (!user || !token) {
        throw new Error("Invalid login response from server");
      }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return {
        success: true,
        user,
        message: "Login successful",
      };
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");
      setAuthError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoggingIn(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setRegistering(true);
      setAuthError("");

      const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
      });

      return {
        success: true,
        data: res.data,
        message: "Register successful. Please login.",
      };
    } catch (error) {
      const message = getErrorMessage(error, "Register failed");
      setAuthError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setRegistering(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthError("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      authError,
      loggingIn,
      registering,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [user, loading, authError, loggingIn, registering],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
