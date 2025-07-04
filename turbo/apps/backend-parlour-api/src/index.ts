import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employee.routes";
import attendanceRoutes from "./routes/attendance.routes";
import taskRoutes from "./routes/task.routes"
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { setupAttendanceSocket } from "./sockets/attendance.socket";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/task",taskRoutes)
app.use("/api/v1/attendance", attendanceRoutes);

setupAttendanceSocket(io);


app.get("/", (req, res) => {
  res.send("Backend API is running");
});


const PORT = Number(process.env.PORT) || 3000;

server.listen(Number(PORT), () => {
  console.log(`API ready at http://localhost:${PORT}`);
});
