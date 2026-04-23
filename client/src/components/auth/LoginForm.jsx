import { useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Lock, Eye, EyeOff, Waves } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const LoginForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ waveId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <motion.div
          className="flex justify-center mb-6"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative p-4 rounded-2xl bg-white/5 border border-white/10 shadow-glass-sm">
            <Waves className="w-10 h-10 text-white" />
            <div className="absolute inset-0 blur-xl bg-white/20 rounded-full" />
          </div>
        </motion.div>
        <h2 className="font-display text-3xl font-semibold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-zinc-400 text-sm font-medium">
          Enter your details to sign in
        </p>
      </div>

      <div className="space-y-4">
        {/* WaveID */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider ml-1">WaveID</label>
          <div className="relative group">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={formData.waveId}
              onChange={(e) => setFormData({ ...formData, waveId: e.target.value })}
              className="w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:ring-0"
              placeholder="e.g. @sagar"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full glass-input rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-zinc-600 focus:ring-0"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoggingIn}
        className="relative w-full py-3.5 rounded-xl font-semibold text-zinc-900 bg-white hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-white overflow-hidden group"
      >
        <span className="relative z-10">{isLoggingIn ? "Signing in..." : "Sign In"}</span>
        {!isLoggingIn && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
        )}
      </button>

      {/* Mock Social Logins */}
      <div className="pt-4">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-4 text-xs font-medium text-zinc-500 bg-[#0F1115] lg:bg-transparent backdrop-blur-md rounded-full">OR CONTINUE WITH</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass-light hover:bg-white/10 transition-colors border border-white/5 text-sm font-medium text-zinc-300 hover:text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass-light hover:bg-white/10 transition-colors border border-white/5 text-sm font-medium text-zinc-300 hover:text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05,20.28c-1.37,1.96-2.85,3.72-5.06,3.72s-2.88-1.2-5.06-1.2s-3.05,1.18-5.06,1.2c-2.12,0.02-3.83-1.95-5.2-3.95C-0.89,15.71-0.2,10.74,1.88,8.23c1.03-1.25,2.55-2.06,4.19-2.06c2.1,0,3.58,1.26,5.13,1.26s3.43-1.3,5.65-1.3c1.33,0,3.03,0.48,4.19,1.87c-3.66,1.86-3.02,6.86,0.55,8.32C20.89,18.06,19.23,19.64,17.05,20.28z M12.02,6.17c-0.22-2.19,1.67-4.22,3.93-4.59C16.32,3.8,14.45,6.17,12.02,6.17z"/></svg>
            Apple
          </button>
        </div>
      </div>

      {/* Switch to signup */}
      <p className="text-center text-zinc-400 text-sm mt-6">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch}
          className="text-white hover:text-zinc-200 font-semibold transition-colors">
          Create one
        </button>
      </p>
    </motion.form>
  );
};

export default LoginForm;
