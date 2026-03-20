import { useContext } from "react";
import { CourseRegisterContext } from "../context/CourseRegisterContext";

export default function useCourseRegister() {
  const ctx = useContext(CourseRegisterContext);

  if (!ctx) {
    throw new Error(
      "useCourseRegister must be used within CourseRegisterProvider",
    );
  }

  return {
    registers: ctx.registers,
    myRegisters: ctx.myRegisters,
    regLoading: ctx.loading,
    error: ctx.error,
    getRegisters: ctx.getRegisters,
    addRegister: ctx.addRegister,
    removeRegister: ctx.removeRegister,
    isRegistered: ctx.isRegistered,
  };
}
