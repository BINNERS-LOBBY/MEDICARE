import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff,
  MessageSquare, Monitor, MoreVertical, ArrowLeft
} from "lucide-react";

export default function VideoCallPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const handleEnd = () => {
    navigate(user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
  };

  return (
    <div className="flex h-screen flex-col bg-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={handleEnd} className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-primary-foreground/70">Connected · 00:12:34</span>
        </div>
        <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Video area */}
      <div className="relative flex flex-1 items-center justify-center p-4">
        {/* Main video (remote) */}
        <div className="flex h-full w-full max-w-4xl items-center justify-center rounded-2xl bg-foreground/80 border border-primary-foreground/10">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full gradient-medical text-3xl font-bold text-primary-foreground">
              {user?.role === "patient" ? "JW" : "SJ"}
            </div>
            <p className="text-lg font-medium text-primary-foreground">
              {user?.role === "patient" ? "Dr. James Wilson" : "Sarah Johnson"}
            </p>
            <p className="text-sm text-primary-foreground/60">
              {user?.role === "patient" ? "Cardiology" : "Patient"}
            </p>
          </div>
        </div>

        {/* Self view (PiP) */}
        <div className="absolute bottom-8 right-8 flex h-36 w-48 items-center justify-center rounded-xl border border-primary-foreground/10 bg-foreground/60 shadow-lg sm:h-44 sm:w-60">
          {videoOn ? (
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary-foreground">
                {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
              </div>
              <p className="text-xs text-primary-foreground/70">You</p>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="mx-auto mb-1 h-6 w-6 text-primary-foreground/40" />
              <p className="text-xs text-primary-foreground/40">Camera off</p>
            </div>
          )}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="absolute bottom-8 left-8 top-8 flex w-72 flex-col rounded-xl border border-primary-foreground/10 bg-foreground/90 p-4 shadow-lg">
            <h3 className="mb-3 text-sm font-semibold text-primary-foreground">Chat</h3>
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div className="rounded-lg bg-primary/20 px-3 py-2 text-sm text-primary-foreground">
                Hello! How are you feeling today?
              </div>
              <div className="ml-auto w-fit rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                Much better, thank you!
              </div>
            </div>
            <input
              placeholder="Type a message..."
              className="mt-3 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 px-4 py-5 sm:gap-4">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
            micOn ? "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" : "bg-destructive text-primary-foreground"
          }`}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setVideoOn(!videoOn)}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
            videoOn ? "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" : "bg-destructive text-primary-foreground"
          }`}
        >
          {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
          <Monitor className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowChat(!showChat)}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
            showChat ? "bg-primary text-primary-foreground" : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
        </button>
        <button
          onClick={handleEnd}
          className="flex h-12 w-14 items-center justify-center rounded-full bg-destructive text-primary-foreground hover:bg-destructive/90"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
