import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employee.routes";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);


app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.listen(Number(PORT), () => {
  console.log(`API ready at http://localhost:${PORT}`);
});
