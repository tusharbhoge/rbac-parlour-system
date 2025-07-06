"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  config.headers.Authorization = `Bearer ${token}`;
  
  if (["post", "put", "delete"].includes(config.method?.toLowerCase() || "")) {
    if (role !== "SUPER_ADMIN") {
      throw new Error("Insufficient permissions. Only SUPER_ADMIN can perform this action");
    }
  }

  return config;
});

export const EmployeeService = {
  getAll: async () => {
    const response = await api.get("/api/v1/employees");
    return response.data;
  },

  create: async (employee: { name: string; email: string }) => {
    const response = await api.post("/api/v1/employees", employee);
    return response.data;
  },

  update: async (data: { id: string; name?: string; email?: string }) => {
    const response = await api.put(`/api/v1/employees/${data.id}`, {
      id: data.id,
      name: data.name || "",
      email: data.email || ""
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/employees/${id}`);
    return response.data;
  },

  // Role verification
  getCurrentRole: () => {
    return localStorage.getItem("role");
  },
  isSuperAdmin: () => {
    return localStorage.getItem("role") === "SUPER_ADMIN";
  }
};