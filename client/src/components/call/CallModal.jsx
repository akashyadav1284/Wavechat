import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import useCallStore from "../../store/useCallStore";
import { generateAvatar } from "../../lib/utils";

const CallModal = () => {
  const {
    callState,
    callType,
    localStream,
    remoteStream,
    caller,
    receivingCall,
    callAccepted,
    isMuted,
    isVideoOff,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useCallStore();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callState]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callState]);

  if (callState === "idle") return null;

  const isIncoming = receivingCall && !callAccepted;
  const avatar = caller ? generateAvatar(caller.name) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col aspect-[4/3] sm:aspect-video"
        >
          {/* INCOMING CALL SCREEN */}
          {isIncoming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="relative mb-8"
              >
                <div className="relative z-10 p-2 rounded-full bg-white/5 border border-white/10">
                  {caller?.profilePic ? (
                    <img src={caller.profilePic} alt={caller.name} className="w-32 h-32 rounded-full object-cover shadow-lg" />
                  ) : (
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-4xl font-bold text-white shadow-lg`}>
                      {avatar.initials}
                    </div>
                  )}
                </div>
                {/* Ripples */}
                <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-60" />
                <div className="absolute inset-[-20px] rounded-full border border-white/10 animate-ping opacity-30" style={{ animationDelay: "0.5s" }} />
              </motion.div>
              
              <h2 className="text-3xl font-display font-semibold text-white tracking-tight mb-2">{caller?.name}</h2>
              <p className="text-zinc-400 mb-12 font-medium">Incoming {callType} call...</p>
              
              <div className="flex items-center gap-10">
                <button onClick={rejectCall} className="w-16 h-16 rounded-full bg-red-500/90 hover:bg-red-500 flex items-center justify-center text-white shadow-lg transition-all active:scale-95">
                  <PhoneOff className="w-7 h-7" />
                </button>
                <button onClick={answerCall} className="w-16 h-16 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center text-zinc-900 shadow-glow-white transition-all active:scale-95">
                  {callType === "video" ? <Video className="w-7 h-7" /> : <Phone className="w-7 h-7 animate-pulse" />}
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE CALL SCREEN (Calling or Connected) */}
          {!isIncoming && (
            <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
              {/* Remote Stream (Main bg) */}
              {(callAccepted && remoteStream) ? (
                 <video
                   ref={remoteVideoRef}
                   autoPlay
                   playsInline
                   className="absolute inset-0 w-full h-full object-cover"
                 />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                   <p className="text-zinc-400 text-lg font-medium animate-pulse">
                     {callState === "calling" ? "Calling..." : "Connecting..."}
                   </p>
                </div>
              )}

              {/* Local Stream (PiP) */}
              {callType === "video" && !isVideoOff && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-white/20 z-10"
                >
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                </motion.div>
              )}

              {/* Controls Bar */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                <button onClick={toggleMute} className={`p-3.5 rounded-full transition-colors ${isMuted ? 'bg-white/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                {callType === "video" && (
                  <button onClick={toggleVideo} className={`p-3.5 rounded-full transition-colors ${isVideoOff ? 'bg-white/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                )}

                <div className="w-px h-6 bg-white/10 mx-1" />

                <button onClick={endCall} className="p-3.5 rounded-full bg-red-500/90 hover:bg-red-500 text-white transition-all active:scale-95 shadow-lg">
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CallModal;
