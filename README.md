# TalentIQ: Full-Stack Interview Platform

TalentIQ is a premium, end-to-end technical interview platform designed to provide a seamless experience for both interviewers and candidates. It combines real-time video conferencing with a high-performance code editor and automated backend synchronization.

---

## Core Technology Stack

### **Frontend (The Client)**
- **React (Vite)**: For a fast, modern single-page application experience.
- **Tailwind CSS & DaisyUI**: For a sleek, responsive, and themeable UI.
- **TanStack Query (React Query)**: For robust server state management and caching.
- **Clerk SDK**: For secure, modern authentication and user management.
- **Stream Video & Chat SDK**: For 1-on-1 video rooms and real-time messaging.
- **Monaco Editor**: The same engine that powers VS Code, offering syntax highlighting and intelligent editing.
- **React Resizable Panels**: For a flexible interface where users can customize their workspace.

### **Backend (The Server)**
- **Express & Node.js**: A high-performance REST API.
- **MongoDB & Mongoose**: For flexible, document-based data storage.
- **Clerk Express SDK**: For server-side authentication and session validation.
- **Stream Node SDK**: For managing video calls and chat channels programmatically.
- **Inngest**: For handling background jobs and complex event-driven workflows (e.g., Clerk webhooks).

### **Infrastructure & APIs**
- **Piston API**: An open-source code execution engine used to run user code safely in isolated environments.
- **Clerk Webhooks**: Used to keep the application database in sync with authentication events.

---

## Key Features & Functionality

### 1. Problem Management
- **Integrated Problem Library**: A collection of coding challenges (Easy, Medium, Hard) categorized by type (e.g., Arrays, Strings).
- **Comprehensive Descriptions**: Each problem includes detailed descriptions, multiple examples (Input/Output), and specific constraints.
- **Difficulty Mapping**: Visual badges to identify the challenge level at a glance.

### 2. Interview Experience (The Session)
- **1-on-1 Video Chat**: High-quality video and audio communication powered by Stream.
- **Real-time Messaging**: A dedicated chat channel for each interview session.
- **Room Locking**: Sessions are restricted to 2 participants (Host and Participant) to ensure privacy.
- **Dynamic Controls**: Mic/Camera toggle, screen sharing, and recording capabilities.

### 3. VS Code-Style IDE
- **Multi-Language Support**: Support for **JavaScript**, **Python**, and **Java**.
- **Live Output Panel**: Instantly see run results (standard output and error logs).
- **Split-View Interface**: Resizable panels allowing users to balance their focus between problem details, code, and video.

### 4. User Dashboard
- **Welcome Statistics**: View active sessions and total interviews conducted.
- **Recent Sessions**: A scrollable history of completed interviews.
- **Live Sessions List**: A real-time view of available sessions that other users can join.

### 5. High-Level Logic (The "Magic")
- **Automated User Sync**: When a user registers via Clerk, **Inngest** background jobs automatically create a record in the local MongoDB and register the user in Stream's database.
- **Session Lifecycle**: When a Host starts a session, the backend automatically provisions a Stream Video Call and a Chat Channel, linking them to a unique `callId`.
- **Cleanup**: Ending a session notifies participants, deletes the Stream resources to save on usage, and archives the session data.

---

## 🗄️ Database Schema

### **User Model**
Stores essential user metadata synchronized from Clerk:
- `name`, `email`, `profileImage`, `clerkId`.

### **Session Model**
Tracks the lifecycle of an interview:
- `problem` (the title of the challenge).
- `difficulty` (easy/medium/hard).
- `host` & `participant` (references to the User model).
- `status` (active/completed).
- `callId` (the link to Stream Video/Chat).

---

