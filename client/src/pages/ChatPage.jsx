import { motion } from "framer-motion";
import Sidebar from "../components/sidebar/Sidebar";
import ChatContainer from "../components/chat/ChatContainer";
import useChatStore from "../store/useChatStore";

const ChatPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-screen pt-[104px] pb-6 px-4 sm:px-6 w-full max-w-[1400px] mx-auto flex gap-4 lg:gap-6"
    >
      {/* Sidebar — Floating Panel */}
      <div
        className={`${
          selectedUser ? "hidden lg:flex" : "flex"
        } w-full lg:w-[340px] xl:w-[380px] h-full shrink-0`}
      >
        <div className="w-full h-full glass-dark rounded-[24px] border border-white/10 shadow-glass overflow-hidden flex flex-col relative z-10">
           <Sidebar />
        </div>
      </div>

      {/* Chat area — Floating Panel */}
      <div
        className={`${
          selectedUser ? "flex" : "hidden lg:flex"
        } flex-1 h-full min-w-0 relative z-10`}
      >
        <div className="w-full h-full glass-dark rounded-[24px] border border-white/10 shadow-glass overflow-hidden flex flex-col relative">
           <ChatContainer />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;
