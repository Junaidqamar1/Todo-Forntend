# 🧠 Real-Time Collaborative Task Board

A real-time collaborative task management app built with React, Node.js, Socket.IO, and MongoDB. It allows multiple users to create, assign, and update tasks live, with conflict detection and smart auto-assignment features.

---

## 🌐 Live Demo

- 🔗 **Frontend (Netlify)**: [View Live Site](https://todo-webalar.netlify.app/)
- 🔗 **Backend (Railway)**: [API Base URL](https://todo-backend-production-6db3.up.railway.app/api)
- 🎥 **Demo Video**: [Watch Here](https://drive.google.com/file/d/1CE9pxNiqwrxzwaol1hPDxd0_R-e9hVmP/view?usp=sharing)

---

## 🧰 Tech Stack

- **Frontend**: React.js, Axios, Socket.IO Client
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Database**: MongoDB Atlas
- **Hosting**: Netlify (Frontend), Railway (Backend)
- **Real-time Communication**: WebSockets via Socket.IO

---

## 📦 Features

- 🧑‍💼 User Registration & Login
- 📝 Create, Update, Delete tasks
- 🔄 Real-time syncing of tasks across users
- ⚔️ Conflict Detection & Resolution
- 🧠 Smart Auto Assignment (assigns task to user with least workload)
- 📜 Activity Log
- 📤 Drag & Drop task status change (Todo, In Progress, Done)
- ✅ Fully responsive design

---

## Smart Assign (📌 Key Feature)

-When you click "🧠 Smart Assign", the system:

    Fetches all users.

    Counts how many tasks each user currently has.

    Assigns the task to the user with the least workload.

    Updates the task in the DB and syncs in real-time via WebSocket.

🔄 This helps distribute tasks fairly and automatically.
---

## Conflict Handling (📌 Key Feature)

Conflicts can occur when two users try to update the same task simultaneously. Here’s how we manage it:

    Each task stores a lastModified timestamp.

    When updating, client sends the current version with the timestamp.

    Server checks if the timestamp is outdated.

    If outdated, server sends 409 Conflict response with both:

        currentTask (latest in DB)

        attemptedUpdate (from client)

    The client prompts the user to confirm overwrite or cancel.

✅ This ensures no accidental overwrites happen in collaboration.
## Real-Time Collaboration

All updates (task creation, status updates, deletions) are broadcast using Socket.IO:

    task-created

    task-updated

    task-deleted

    new-action (for activity log)

Each user sees changes instantly without refreshing.


## 🚀 Setup and Installation

### 🔧 Backend (Node + Express)

```bash
git clone https://github.com/junaid1/repo.git
cd server
npm install
npm start
