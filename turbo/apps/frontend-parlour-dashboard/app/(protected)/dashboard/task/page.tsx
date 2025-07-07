"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CreateTaskInput, createTaskInput } from "@repo/common/types"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CommandInput } from "cmdk"
import { TaskService } from "./task-services"
import {EmployeeService} from "../employee/employee-service"
import { Task } from "@repo/db/client"


type TaskWithAssignee = {
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
}

export default function TaskManager() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employees, setEmployees] = useState<Array<{
        id: string;
        name: string;
        email: string;
    }>>([]);
    const [tasks, setTasks] = useState<TaskWithAssignee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);


    useEffect(() => {
        setIsSuperAdmin(TaskService.isSuperAdmin());
    }, []);

    const form = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskInput),
        defaultValues: {
        title: "",
        description: "",
        employeeId: "",
        isDone: false
        },
    });


    useEffect(() => {
        const fetchData = async () => {
        try {
            const [employeesData, tasksData] = await Promise.all([
            EmployeeService.getAll(),
            TaskService.getAll()
            ])
            setEmployees(employeesData)
            setTasks(tasksData)
        } catch (error) {
            console.error("Fetch error:", error)
            setError("Failed to load data. Please try again.")
        } finally {
            setIsLoading(false)
        }
        }

        fetchData()
    }, [])

    

    const onSubmit = async (data: CreateTaskInput) => {
        if (!isSuperAdmin) {
        toast.error("Only SUPER_ADMIN can create or edit tasks");
        return;
        }

        setIsSubmitting(true);
        try {
        if (editingTask) {
            const updatedTask = await TaskService.update(editingTask.id,{...data,id:editingTask.id});
            setTasks(prev => prev.map(task => 
            task.id === editingTask.id ? updatedTask : task
            ));
            toast.success("Task updated successfully!");
        } else {
            const newTask = await TaskService.create(data);
            setTasks(prev => [newTask, ...prev]);
            toast.success("Task added successfully!");
        }
        setEditingTask(null);
        form.reset();
        } catch (error) {
        console.error("Task operation error:", error);
        toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
        } finally {
        setIsSubmitting(false);
        }
    };

    const markAsDone = async (taskId: string) => {
        try {
        const updatedTask = await TaskService.markAsDone(taskId)
        setTasks(prev => prev.map(task => 
            task.id === taskId ? updatedTask : task
        ))
        toast.success("Task marked as done!")
        } catch (error) {
        console.error("Task update error:", error)
        toast.error("Failed to update task")
        }
    }

        const handleEditClick = (task: TaskWithAssignee) => {
        if (!isSuperAdmin) {
        toast.error("Only SUPER_ADMIN can edit tasks");
        return;
        }
        setEditingTask(task);

        document.getElementById('task-form')?.scrollIntoView({ behavior: 'smooth' });
    };



    return (
        <div className="w-[85vw] flex flex-wrap">

        {isSuperAdmin && (
            <div id="task-form" className="w-[350px] h-[400px] p-7 m-5 bg-neutral-900 rounded-2xl">
            <div className="font-bold text-xl pb-3 flex w-full justify-center items-center">
                {editingTask ? 'Edit Task' : 'Add Task'}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Title..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Description..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Assign to</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value
                                ? employees.find(e => e.id === field.value)?.name
                                : "Select employee"}
                            <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search employee..." />
                            <CommandList>
                            <CommandEmpty>No employees found</CommandEmpty>
                            <CommandGroup>
                                {employees.map((employee) => (
                                <CommandItem
                                    value={employee.id}
                                    key={employee.id}
                                    onSelect={() => {
                                    form.setValue("employeeId", employee.id)
                                    }}
                                >
                                    {employee.name}
                                    <Check
                                    className={cn(
                                        "ml-auto",
                                        employee.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                    />
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </CommandList>
                        </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : editingTask ? "Update" : "Submit"}
                    </Button>
                    {editingTask && (
                    <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setEditingTask(null)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    )}
                </div>
                </form>
            </Form>
            </div>
        )}

        {isLoading ? (
            <div>Loading tasks...</div>
        ) : (
            tasks.map((task) => (
            <TaskCard 
                key={task.id}
                task={task}
                onMarkAsDone={markAsDone}
                onEditClick={isSuperAdmin ? handleEditClick : undefined}
            />
            ))
        )}
        </div>
    );
}

const TaskCard = ({ task, onMarkAsDone, onEditClick }: { 
    task: TaskWithAssignee, 
    onMarkAsDone: (id: string) => void,
    onEditClick?: (task: TaskWithAssignee) => void
    }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const currentRole = localStorage.getItem("role");
    const isSuperAdmin = currentRole === "SUPER_ADMIN";

    const handleDelete = async () => {
        if (!isSuperAdmin) {
        toast.error("Only SUPER_ADMIN can delete tasks");
        return;
        }

        setIsDeleting(true);
        try {
        await TaskService.delete(task.id);
        toast.success("Task deleted successfully!");
        } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete task");
        } finally {
        setIsDeleting(false);
        }
    };

return (
        <div className="w-[350px] h-[400px] p-7 m-5 bg-neutral-900 rounded-2xl flex flex-col justify-between">
        <div>
            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
            <p className="text-gray-300 mb-4 text-xl">{task.description}</p>
        </div>
        <div>
            <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm text-gray-400">
                Assigned to: {task.assignedTo?.name || "Unassigned"}
            </h3>
            {isSuperAdmin && (
                <div className="flex gap-2">
                {onEditClick && (
                    <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditClick(task)}
                    disabled={isDeleting}
                    >
                    Edit
                    </Button>
                )}
                <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
                </div>
            )}
            </div>
            <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded text-xs ${
                task.isDone 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
                {task.isDone ? 'Completed' : 'Pending'}
            </span>
            {!task.isDone && (
                <Button 
                size="sm" 
                onClick={() => onMarkAsDone(task.id)}
                disabled={isDeleting}
                >
                Mark as Done
                </Button>
            )}
            </div>
        </div>
        </div>
    );
};