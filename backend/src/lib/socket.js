import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from './env.js';
import {socketAuthMiddleware} from '../middleware/socket.auth.middleware.js';

const app =express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});

//apply authentication middleware to all socket connections

io.use(socketAuthMiddleware);

//to check if the user is online or not
export function  getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//this is for storing the online users
const userSocketMap={};

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    //io.emit is use to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=> {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
         io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

            // Join a group room
        socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`${socket.user.fullName} joined group ${groupId}`);
        });

        // Leave a group room
        socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId);
        console.log(`${socket.user.fullName} left group ${groupId}`);
        });
});

export {io, app, server};