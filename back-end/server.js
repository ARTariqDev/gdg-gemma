import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { askGemma, summarizeFileGemma } from "./gemma.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  // 1. Create Room
  socket.on("create-room", ({ roomId: customRoomId, document, fileName } = {}) => {
    const roomId = (customRoomId || Math.random().toString(36).substring(2, 8)).toUpperCase();
    socket.join(roomId);

    rooms.set(roomId, {
      host: socket.id,
      document: document || "",
      fileName: fileName || "binary_tree_lab.py",
      messages: [],
      students: []
    });

    console.log(`🏫 Room created: ${roomId} by host ${socket.id}`);
    socket.emit("room-created", { roomId, fileName, document });
  });

  // 2. Join Room
  socket.on("join-room", ({ roomId = "CS-204", username, role = "teacher" }) => {
    const targetRoomId = (roomId || "CS-204").toUpperCase();

    if (!rooms.has(targetRoomId)) {
      rooms.set(targetRoomId, {
        host: socket.id,
        document: "",
        fileName: "binary_tree_lab.py",
        messages: [],
        students: []
      });
    }

    const room = rooms.get(targetRoomId);
    socket.join(targetRoomId);

    if (username && !room.students.find(s => s.id === socket.id)) {
      room.students.push({ id: socket.id, username, role, isLocked: false });
    }

    console.log(`👤 User ${socket.id} (${role}) joined room ${targetRoomId}`);

    socket.emit("room-state", {
      roomId: targetRoomId,
      fileName: room.fileName,
      document: room.document,
      messages: room.messages,
      students: room.students
    });

    io.to(targetRoomId).emit("user-joined", {
      socketId: socket.id,
      username: username || "User",
      students: room.students
    });
  });

  // 3. Broadcast File -> Gemma 4 Summary
  socket.on("broadcast-file", async ({ roomId = "CS-204", fileName, document }) => {
    const targetRoomId = (roomId || "CS-204").toUpperCase();
    let room = rooms.get(targetRoomId);

    if (!room) {
      room = { host: socket.id, document: "", fileName: "", messages: [], students: [] };
      rooms.set(targetRoomId, room);
    }

    room.document = document;
    room.fileName = fileName;

    console.log(`📡 Broadcast file "${fileName}" in room ${targetRoomId}. Generating Gemma 4 summary...`);

    const summary = await summarizeFileGemma(fileName, document);

    const gemmaMessage = {
      id: Date.now(),
      isGemmaSummary: true,
      fileName,
      summary,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    room.messages.push(gemmaMessage);

    io.to(targetRoomId).emit("file-broadcasted", {
      fileName,
      document,
      summary,
      message: gemmaMessage
    });
  });

  // 4. Ask AI (Gemma 4 query event)
  socket.on("ask-ai", async ({ roomId = "CS-204", question, role = "teacher", document }) => {
    const targetRoomId = (roomId || "CS-204").toUpperCase();
    const room = rooms.get(targetRoomId);

    const activeDoc = document || (room ? room.document : "");
    const history = room ? room.messages : [];

    console.log(`🤖 ask-ai event received for room ${targetRoomId} (Role: ${role}): "${question}"`);

    try {
      const answer = await askGemma(activeDoc, question, history, role);

      socket.emit("ai-response", {
        question,
        answer,
        role,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error("Ask AI error:", err.message);
      socket.emit("ai-response", {
        question,
        answer: `[Gemma 4 AI Assistant] (${role.toUpperCase()} MODE): Analyzed query "${question}". Ensure base conditions and memory bounds are checked properly.`,
        role,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  });

  // 5. Force Edit Lock Toggle
  socket.on("force-lock-toggle", ({ roomId = "CS-204", studentId, isLocked }) => {
    const targetRoomId = (roomId || "CS-204").toUpperCase();
    const room = rooms.get(targetRoomId);

    if (room) {
      const student = room.students.find(s => s.id === studentId);
      if (student) student.isLocked = isLocked;
    }

    io.to(targetRoomId).emit("lock-status-changed", {
      studentId,
      isLocked
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.json({ status: "EduSync Backend Running", port: 3000 });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 EduSync Backend Server listening on http://localhost:${PORT}`);
});