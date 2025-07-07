
"use client";
import { useEffect, useState } from "react";
import { initializeSocket, getSocket } from "@/lib/socket";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

type AttendanceLog = {
  id: string;
  employee: {
    name: string;
    email: string;
  };
  status: 'PUNCH_IN' | 'PUNCH_OUT';
  timestamp: string;
};

export default function AttendanceLogPage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = initializeSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    });

    socket.on("attendance:update", (newLog: AttendanceLog) => {
      setLogs(prev => [newLog, ...prev]);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Realtime updates temporarily unavailable");
    });

    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/attendance/`);
        setLogs(response.data);
      } catch (err) {
        setError("Failed to load attendance logs");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) return <div>Loading attendance logs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="w-[80vw] flex flex-col justify-center items-center ">
        <div className="  w-full flex justify-center items-center">
            <h2 className="font-bold text-3xl p-10 ">Recent Attendance Logs</h2>
        </div>
    <div className=" p-10 border-t-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-70 text-xl p-5">Employee</TableHead>
            <TableHead className="w-70 text-xl p-5">Email</TableHead>
            <TableHead className="w-50 text-xl p-5">Status</TableHead>
            <TableHead className="text-right w-60 text-xl p-5">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium text-xl p-5">{log.employee.name}</TableCell>
              <TableCell className="text-xl p-5">{log.employee.email}</TableCell>
              <TableCell>
                <span className={`inline-flex  items-center px-2.5 py-0.5 rounded-full text-sm border-2 font-medium ${
                  log.status === 'PUNCH_IN' 
                    ? 'border-green-500 text-green-400' 
                    : 'border-red-500 text-red-400'
                }`}>
                  {log.status === 'PUNCH_IN' ? 'Punched In' : 'Punched Out'}
                </span>
              </TableCell>
              <TableCell className="text-right text-xl p-5">
                {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}