import { useContext } from "react";
import { CourseContext } from "../context/CourseContext";
export default function useCourses() {
  return useContext(CourseContext);
}
