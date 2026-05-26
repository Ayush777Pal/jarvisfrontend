import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/jarvisService";
import "./Chat.css";

const JarvisChat = () => {
  const [mode, setMode] = useState("idle");
  // const [message, setMessage] = useState(""); when switching b/w chat
  const inputRef = useRef(null);

  useEffect(() => {
    if (mode === "chat" && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [mode]);

  // const handleSend = async () => {
  //   const text = message.trim();
  //   if (!text) return;

  //   setMessage("");
  //   setMode("speaking");

  //   try {
  //     const reply = await sendMessage(text);
  //     speak(reply);
  //   } catch {
  //     speak("I apologize, sir. There appears to be a connectivity issue.");
  //   }
  // };

  const startListening = () => {
    if (mode !== "idle") return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setMode("listening"); // FIX: was missing

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("USER:", transcript);
      setMode("thinking");
      try {
        const aiReply = await sendMessage(transcript);
        setMode("speaking"); // FIX: was missing before speak()
        speak(aiReply);
      } catch (error) {
        speak("I apologize sir, Something went wrong.");
      }
    };

    recognition.onerror = () => {
      setMode("idle");
    };

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

  const isSpeaking = mode === "speaking";
  const isChatOpen = false; // FIX: was undefined; chat removed but kept for reference
  const isListening = mode === "listening";
  const isThinking = mode === "thinking";

  return (
    <div className="app">
      {/* HUD */}
      <div className="hud-corner tl"></div>
      <div className="hud-corner tr"></div>
      <div className="hud-corner bl"></div>
      <div className="hud-corner br"></div>

      <span className="hud-text top-left">SYS // v4.1.0</span>
      <span className="hud-text top-right">ONLINE</span>
      <span className="hud-text bottom-left">ARC REACTOR</span>
      <span className="hud-text bottom-right">{mode.toUpperCase()}</span>

      {/* Scan */}
      <div className="scan-line"></div>

      {/* Ball */}
      <div
        className="ball-container"
        onClick={startListening}
        // onClick={() => mode === "idle" && setMode("chat")}
      >
        <OrbitRing size={180} duration={4} />
        <OrbitRing size={210} duration={7} reverse dim />
        <OrbitRing size={240} duration={11} nodot dim2 />

        {/* Listening sonar rings */}
        {isListening && (
          <>
            <div className="sonar-ring sonar-ring-1" />
            <div className="sonar-ring sonar-ring-2" />
            <div className="sonar-ring sonar-ring-3" />
          </>
        )}

        <div
          className={`ball ${isSpeaking ? "ball-speaking" : ""} ${isListening ? "ball-listening" : ""}`}
          style={{
            cursor: mode === "idle" ? "pointer" : "default",
          }}
        >
          <div className="ball-inner">
            <div
              className={`ball-core ${isSpeaking ? "ball-core-speaking" : ""}`}
            ></div>
          </div>
        </div>

        {isSpeaking && (
          <div className="wave-bars">
            {[0, 0.1, 0.05, 0.15, 0.08, 0.2, 0.03].map((delay, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${delay}s` }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div
        className="status-text"
        style={{
          opacity: isChatOpen ? 0 : 1,
        }}
      >
        {mode === "idle"
          ? "CLICK CORE TO ACTIVATE"
          : mode === "listening"
          ? "LISTENING..."
          : mode === "thinking"
          ? "PROCESSING..."
          : "RESPONDING..."}
      </div>

      {/* Chat Panel */}
      {/* <div
        className="chat-panel"
        style={{
          opacity: isChatOpen ? 1 : 0,
          pointerEvents: isChatOpen ? "all" : "none",
        }}
      >
        <div className="chat-header">
          <span className="chat-title">
            J.A.R.V.I.S. — INTERFACE
          </span>

          <button
            className="close-btn"
            onClick={() => setMode("idle")}
          >
            ✕
          </button>
        </div>

        <div className="input-row">
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
            placeholder="Enter command..."
          />

          <button className="send-btn" onClick={handleSend}>
            TRANSMIT
          </button>
        </div>
      </div> */}
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
      ></div>
    )}
  </div>
);

export default JarvisChat;