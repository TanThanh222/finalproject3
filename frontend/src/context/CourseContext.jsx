import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosClient from "../config/axiosClient";

export const CourseContext = createContext();

const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState("");

  const [creatingCourse, setCreatingCourse] = useState(false);
  const [updatingCourse, setUpdatingCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setCourseLoading(true);
      setCourseError("");

      const res = await axiosClient.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
      return { success: true, data: res.data };
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch courses");
      console.error("Fetch courses error:", error?.response?.data || error);
      setCourseError(message);
      return { success: false, message };
    } finally {
      setCourseLoading(false);
    }
  }, []);

  // thêm hàm này
  const refreshCoursesSilently = useCallback(async () => {
    try {
      const res = await axiosClient.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
      return { success: true, data: res.data };
    } catch (error) {
      console.error(
        "Refresh courses silently error:",
        error?.response?.data || error,
      );
      return {
        success: false,
        message: getErrorMessage(error, "Failed to refresh courses"),
      };
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (data) => {
    try {
      setCreatingCourse(true);
      setCourseError("");

      const res = await axiosClient.post("/courses", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchCourses();

      return {
        success: true,
        data: res.data,
        message: "Course created successfully",
      };
    } catch (error) {
      const message = getErrorMessage(error, "Create course failed");
      console.error("Create course error:", error?.response?.data || error);
      setCourseError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setCreatingCourse(false);
    }
  };

  const updateCourse = async (id, data) => {
    try {
      setUpdatingCourse(true);
      setCourseError("");

      const res = await axiosClient.put(`/courses/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchCourses();

      return {
        success: true,
        data: res.data,
        message: "Course updated successfully",
      };
    } catch (error) {
      const message = getErrorMessage(error, "Update course failed");
      console.error("Update course error:", error?.response?.data || error);
      setCourseError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setUpdatingCourse(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      setDeletingCourse(true);
      setCourseError("");

      const res = await axiosClient.delete(`/courses/${id}`);

      await fetchCourses();

      return {
        success: true,
        data: res.data,
        message: "Course deleted successfully",
      };
    } catch (error) {
      const message = getErrorMessage(error, "Delete course failed");
      console.error("Delete course error:", error?.response?.data || error);
      setCourseError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setDeletingCourse(false);
    }
  };

  const clearCourseError = () => setCourseError("");

  const value = useMemo(
    () => ({
      courses,
      courseLoading,
      courseError,
      creatingCourse,
      updatingCourse,
      deletingCourse,
      createCourse,
      updateCourse,
      deleteCourse,
      fetchCourses,
      refreshCoursesSilently,
      clearCourseError,
    }),
    [
      courses,
      courseLoading,
      courseError,
      creatingCourse,
      updatingCourse,
      deletingCourse,
      fetchCourses,
      refreshCoursesSilently,
    ],
  );

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};
