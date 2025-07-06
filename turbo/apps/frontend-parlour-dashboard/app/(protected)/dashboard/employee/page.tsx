"use client"; 

import axios from "axios";
import { Employee } from "./columns";
import { EmployeeDataTable } from "./employee-DataTable";
import { useEffect, useState } from "react";

export default function DemoPage() {
    const [data, setData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
            throw new Error("No authentication token found");
            }

            const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/employees/`,
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (!res.data) {
            throw new Error("No data received from server");
            }

            setData(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || error.message);
            } else if (error instanceof Error) {
            setError(error.message);
            }
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalTasks = data.reduce((sum, emp) => sum + (emp.noOfTask || 0), 0);

    return (
        <div className="container mx-auto w-screen py-5 px-10 flex justify-center items-center flex-col">
        <div className="w-full h-auto border-b border-neutral-600 mb-10">
            <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Total Employees
                </h2>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                    {data.length}
                </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    On Leave
                </h2>
                <p className="mt-2 text-3xl font-bold text-yellow-500">{3}</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Total Tasks
                </h2>
                <p className="mt-2 text-3xl font-bold text-green-600">
                    {totalTasks}
                </p>
                </div>
            </div>
            </div>
        </div>

        <div className="container mx-auto py-10">
            <EmployeeDataTable initialData={data} />
        </div>
        </div>
    );
}