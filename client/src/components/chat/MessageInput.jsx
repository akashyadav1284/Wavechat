import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Image, X } from "lucide-react";
import useChatStore from "../../store/useChatStore";
import { getSocket } from "../../lib/socket";
import { fileToBase64 } from "../../lib/utils";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();

  const handleTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !selectedUser) return;

    socket.emit("typing", { to: selectedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { to: selectedUser._id });
    }, 2000);
  }, [selectedUser]);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const base64 = await fileToBase64(file);
    setImagePreview(base64);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !imagePreview) || isSending) return;

    setIsSending(true);

    const socket = getSocket();
    if (socket) socket.emit("stopTyping", { to: selectedUser._id });

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview || "",
      });
      setText("");
      setImagePreview(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-white/5 p-4 bg-transparent shrink-0">
      {/* Image preview */}
      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-3 relative inline-block"
        >
          <div className="p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-auto rounded-xl object-cover"
            />
            <button
              onClick={() => {
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:bg-zinc-700 transition-colors shadow-lg"
            >
              <X className="w-3.5 h-3.5 text-zinc-300 hover:text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Image button */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors shrink-0 active:scale-95"
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 glass-input rounded-xl py-3 px-4 text-[15px] text-white placeholder-zinc-500"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isSending}
          className={`p-3 rounded-xl transition-all duration-300 shrink-0 flex items-center justify-center group ${
            text.trim() || imagePreview
              ? "bg-white text-zinc-900 shadow-glow-white hover:bg-zinc-200 active:scale-95"
              : "bg-white/5 text-zinc-600 cursor-not-allowed"
          }`}
        >
          <Send className={`w-5 h-5 ${text.trim() || imagePreview ? "translate-x-[1px] -translate-y-[1px]" : ""}`} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
