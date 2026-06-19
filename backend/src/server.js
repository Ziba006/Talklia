import express from "express";
import dotenv from "dotenv";
import path from "path";
import dns from 'dns';

// import cors from "cors";
// app.use(cors());

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";


console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 9000;
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// //  make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(9000, () => {
    console.log("Server running on port " + PORT)
    connectDB()
});
