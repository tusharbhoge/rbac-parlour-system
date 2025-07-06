"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { Employee } from "./columns";
import { EmployeeService } from "./employee-service";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EmployeeDataTable({ initialData }: { initialData: Employee[] }) {
    const [data, setData] = useState<Employee[]>(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: { name: string; email: string; id?: string }) => {
    setIsLoading(true);
    try {
        if (formData.id) {
        const updated = await EmployeeService.update({
            id: formData.id,
            name: formData.name,
            email: formData.email
        });
        setData(data.map(e => e.id === formData.id ? updated : e));
        toast.success("Employee updated successfully");
        } else {
        const newEmployee = await EmployeeService.create({
            name: formData.name,
            email: formData.email
        });
        setData([...data, newEmployee]);
        toast.success("Employee added successfully");
        }
        setIsModalOpen(false);
        setSelectedEmployee(null);
        router.refresh();
    } catch (error) {
        toast.error("Operation failed");
    } finally {
        setIsLoading(false);
    }
    };


    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this employee?")) {
        try {
            await EmployeeService.delete(id);
            setData(data.filter(e => e.id !== id));
            toast.success("Employee deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Delete failed");
        }
        }
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const columns = getColumns(handleEdit, handleDelete);

    return (
        <>
        <DataTable 
            columns={columns} 
            data={data}
            onAddClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
            }}
        />
        
        <Modal
    isOpen={isModalOpen}
    onClose={() => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    }}
    onSubmit={handleSubmit}
    employee={selectedEmployee ? {
        id: selectedEmployee.id, 
        name: selectedEmployee.name, 
        email: selectedEmployee.email 
    } : undefined}
    />
        </>
    );
}