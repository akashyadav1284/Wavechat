import { motion } from "framer-motion";
import { LogOut, Waves } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { generateAvatar } from "../../lib/utils";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const avatar = authUser ? generateAvatar(authUser.name) : null;

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-dark fixed top-6 left-1/2 z-50 w-[92%] max-w-6xl rounded-2xl border border-white/5 shadow-glass-sm"
    >
      <div className="px-5 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(authUser ? "/chat" : "/")}
          >
            <div className="relative">
              <Waves className="w-7 h-7 text-white transition-transform group-hover:rotate-6" />
              <div className="absolute inset-0 blur-lg bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-lg font-semibold tracking-wide text-white">
              WaveChat
            </span>
          </motion.div>

          {/* Right side */}
          {authUser && (
            <div className="flex items-center gap-2">
              {/* Profile button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
              >
                {authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt={authUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-sm"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-xs font-bold text-white shadow-sm border border-white/10`}
                  >
                    {avatar.initials}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-zinc-300">
                  {authUser.name}
                </span>
              </motion.button>

              <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
