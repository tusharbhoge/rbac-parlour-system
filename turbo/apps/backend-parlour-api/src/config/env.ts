import path from "path";
import dotenv from "dotenv";

// Load env from the app's own .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = Number(process.env.PORT) || 3000;
