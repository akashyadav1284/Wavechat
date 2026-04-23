# 🌊 WaveChat

A premium, futuristic real-time chat application built with the MERN stack + Socket.io, featuring an iOS liquid glass UI/UX.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Real-Time:** Socket.io
- **Auth:** JWT + bcrypt
- **State:** Zustand

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables



### 3. Run

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

### 4. Open

Visit `http://localhost:5173` in your browser.

## Features

- 🔐 JWT authentication with httpOnly cookies
- 💬 Real-time messaging with Socket.io
- 👥 User search by WaveChat ID (@wave123456)
- 🟢 Online/offline status tracking
- ⌨️ Typing indicators
- ✅ Seen/delivered message status
- 🖼️ Image sharing with preview
- 🎨 Liquid glass UI with wave animations
- 📱 Fully responsive (mobile-first)
- 🌊 Animated wave background

## Folder Structure

```
wavechat/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI, auth, chat, sidebar, layout
│   │   ├── pages/        # Landing, Chat, Profile
│   │   ├── store/        # Zustand state management
│   │   └── lib/          # Axios, Socket, utilities
│   └── ...
├── server/          # Express.js backend
│   ├── controllers/ # Auth, User, Message logic
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── socket/      # Socket.io server
│   └── ...
└── README.md
```

