import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.listen(Number(PORT), () => {
  console.log(`API ready at http://localhost:${PORT}`);
});
