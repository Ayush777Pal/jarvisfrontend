import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/jarvisService";
import "./Chat.css";
import Camera from "./Camera";

const JarvisChat = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [mode, setMode] = useState("idle");
  const inputRef = useRef(null);

  useEffect(() => {
    if (mode === "chat" && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [mode]);

  const startListening = () => {
    if (mode !== "idle") return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setMode("listening");

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const handled = await handleCommand(transcript);
      if (handled) return;

      setMode("thinking");
      try {
        const aiReply = await sendMessage(transcript);
        setMode("speaking");
        speak(aiReply);
      } catch {
        speak("I apologize sir, Something went wrong.");
      }
    };

    recognition.onerror = () => setMode("idle");
    recognition.start();
  };

  const speak = (text) => {
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);

    const trySpeak = () => {
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("David") ||
          v.name.includes("Daniel") ||
          v.name.includes("Alex")
      );
      if (preferred) utt.voice = preferred;
      utt.pitch = 0.75;
      utt.rate = 0.88;
      utt.volume = 1;
      utt.onend = () => setMode("idle");
      speechSynthesis.speak(utt);
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = trySpeak;
    } else {
      trySpeak();
    }
  };

  const handleCommand = async (text) => {
    const command = text.toLowerCase();
    if (
      command.includes("take selfie") ||
      command.includes("take a selfie") ||
      command.includes("open camera")
    ) {
      setShowCamera(true);
      speak("Opening camera Sir");
      return true;
    }
    return false;
  };

  const isSpeaking = mode === "speaking";
  const isListening = mode === "listening";

  return (
    <div className="app">
      <div className="hud-corner tl"></div>
      <div className="hud-corner tr"></div>
      <div className="hud-corner bl"></div>
      <div className="hud-corner br"></div>

      <span className="hud-text top-left">SYS // v4.1.0</span>
      <span className="hud-text top-right">ONLINE</span>
      <span className="hud-text bottom-left">ARC REACTOR</span>
      <span className="hud-text bottom-right">{mode.toUpperCase()}</span>

      <div className="scan-line"></div>

      <div className="ball-container" onClick={startListening}>
        <OrbitRing size={180} duration={4} />
        <OrbitRing size={210} duration={7} reverse dim />
        <OrbitRing size={240} duration={11} nodot dim2 />

        {isListening && (
          <>
            <div className="sonar-ring sonar-ring-1" />
            <div className="sonar-ring sonar-ring-2" />
            <div className="sonar-ring sonar-ring-3" />
          </>
        )}

        <div
          className={`ball ${isSpeaking ? "ball-speaking" : ""} ${isListening ? "ball-listening" : ""}`}
          style={{ cursor: mode === "idle" ? "pointer" : "default" }}
        >
          <div className="ball-inner">
            <div className={`ball-core ${isSpeaking ? "ball-core-speaking" : ""}`}></div>
          </div>
        </div>

        {isSpeaking && (
          <div className="wave-bars">
            {[0, 0.1, 0.05, 0.15, 0.08, 0.2, 0.03].map((delay, i) => (
              <div key={i} className="wave-bar" style={{ animationDelay: `${delay}s` }} />
            ))}
          </div>
        )}
      </div>

      {/* Camera opens as full overlay, onClose returns here */}
      {showCamera && (
        <Camera onClose={() => setShowCamera(false)} />
      )}

      <div className="status-text">
        {mode === "idle"
          ? "CLICK CORE TO ACTIVATE"
          : mode === "listening"
          ? "LISTENING..."
          : mode === "thinking"
          ? "PROCESSING..."
          : "RESPONDING..."}
      </div>
    </div>
  );
};

const OrbitRing = ({ size, duration, reverse, dim, dim2, nodot }) => (
  <div
    className={`orbit-ring ${reverse ? "reverse" : ""}`}
    style={{
      width: size,
      height: size,
      border: `0.5px solid rgba(0,200,255,${dim2 ? 0.07 : dim ? 0.12 : 0.2})`,
      animationDuration: `${duration}s`,
    }}
  >
    {!nodot && (
      <div
        className="orbit-dot"
        style={{
          background: dim ? "rgba(0,200,255,0.5)" : "#00c8ff",
          boxShadow: dim ? "none" : "0 0 8px #00c8ff",
        }}
      />
    )}
  </div>
);

export default JarvisChat;