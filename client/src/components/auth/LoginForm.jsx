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
              placeholder="Wave I'D"
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
