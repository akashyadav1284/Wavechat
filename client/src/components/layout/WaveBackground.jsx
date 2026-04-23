const WaveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden wave-bg-gradient">
      {/* Animated gradient orbs (Subtle White/Silver) */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full animate-float opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      
      <div
        className="absolute top-[60%] -right-[10%] w-[60vw] h-[60vw] rounded-full animate-float-delayed opacity-[0.02]"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full animate-float opacity-[0.02]"
        style={{
          background: "radial-gradient(circle, rgba(161,161,170,0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
          animationDuration: "12s",
        }}
      />

      {/* Noise overlay for premium cinematic texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default WaveBackground;
