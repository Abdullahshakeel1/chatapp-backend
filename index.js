import { Server } from "socket.io";
import express from "express";
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectDB } from "./Db_connection.js";
import { messageRoute } from "./routers/massege.route.js";
import { authRoute } from "./routers/auth.route.js";
import { userRoute } from "./routers/user.route.js";
import cors from 'cors'

dotenv.config();

// Initialize Express
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend URL
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials to be sent
}));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with CORS
 const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
export const getReceiverSocketId =(receiverId)=>{
    return userSocketmap[receiverId];
}
const userSocketmap = {};

// Socket.IO Connection Handling
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId; // Ensure this is 'userId'
    if (userId) {
        userSocketmap[userId] = socket.id;
    }
    console.log("Current User Socket Map:", userSocketmap); // Log the userSocketmap
    io.emit("getOnlineUser", Object.keys(userSocketmap)); // Emit online users

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketmap[userId];
        io.emit("getOnlineUser", Object.keys(userSocketmap)); // Emit updated online users
    });
});


// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/message', messageRoute);
app.use('/api/users', userRoute);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// Database Connection and Server Initialization
const port = process.env.PORT || 6000;
connectDB().then(() => {
    server.listen(port, () => console.log(`Server running on port ${port}`));
});
export{io}
export default app;