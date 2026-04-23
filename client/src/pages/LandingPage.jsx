import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WaveBackground from "../components/layout/WaveBackground";
import GlassCard from "../components/ui/GlassCard";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { Waves } from "lucide-react";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <WaveBackground />

      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10 pt-16 lg:pt-0">
        
        {/* Left Side: Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center text-center lg:text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-3 mb-6"
          >
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-glass-sm backdrop-blur-md">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-medium tracking-widest text-zinc-400 uppercase">WaveChat</span>
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-semibold leading-tight text-white mb-6 tracking-tight">
            Where <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
              Conversations
            </span> <br />
            Flow freely.
          </h1>
          
          <p className="text-lg lg:text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
            Experience the next generation of messaging. Minimal, immersive, and built for seamless real-time connections.
          </p>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <GlassCard className="w-full max-w-md p-8 sm:p-10 relative overflow-hidden !rounded-3xl !border-white/10 shadow-2xl">
            {/* Decorative subtle glows */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

            <AnimatePresence mode="wait">
              {isLogin ? (
                <LoginForm key="login" onSwitch={() => setIsLogin(false)} />
              ) : (
                <SignupForm key="signup" onSwitch={() => setIsLogin(true)} />
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
