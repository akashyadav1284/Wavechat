import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { formatTime } from "../../lib/utils";
import useAuthStore from "../../store/useAuthStore";
import { useState } from "react";

const MessageBubble = ({ message }) => {
  const { authUser } = useAuthStore();
  const isSent = message.senderId === authUser._id;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showTime, setShowTime] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-3 px-4`}
      onClick={() => setShowTime(!showTime)}
    >
      <div className={`max-w-[80%] lg:max-w-[65%] ${isSent ? "order-1" : ""}`}>
        <div
          className={`px-4 py-2.5 shadow-sm ${
            isSent
              ? "msg-sent rounded-2xl rounded-br-sm"
              : "msg-received rounded-2xl rounded-bl-sm"
          }`}
        >
          {/* Image */}
          {message.image && (
            <div className="mb-2">
              {!imgLoaded && (
                <div className="skeleton w-48 h-32 rounded-xl" />
              )}
              <img
                src={message.image}
                alt="Shared image"
                className={`rounded-xl max-w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity border border-white/5 shadow-sm ${
                  imgLoaded ? "block" : "hidden"
                }`}
                onLoad={() => setImgLoaded(true)}
              />
            </div>
          )}

          {/* Text */}
          {message.text && (
            <p className="text-[15px] text-white/95 leading-relaxed break-words">
              {message.text}
            </p>
          )}

          {/* Meta */}
          <div
            className={`flex items-center gap-1.5 mt-1 ${
              isSent ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-[10px] font-medium text-zinc-400">
              {formatTime(message.createdAt)}
            </span>
            {isSent && (
              <span className="text-zinc-400">
                {message.seen ? (
                  <CheckCheck className="w-3.5 h-3.5 text-white" />
                ) : message.delivered ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
