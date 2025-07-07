"use client";

import axios from "axios";
import { CreateTaskInput, UpdateETaskInput } from "@repo/common/types";

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

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 400) {
      console.error("Validation Error:", error.response.data);
      throw new Error(error.response.data.message || "Invalid request data");
    }
    throw error;
  }
);

export const TaskService = {
  getAll: async (): Promise<Array<{
    id: string;
    title: string;
    description: string;
    employeeId: string;
    isDone: boolean;
    assignedTo: {
      id: string;
      name: string;
      email: string;
    };
  }>> => {
    try {
      const response = await api.get("/api/v1/task");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      throw new Error("Failed to load tasks");
    }
  },

  create: async (task: CreateTaskInput) => {
    try {
      const payload = task.employeeId ? task : { ...task, employeeId: undefined };
      const response = await api.post("/api/v1/task", payload);
      return response.data;
    } catch (error) {
      console.error("Task creation failed:", error);
      throw new Error("Failed to create task");
    }
  },

  update: async (id: string, updates: UpdateETaskInput) => {
    try {
      
      const response = await api.put(`/api/v1/task/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error("Task update failed:", error);
      throw new Error("Failed to update task");
    }
  },

  markAsDone: async (id: string) => {
    try {
      const response = await api.put(`/api/v1/task/${id}`, { isDone: true });
      return response.data;
    } catch (error) {
      console.error("Failed to mark task as done:", error);
      throw new Error("Failed to update task status");
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/api/v1/task/${id}`);
    } catch (error) {
      console.error("Task deletion failed:", error);
      throw new Error("Failed to delete task");
    }
  },

  getCurrentRole: () => {
    return localStorage.getItem("role");
  },

  isSuperAdmin: () => {
    return localStorage.getItem("role") === "SUPER_ADMIN";
  }
};