import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  variant = "default",
  animate = true,
  ...props
}) => {
  const variants = {
    default: "glass",
    dark: "glass-dark",
    light: "glass-light",
  };

  const baseClass = variants[variant] || variants.default;

  const content = (
    <div className={`${baseClass} rounded-2xl ${className}`} {...props}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
};

export default GlassCard;
