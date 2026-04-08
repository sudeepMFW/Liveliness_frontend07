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

// const API_BASE_URL = "http://:8000/liveliness";
const API_BASE_URL = "https://enterprise-mediafirewall-ai.millionvisions.ai/liveliness";

const USERS = [
  { username: "admin", password: "admin123" },
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
      onLogin(user);
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
const ResultCard = ({ result, multiResults, onReset, customError }) => {
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
          {passed ? "VERIFICATION PASSED" : (customError || "VERIFICATION FAILED")}
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
      {!passed && onReset && (
        <button
          onClick={onReset}
          style={{
            marginTop: "0.25rem",
            padding: "0.4rem 1.25rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#ef4444",
            color: "white",
            fontWeight: 700,
            fontSize: "0.8rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          ↺ Try Again
        </button>
      )}
    </div>
  );
};

const WebhookNotification = () => (
  <div
    style={{
      marginTop: "1rem",
      padding: "1.5rem",
      borderRadius: "1rem",
      background: "rgba(124, 58, 237, 0.15)",
      border: "1px solid rgba(124, 58, 237, 0.4)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      animation: "fadeIn 0.4s ease-out",
      textAlign: "center"
    }}
  >
    <div style={{ color: "#a78bfa", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <RefreshCw size={40} className="spin-slow" />
      <span style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.1em", color: "white" }}>
        WEBHOOK RESPONSE
      </span>
    </div>
    <div style={{ fontSize: "0.85rem", color: "#a78bfa", fontWeight: 600 }}>
      Processing request asynchronously...
    </div>
    <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", background: "#7c3aed", animation: "progress 5s linear forwards" }} />
    </div>
  </div>
);

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

function MainApp({ onLogout, userId }) {
  const [activeTab, setActiveTab] = useState("url");
  const [selectedSteps, setSelectedSteps] = useState(["smile"]); // Array for multi-step
  const [stepUrls, setStepUrls] = useState({ smile: "" }); // Store discrete URLs per step
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [multiResults, setMultiResults] = useState([]); // Results for multi-step
  const [requestJson, setRequestJson] = useState(null);
  const [responseJson, setResponseJson] = useState(null);
  const [challengeRequestJson, setChallengeRequestJson] = useState(null);
  const [challengeResponseJson, setChallengeResponseJson] = useState(null);
  const [quality, setQuality] = useState({
    proximity: "Optimal",
    blur: "Sharp",
    lighting: "Good",
  });
  const [voiceChallenge, setVoiceChallenge] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [mainTab, setMainTab] = useState("liveliness"); // "liveliness" or "aigenerated"
  const [livelinessRequestId, setLivelinessRequestId] = useState(null);
  const [isFaceAligned, setIsFaceAligned] = useState(false);
  const [showFaceWarning, setShowFaceWarning] = useState(false);
  const [isWebhookWaiting, setIsWebhookWaiting] = useState(false);
  const [customError, setCustomError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [webhookResponseJson, setWebhookResponseJson] = useState(null);
  const [faceAlignmentToast, setFaceAlignmentToast] = useState(false);

  const resetWorkbench = () => {
    setRequestJson(null);
    setResponseJson(null);
    setChallengeRequestJson(null);
    setChallengeResponseJson(null);
  };

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

  const handleVerifyUrl = async (overrides = {}) => {
    // Ensure all selected steps have a URL
    if (selectedSteps.some((step) => !stepUrls[step])) {
      alert("Please provide a video URL for all selected steps.");
      return;
    }
    setLoading(true);
    setResult(null);
    setMultiResults([]);

    const method = mainTab === "aigenerated" ? "verify-voice" : "verify-url-multi";

    // Construct the new API contract payload
    const payload =
      mainTab === "aigenerated"
        ? {
          userId: userId || "demo_user",
          requestId: livelinessRequestId,
          challengeId: overrides.challengeId || challengeId,
          url: stepUrls[selectedSteps[0]],
        }
        : {
          userId: userId || `usr_${Math.floor(Math.random() * 10000)}`,
          sourceImage: "",
          referenceUrls: [],
          liveliness: selectedSteps.map((step, index) => ({
            stepId: index + 1,
            step: step,
            videoClip: stepUrls[step],
          })),
        };

    if (mainTab === "aigenerated" && !payload.challengeId) {
      alert("Please fetch a voice challenge first.");
      setLoading(false);
      return;
    }

    if (mainTab === "aigenerated" && !payload.requestId) {
      alert("Missing Request ID. Please complete Liveliness step first.");
      setLoading(false);
      return;
    }

    // If it's a multi-verify call but we only have 1 step, it still works fine per api.py
    setRequestJson(payload);

    try {
      let resp;
      if (mainTab === "aigenerated") {
        // backend verify-voice expects Form for POST
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            formData.append(k, v);
          }
        });
        resp = await axios.post(`${API_BASE_URL}/${method}`, formData);
      } else {
        resp = await axios.post(`${API_BASE_URL}/${method}`, payload);
      }

      const { data } = resp;
      setResponseJson(data);

      const rid = data.requestId || data.request_id;
      if (mainTab === "liveliness" && rid) {
        setLivelinessRequestId(rid);
      }

      // Map response to UI state
      if (mainTab === "aigenerated") {
        setMultiResults([]);
        setIsWebhookWaiting(true);
        await new Promise(r => setTimeout(r, 5000));
        setIsWebhookWaiting(false);

        // Fetch actual result
        try {
          const finalResp = await axios.get(`${API_BASE_URL}/result`, {
            params: {
              userId: payload.userId,
              requestId: rid
            }
          });
          setWebhookResponseJson(finalResp.data);

          const passed = finalResp.data.processStatus?.AIGenerated && finalResp.data.processStatus?.Liveliness;
          setResult(passed ? "passed" : "failed");
          setNotification({
            type: passed ? "passed" : "failed",
            message: passed ? "AI Voice Verification Successful" : "AI Voice Verification Failed",
            timestamp: new Date().toLocaleTimeString()
          });
        } catch (fetchErr) {
          console.error("Failed to fetch final result:", fetchErr);
          // fallback to initial response if GET fails
          const passed = data.AIGenerated ? "passed" : "failed";
          setResult(passed);
        }
        setTimeout(() => setNotification(null), 5000);
      } else {
        setMultiResults(data.liveliness || []);
        setResult(data.processStatus?.Liveliness ? "passed" : "failed");
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail;
      if (errMsg === "Invalid or expired challengeId") {
        setCustomError("Challenge Id got expired");
      } else {
        setCustomError(null);
      }
      setResponseJson(err.response?.data || { error: "Unknown error" });
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFileMulti = async (recordings = [], overrides = {}) => {
    setLoading(true);
    setResult(null);

    const isAIGen = mainTab === "aigenerated";
    const endpoint = isAIGen ? "verify-voice" : "verify-file-multi";

    if (isAIGen && !(overrides.challengeId || challengeId)) {
      alert("Please fetch a voice challenge first.");
      setLoading(false);
      return;
    }
    if (isAIGen && !livelinessRequestId) {
      alert("Missing Request ID. Please complete Liveliness step first.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId || "demo_user");

    if (isAIGen) {
      formData.append("requestId", livelinessRequestId);
      formData.append("challengeId", overrides.challengeId || challengeId);
      // verify-voice expects 'file' for the recording
      const fileObj = new File([recordings[0].blob], `voice_recording.webm`, {
        type: "video/webm",
      });
      formData.append("file", fileObj);
    } else {
      const mapping = recordings.map((r, i) => {
        const fileObj = new File([r.blob], `step_${i + 1}.webm`, {
          type: "video/webm",
        });
        formData.append("files", fileObj);
        return { order: i + 1, step: r.step, challenge: r.challenge };
      });
      formData.append("mapping", JSON.stringify(mapping));
    }

    setRequestJson({
      source: "Multi-Step Recorder",
      userId: userId || "demo_user",
      ...(isAIGen
        ? { requestId: livelinessRequestId, challengeId: overrides.challengeId || challengeId }
        : { liveliness: selectedSteps, mapping: recordings.map((r, i) => ({ order: i + 1, step: r.step })) }),
    });

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/${endpoint}`,
        formData,
      );
      setResponseJson(data);

      const rid = data.requestId || data.request_id;
      if (mainTab === "liveliness" && rid) {
        setLivelinessRequestId(rid);
      }

      if (isAIGen) {
        setMultiResults([]);
        setIsWebhookWaiting(true);
        await new Promise(r => setTimeout(r, 5000));
        setIsWebhookWaiting(false);

        // Fetch actual result from /result endpoint
        try {
          const finalResp = await axios.get(`${API_BASE_URL}/result`, {
            params: { userId: userId || "demo_user", requestId: livelinessRequestId }
          });
          setWebhookResponseJson(finalResp.data);
          const passed = finalResp.data.processStatus?.AIGenerated && finalResp.data.processStatus?.Liveliness;
          setResult(passed ? "passed" : "failed");
          setNotification({
            type: passed ? "passed" : "failed",
            message: passed ? "AI Voice Verification Successful" : "AI Voice Verification Failed",
            timestamp: new Date().toLocaleTimeString()
          });
        } catch (fetchErr) {
          console.error("Failed to fetch final result:", fetchErr);
          const passed = data.AIGenerated ? "passed" : "failed";
          setResult(passed);
        }
        setTimeout(() => setNotification(null), 5000);
      } else {
        setMultiResults(data.liveliness || []);
        setResult(data.processStatus?.Liveliness ? "passed" : "failed");
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail;
      if (errMsg === "Invalid or expired challengeId") {
        setCustomError("Challenge Id got expired");
      } else {
        setCustomError(null);
      }
      setResponseJson(err.response?.data || { error: "Unknown error" });
      setResult("error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFile = async (targetFile = file, overrides = {}) => {
    const finalFile = targetFile || file;
    if (!finalFile) return;
    setLoading(true);
    setResult(null);
    setMultiResults([]);

    const isAIGen = mainTab === "aigenerated";
    const endpoint = isAIGen ? "verify-voice" : "verify-file-multi";

    if (isAIGen && !(overrides.challengeId || challengeId)) {
      alert("Please fetch a voice challenge first.");
      setLoading(false);
      return;
    }
    if (isAIGen && !livelinessRequestId) {
      alert("Missing Request ID. Please complete Liveliness step first.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId || "demo_user");

    if (isAIGen) {
      formData.append("requestId", livelinessRequestId);
      formData.append("challengeId", overrides.challengeId || challengeId);
      formData.append("file", finalFile);
    } else {
      formData.append("files", finalFile);
      formData.append(
        "mapping",
        JSON.stringify([{ order: 1, step: selectedSteps[0] }]),
      );
    }

    setRequestJson({
      source: targetFile ? "Live Recorder" : "File Upload",
      userId: userId || "demo_user",
      ...(isAIGen
        ? { requestId: livelinessRequestId, challengeId: overrides.challengeId || challengeId }
        : { step: selectedSteps[0], filename: finalFile.name }),
    });

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/${endpoint}`,
        formData,
      );
      setResponseJson(data);

      const rid = data.requestId || data.request_id;
      if (mainTab === "liveliness" && rid) {
        setLivelinessRequestId(rid);
      }

      if (isAIGen) {
        setMultiResults([]);
        setIsWebhookWaiting(true);
        await new Promise(r => setTimeout(r, 5000));
        setIsWebhookWaiting(false);

        // Fetch actual result from /result endpoint
        try {
          const finalResp = await axios.get(`${API_BASE_URL}/result`, {
            params: { userId: userId || "demo_user", requestId: livelinessRequestId }
          });
          setWebhookResponseJson(finalResp.data);
          const passed = finalResp.data.processStatus?.AIGenerated && finalResp.data.processStatus?.Liveliness;
          setResult(passed ? "passed" : "failed");
          setNotification({
            type: passed ? "passed" : "failed",
            message: passed ? "AI Voice Verification Successful" : "AI Voice Verification Failed",
            timestamp: new Date().toLocaleTimeString()
          });
        } catch (fetchErr) {
          console.error("Failed to fetch final result:", fetchErr);
          const passed = data.AIGenerated ? "passed" : "failed";
          setResult(passed);
        }
        setTimeout(() => setNotification(null), 5000);
      } else {
        setMultiResults(data.liveliness || []);
        setResult(data.processStatus?.Liveliness ? "passed" : "failed");
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail;
      if (errMsg === "Invalid or expired challengeId") {
        setCustomError("Challenge Id got expired");
      } else {
        setCustomError(null);
      }
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

  const fetchVoiceChallenge = async () => {
    if (!livelinessRequestId) {
      alert("Please complete the Liveliness step first to get a Request ID.");
      return;
    }
    setLoading(true);
    const params = {
      requestId: livelinessRequestId,
      userId: userId || "demo_user"
    };
    setChallengeRequestJson({
      endpoint: `${API_BASE_URL}/challenge`,
      method: "GET",
      params: params
    });
    try {
      const res = await axios.get(`${API_BASE_URL}/challenge`, {
        params: params
      });
      setChallengeResponseJson(res.data);
      setChallengeId(res.data.challengeId);
      setVoiceChallenge(res.data.challenge);
      return res.data;
    } catch (e) {
      console.error("Failed to fetch voice challenge", e);
      setChallengeResponseJson(e.response?.data || { error: "Failed to fetch challenge" });
      alert("Failed to fetch voice challenge. Please ensure the Liveliness step was successful.");
    } finally {
      setLoading(false);
    }
  };

  const startChainRecording = async () => {
    setResult(null);
    setMultiResults([]);
    setResponseJson(null);
    setWebhookResponseJson(null);
    setCustomError(null);
    setIsRecording(true);
    const recordings = [];
    let lastFetchedChallengeId = challengeId;

    for (let i = 0; i < selectedSteps.length; i++) {
      // Check face alignment before starting any recording in AIGenerated tab
      if (mainTab === "aigenerated" && !isFaceAligned) {
        setFaceAlignmentToast(true);
        setTimeout(() => setFaceAlignmentToast(false), 4000);
        setIsRecording(false);
        setCurrentRecordingStepIndex(-1);
        return;
      }

      setCurrentRecordingStepIndex(i);
      const step = selectedSteps[i];

      let challenge = null;
      if (step === "voice_liveness") {
        if (mainTab === "aigenerated" && challengeId) {
          // Reuse existing
          challenge = voiceChallenge;
          lastFetchedChallengeId = challengeId;
        } else {
          const chalData = await fetchVoiceChallenge();
          if (!chalData) {
            setIsRecording(false);
            setCurrentRecordingStepIndex(-1);
            return;
          }
          lastFetchedChallengeId = chalData.challengeId;
          challenge = chalData.challenge;
        }
      }

      // Transition / Prep Phase
      setIsPrep(true);
      await new Promise((r) => setTimeout(r, 1500));
      setIsPrep(false);

      const blob = await recordStep(step);
      if (!blob) {
        // Recording abandoned due to misalignment
        setIsRecording(false);
        setCurrentRecordingStepIndex(-1);
        return;
      }
      recordings.push({ step, blob, challenge });
    }

    setIsRecording(false);
    setCurrentRecordingStepIndex(-1);
    handleVerifyFileMulti(recordings, { challengeId: lastFetchedChallengeId });
  };

  const recordStep = (step) => {
    return new Promise((resolve) => {
      const chunks = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      let wasMisaligned = false;

      mediaRecorder.onstop = () => {
        if (wasMisaligned) resolve(null);
        else resolve(new Blob(chunks, { type: "video/webm" }));
      };

      mediaRecorder.start();
      const duration = step === "voice_liveness" ? 5 : 3;
      setCountdown(duration);

      const interval = setInterval(() => {
        // Alignment check during recording for AIGenerated
        if (mainTab === "aigenerated" && !isFaceAligned) {
          wasMisaligned = true;
          clearInterval(interval);
          mediaRecorder.stop();
          return;
        }

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

          const aligned = distStr === "Perfect" && isCentered;
          setIsFaceAligned(aligned);

          if (isRecording && !aligned) {
            setShowFaceWarning(true);
          } else {
            setShowFaceWarning(false);
          }

          setQuality({
            proximity: distStr,
            blur: isCentered ? "Sharp" : "Not Centered",
            lighting: "Good",
          });
        } else {
          setIsFaceAligned(false);
          if (isRecording) setShowFaceWarning(true);
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
      {/* Horizontal Tabs at Top */}
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "0.5rem",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "1.25rem",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <button
          onClick={() => {
            setMainTab("liveliness");
            setSelectedSteps(["smile"]);
            setResult(null);
            setMultiResults([]);
            resetWorkbench();
          }}
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "1rem",
            border: "none",
            background:
              mainTab === "liveliness"
                ? "linear-gradient(135deg, var(--primary), #4338ca)"
                : "transparent",
            color: mainTab === "liveliness" ? "white" : "rgba(255,255,255,0.5)",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            boxShadow:
              mainTab === "liveliness"
                ? "0 10px 20px -5px rgba(99, 102, 241, 0.4)"
                : "none",
          }}
        >
          <CheckCircle2 size={24} />
          LIVELINESS (SYNC)
        </button>
        <button
          onClick={() => {
            setMainTab("aigenerated");
            setSelectedSteps(["voice_liveness"]);
            setResult(null);
            setMultiResults([]);
            resetWorkbench();
          }}
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "1rem",
            border: "none",
            background:
              mainTab === "aigenerated"
                ? "linear-gradient(135deg, #7c3aed, #4c1d95)"
                : "transparent",
            color: mainTab === "aigenerated" ? "white" : "rgba(255,255,255,0.5)",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            boxShadow:
              mainTab === "aigenerated"
                ? "0 10px 20px -5px rgba(124, 58, 237, 0.4)"
                : "none",
          }}
        >
          <RefreshCw size={24} />
          AIGENERATED (ASYNC)
        </button>
      </div>

      {/* Flow Header Component */}
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          marginBottom: "2rem",
          padding: "1.5rem 2rem",
          background: "linear-gradient(90deg, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.1))",
          borderRadius: "1rem",
          borderLeft: `4px solid ${mainTab === "liveliness" ? "var(--primary)" : "#7c3aed"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", marginBottom: "0.25rem" }}>
            {mainTab === "liveliness" ? "Standard Liveliness And Voice Verification" : "AI-Generated Content Detection"}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>
            {mainTab === "liveliness"
              ? "Synchronous flow for real-time human identity confirmation."
              : "Asynchronous evaluation for deepfake and synthetic media detection."}
          </p>
        </div>
        <div style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          background: "rgba(255,255,255,0.05)",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: mainTab === "liveliness" ? "var(--primary)" : "#a78bfa",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          {mainTab === "liveliness" ? "⚡ Sync Flow" : "🕒 Async Flow"}
        </div>
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
                  {mainTab === "liveliness" ? "Select Liveliness Actions" : "Voice Liveliness Verification"}
                </label>
                {mainTab === "liveliness" && (
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
                )}
              </div>

              {mainTab === "liveliness" ? (
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
              ) : (
                <div
                  style={{
                    padding: "1.5rem",
                    background: "rgba(124, 58, 237, 0.1)",
                    borderRadius: "1rem",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
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
                        fontSize: "0.8rem",
                      }}
                    >
                      <RefreshCw size={14} className="spin-slow" />
                      PREMIUM AI PROTECTION ENABLED
                    </label>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        background: "#7c3aed",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontWeight: 900,
                      }}
                    >
                      STEP 2
                    </div>
                  </div>

                  {livelinessRequestId ? (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#34d399",
                        background: "rgba(52, 211, 153, 0.1)",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(52, 211, 153, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <CheckCircle2 size={14} />
                      Linked to Request ID: {livelinessRequestId}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#f87171",
                        background: "rgba(248, 113, 113, 0.1)",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid rgba(248, 113, 113, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Info size={14} />
                      Warning: No Liveliness Request ID found. Complete Step 1 first.
                    </div>
                  )}

                  <div
                    style={{
                      padding: "1rem",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "0.75rem",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <RefreshCw size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "1rem", color: "white" }}>
                          AIGen Voice Liveness
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>
                          Challenge-response voice verification
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={fetchVoiceChallenge}
                      disabled={loading || !livelinessRequestId}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #7c3aed",
                        background: "rgba(124, 58, 237, 0.1)",
                        color: "#a78bfa",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(124, 58, 237, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(124, 58, 237, 0.1)";
                      }}
                    >
                      {loading ? "Fetching..." : "Fetch Challenge"}
                    </button>
                  </div>

                  {voiceChallenge && (
                    <div
                      style={{
                        padding: "1rem",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "0.75rem",
                        border: "1px dashed rgba(124, 58, 237, 0.4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                          VOICE CHALLENGE:
                        </span>
                        <span style={{ fontSize: "1.25rem", color: "white", fontWeight: 900, letterSpacing: "0.1em" }}>
                          {voiceChallenge}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                          CHALLENGE ID:
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#a78bfa", fontFamily: "monospace" }}>
                          {challengeId}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  {isWebhookWaiting && <WebhookNotification />}
                  {webhookResponseJson && mainTab === "aigenerated" && !isWebhookWaiting && (
                    <div className="json-panel-container" style={{ marginTop: "1rem" }}>
                      <div className="json-panel-title">
                        <RefreshCw size={12} style={{ marginRight: "0.5rem" }} />
                        Webhook Response
                      </div>
                      <div className="json-panel" style={{ flex: 1, maxHeight: "260px", overflowY: "auto" }}>
                        <pre style={{ margin: 0 }}>{JSON.stringify(webhookResponseJson, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                  {result && !isWebhookWaiting && (
                    <ResultCard
                      result={result}
                      multiResults={multiResults}
                      customError={customError}
                      onReset={() => {
                        setResult(null);
                        setMultiResults([]);
                        setResponseJson(null);
                        setWebhookResponseJson(null);
                        setCustomError(null);
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
                  {isWebhookWaiting && <WebhookNotification />}
                  {webhookResponseJson && mainTab === "aigenerated" && !isWebhookWaiting && (
                    <div className="json-panel-container" style={{ marginTop: "1rem" }}>
                      <div className="json-panel-title">
                        <RefreshCw size={12} style={{ marginRight: "0.5rem" }} />
                        Webhook Response
                      </div>
                      <div className="json-panel" style={{ flex: 1, maxHeight: "260px", overflowY: "auto" }}>
                        <pre style={{ margin: 0 }}>{JSON.stringify(webhookResponseJson, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                  {result && !isWebhookWaiting && (
                    <ResultCard
                      result={result}
                      multiResults={multiResults}
                      customError={customError}
                      onReset={() => {
                        setResult(null);
                        setMultiResults([]);
                        setResponseJson(null);
                        setFile(null);
                        setWebhookResponseJson(null);
                        setCustomError(null);
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
                          className={`face-guide-outline ${isFaceAligned ? "active" : ""}`}
                        />

                        {/* Alignment Warnings */}
                        {mainTab === "aigenerated" && !isFaceAligned && (
                          <div style={{
                            position: "absolute",
                            top: "10%",
                            background: "rgba(239, 68, 68, 0.9)",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                            border: "2px solid #ef4444",
                            boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
                            zIndex: 100,
                            animation: "shake 0.5s ease-in-out"
                          }}>
                            {isRecording ? "⚠️ OFF SCREEN DETECTED!" : "⚠️ POSITION YOUR FACE WITHIN THE CIRCLE"}
                          </div>
                        )}

                        <div className="face-instruction">
                          {isRecording
                            ? `STEP ${currentRecordingStepIndex + 1}/${selectedSteps.length}: PERFORM ${selectedSteps[currentRecordingStepIndex].replaceAll("_", " ").toUpperCase()}`
                            : `Queue: ${selectedSteps.join(" → ").replaceAll("_", " ").toUpperCase()}`}
                        </div>

                        {/* Retry Button Overly if recording fails due to alignment */}
                        {!isRecording && showFaceWarning && (
                          <button
                            className="primary-btn"
                            onClick={startChainRecording}
                            style={{
                              position: "absolute",
                              zIndex: 101,
                              background: "#ef4444",
                              boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)"
                            }}
                          >
                            <RefreshCw size={18} /> Retry Alignment
                          </button>
                        )}
                      </div>
                    )}

                    {isWebhookWaiting && (
                      <div className="result-overlay passed" style={{ zIndex: 110 }}>
                        <WebhookNotification />
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
                            top: "1rem",
                            right: "1rem",
                            background: "rgba(0,0,0,0.8)",
                            padding: "0.75rem 1.25rem",
                            borderRadius: "0.75rem",
                            border: "1px solid var(--primary)",
                            textAlign: "right",
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
                      <div className={`result-overlay ${result === "error" ? "failed" : result}`}>
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
                            : (customError || "VERIFICATION FAILED")}
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
                            setWebhookResponseJson(null);
                            setCustomError(null);
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

                  {webhookResponseJson && mainTab === "aigenerated" && !isWebhookWaiting && (
                    <div className="json-panel-container" style={{ marginTop: "1rem" }}>
                      <div className="json-panel-title">
                        <RefreshCw size={12} style={{ marginRight: "0.5rem" }} />
                        Webhook Response
                      </div>
                      <div className="json-panel" style={{ flex: 1, maxHeight: "260px", overflowY: "auto" }}>
                        <pre style={{ margin: 0 }}>{JSON.stringify(webhookResponseJson, null, 2)}</pre>
                      </div>
                    </div>
                  )}

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

            {mainTab === "aigenerated" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
                {/* Challenge Section */}
                {(challengeRequestJson || challengeResponseJson) && (
                  <div className="json-group" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.7rem", color: "#a78bfa", fontWeight: 900, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "4px", height: "12px", background: "#7c3aed" }} />
                      PHASE 1: CHALLENGE GENERATION
                    </div>
                    {challengeRequestJson && (
                      <div className="json-panel-container">
                        <div className="json-panel-title">
                          <Terminal size={12} style={{ marginRight: "0.5rem" }} />
                          Challenge Request
                        </div>
                        <div className="json-panel" style={{ minHeight: "100px" }}>
                          <pre>
                            <span className="res-key">{challengeRequestJson.method}</span> <span className="res-string">{challengeRequestJson.endpoint}</span>
                            {"\n\n"}
                            {formatJson(challengeRequestJson.params)}
                          </pre>
                        </div>
                      </div>
                    )}
                    {challengeResponseJson && (
                      <div className="json-panel-container">
                        <div className="json-panel-title">
                          <CheckCircle2 size={12} style={{ marginRight: "0.5rem" }} />
                          Challenge Response
                        </div>
                        <div className="json-panel" style={{ minHeight: "100px" }}>
                          <pre>{formatJson(challengeResponseJson)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Verification Section */}
                {(requestJson || responseJson) && (
                  <div className="json-group" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <div style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 900, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "4px", height: "12px", background: "#10b981" }} />
                      PHASE 2: VOICE VERIFICATION
                    </div>
                    {requestJson && (
                      <div className="json-panel-container">
                        <div className="json-panel-title">
                          <Terminal size={12} style={{ marginRight: "0.5rem" }} />
                          Verification Payload
                        </div>
                        <div className="json-panel" style={{ minHeight: "150px" }}>
                          <pre>
                            <span className="res-key">POST</span> <span className="res-string">{API_BASE_URL}/verify-voice</span>
                            {"\n\n"}
                            {formatJson(requestJson)}
                          </pre>
                        </div>
                      </div>
                    )}
                    {responseJson && (
                      <div className="json-panel-container">
                        <div className="json-panel-title">
                          <RefreshCw size={12} style={{ marginRight: "0.5rem" }} />
                          Verification Results
                        </div>
                        <div className="json-panel" style={{ flex: 1, minHeight: "200px" }}>
                          <pre className={result === "passed" ? "res-success" : result === "failed" ? "res-error" : ""}>
                            {formatJson(responseJson)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!challengeRequestJson && !requestJson && (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyItems: "center", opacity: 0.3, textAlign: "center", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
                    <Terminal size={48} />
                    <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>AWAITING API CALLS</div>
                    <div style={{ fontSize: "0.7rem" }}>Request and response telemetry will appear here</div>
                  </div>
                )}
              </div>
            ) : (
              // Standard Liveliness Workbench
              <>
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
              </>
            )}
          </section>
        </div>
      </div >

      {/* Async Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "var(--bg-card)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${notification.type === "passed" ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: "1rem",
          padding: "1.25rem",
          width: "320px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
          zIndex: 1000,
          animation: "slideInRight 0.4s ease-out",
          display: "flex",
          gap: "1rem"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: notification.type === "passed" ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: notification.type === "passed" ? "#34d399" : "#ef4444"
          }}>
            {notification.type === "passed" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              ASYNC COMPLETION · {notification.timestamp}
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>
              {notification.message}
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", height: "fit-content" }}
          >
            ✕
          </button>
        </div>
      )}

      {faceAlignmentToast && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(239, 68, 68, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(248,113,113,0.5)",
          borderRadius: "0.75rem",
          padding: "1rem 1.5rem",
          zIndex: 1001,
          animation: "slideInRight 0.4s ease-out",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          boxShadow: "0 10px 25px -5px rgba(239,68,68,0.4)",
          color: "white",
          fontWeight: 700,
          fontSize: "0.9rem",
          whiteSpace: "nowrap",
        }}>
          ⚠️ Face not aligned correctly. Please center your face in the guide.
        </div>
      )}
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return (
      <LoginForm
        onLogin={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  return (
    <MainApp
      userId={currentUser.username}
      onLogout={() => setCurrentUser(null)}
    />
  );
}

export default App;
