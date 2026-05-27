import { useEffect, useRef, useState } from "react";

const Camera = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [scanLine, setScanLine] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera Error:", error);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const handleCapture = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        triggerCapture();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const triggerCapture = () => {
    setScanLine(true);
    setTimeout(() => setScanLine(false), 800);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    setCaptured(image);
    stopCamera();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = captured;
    link.download = `jarvis-selfie-${Date.now()}.png`;
    link.click();
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleRetake = () => {
    setCaptured(null);
    startCamera();
  };

  return (
    <div style={styles.overlay}>
      {/* HUD corners */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <div key={pos} style={{ ...styles.corner, ...styles[pos] }} />
      ))}

      <div style={styles.hudLabel("top-left")}>CAM // UNIT-01</div>
      <div style={styles.hudLabel("top-right")}>BIOMETRIC SCAN</div>
      <div style={styles.hudLabel("bottom-left")}>RESOLUTION: HD</div>
      <div style={styles.hudLabel("bottom-right")}>{captured ? "CAPTURED" : "LIVE FEED"}</div>

      <div style={styles.panel}>
        {/* Title */}
        <div style={styles.title}>
          <span style={styles.titleAccent}>J.A.R.V.I.S.</span>
          <span style={styles.titleSub}>&nbsp;// VISUAL INTERFACE</span>
        </div>

        {/* Viewfinder */}
        <div style={styles.viewfinder}>
          {/* Corner brackets */}
          {["tl", "tr", "bl", "br"].map((c) => (
            <div key={c} style={{ ...styles.bracket, ...styles[`b_${c}`] }} />
          ))}

          {/* Center crosshair */}
          {!captured && (
            <>
              <div style={styles.crossH} />
              <div style={styles.crossV} />
            </>
          )}

          {/* Scan line animation */}
          {scanLine && <div style={styles.scanLine} />}

          {/* Countdown */}
          {countdown !== null && (
            <div style={styles.countdown}>{countdown}</div>
          )}

          {captured ? (
            <img src={captured} alt="Captured" style={styles.preview} />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={styles.video}
            />
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Status bar */}
        <div style={styles.statusBar}>
          <span style={styles.statusDot(captured)} />
          <span style={styles.statusText}>
            {captured ? "IMAGE ACQUIRED — READY TO DOWNLOAD" : "TARGETING..."}
          </span>
        </div>

        {/* Buttons */}
        <div style={styles.btnRow}>
          {!captured ? (
            <>
              <button style={styles.btnSecondary} onClick={onClose}>
                ABORT
              </button>
              <button
                style={styles.btnPrimary}
                onClick={handleCapture}
                disabled={countdown !== null}
              >
                {countdown !== null ? `CAPTURING IN ${countdown}...` : "⬤ CAPTURE"}
              </button>
            </>
          ) : (
            <>
              <button style={styles.btnSecondary} onClick={handleRetake}>
                RETAKE
              </button>
              <button style={styles.btnPrimary} onClick={handleDownload}>
                ↓ DOWNLOAD & EXIT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const C = {
  bg: "#020d14",
  panel: "rgba(0,20,35,0.97)",
  cyan: "#00c8ff",
  cyanDim: "rgba(0,200,255,0.15)",
  cyanGlow: "rgba(0,200,255,0.5)",
  border: "rgba(0,200,255,0.25)",
  text: "#a0e8f8",
  textDim: "rgba(0,200,255,0.45)",
  white: "#e8f8ff",
  danger: "#ff4560",
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Courier New', monospace",
    zIndex: 100,
  },
  panel: {
    width: "min(560px, 92vw)",
    background: C.panel,
    border: `1px solid ${C.border}`,
    boxShadow: `0 0 60px rgba(0,200,255,0.08), inset 0 0 40px rgba(0,200,255,0.03)`,
    padding: "28px 28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    fontSize: 11,
    letterSpacing: "0.2em",
    borderBottom: `1px solid ${C.border}`,
    paddingBottom: 10,
  },
  titleAccent: { color: C.cyan, fontWeight: "bold" },
  titleSub: { color: C.textDim },

  viewfinder: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    background: "#000",
    overflow: "hidden",
    border: `1px solid ${C.border}`,
  },
  video: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  preview: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  // Crosshair
  crossH: {
    position: "absolute", top: "50%", left: "20%", right: "20%",
    height: 1, background: "rgba(0,200,255,0.3)", zIndex: 2, pointerEvents: "none",
  },
  crossV: {
    position: "absolute", left: "50%", top: "20%", bottom: "20%",
    width: 1, background: "rgba(0,200,255,0.3)", zIndex: 2, pointerEvents: "none",
  },

  scanLine: {
    position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
    background: "linear-gradient(to bottom, transparent 0%, rgba(0,200,255,0.35) 50%, transparent 100%)",
    animation: "scanDown 0.7s ease-in-out",
  },

  countdown: {
    position: "absolute", inset: 0, display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 80, fontWeight: "bold", color: C.cyan,
    textShadow: `0 0 40px ${C.cyanGlow}`, zIndex: 10,
    background: "rgba(0,0,0,0.4)",
  },

  // Corner brackets on viewfinder
  bracket: { position: "absolute", width: 16, height: 16, zIndex: 3 },
  b_tl: { top: 8, left: 8, borderTop: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` },
  b_tr: { top: 8, right: 8, borderTop: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` },
  b_bl: { bottom: 8, left: 8, borderBottom: `2px solid ${C.cyan}`, borderLeft: `2px solid ${C.cyan}` },
  b_br: { bottom: 8, right: 8, borderBottom: `2px solid ${C.cyan}`, borderRight: `2px solid ${C.cyan}` },

  statusBar: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 10px", background: "rgba(0,200,255,0.04)",
    border: `1px solid ${C.border}`,
  },
  statusDot: (captured) => ({
    width: 6, height: 6, borderRadius: "50%",
    background: captured ? C.cyan : C.danger,
    boxShadow: captured ? `0 0 8px ${C.cyan}` : `0 0 8px ${C.danger}`,
    flexShrink: 0,
  }),
  statusText: { fontSize: 10, letterSpacing: "0.15em", color: C.textDim },

  btnRow: { display: "flex", gap: 10 },
  btnPrimary: {
    flex: 1, padding: "11px 0", background: C.cyanDim,
    border: `1px solid ${C.cyan}`, color: C.cyan,
    fontFamily: "'Courier New', monospace", fontSize: 11,
    letterSpacing: "0.15em", cursor: "pointer",
    transition: "background 0.2s",
  },
  btnSecondary: {
    flex: "0 0 100px", padding: "11px 0", background: "transparent",
    border: `1px solid ${C.border}`, color: C.textDim,
    fontFamily: "'Courier New', monospace", fontSize: 11,
    letterSpacing: "0.15em", cursor: "pointer",
  },

  // HUD overlays
  corner: {
    position: "fixed", width: 20, height: 20, zIndex: 99,
    border: `1.5px solid rgba(0,200,255,0.3)`,
  },
  tl: { top: 16, left: 16, borderRight: "none", borderBottom: "none" },
  tr: { top: 16, right: 16, borderLeft: "none", borderBottom: "none" },
  bl: { bottom: 16, left: 16, borderRight: "none", borderTop: "none" },
  br: { bottom: 16, right: 16, borderLeft: "none", borderTop: "none" },
  hudLabel: (pos) => ({
    position: "fixed", fontSize: 9, letterSpacing: "0.18em",
    color: "rgba(0,200,255,0.35)", zIndex: 99,
    ...(pos === "top-left" && { top: 20, left: 44 }),
    ...(pos === "top-right" && { top: 20, right: 44 }),
    ...(pos === "bottom-left" && { bottom: 20, left: 44 }),
    ...(pos === "bottom-right" && { bottom: 20, right: 44 }),
  }),
};

export default Camera;