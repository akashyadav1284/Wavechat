import { useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Lock, Eye, EyeOff, User, Waves, Check, X } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import axiosInstance from "../../lib/axios";

const SignupForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    name: "",
    waveId: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [waveIdStatus, setWaveIdStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const { signup, isSigningUp } = useAuthStore();

  const checkWaveId = async (id) => {
    if (!id || id.length < 2) {
      setWaveIdStatus(null);
      return;
    }
    setWaveIdStatus("checking");
    try {
      let normalized = id.trim().toLowerCase();
      if (!normalized.startsWith("@")) normalized = `@${normalized}`;
      const res = await axiosInstance.get(`/users/check-waveid?waveId=${normalized}`);
      setWaveIdStatus(res.data.available ? "available" : "taken");
    } catch (error) {
      setWaveIdStatus(null);
    }
  };

  let debounceTimer;
  const handleWaveIdChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, waveId: value });
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => checkWaveId(value), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords don't match");
    }
    if (waveIdStatus === "taken") {
      return alert("This WaveID is already taken!");
    }
    signup({
      name: formData.name,
      waveId: formData.waveId,
      password: formData.password,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      <div className="text-center space-y-2 mb-6">
        <motion.div
          className="flex justify-center mb-4"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 shadow-glass-sm">
            <Waves className="w-8 h-8 text-white" />
            <div className="absolute inset-0 blur-xl bg-white/20 rounded-full" />
          </div>
        </motion.div>
        <h2 className="font-display text-2xl font-semibold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-zinc-400 text-sm font-medium">Join the next-gen wave</p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full glass-input rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:ring-0"
              placeholder="e.g. John Doe"
              required
            />
          </div>
        </div>

        {/* WaveID */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider ml-1">Choose WaveID</label>
          <div className="relative group">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              value={formData.waveId}
              onChange={handleWaveIdChange}
              className={`w-full glass-input rounded-xl py-3 pl-11 pr-10 text-sm text-white placeholder-zinc-600 focus:ring-0 ${
                waveIdStatus === "available" ? "border-emerald-500/40" : waveIdStatus === "taken" ? "border-red-500/40" : ""
              }`}
              placeholder="e.g. john_doe"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {waveIdStatus === "checking" && <div className="w-4 h-4 border-2 border-zinc-400/30 border-t-zinc-400 rounded-full animate-spin" />}
              {waveIdStatus === "available" && <Check className="w-4 h-4 text-emerald-400" />}
              {waveIdStatus === "taken" && <X className="w-4 h-4 text-red-400" />}
            </div>
          </div>
          {waveIdStatus === "available" && <p className="text-[11px] text-emerald-400 pl-1 font-medium">✓ Available</p>}
          {waveIdStatus === "taken" && <p className="text-[11px] text-red-400 pl-1 font-medium">✗ Taken</p>}
        </div>

        {/* Password */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full glass-input rounded-xl py-3 pl-10 pr-9 text-sm text-white placeholder-zinc-600 focus:ring-0"
                placeholder="Min 6 chars"
                required minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider ml-1">Confirm</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:ring-0"
                placeholder="Repeat"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSigningUp || waveIdStatus === "taken"}
        className="relative w-full py-3.5 mt-2 rounded-xl font-semibold text-zinc-900 bg-white hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-white overflow-hidden group"
      >
        <span className="relative z-10">{isSigningUp ? "Creating..." : "Create Account"}</span>
        {!isSigningUp && waveIdStatus !== "taken" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
        )}
      </button>

      <p className="text-center text-zinc-400 text-xs mt-4">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-white hover:text-zinc-200 font-semibold transition-colors">
          Sign in
        </button>
      </p>
    </motion.form>
  );
};

export default SignupForm;
