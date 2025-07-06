"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeService } from "./employee-service"; 

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onAddClick?: () => void;
    isLoading?: boolean;
    isError?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onAddClick,
    isLoading = false,
    isError = false,
    }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const isSuperAdmin = EmployeeService.isSuperAdmin();

    if (isLoading) {
        return (
        <div className="space-y-4">
            <div className="w-270 flex justify-between pb-5">
            <Skeleton className="h-8 w-[200px]" />
            {onAddClick && isSuperAdmin && <Skeleton className="h-8 w-[100px]" />}
            </div>
            <Skeleton className="h-[400px] w-full" />
        </div>
        );
    }

    if (isError) {
        return (
        <div className="space-y-4">
            <div className="w-270 flex justify-between pb-5">
            <div className="text-xl flex items-center">Employee List</div>
            {onAddClick && isSuperAdmin && (
                <Button onClick={onAddClick} disabled>
                <UserRoundPlus className="w-4 h-4 mr-2" />
                Add
                </Button>
            )}
            </div>
            <div className="rounded-md border p-4 text-center text-red-500">
            Failed to load employee data
            </div>
        </div>
        );
    }

    return (
        <>
        <div className="w-270 flex justify-between pb-5">
            <div className="text-xl flex items-center">Employee List</div>
            {onAddClick && isSuperAdmin && (
            <Button onClick={onAddClick} variant="outline">
                <UserRoundPlus className="w-4 h-4 mr-2" />
                Add Employee
            </Button>
            )}
        </div>

        <div className="rounded-md border">
            <Table>
            <TableHeader className="bg-neutral-900">
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                    ))}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                    No employees found
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        </>
    );
}