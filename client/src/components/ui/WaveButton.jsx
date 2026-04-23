import { useState, useRef } from "react";
import { motion } from "framer-motion";

const WaveButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  loading = false,
  type = "button",
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);

  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create ripple
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);

    onClick?.(e);
  };

  const variants = {
    primary:
      "bg-white text-zinc-900 shadow-glow-white hover:bg-zinc-200",
    secondary:
      "bg-white/5 border border-white/10 text-white hover:bg-white/10",
    ghost:
      "bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white",
    danger:
      "bg-red-500/80 hover:bg-red-500 text-white border border-red-500/50",
  };

  return (
    <motion.button
      ref={btnRef}
      type={type}
      className={`
        relative overflow-hidden rounded-xl px-6 py-3 font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-effect bg-white/20"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-typing-dot ${variant === "primary" ? "bg-zinc-900" : "bg-white"}`} />
            <div
              className={`w-1.5 h-1.5 rounded-full animate-typing-dot ${variant === "primary" ? "bg-zinc-900" : "bg-white"}`}
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className={`w-1.5 h-1.5 rounded-full animate-typing-dot ${variant === "primary" ? "bg-zinc-900" : "bg-white"}`}
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

export default WaveButton;
