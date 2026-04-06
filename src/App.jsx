import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Camera,
  Link as LinkIcon,
  Upload,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Terminal,
  Play,
  Square,
  RefreshCw,
  Info,
  LogOut,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000/liveliness";
// const API_BASE_URL =
// "https://enterprise-mediafirewall-ai.millionvisions.ai/liveliness";

const USERS = [
  { username: "admin", password: "password123" },
  { username: "user1", password: "123" },
  { username: "test123@gmail.com", password: "test@123" },
];

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (user) {
      onLogin(true);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="app-container"
      style={{
        justifyContent: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="glass-card"
        style={{ maxWidth: "400px", width: "100%", padding: "2.5rem" }}
      >
        <div className="header" style={{ marginBottom: "2rem" }}>
          <h1>Login</h1>
          <p>Sign in to access Enterprise Portal</p>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && (
            <div
              style={{
                color: "#f87171",
                fontSize: "0.875rem",
                textAlign: "center",
                background: "rgba(239, 68, 68, 0.1)",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            className="primary-btn"
            style={{ marginTop: "0.5rem" }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Reusable Result Card for URL & File tabs ---
const ResultCard = ({ result, multiResults, onReset }) => {
  const passed = result === "passed";
  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1.25rem",
        borderRadius: "1rem",
        background: passed ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
        border: `1px solid ${passed ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        animation: "fadeIn 0.4s ease-out",
      }}
    >
      <div
        style={{
          color: passed ? "#34d399" : "#f87171",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
        <span
          style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.05em" }}
        >
          {passed ? "VERIFICATION PASSED" : "VERIFICATION FAILED"}
        </span>
      </div>
      {multiResults?.length > 0 && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {multiResults.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.35rem 0.75rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "0.5rem",
                fontSize: "0.8rem",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textTransform: "capitalize",
                }}
              >
                {r.step.replaceAll("_", " ")}
              </span>
              <span
                style={{
                  fontWeight: 800,
                  color: r.status ? "#34d399" : "#f87171",
                }}
              >
                {r.status ? "PASSED" : "FAILED"}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* <button
        onClick={onReset}
        style={{
          marginTop: '0.25rem',
          padding: '0.4rem 1.25rem',
          borderRadius: '0.5rem',
          border: 'none',
          background: passed ? 'var(--accent)' : '#ef4444',
          color: 'white',
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: 'pointer',
          letterSpacing: '0.05em'
        }}
      >
        {passed ? '✓ Continue' : '↺ Try Again'}
      </button> */}
    </div>
  );
};

// --- Guidance Animation Component ---
const GuidanceAnimation = ({ step }) => {
  if (!step) return null;

  const renderFace = (className, mouthPath = "M 30 70 Q 50 70 70 70") => (
    <div className={`guidance-anim-container ${className}`}>
      <svg viewBox="0 0 100 100" className="guidance-face-svg">
        {/* Head Outline */}
        <path d="M 50 10 C 25 10 10 30 10 55 C 10 85 30 95 50 95 C 70 95 90 85 90 55 C 90 30 75 10 50 10" />

        {/* Eyes */}
        <g className="eyes">
          <ellipse
            cx="35"
            cy="40"
            rx="5"
            ry="5"
            className="eye"
            fill="currentColor"
            opacity="0.4"
          />
          <ellipse
            cx="65"
            cy="40"
            rx="5"
            ry="5"
            className="eye"
            fill="currentColor"
            opacity="0.4"
          />
        </g>

        {/* Mouth */}
        <path d={mouthPath} className="mouth" />
      </svg>
    </div>
  );

  switch (step) {
    case "smile":
      return renderFace("anim-smile");
    case "blink":
      return renderFace("anim-blink");
    case "head_turn_left":
      return renderFace("anim-turn-left");
    case "head_turn_right":
      return renderFace("anim-turn-right");
    case "head_turn_down":
      return renderFace("anim-turn-down");
    case "head_tilt_left":
      return (
        <div className="guidance-anim-container" style={{ animation: "none" }}>
          <div
            style={{
              transform: "rotate(-20deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <svg viewBox="0 0 100 100" className="guidance-face-svg">
              <path d="M 50 10 C 25 10 10 30 10 55 C 10 85 30 95 50 95 C 70 95 90 85 90 55 C 90 30 75 10 50 10" />
              <ellipse
                cx="35"
                cy="40"
                rx="5"
                ry="5"
                fill="currentColor"
                opacity="0.4"
              />
              <ellipse
                cx="65"
                cy="40"
                rx="5"
                ry="5"
                fill="currentColor"
                opacity="0.4"
              />
              <path d="M 30 70 Q 50 70 70 70" />
            </svg>
          </div>
        </div>
      );
    case "head_tilt_right":
      return (
        <div className="guidance-anim-container" style={{ animation: "none" }}>
          <div
            style={{
              transform: "rotate(20deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <svg viewBox="0 0 100 100" className="guidance-face-svg">
              <path d="M 50 10 C 25 10 10 30 10 55 C 10 85 30 95 50 95 C 70 95 90 85 90 55 C 90 30 75 10 50 10" />
              <ellipse
                cx="35"
                cy="40"
                rx="5"
                ry="5"
                fill="currentColor"
                opacity="0.4"
              />
              <ellipse
                cx="65"
                cy="40"
                rx="5"
                ry="5"
                fill="currentColor"
                opacity="0.4"
              />
              <path d="M 30 70 Q 50 70 70 70" />
            </svg>
          </div>
        </div>
      );
    case "mouth_open":
      return renderFace("", "M 35 75 Q 50 95 65 75");
    case "voice_liveness":
      return (
        <div className="guidance-anim-container anim-speak">
          <div className="mic-icon-container">
            <svg viewBox="0 0 24 24" className="mic-svg" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
            <div className="voice-waves">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

function MainApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState("url");
  const [selectedSteps, setSelectedSteps] = useState(["smile"]); // Array for multi-step
  const [stepUrls, setStepUrls] = useState({ smile: "" }); // Store discrete URLs per step
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [multiResults, setMultiResults] = useState([]); // Results for multi-step
  const [requestJson, setRequestJson] = useState(null);
  const [responseJson, setResponseJson] = useState(null);
  const [quality, setQuality] = useState({
    proximity: "Optimal",
    blur: "Sharp",
    lighting: "Good",
  });
  const [voiceChallenge, setVoiceChallenge] = useState("");

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPrep, setIsPrep] = useState(false); // New: Transition state
  const [currentRecordingStepIndex, setCurrentRecordingStepIndex] =
    useState(-1);
  const [recordedBlobs, setRecordedBlobs] = useState([]); // Array of {step, blob}
  const [countdown, setCountdown] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const steps = [
    { id: "smile", label: "Smile", recommended: true },
    { id: "blink", label: "Blink", recommended: true },
    { id: "head_turn_left", label: "Turn Left" },
    { id: "head_turn_right", label: "Turn Right" },
    { id: "head_turn_down", label: "Turn Down" },
    { id: "head_tilt_left", label: "Tilt Left" },
    { id: "head_tilt_right", label: "Tilt Right" },
    { id: "mouth_open", label: "Mouth Open" },
    { id: "voice_liveness", label: "AIGen Voice Liveness", recommended: true },
  ];

  // Helper to format JSON for display
  const formatJson = (obj) => JSON.stringify(obj, null, 2);

  const handleVerifyUrl = async () => {
    // Ensure all selected steps have a URL
    if (selectedSteps.some((step) => !stepUrls[step])) {
      alert("Please provide a video URL for all selected steps.");
      return;
    }
    setLoading(true);
    setResult(null);
    setMultiResults([]);

    // Construct the new API contract payload
    const payload = {
      customId: `usr_${Math.floor(Math.random() * 10000)}`, // Mock user ID for demo
      sourceImage: "", // Optional FaceMatch field
      referenceUrls: [],
      liveliness: selectedSteps.map((step, index) => ({
        stepId: index + 1,
        step: step,
        videoClip: stepUrls[step],
      })),
    };

    setRequestJson(payload);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/verify-url-multi`,
        payload,
      );
      setResponseJson(data);
      // Map the new response structure to our UI state
      setMultiResults(data.liveliness || []);
      setResult(data.processStatus?.Liveliness ? "passed" : "failed");
    } catch (err) {
      setResponseJson(err.response?.data || { error: "Unknown error" });
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFileMulti = async (recordings = []) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    const mapping = recordings.map((r, i) => {
      const file = new File([r.blob], `step_${i + 1}.webm`, {
        type: "video/webm",
      });
      formData.append("files", file);
      return { order: i + 1, step: r.step, challenge: r.challenge };
    });

    formData.append("mapping", JSON.stringify(mapping));
    setRequestJson({
      source: "Multi-Step Recorder",
      liveliness: selectedSteps,
      mapping,
    });

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/verify-file-multi`,
        formData,
      );
      setResponseJson(data);
      // Map the new response structure to our UI state
      setMultiResults(data.liveliness || []);
      setResult(data.processStatus?.Liveliness ? "passed" : "failed");
    } catch (err) {
      setResponseJson(err.response?.data || { error: "Unknown error" });
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFile = async (targetFile = file) => {
    const finalFile = targetFile || file;
    if (!finalFile) return;
    setLoading(true);
    setResult(null);
    setMultiResults([]);

    setRequestJson({
      source: targetFile ? "Live Recorder" : "File Upload",
      step: selectedSteps[0],
      filename: finalFile.name,
      type: "multipart/form-data",
    });

    const formData = new FormData();
    formData.append("file", finalFile);
    formData.append("step", selectedSteps[0]);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/verify-file`,
        formData,
      );
      setResponseJson(data);
      // Map the new single response structure natively (array of 1 step)
      setMultiResults(data.liveliness || []);
      setResult(data.processStatus?.Liveliness ? "passed" : "failed");
    } catch (err) {
      setResponseJson(err.response?.data || { error: "Unknown error" });
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  // --- LIVE RECORDING LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const startChainRecording = async () => {
    setResult(null);
    setMultiResults([]);
    setResponseJson(null);
    setIsRecording(true);
    const recordings = [];

    for (let i = 0; i < selectedSteps.length; i++) {
      setCurrentRecordingStepIndex(i);
      const step = selectedSteps[i];

      let challenge = null;
      if (step === "voice_liveness") {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/challenge`,
          );
          challenge = res.data.challenge;
          setVoiceChallenge(challenge);
        } catch (e) {
          console.error("Failed to fetch voice challenge", e);
          alert("Failed to fetch voice challenge. Please check if the backend is running.");
          setIsRecording(false);
          setCurrentRecordingStepIndex(-1);
          return;
        }
      }

      // Transition / Prep Phase
      setIsPrep(true);
      await new Promise((r) => setTimeout(r, 1500));
      setIsPrep(false);

      const blob = await recordStep(step);
      recordings.push({ step, blob, challenge });
    }

    setIsRecording(false);
    setCurrentRecordingStepIndex(-1);
    handleVerifyFileMulti(recordings);
  };

  const recordStep = (step) => {
    return new Promise((resolve) => {
      const chunks = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        resolve(new Blob(chunks, { type: "video/webm" }));
      };

      mediaRecorder.start();
      const duration = step === "voice_liveness" ? 5 : 3;
      setCountdown(duration);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            mediaRecorder.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const analyzeQuality = () => {
      if (!videoRef.current || activeTab !== "live") return;

      const faceMesh = new window.FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        if (
          results.multiFaceLandmarks &&
          results.multiFaceLandmarks.length > 0
        ) {
          const landmarks = results.multiFaceLandmarks[0];

          // Distance check (using outer eye corners)
          const p1 = landmarks[33];
          const p2 = landmarks[263];
          const dist = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
          );

          let distStr = "Perfect";
          if (dist < 0.12) distStr = "Too Far";
          else if (dist > 0.32) distStr = "Too Near";

          // Simple center check
          const nose = landmarks[1];
          const isCentered =
            nose.x > 0.35 && nose.x < 0.65 && nose.y > 0.3 && nose.y < 0.7;

          setQuality({
            proximity: distStr,
            blur: isCentered ? "Sharp" : "Not Centered",
            lighting: "Good",
          });
        } else {
          setQuality({
            proximity: "No Face",
            blur: "Analyzing",
            lighting: "Analyzing",
          });
        }
      });

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      camera.start();
      return { camera, faceMesh };
    };

    if (activeTab === "live") {
      startCamera();
      const { camera, faceMesh } = analyzeQuality();
      return () => {
        stopCamera();
        camera?.stop();
        faceMesh?.close();
      };
    } else {
      stopCamera();
    }
  }, [activeTab, isRecording]);

  return (
    <div className="app-container">
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={onLogout}
          className="tab-btn"
          style={{
            flex: "none",
            width: "auto",
            padding: "0.5rem 1.5rem",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
      <div className="main-layout">
        {/* Verification Section */}
        <div className="left-panel">
          <main className="glass-card">
            {/* Step Selector */}
            <div className="input-group" style={{ marginBottom: "2.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <label className="input-label" style={{ marginBottom: 0 }}>
                  Select verification steps (Multi-select)
                </label>
                <button
                  onClick={() => setSelectedSteps(["smile"])}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(239,68,68,0.7)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: "2px 4px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    opacity: 0.8,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 1)}
                  onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
                >
                  ✕ Clear
                </button>
              </div>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                {steps
                  .filter((s) => s.id !== "voice_liveness")
                  .map((s) => (
                    <button
                      key={s.id}
                      className={`tab-btn ${selectedSteps.includes(s.id) ? "active" : ""}`}
                      onClick={() => {
                        setSelectedSteps((prev) => {
                          const newSteps = prev.includes(s.id)
                            ? prev.filter((id) => id !== s.id)
                            : [...prev, s.id];

                          // Maintain URL inputs state matching the selected steps
                          if (!newSteps.includes(s.id)) {
                            const newUrls = { ...stepUrls };
                            delete newUrls[s.id];
                            setStepUrls(newUrls);
                          }

                          return newSteps.length === 0 ? ["smile"] : newSteps;
                        });
                        setResult(null);
                        setMultiResults([]);
                        setResponseJson(null);
                      }}
                      style={{
                        position: "relative",
                        flex: "none",
                        background: selectedSteps.includes(s.id)
                          ? "var(--primary)"
                          : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {s.recommended && (
                        <div className="recommended-tag">REC.</div>
                      )}
                      {s.label}
                    </button>
                  ))}
              </div>

              {/* Special Highlight for Voice Liveness */}
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "rgba(124, 58, 237, 0.1)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(124, 58, 237, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  maxWidth: "350px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label
                    className="input-label"
                    style={{
                      marginBottom: 0,
                      color: "#a78bfa",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <RefreshCw size={14} className="spin-slow" />
                    PREMIUM AI PROTECTION
                  </label>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      background: "var(--primary)",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 900,
                    }}
                  >
                    BETA
                  </div>
                </div>
                <button
                  className={`tab-btn ${selectedSteps.includes("voice_liveness") ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSteps((prev) => {
                      const newSteps = prev.includes("voice_liveness")
                        ? prev.filter((id) => id !== "voice_liveness")
                        : [...prev, "voice_liveness"];
                      return newSteps.length === 0 ? ["smile"] : newSteps;
                    });
                    setResult(null);
                    setMultiResults([]);
                    setResponseJson(null);
                  }}
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "1rem",
                    background: selectedSteps.includes("voice_liveness")
                      ? "linear-gradient(135deg, var(--primary), #4c1d95)"
                      : "rgba(255,255,255,0.05)",
                    border: selectedSteps.includes("voice_liveness")
                      ? "1px solid var(--primary)"
                      : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: selectedSteps.includes("voice_liveness")
                      ? "0 0 20px rgba(124, 58, 237, 0.3)"
                      : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <RefreshCw size={16} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                        AIGen Voice Liveness
                      </div>
                      {/* <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                        Speech-to-text challenge-response verification
                      </div> */}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "2px solid currentColor",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedSteps.includes("voice_liveness") && (
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "currentColor",
                        }}
                      />
                    )}
                  </div>
                </button>
              </div>

              {/* Upcoming Features */}
              <div className="advanced-section">
                <label
                  className="input-label"
                  style={{ fontSize: "0.7rem", opacity: 0.6 }}
                >
                  ADVANCED FEATURES (COMING SOON)
                </label>
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}
                >
                  <div className="feature-pill-disabled" title="Coming Soon">
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        border: "1.5px solid rgba(255,255,255,0.2)",
                      }}
                    />
                    AI Deepfake Detection <span>ENTERPRISE</span>
                  </div>
                  <div
                    className="feature-pill-disabled"
                    title="Enterprise Exclusive"
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        border: "1.5px solid rgba(255,255,255,0.2)",
                      }}
                    />
                    Face Match <span>ENTERPRISE</span>
                  </div>
                </div>
              </div>
            </div>

            <nav className="tabs">
              <button
                className={`tab-btn ${activeTab === "url" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("url");
                  setResult(null);
                  setMultiResults([]);
                  setResponseJson(null);
                }}
              >
                <LinkIcon size={18} /> URL Verify
              </button>
              <button
                className={`tab-btn ${activeTab === "file" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("file");
                  setResult(null);
                  setMultiResults([]);
                  setResponseJson(null);
                }}
              >
                <Upload size={18} /> File Upload
              </button>
              <button
                className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("live");
                  setResult(null);
                  setMultiResults([]);
                  setResponseJson(null);
                }}
              >
                <Camera size={18} /> Live Demo
              </button>
            </nav>

            <section className="content-section">
              {activeTab === "url" && (
                <div className="input-group">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {selectedSteps.map((step, index) => (
                      <div key={step}>
                        <label
                          className="input-label"
                          style={{ marginRight: "0.5rem" }}
                        >
                          Video URL for:{" "}
                          {step.replaceAll("_", " ").toUpperCase()}
                        </label>
                        <input
                          placeholder={`https://cdn.com/video_${step}.mp4`}
                          value={stepUrls[step] || ""}
                          onChange={(e) =>
                            setStepUrls((prev) => ({
                              ...prev,
                              [step]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="primary-btn"
                    onClick={handleVerifyUrl}
                    disabled={
                      loading || selectedSteps.some((step) => !stepUrls[step])
                    }
                    style={{ marginTop: "0.5rem" }}
                  >
                    {loading ? (
                      <div className="loader" />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                    {loading
                      ? "Processing..."
                      : `Verify ${selectedSteps.length} Step(s)`}
                  </button>
                  {result && (
                    <ResultCard
                      result={result}
                      multiResults={multiResults}
                      onReset={() => {
                        setResult(null);
                        setMultiResults([]);
                        setResponseJson(null);
                      }}
                    />
                  )}
                </div>
              )}

              {activeTab === "file" && (
                <div className="input-group">
                  <label className="input-label">Upload Video</label>
                  <div
                    className={`file-dropzone ${file ? "active" : ""}`}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    <Upload
                      size={40}
                      style={{
                        marginBottom: "1.25rem",
                        color: "var(--primary)",
                        opacity: 0.8,
                      }}
                    />
                    <p style={{ fontWeight: 600 }}>
                      {file ? file.name : "Choose a video file or drag here"}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        marginTop: "0.5rem",
                      }}
                    >
                      MP4, WEBM formats supported
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      hidden
                      onChange={(e) => setFile(e.target.files[0])}
                      accept="video/*"
                    />
                  </div>
                  <button
                    className="primary-btn"
                    onClick={() => handleVerifyFile()}
                    disabled={loading || !file}
                    style={{ marginTop: "0.5rem" }}
                  >
                    {loading ? (
                      <div className="loader" />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                    {loading ? "Analyzing..." : `Analyze: ${selectedSteps[0]}`}
                  </button>
                  {result && (
                    <ResultCard
                      result={result}
                      multiResults={multiResults}
                      onReset={() => {
                        setResult(null);
                        setMultiResults([]);
                        setResponseJson(null);
                        setFile(null);
                      }}
                    />
                  )}
                </div>
              )}

              {activeTab === "live" && (
                <div className="input-group">
                  <div className="live-preview-container">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="live-preview"
                    />

                    {/* Step Transition Overlay */}
                    {isPrep && (
                      <div className="prep-overlay">
                        <div className="prep-badge">
                          {currentRecordingStepIndex === 0
                            ? "STARTING"
                            : `STEP ${currentRecordingStepIndex} COMPLETE`}
                        </div>
                        <div className="prep-title">
                          Next:{" "}
                          {selectedSteps[currentRecordingStepIndex]
                            .replaceAll("_", " ")
                            .toUpperCase()}
                        </div>
                        <div className="prep-subtitle">Get ready in...</div>
                      </div>
                    )}

                    {/* Face Guide Overlay */}
                    {!result && !isPrep && (
                      <div className="face-guide-overlay">
                        {/* Ghost Guidance Animation */}
                        {isRecording && (
                          <GuidanceAnimation
                            step={selectedSteps[currentRecordingStepIndex]}
                          />
                        )}

                        <div className="face-guide-mask" />
                        <div
                          className={`face-guide-outline ${isRecording ? "active" : ""}`}
                        />
                        <div className="face-instruction">
                          {isRecording
                            ? `STEP ${currentRecordingStepIndex + 1}/${selectedSteps.length}: PERFORM ${selectedSteps[currentRecordingStepIndex].replaceAll("_", " ").toUpperCase()}`
                            : `Queue: ${selectedSteps.join(" → ").replaceAll("_", " ").toUpperCase()}`}
                        </div>
                      </div>
                    )}

                    {isRecording && (
                      <div className="recording-badge">
                        <div className="recording-dot" />
                        REC:{" "}
                        {selectedSteps[currentRecordingStepIndex]
                          .replaceAll("_", " ")
                          .toUpperCase()}{" "}
                        · {countdown}s
                      </div>
                    )}

                    {isRecording &&
                      selectedSteps[currentRecordingStepIndex] ===
                      "voice_liveness" && (
                        <div
                          className="voice-challenge-overlay"
                          style={{
                            position: "absolute",
                            top: "20%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(0,0,0,0.8)",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "0.75rem",
                            border: "1px solid var(--primary)",
                            textAlign: "center",
                            zIndex: 100,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                              marginBottom: "0.25rem",
                              fontWeight: 800,
                            }}
                          >
                            READ THIS NUMBER IN REVERSE:
                          </div>
                          <div
                            style={{
                              fontSize: "2.5rem",
                              fontWeight: 900,
                              color: "white",
                              letterSpacing: "0.2em",
                              lineHeight: 1,
                            }}
                          >
                            {voiceChallenge}
                          </div>
                          <div
                            style={{
                              marginTop: "0.4rem",
                              fontSize: "0.85rem",
                              color: "var(--accent)",
                              fontWeight: 700,
                            }}
                          >
                            (Speak: {voiceChallenge.split("").reverse().join(" ")}
                            )
                          </div>
                        </div>
                      )}

                    {result && (
                      <div className={`result-overlay ${result}`}>
                        {/* Celebration Particles for Success */}
                        {result === "passed" &&
                          Array.from({ length: 15 }).map((_, i) => (
                            <div
                              key={i}
                              className="confetti-particle"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: "-20px",
                                backgroundColor: [
                                  "#34d399",
                                  "#6366f1",
                                  "#fbbf24",
                                  "#f472b6",
                                ][i % 4],
                                "--tx": `${(Math.random() - 0.5) * 300}px`,
                                animationDelay: `${Math.random() * 0.8}s`,
                              }}
                            />
                          ))}

                        <div
                          className={`result-icon ${result === "passed" ? "result-badge-pass" : "result-badge-fail"}`}
                        >
                          {result === "passed" ? (
                            <CheckCircle2 size={48} />
                          ) : (
                            <XCircle size={48} />
                          )}
                        </div>

                        <h2
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 900,
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {result === "passed"
                            ? "VERIFICATION SUCCESS"
                            : "VERIFICATION FAILED"}
                        </h2>

                        <div
                          style={{
                            marginTop: "1rem",
                            width: "100%",
                            maxWidth: "300px",
                          }}
                        >
                          {(multiResults?.length || 0) > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                              }}
                            >
                              {multiResults.map((r, i) => (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "0.4rem 0.8rem",
                                    background: "rgba(255,255,255,0.05)",
                                    borderRadius: "0.5rem",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  <span
                                    style={{ color: "rgba(255,255,255,0.6)" }}
                                  >
                                    {r.step.replaceAll("_", " ")}
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: 800,
                                      color: r.status ? "#34d399" : "#f87171",
                                    }}
                                  >
                                    {r.status ? "PASSED" : "FAILED"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              style={{
                                color: "white",
                                textAlign: "center",
                                fontSize: "0.9rem",
                              }}
                            ></p>
                          )}
                        </div>

                        <button
                          className="primary-btn"
                          onClick={() => {
                            setResult(null);
                            setMultiResults([]);
                            setResponseJson(null);
                          }}
                          style={{
                            marginTop: "1.5rem",
                            padding: "0.625rem 2rem",
                            fontSize: "0.9rem",
                            background:
                              result === "passed" ? "var(--accent)" : "#ef4444",
                          }}
                        >
                          {result === "passed" ? "Continue" : "Try Again"}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="primary-btn"
                    onClick={startChainRecording}
                    disabled={isRecording || loading}
                    style={{ marginTop: "0.5rem" }}
                  >
                    {loading ? (
                      <div className="loader" />
                    ) : isRecording ? (
                      <Square size={20} />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                    {isRecording
                      ? `Recording Queue...`
                      : `Start Multi-Step Demo (${selectedSteps.length} Actions)`}
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>

        {/* API Workbench Sidebar */}
        <div className="right-panel">
          <section className="workbench">
            {/* Real-time Quality Dashboard */}
            {activeTab === "live" && (
              <div className="quality-indicator-container">
                <div className="quality-title">Liveliness Check</div>

                <div className="quality-row">
                  <span className="quality-label">Distance</span>
                  <div
                    className={`quality-status-badge ${quality.proximity === "Perfect" ? "status-perfect" : "status-warning"}`}
                  >
                    <div className="quality-dot-pulse" />
                    {quality.proximity}
                  </div>
                </div>

                <div className="quality-row">
                  <span className="quality-label">Position</span>
                  <div
                    className={`quality-status-badge ${quality.blur === "Sharp" ? "status-perfect" : "status-warning"}`}
                  >
                    <div className="quality-dot-pulse" />
                    {quality.blur}
                  </div>
                </div>

                <div className="quality-row">
                  <span className="quality-label">Lighting</span>
                  <div
                    className={`quality-status-badge ${quality.lighting === "Good" ? "status-perfect" : "status-warning"}`}
                  >
                    <div className="quality-dot-pulse" />
                    {quality.lighting}
                  </div>
                </div>
              </div>
            )}
            <div className="json-panel-container">
              <div className="json-panel-title">
                <Terminal size={12} style={{ marginRight: "0.5rem" }} />
                Request Payload
              </div>
              <div
                className="json-panel"
                style={{ minHeight: "180px", maxHeight: "250px" }}
              >
                <pre>
                  <span className="res-key">POST</span>{" "}
                  <span className="res-string">
                    {API_BASE_URL}/verify-{activeTab === "url" ? "url" : "file"}
                    {selectedSteps.length > 1 ? "-multi" : ""}
                  </span>
                  {"\n\n"}
                  {requestJson
                    ? formatJson(requestJson)
                    : "// No telemetry data"}
                </pre>
              </div>
            </div>
            <div className="json-panel-container">
              <div className="json-panel-title">
                <RefreshCw size={12} style={{ marginRight: "0.5rem" }} />
                Server Response
              </div>
              <div
                className="json-panel"
                style={{ flex: 1, minHeight: "300px" }}
              >
                <pre
                  className={
                    result === "passed"
                      ? "res-success"
                      : result === "failed"
                        ? "res-error"
                        : ""
                  }
                >
                  {responseJson
                    ? formatJson(responseJson)
                    : "// Monitoring stream..."}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div >
    </div >
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginForm onLogin={setIsLoggedIn} />;
  }

  return <MainApp onLogout={() => setIsLoggedIn(false)} />;
}

export default App;
