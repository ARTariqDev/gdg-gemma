# 🚀 EduSync: Real-Time Classroom Collaboration Platform

> Powered by **Google Gemma 4 AI**, **Socket.IO**, and **React**.

EduSync is a real-time collaboration tool built specifically for programming classrooms and coding labs. Instead of relying on static screen-sharing, every student gets an isolated, live copy of the instructor's code template. Instructors can monitor student sandboxes in real time, co-edit any student's file over WebSockets without interrupting the class, and leverage **Google Gemma 4 AI** for automated code summaries and role-aware tutoring.

---

## 🎯 The Problem

In traditional coding classes, instructors teach by sharing their screen, while students try to follow along and copy code. For interactive programming, this model falls short:
- **Frequent Interruptions**: When one student gets stuck, the instructor must pause the lecture to help, halting the entire class.
- **Heavy Bandwidth & Video Lag**: Screen-sharing video streams consume excessive bandwidth and introduce high latency.
- **Lack of Hands-On Visibility**: Instructors cannot see individual student progress or detect syntax exceptions early.

---

## ✨ What EduSync Does

EduSync replaces heavy video streams with **bi-directional WebSocket state diffs** and **Google Gemma 4 AI integration**:

1. **Instant Copy-on-Broadcast**: The instructor picks a template or uploads a local file (`.py`, `.js`, `.cpp`, `.java`, etc.) and broadcasts it. EduSync clones isolated, sandboxed copies out to every connected student over WebSockets in sub-5ms latency.
2. **Google Gemma 4 AI Engine**:
   - **Automated Summaries**: Broadcasted files automatically generate structured AI code summaries (key concepts, complexity, explanations) in the global chatroom.
   - **Role-Conditioned Tutoring**: Tailors prompt engineering for **Teachers** (pedagogical hints, error trends, question prompts) vs **Students** (step-by-step guidance, logic hints, non-spoiler debugging checkpoints).
3. **Teacher Student Selection & Co-Editing**: Instructors can select any student from their dashboard to view their live file, edit their code in real time with a dual-cursor setup, and toggle **Force Edit Lock**.
4. **Student Assignments & Deadlines**: Built-in student editor displaying instructor-assigned files with deadline countdowns and submission tracking.
5. **Global Class Chatroom**: Real-time room chat featuring AI summary cards and an embedded Gemma 4 AI chatbot input bar.

---

## 🛠️ Core Features

- 📡 **Instant Copy-on-Dispatch**: Every student receives a sandboxed copy of the master file the moment it's broadcast, preventing accidental overwrites.
- ⚡ **Bi-Directional WebSocket Streaming**: Text state updates sync in low milliseconds, giving instructors a real-time view of student screens.
- 🔒 **Host Takeover & Force Edit Lock**: Instructors can toggle exclusive control over a student's editor during 1-on-1 guidance or release control for dual-cursor collaboration.
- 🤖 **Embedded Gemma 4 AI Chatbot**: Students and teachers can ask Gemma 4 questions directly in the chatroom or open the slide-over AI assistant drawer.
- 📁 **Custom File Upload**: Instructors can drag and drop local files from their disk directly into the workbench for instant distribution.
- 📝 **Assignments & Deadlines Tab**: Students can view assigned tasks, check deadlines (`Today at 11:59 PM`), write code in the built-in editor, and submit solutions.

---

## 🏗️ Architecture & Tech Stack

### **Frontend**
- **Framework**: React 18, Vite
- **Styling**: Vanilla CSS + Tailwind CSS (Dark Glassmorphic Theme)
- **Icons**: Lucide Icons
- **Real-Time Client**: `socket.io-client`

### **Backend**
- **Runtime**: Node.js, Express
- **Real-Time Server**: Socket.IO
- **AI SDK**: `@google/genai` (Google Gemma 4 / Gemini model family)
- **Configuration**: `dotenv`

---

## 📡 Socket.IO Event Protocol

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `create-room` | Client ➔ Server | `{ roomId, document, fileName }` | Creates a new session room instance |
| `join-room` | Client ➔ Server | `{ roomId, username, role }` | Joins client to specified room stream |
| `broadcast-file` | Client ➔ Server | `{ roomId, fileName, document }` | Broadcasts file & triggers Gemma 4 AI summary |
| `file-broadcasted` | Server ➔ Clients | `{ fileName, document, summary, message }` | Transmits file & Gemma 4 summary card |
| `ask-ai` | Client ➔ Server | `{ roomId, question, role, document }` | Routes user prompt to Gemma 4 AI engine |
| `ai-response` | Server ➔ Client | `{ question, answer, role, time }` | Returns Gemma 4 generated response |
| `force-lock-toggle` | Client ➔ Server | `{ roomId, studentId, isLocked }` | Toggles exclusive edit lock on a student sandbox |
| `code-change` | Client ➔ Server | `{ roomId, document, studentId }` | Streams live code edits between teacher & student |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+`
- **npm**: `v9+`
- **Google Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 2. Backend Setup
```bash
cd back-end
npm install
```

Create a `.env` file inside `back-end/.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

Start the backend server:
```bash
npm start
```
*Backend runs at `http://localhost:3000`*

### 3. Frontend Setup
In a new terminal window:
```bash
cd front-end
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 💡 How to Use

1. **Sign In**: Launch the app and select **Sign in as Teacher** or **Sign in as Student**.
2. **Join / Launch Room**: Enter any room key (e.g. `CS-204`) and click **Enter Global Chatroom**.
3. **Global Chatroom**: Chat with the class, view broadcasted Gemma 4 AI summary cards, and query the embedded Gemma 4 Chatbot.
4. **Code Workspace**:
   - **Teacher**: Select or upload a local file, broadcast to all student copies, select any student to view/edit their code live, and toggle **Force Edit Lock**.
   - **Student**: View assigned files and deadlines, write solutions in the built-in editor, or observe the teacher's live broadcast stream.
5. **Gemma 4 AI Assistant Drawer**: Click **Gemma AI** in the top navigation to view role-specific pedagogical tips and debugging hints.

---

## 🔮 Future Roadmap

- 🎙️ **Voice & Audio Channels**: Low-latency spatial audio chat alongside collaborative code editing.
- 🖥️ **Browser Code Execution**: Integrated WebAssembly / Docker execution sandbox for running Python, JS, C++, and Rust in-browser.
- 🎓 **LMS & GitHub Export**: One-click grading exports to Canvas, Blackboard, and GitHub Repositories.
- 🏫 **Self-Hosted Department Deployment**: Dockerized campus deployments for computer science departments.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
