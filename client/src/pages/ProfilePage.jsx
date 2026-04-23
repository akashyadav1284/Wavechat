import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, ArrowLeft, AtSign, Calendar } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { generateAvatar, fileToBase64 } from "../lib/utils";
import WaveButton from "../components/ui/WaveButton";
import GlassCard from "../components/ui/GlassCard";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.name || "");
  const avatar = generateAvatar(authUser?.name);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateProfile({ profilePic: base64 });
  };

  const handleSaveName = () => {
    if (name.trim() && name !== authUser.name) {
      updateProfile({ name: name.trim() });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-8 px-4 flex justify-center"
    >
      <div className="w-full max-w-lg space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to chats</span>
        </button>

        <GlassCard className="p-8 border border-white/10 shadow-glass">
          <div className="text-center space-y-6">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="p-1.5 rounded-full bg-white/5 border border-white/10">
                {authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt={authUser.name}
                    className="w-28 h-28 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-3xl font-bold text-white shadow-sm border border-white/5`}>
                    {avatar.initials}
                  </div>
                )}
              </div>

              <label className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors shadow-lg active:scale-95 group">
                <Camera className="w-4 h-4 text-zinc-900" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">{authUser.name}</h2>
              <p className="text-zinc-400 text-sm font-medium">{authUser.waveId}</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {/* Name edit */}
            <div className="space-y-2">
              <label className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider ml-1">Display Name</label>
              <div className="flex gap-2">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="flex-1 glass-input rounded-xl py-3 px-4 text-sm text-white focus:ring-0 placeholder-zinc-600" />
                <WaveButton onClick={handleSaveName} loading={isUpdatingProfile}
                  className="px-5 py-3 text-sm">
                  Save
                </WaveButton>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4 pt-5 border-t border-white/5">
              <div className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-2 bg-white/5 rounded-lg">
                  <AtSign className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">WaveID</span>
                  <span className="text-zinc-300 font-medium">{authUser.waveId}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Joined</span>
                  <span className="text-zinc-300 font-medium">
                    {new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
