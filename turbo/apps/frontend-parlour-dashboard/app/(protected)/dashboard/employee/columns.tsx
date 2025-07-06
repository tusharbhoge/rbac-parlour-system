"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeService } from "./employee-service";

export type Employee = {
    id: string;
    name: string;
    noOfTask: number;
    email: string;
    onLeave?: boolean;
};

export const getColumns = (
    handleEdit: (employee: Employee) => void,
    handleDelete: (id: string) => Promise<void>
): ColumnDef<Employee>[] => {
    const isSuperAdmin = EmployeeService.isSuperAdmin();

    return [
        {
        accessorKey: "id",
        header: () => <div className="text-left text-xl p-3">ID</div>,
        cell: ({ row }) => (
            <div className="text-left text-xl text-muted-foreground w-40 p-3">
            {(row.getValue("id") as string).slice(0, 8)}...
            </div>
        ),
        },
        {
        accessorKey: "name",
        header: () => <div className="text-left text-xl p-3">Name</div>,
        cell: ({ row }) => (
            <div className="text-left font-medium text-xl w-70 p-3">
            {row.getValue("name")}
            </div>
        ),
        },
        {
        accessorKey: "email",
        header: () => <div className="text-left text-xl p-3">Email</div>,
        cell: ({ row }) => (
            <div className="text-left font-medium text-xl w-80 p-3">
            {row.getValue("email")}
            </div>
        ),
        },
        {
        accessorKey: "noOfTask",
        header: () => <div className="text-center text-xl p-3">No. of Tasks</div>,
        cell: ({ row }) => (
            <div className="text-center font-semibold text-xl w-60 p-3">
            {row.getValue("noOfTask")}
            </div>
        ),
        },
        ...(isSuperAdmin
        ? [
            {
                id: "actions",
                cell: ({ row }: any) => {
                const employee = row.original;
                return (
                    <div className="flex justify-end p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-6 w-6" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(employee)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                );
                },
            },
            ]
        : []),
    ];
};
