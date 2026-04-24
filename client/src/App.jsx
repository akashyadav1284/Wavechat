import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import useAuthStore from "./store/useAuthStore";
import { getSocket } from "./lib/socket";
import WaveBackground from "./components/layout/WaveBackground";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import CallModal from "./components/call/CallModal";
import useCallStore from "./store/useCallStore";
import { Waves } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, setOnlineUsers } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Set up ALL socket listeners once after auth is confirmed
  useEffect(() => {
    if (!authUser) return;

    // Poll for the socket object — it may not be created immediately after checkAuth
    let attempts = 0;
    const interval = setInterval(() => {
      const socket = getSocket();
      attempts++;
      if (!socket || attempts > 20) {
        clearInterval(interval);
        return;
      }

      clearInterval(interval);

      const {
        handleIncomingCall,
        handleCallAccepted,
        handleIceCandidate,
        handleCallEnded,
        handleCallRejected,
      } = useCallStore.getState();

      const setupListeners = () => {
        // Remove old listeners to avoid duplicates on reconnect
        socket.off("getOnlineUsers");
        socket.off("incomingCall");
        socket.off("callAccepted");
        socket.off("iceCandidate");
        socket.off("callEnded");
        socket.off("callRejected");

        // Online users
        socket.on("getOnlineUsers", (users) => setOnlineUsers(users));

        // Call signaling
        socket.on("incomingCall", handleIncomingCall);
        socket.on("callAccepted", handleCallAccepted);
        socket.on("iceCandidate", handleIceCandidate);
        socket.on("callEnded", handleCallEnded);
        socket.on("callRejected", handleCallRejected);

        // Request current online users
        socket.emit("requestOnlineUsers");

        console.log("✅ All socket listeners registered");
      };

      // If already connected, set up immediately
      if (socket.connected) {
        setupListeners();
      }

      // Re-setup listeners on every (re)connect
      socket.on("connect", setupListeners);
    }, 200); // Check every 200ms

    return () => {
      clearInterval(interval);
      const socket = getSocket();
      if (socket) {
        socket.off("connect");
        socket.off("getOnlineUsers");
        socket.off("incomingCall");
        socket.off("callAccepted");
        socket.off("iceCandidate");
        socket.off("callEnded");
        socket.off("callRejected");
      }
    };
  }, [authUser, setOnlineUsers]);


  // Loading screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center wave-bg-gradient">
        <div className="text-center">
          <div className="relative inline-block mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-glass-sm">
            <Waves className="w-12 h-12 text-white animate-wave-slow" />
            <div className="absolute inset-0 blur-2xl bg-white/20 rounded-full animate-glow-pulse" />
          </div>
          <p className="text-zinc-400 text-sm animate-pulse font-medium">Loading WaveChat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <WaveBackground />
      <CallModal />

      {authUser && <Navbar />}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(24, 24, 27, 0.9)", // zinc-900
            color: "#FAFAFA",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          },
          success: {
            iconTheme: {
              primary: "#FFFFFF",
              secondary: "#18181B",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#18181B",
            },
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              !authUser ? <LandingPage /> : <Navigate to="/chat" />
            }
          />
          <Route
            path="/chat"
            element={
              authUser ? <ChatPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/profile"
            element={
              authUser ? <ProfilePage /> : <Navigate to="/" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
