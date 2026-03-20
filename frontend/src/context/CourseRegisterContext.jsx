import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axiosClient from "../config/axiosClient";
import useAuth from "../hook/useAuth";

export const CourseRegisterContext = createContext(null);

export function CourseRegisterProvider({ children }) {
  const { user } = useAuth();

  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRegisters = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.get("/enroll/my-courses");
      setRegisters(res?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Get enroll failed");
      setRegisters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getRegisters();
    } else {
      setRegisters([]);
    }
  }, [getRegisters, user]);

  const myRegisters = useMemo(() => {
    if (!user) return [];
    return registers;
  }, [registers, user]);

  const isRegistered = useCallback(
    (courseId) => {
      return registers.some((course) => course._id === courseId);
    },
    [registers],
  );

  const addRegister = async (courseId) => {
    try {
      const res = await axiosClient.post(`/enroll/courses/${courseId}/enroll`);
      await getRegisters();
      return { success: true, data: res.data };
    } catch (e) {
      return {
        success: false,
        message: e?.response?.data?.message || "Enroll failed",
      };
    }
  };

  const removeRegister = async (courseId) => {
    try {
      const res = await axiosClient.delete(
        `/enroll/courses/${courseId}/enroll`,
      );
      await getRegisters();
      return { success: true, data: res.data };
    } catch (e) {
      return {
        success: false,
        message: e?.response?.data?.message || "Cancel failed",
      };
    }
  };

  return (
    <CourseRegisterContext.Provider
      value={{
        registers,
        myRegisters,
        loading,
        error,
        getRegisters,
        addRegister,
        removeRegister,
        isRegistered,
      }}
    >
      {children}
    </CourseRegisterContext.Provider>
  );
}
