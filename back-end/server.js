import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { askGemma } from "./gemma.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const rooms = new Map();

/*
rooms = {
    roomId: {
        host: socket.id,
        document: "",
        messages: []
    }
}
*/

io.on("connection", (socket) => {

    console.log(`${socket.id} connected`);

    // Create Room
    socket.on("create-room", () => {

        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

        socket.join(roomId);

        rooms.set(roomId, {
            host: socket.id,
            document: "",
            messages: []
        });

        socket.emit("room-created", roomId);
    });

    // Join Room
    socket.on("join-room", ({ roomId }) => {

        if (!rooms.has(roomId)) {
            socket.emit("error-message", "Room does not exist.");
            return;
        }

        socket.join(roomId);

        io.to(roomId).emit("user-joined", socket.id);
    });

    // Ask AI
    socket.on("ask-ai", async ({ roomId, question }) => {

        const room = rooms.get(roomId);

        if (!room) return;

        try {

            const answer = await askGemma(
                room.document,
                room.messages,
                question
            );

            room.messages.push({
                role: "user",
                content: question
            });

            room.messages.push({
                role: "assistant",
                content: answer
            });

            socket.emit("ai-response", answer);

        } catch (err) {

            console.log(err);

            socket.emit("error-message", "Gemma failed.");

        }

    });

    socket.on("disconnect", () => {

        console.log(`${socket.id} disconnected`);

    });

});

app.get("/", (req, res) => {
    res.send("Server running");
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});