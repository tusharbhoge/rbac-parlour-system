"use client";

import { useState, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; id?:string }) => void;
  employee?: { id:string; name: string; email: string }; // Make it optional
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  employee, // Now properly optional
  isLoading = false,
}: ModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Initialize form when employee changes
  useEffect(() => {
    setFormData({
      name: employee?.name || "",
      email: employee?.email || "",
    });
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
    ...formData,
    id: employee?.id // Include the ID if editing
  });
    setFormData({
      name: "",
      email:  "",
    })
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/70 flex justify-center items-center">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-md shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (employee ? "Update" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}