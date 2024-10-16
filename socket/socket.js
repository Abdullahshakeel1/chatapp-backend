import { Server } from "socket.io";
import express from "express";
import http from 'http'
const app = express();

const server =http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

export {app,server,io}