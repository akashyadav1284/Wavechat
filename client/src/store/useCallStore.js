import { create } from "zustand";
import { getSocket } from "../lib/socket";
import useAuthStore from "./useAuthStore";
import useChatStore from "./useChatStore";
import toast from "react-hot-toast";

// Public STUN servers for NAT traversal
const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const useCallStore = create((set, get) => ({
  callState: "idle", // 'idle' | 'calling' | 'ringing' | 'connected'
  callType: "video", // 'video' | 'audio'
  localStream: null,
  remoteStream: null,
  caller: null,
  receivingCall: false,
  callAccepted: false,
  callEnded: false,
  isMuted: false,
  isVideoOff: false,
  peerConnection: null,

  // Audio elements for ringing
  ringtoneAudio: new Audio("https://actions.google.com/sounds/v1/alarms/phone_ringing.ogg"),
  dialToneAudio: new Audio("https://actions.google.com/sounds/v1/communications/dial_tone.ogg"),

  resetCallState: () => {
    const { localStream, peerConnection, ringtoneAudio, dialToneAudio } = get();
    
    // Stop tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    
    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
    }

    // Stop audio
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
    dialToneAudio.pause();
    dialToneAudio.currentTime = 0;

    set({
      callState: "idle",
      localStream: null,
      remoteStream: null,
      caller: null,
      receivingCall: false,
      callAccepted: false,
      callEnded: true,
      isMuted: false,
      isVideoOff: false,
      peerConnection: null,
    });
  },

  initiateCall: async (userToCallId, type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });

      const pc = new RTCPeerConnection(iceServers);
      
      set({ 
        localStream: stream, 
        peerConnection: pc, 
        callState: "calling",
        callType: type,
        callEnded: false,
      });

      // Play dial tone
      const { dialToneAudio } = get();
      dialToneAudio.loop = true;
      dialToneAudio.play().catch(e => console.log("Audio play blocked", e));

      // Add local tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Handle remote tracks
      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          getSocket()?.emit("iceCandidate", {
            to: userToCallId,
            candidate: event.candidate,
          });
        }
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const { authUser } = useAuthStore.getState();

      getSocket()?.emit("callUser", {
        userToCall: userToCallId,
        signalData: offer,
        from: authUser._id,
        name: authUser.name,
        profilePic: authUser.profilePic,
        callType: type,
      });

    } catch (error) {
      toast.error("Could not access camera/microphone");
      get().resetCallState();
    }
  },

  handleIncomingCall: (data) => {
    const { ringtoneAudio } = get();
    ringtoneAudio.loop = true;
    ringtoneAudio.play().catch(e => console.log("Audio play blocked", e));

    set({
      receivingCall: true,
      caller: data,
      callState: "ringing",
      callType: data.callType,
      callEnded: false,
    });
  },

  answerCall: async () => {
    try {
      const { caller, callType, ringtoneAudio } = get();
      ringtoneAudio.pause();
      ringtoneAudio.currentTime = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

      const pc = new RTCPeerConnection(iceServers);
      
      set({
        callAccepted: true,
        callState: "connected",
        localStream: stream,
        peerConnection: pc,
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          getSocket()?.emit("iceCandidate", {
            to: caller.from,
            candidate: event.candidate,
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(caller.signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      getSocket()?.emit("answerCall", { signal: answer, to: caller.from });

    } catch (error) {
      toast.error("Could not access camera/microphone");
      get().resetCallState();
    }
  },

  handleCallAccepted: async (signal) => {
    const { peerConnection, dialToneAudio } = get();
    dialToneAudio.pause();
    dialToneAudio.currentTime = 0;

    set({ callAccepted: true, callState: "connected" });
    await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
  },

  handleIceCandidate: async (candidate) => {
    const { peerConnection } = get();
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  },

  rejectCall: () => {
    const { caller } = get();
    getSocket()?.emit("rejectCall", { to: caller.from });
    get().resetCallState();
  },

  handleCallRejected: () => {
    toast.error("Call was declined");
    get().resetCallState();
  },

  endCall: () => {
    const { callState, caller } = get();
    const { authUser } = useAuthStore.getState();
    const { selectedUser } = useChatStore.getState();
    
    // Determine who to notify
    let targetId = null;
    if (callState === "connected" || callState === "calling") {
       targetId = caller ? caller.from : selectedUser?._id;
    }
    
    if (targetId) {
       getSocket()?.emit("endCall", { to: targetId });
    }

    get().resetCallState();
  },

  handleCallEnded: () => {
    toast("Call ended", { icon: "📞" });
    get().resetCallState();
  },

  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = isMuted; // Toggle opposite of current state
      set({ isMuted: !isMuted });
    }
  },

  toggleVideo: () => {
    const { localStream, isVideoOff } = get();
    if (localStream && localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].enabled = isVideoOff;
      set({ isVideoOff: !isVideoOff });
    }
  },

}));

export default useCallStore;
