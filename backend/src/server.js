import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 9000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(9000, () => console.log("Server running on port 9000"));
