import { config } from "dotenv";
import express from "express";
import connectToDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadImageRoutes from "./routes/imageRoutes.js";
// Configure dotenv
config();
const port = process.env.PORT || 3030;
const database_url = process.env.DATABASE_URL;
connectToDB(database_url);
const app = express();
app.use(express.json());
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/image", uploadImageRoutes);
app.listen(port, () => console.log(`Server listening on port ${port}`));
