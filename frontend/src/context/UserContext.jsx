import { createContext, useEffect, useState } from "react";
import axiosClient from "../config/axiosClient";

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  const getUsers = async () => {
    try {
      setUserLoading(true);

      const res = await axiosClient.get("/users");

      const list = res?.data?.data || res?.data || [];

      setUsers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axiosClient.delete(`/users/${id}`);

      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Delete user failed",
      };
    }
  };

  const updateUser = async (id, data) => {
    try {
      const res = await axiosClient.put(`/users/${id}`, data);

      await getUsers();

      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Update user failed",
      };
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        userLoading,
        getUsers,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
