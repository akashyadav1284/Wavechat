import { generateAvatar } from "../../lib/utils";
import useAuthStore from "../../store/useAuthStore";
import useCallStore from "../../store/useCallStore";
import useChatStore from "../../store/useChatStore";
import toast from "react-hot-toast";
import { ArrowLeft, Phone, Video, Info } from "lucide-react";
import { motion } from "framer-motion";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { initiateCall, callState } = useCallStore();

  if (!selectedUser) return null;

  const avatar = generateAvatar(selectedUser.name);
  const isOnline = onlineUsers.includes(selectedUser._id);

  const handleCall = (type) => {
    if (!isOnline) {
      return toast.error(`${selectedUser.name} is currently offline`);
    }
    if (callState !== "idle") {
      return toast.error("You are already in a call");
    }
    initiateCall(selectedUser._id, type);
  };

  return (
    <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-transparent shrink-0">
      <div className="flex items-center gap-3.5">
        {/* Back button (mobile) */}
        <button
          onClick={() => setSelectedUser(null)}
          className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-zinc-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative">
          {selectedUser.profilePic ? (
            <img src={selectedUser.profilePic} alt={selectedUser.name}
              className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-sm" />
          ) : (
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-sm font-bold text-white shadow-sm border border-white/5`}>
              {avatar.initials}
            </div>
          )}
          {isOnline && <span className="absolute bottom-0 right-0 online-dot border-2 border-[#181A20]" />}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-white text-[15px] leading-snug">{selectedUser.name}</h3>
          <p className="text-xs font-medium">
            {isOnline ? (
              <span className="text-emerald-400">Online</span>
            ) : (
              <span className="text-zinc-500">{selectedUser.waveId}</span>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => handleCall("audio")}
          className="p-2.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button 
          onClick={() => handleCall("video")}
          className="p-2.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <Video className="w-5 h-5" />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
        <button 
          className="hidden sm:block p-2.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
