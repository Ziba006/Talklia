import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dns from 'dns';
import {ENV} from './lib/env.js';
import cors from "cors";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import {app, server} from './lib/socket.js';
import groupRoutes from "./routes/group.route.js";
import groupMessageRoutes from "./routes/groupMessage.route.js"

console.log("MONGO_URI:", ENV.MONGO_URI);
const __dirname = path.resolve();

const PORT = ENV.PORT || 9000;

app.use(express.json({limit:"5mb"}));
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-messages", groupMessageRoutes);

// //  make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
    console.log("Server running on port " + PORT)
    connectDB()
});
