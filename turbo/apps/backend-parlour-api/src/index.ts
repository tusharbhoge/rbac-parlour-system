import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employee.routes";
import attendanceRoutes from "./routes/attendance.routes";
import taskRoutes from "./routes/task.routes";
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { setupAttendanceSocket } from "./sockets/attendance.socket";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/api/socket.io", 
  transports: ["websocket"] 
});

app.use(cors({
  origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5000",
  credentials: true
}));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/attendance", attendanceRoutes);

setupAttendanceSocket(io);

app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    message: "Backend API is running",
    websocket: "enabled"
  });
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/socket.io`);
});