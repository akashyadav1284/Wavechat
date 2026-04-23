import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Waves, MessageSquare } from "lucide-react";
import useChatStore from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
    markAsSeen,
  } = useChatStore();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      markAsSeen(selectedUser._id);
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const isTyping = selectedUser && typingUsers[selectedUser._id];

  // Empty state — no user selected
  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <div className="relative inline-block p-5 rounded-3xl bg-white/5 border border-white/10 shadow-glass-sm">
              <Waves className="w-16 h-16 text-white" />
              <div className="absolute inset-0 blur-2xl bg-white/10 rounded-full" />
            </div>
          </motion.div>
          <h3 className="font-display text-3xl font-semibold text-white tracking-tight mb-3">
            Your Messages
          </h3>
          <p className="text-zinc-400 text-sm max-w-[280px] mx-auto leading-relaxed">
            Select a conversation from the sidebar or search for a friend to start chatting.
          </p>
          <div className="flex items-center justify-center gap-2 mt-8 py-2 px-4 rounded-full bg-white/5 border border-white/5 w-fit mx-auto text-zinc-400 text-xs font-medium">
            <MessageSquare className="w-4 h-4" />
            <span>End-to-end encrypted feel</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-4">
        {isMessagesLoading ? (
          <LoadingSkeleton type="message" count={6} />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Waves className="w-12 h-12 mb-4 opacity-40" />
            </motion.div>
            <p className="text-sm font-medium text-zinc-400">No messages yet</p>
            <p className="text-xs mt-1 text-zinc-500">Send a wave to start the conversation</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg._id} message={msg} />
            ))}
          </>
        )}

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
