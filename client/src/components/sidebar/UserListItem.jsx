import { motion } from "framer-motion";
import { generateAvatar } from "../../lib/utils";

const UserListItem = ({ user, isSelected, isOnline, onClick }) => {
  const avatar = generateAvatar(user.name);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 my-0.5 rounded-xl transition-all duration-300 text-left group ${
        isSelected
          ? "bg-white/10 border border-white/20 shadow-glass-sm"
          : "border border-transparent hover:border-white/5"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-sm"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-sm font-bold text-white shadow-sm border border-white/5`}
          >
            {avatar.initials}
          </div>
        )}
        {isOnline && (
          <span className="absolute bottom-0 right-0 online-dot border-2 border-[#181A20]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm truncate">
            {user.name}
          </h3>
        </div>
        <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"} transition-colors`}>
          {user.waveId}
        </p>
      </div>

      {/* Online status text */}
      {isOnline && (
        <span className="text-[10px] text-emerald-400 font-medium shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Online
        </span>
      )}
    </motion.button>
  );
};

export default UserListItem;
