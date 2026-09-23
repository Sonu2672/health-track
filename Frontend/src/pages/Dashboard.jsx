import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  HeartPulse,
  Bell,
  AlertTriangle,
  Droplets,
  Thermometer,
  Footprints,
  Activity,
  Wind,
  Pill,
  FileText,
  ChevronRight,
  Sun,
  TriangleAlert,
  Menu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import Sidebar from "../components/Sidebar";
import "../App.css";

const activityData = [
  15, 22, 17, 31, 24, 38,
  25, 43, 30, 35, 28, 45
];

// ==================================================
// API CONFIG
// ==================================================
const ONLINE_HEALTH_API =
  "https://healthtrackb.onrender.com/api/health/getHealthData";

const ESP32_LOCAL_API =
  "http://192.168.4.1/data";

function Dashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [healthData, setHealthData] = useState([]);
  const [healthd, setHealthd] = useState({
    heartRate: 70,
    spo2: 98,
    temp: 96,
  });

  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Normal");
  const [voiceAlertStopped, setVoiceAlertStopped] = useState(false);
  const voiceIntervalRef = useRef(null);

  // ==================================================
  // 🔊 VOICE ALERT FUNCTION
  // ==================================================
  const speakRiskAlert = (level) => {
    if (!("speechSynthesis" in window)) {
      console.log("❌ Speech synthesis not supported");
      return;
    }

    let message = "";
    if (level === "Critical Risk") {
      message = "Critical health risk detected. Please take immediate action.";
    } else if (level === "High Risk") {
      message = "Warning. High health risk detected. Please check your health condition.";
    } else {
      return;
    }

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (voice) => voice.lang && voice.lang.toLowerCase().startsWith("hi")
    );

    if (hindiVoice) {
      speech.voice = hindiVoice;
    }

    window.speechSynthesis.speak(speech);
  };

  // ==================================================
  // 🔊 START / STOP VOICE ALERT EFFECT
  // ==================================================
  useEffect(() => {
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
      voiceIntervalRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (riskLevel !== "High Risk" && riskLevel !== "Critical Risk") {
      setVoiceAlertStopped(false);
      return;
    }

    if (voiceAlertStopped) return;

    speakRiskAlert(riskLevel);

    voiceIntervalRef.current = setInterval(() => {
      if (
        !voiceAlertStopped &&
        (riskLevel === "High Risk" || riskLevel === "Critical Risk")
      ) {
        speakRiskAlert(riskLevel);
      }
    }, 5000);

    return () => {
      if (voiceIntervalRef.current) {
        clearInterval(voiceIntervalRef.current);
        voiceIntervalRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [riskLevel, voiceAlertStopped]);

  // ==================================================
  // DATA FETCHING & SOCKET EFFECT
  // ==================================================
  useEffect(() => {
    let isMounted = true;

    const fetchOnlineHealthData = async () => {
      const response = await fetch(ONLINE_HEALTH_API, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Online API failed: ${response.status}`);
      return await response.json();
    };

    const fetchESP32LocalData = async () => {
      const response = await fetch(ESP32_LOCAL_API, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`ESP32 local API failed: ${response.status}`);
      return await response.json();
    };

    const applyOnlineData = (data) => {
      if (!isMounted) return;
      if (!data?.hd) {
        setHealthd({ heartRate: 0, spo2: 0, temp: 0 });
        setRiskScore(data?.riskScore ?? 0);
        setRiskLevel(data?.riskLevel ?? "Normal");
        setHealthData(data?.datatimers ?? []);
        return;
      }

      const heartRate = Number(data.hd.heartRate ?? data.hd.rawBPM ?? 0);
      const spo2 = Number(data.hd.spo2 ?? 0);
      const rawTemp = data.hd.temp ?? data.hd.bodyTemperature ?? 0;
      const tempF =
        rawTemp != null && Number(rawTemp) !== 0
          ? (Number(rawTemp) * 1.8 + 32).toFixed(1)
          : 0;

      setHealthd({ heartRate, spo2, temp: tempF });
      setRiskScore(Number(data?.riskScore ?? data?.hd?.riskScore ?? 0));
      setRiskLevel(data?.riskLevel ?? data?.hd?.riskLevel ?? data?.status ?? "Normal");
      setHealthData(Array.isArray(data?.datatimers) ? data.datatimers : []);
    };

    const applyLocalData = (data) => {
      if (!isMounted) return;
      const heartRate = Number(data?.heartRate ?? data?.rawBPM ?? 0);
      const spo2 = Number(data?.spo2 ?? 0);
      const rawTemp = Number(data?.bodyTemperature ?? data?.temperature ?? 0);
      const tempF = rawTemp > 0 ? (rawTemp * 1.8 + 32).toFixed(1) : 0;

      let localRiskLevel = data?.mlStatus ?? data?.status ?? "NORMAL";
      const normalizedStatus = String(localRiskLevel).toUpperCase();

      if (normalizedStatus === "CRITICAL") {
        localRiskLevel = "Critical Risk";
      } else if (
        normalizedStatus === "ABNORMAL" ||
        normalizedStatus === "HIGH" ||
        normalizedStatus === "WARNING"
      ) {
        localRiskLevel = "High Risk";
      } else {
        localRiskLevel = "Normal";
      }

      let confidence = Number(data?.mlConfidence ?? 0);
      if (confidence > 0 && confidence <= 1) confidence *= 100;

      let localRiskScore = 0;
      if (localRiskLevel === "Critical Risk") {
        localRiskScore = Math.max(80, Math.round(confidence));
      } else if (localRiskLevel === "High Risk") {
        localRiskScore = Math.max(60, Math.round(confidence));
      } else {
        localRiskScore = Math.min(30, Math.round(confidence));
      }

      setHealthd({ heartRate, spo2, temp: tempF });
      setRiskLevel(localRiskLevel);
      setRiskScore(localRiskScore);
      setHealthData([{ time: "Now", score: localRiskScore }]);
    };

    const Hdata = async () => {
      try {
        const onlineData = await fetchOnlineHealthData();
        if (onlineData?.hd) {
          applyOnlineData(onlineData);
          return;
        }
        if (onlineData?.data?.hd) {
          applyOnlineData(onlineData.data);
          return;
        }
      } catch (onlineError) {
        try {
          const localData = await fetchESP32LocalData();
          applyLocalData(localData);
        } catch (localError) {
          if (!isMounted) return;
          setHealthd({ heartRate: 0, spo2: 0, temp: 0 });
          setRiskScore(0);
          setRiskLevel("Normal");
          setHealthData([]);
        }
      }
    };

    Hdata();
    const interval = setInterval(Hdata, 3000);

    // Socket.io Setup
    const socket = io("https://healthtrackb.onrender.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("healthData", (data) => {
      const heartRate = Number(data?.heartRate ?? data?.rawBPM ?? 0);
      const spo2 = Number(data?.spo2 ?? 0);
      const rawTemp = Number(data?.temp ?? data?.bodyTemperature ?? 0);
      const tempF = rawTemp > 0 ? (rawTemp * 1.8 + 32).toFixed(1) : 0;

      setHealthd({ heartRate, spo2, temp: tempF });

      if (data?.riskScore !== undefined && data?.riskScore !== null) {
        setRiskScore(Number(data.riskScore));
      }
      if (data?.riskLevel) {
        setRiskLevel(data.riskLevel);
      }

      if (data?.riskScore !== undefined && data?.riskScore !== null) {
        setHealthData((previousData) => {
          const newPoint = {
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            score: Number(data.riskScore),
          };
          return [...previousData.slice(-11), newPoint];
        });
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      socket.disconnect();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isDangerous =
    riskLevel === "High Risk" || riskLevel === "Critical Risk";

  return (
    <div className="dashboard">
      <Sidebar isOpen={menuOpen} />

      <main className="main">
        <header className="header">
          <div className="header-left">
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={28} />
            </button>
            <div>
              <h1>
                Good Morning, Sonu! <span>👋</span>
              </h1>
              <p>Here's your health overview</p>
            </div>
          </div>

          <div className="header-right">
            <div
              onClick={() => navigate("/alerts")}
              className="notification"
            >
              <TriangleAlert size={28} />
            </div>
            <div className="profile-avatar">A</div>
          </div>
        </header>

        <section className="health-cards">
          {/* Health Cards omitted for brevity in snippet view or include standard cards */}
        </section>

        <section className="middle-grid">
          <div
            className={`card risk-card ${
              isDangerous ? "risk-blink" : ""
            }`}
          >
            <div className="risk-meter">
              <div className="gauge">
                <div className="gauge-score">
                  <strong>{riskScore}</strong>
                  <small>/100</small>
                </div>
                <div className="gauge-label">{riskLevel}</div>
              </div>
            </div>

            <div className={`risk-warning ${isDangerous ? "danger-blink" : ""}`}>
              <strong>You are at {riskLevel}.</strong>
              <span>
                {isDangerous
                  ? "Immediate attention recommended!"
                  : "Continue monitoring your health."}
              </span>
            </div>

            {isDangerous && (
              <button
                className="stop-voice-btn"
                onClick={() => {
                  setVoiceAlertStopped(true);
                  if ("speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  if (voiceIntervalRef.current) {
                    clearInterval(voiceIntervalRef.current);
                    voiceIntervalRef.current = null;
                  }
                }}
              >
                🔇 Stop Voice Alert
              </button>
            )}

            <button
              className="risk-link"
              onClick={() => navigate("/risk-analysis")}
            >
              View Risk Analysis <ChevronRight size={14} />
            </button>
          </div>

          <div className="card trend-card">
            <div className="trend-header">
              <h3>Today's Health Trend</h3>
            </div>
            <div className="trend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

// import React from "react";
// import { useState, useEffect, useRef } from "react";
// import "../App.css";
// import Sidebar from "../components/Sidebar";
// import { TriangleAlert, Menu } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// // import React from "react";
// // import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import {
//   HeartPulse,
//   Bell,
//   AlertTriangle,
//   Droplets,
//   Thermometer,
//   Footprints,
//   Activity,
//   Wind,
//   Pill,
//   FileText,
//   ChevronRight,
//   Sun,
// } from "lucide-react";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Tooltip,
//   AreaChart,
//   Area,
// } from "recharts";

// const activityData = [
//   15, 22, 17, 31, 24, 38,
//   25, 43, 30, 35, 28, 45
// ];

// // ==================================================
// // API CONFIG
// // ==================================================

// // ONLINE BACKEND → MongoDB saved ESP32 data
// const ONLINE_HEALTH_API =
//   "https://healthtrackb.onrender.com/api/health/getHealthData";

// // OFFLINE ESP32 → direct local data
// const ESP32_LOCAL_API =
//   "http://192.168.4.1/data";


// function Dashboard() {

//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] =
//     useState(false);

//   const [healthData, setHealthData] =
//     useState([]);

//   const [healthd, setHealthd] =
//     useState({
//       heartRate: 70,
//       spo2: 98,
//       temp: 96,
//     });

//   const [riskScore, setRiskScore] =
//     useState(0);

//   const [riskLevel, setRiskLevel] =
//     useState("Normal");

//   const [name, setName] =
//     useState("");

//   // ==================================================
//   // 🔊 VOICE ALERT STATE
//   // ==================================================

//   const [voiceAlertStopped, setVoiceAlertStopped] =
//     useState(false);

//   const voiceIntervalRef =
//     useRef(null);


//   // ==================================================
//   // 🔊 VOICE ALERT FUNCTION
//   // ==================================================

//   const speakRiskAlert = (level) => {

//     if (!("speechSynthesis" in window)) {

//       console.log(
//         "❌ Speech synthesis not supported"
//       );

//       return;
//     }

//     let message = "";

//     if (level === "Critical Risk") {

//       message =
//         "Critical health risk detected. Please take immediate action.";

//     }
//     else if (level === "High Risk") {

//       message =
//         "Warning. High health risk detected. Please check your health condition.";

//     }
//     else {

//       return;

//     }

//     // Stop previous speech
//     window.speechSynthesis.cancel();

//     const speech =
//       new SpeechSynthesisUtterance(
//         message
//       );

//     // Hindi voice
//     speech.lang = "hi-IN";

//     speech.rate = 0.9;
//     speech.pitch = 1;
//     speech.volume = 1;

//     // Find Hindi voice
//     const voices =
//       window.speechSynthesis.getVoices();

//     const hindiVoice =
//       voices.find(
//         (voice) =>
//           voice.lang &&
//           voice.lang
//             .toLowerCase()
//             .startsWith("hi")
//       );

//     if (hindiVoice) {

//       speech.voice =
//         hindiVoice;

//     }

//     window.speechSynthesis.speak(
//       speech
//     );

//     console.log(
//       "🔊 VOICE ALERT:",
//       message
//     );
//   };


//   // ==================================================
//   // ONESIGNAL
//   // ==================================================

//   // useEffect(() => {

//   //   if (window._oneSignalInitialized)
//   //     return;

//   //   window._oneSignalInitialized = true;

//   //   window.OneSignal =
//   //     window.OneSignal || [];

//   //   window.OneSignal.push(
//   //     async function () {

//   //       try {

//   //         await window.OneSignal.init({

//   //           appId:
//   //             "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",

//   //           allowLocalhostAsSecureOrigin:
//   //             true,

//   //         });

//   //         console.log(
//   //           "OneSignal Initialized Successfully"
//   //         );


//   //         // Notification permission
//   //         await window.OneSignal.Slidedown.promptPush();


//   //         // Player ID
//   //         const playerId =
//   //           window.OneSignal
//   //             ?.User
//   //             ?.PushSubscription
//   //             ?.id;


//   //         if (playerId) {

//   //           console.log(
//   //             "🔥 Player ID Found:",
//   //             playerId
//   //           );


//   //           const response =
//   //             await fetch(
//   //               "https://healthtrackb.onrender.com/api/devicedata/onesignalid",
//   //               {

//   //                 method: "POST",

//   //                 credentials: "include",

//   //                 headers: {

//   //                   "Content-Type":
//   //                     "application/json",

//   //                 },

//   //                 body:
//   //                   JSON.stringify({
//   //                     playerId,
//   //                   }),

//   //               }
//   //             );


//   //           const data =
//   //             await response.json();


//   //           console.log(
//   //             "✅ Backend Save Response:",
//   //             data
//   //           );

//   //         }
//   //         else {

//   //           console.log(
//   //             "⚠️ Player ID not generated yet."
//   //           );

//   //         }

//   //       }
//   //       catch (error) {

//   //         if (
//   //           !error.message?.includes(
//   //             "already initialized"
//   //           )
//   //         ) {

//   //           console.error(
//   //             "Error during OneSignal init:",
//   //             error
//   //           );

//   //         }

//   //       }

//   //     }
//   //   );

//   // }, []);


//   // ==================================================
//   // 🔊 START / STOP VOICE ALERT
//   // ==================================================

//   useEffect(() => {

//     // Clear previous interval
//     if (voiceIntervalRef.current) {

//       clearInterval(
//         voiceIntervalRef.current
//       );

//       voiceIntervalRef.current =
//         null;

//     }

//     // Stop current speech
//     if (
//       "speechSynthesis" in window
//     ) {

//       window.speechSynthesis.cancel();

//     }


//     // ==================================================
//     // ONLY HIGH / CRITICAL
//     // ==================================================

//     if (
//       riskLevel !== "High Risk" &&
//       riskLevel !== "Critical Risk"
//     ) {

//       setVoiceAlertStopped(false);

//       return;

//     }


//     // ==================================================
//     // USER PRESSED STOP
//     // ==================================================

//     if (voiceAlertStopped) {

//       console.log(
//         "🔇 Voice alert stopped by user"
//       );

//       return;

//     }


//     // ==================================================
//     // SPEAK IMMEDIATELY
//     // ==================================================

//     speakRiskAlert(
//       riskLevel
//     );


//     // ==================================================
//     // REPEAT EVERY 5 SECONDS
//     // ==================================================

//     voiceIntervalRef.current =
//       setInterval(() => {

//         if (
//           !voiceAlertStopped &&
//           (
//             riskLevel === "High Risk" ||
//             riskLevel === "Critical Risk"
//           )
//         ) {

//           speakRiskAlert(
//             riskLevel
//           );

//         }

//       }, 5000);


//     // ==================================================
//     // CLEANUP
//     // ==================================================

//     return () => {

//       if (
//         voiceIntervalRef.current
//       ) {

//         clearInterval(
//           voiceIntervalRef.current
//         );

//         voiceIntervalRef.current =
//           null;

//       }

//       if (
//         "speechSynthesis" in window
//       ) {

//         window.speechSynthesis.cancel();

//       }

//     };

//   }, [
//     riskLevel,
//     voiceAlertStopped
//   ]);


//   // ==================================================
//   // LOAD HEALTH DATA
//   // ==================================================

//   useEffect(() => {

//     let isMounted = true;


//     // ==================================================
//     // ONLINE API
//     // ==================================================

//     const fetchOnlineHealthData =
//       async () => {

//         const response =
//           await fetch(
//             ONLINE_HEALTH_API,
//             {

//               method: "GET",

//               credentials: "include",

//               headers: {

//                 "Content-Type":
//                   "application/json",

//               },

//             }
//           );


//         if (!response.ok) {

//           throw new Error(
//             `Online API failed: ${response.status}`
//           );

//         }


//         const data =
//           await response.json();


//         console.log(
//           "🌐 ONLINE HEALTH DATA:",
//           data
//         );


//         return data;

//       };


//     // ==================================================
//     // OFFLINE ESP32 API
//     // ==================================================

//     const fetchESP32LocalData =
//       async () => {

//         const response =
//           await fetch(
//             ESP32_LOCAL_API,
//             {

//               method: "GET",

//               headers: {

//                 "Content-Type":
//                   "application/json",

//               },

//             }
//           );


//         if (!response.ok) {

//           throw new Error(
//             `ESP32 local API failed: ${response.status}`
//           );

//         }


//         const data =
//           await response.json();


//         console.log(
//           "📡 ESP32 LOCAL DATA:",
//           data
//         );


//         return data;

//       };


//     // ==================================================
//     // APPLY ONLINE DATA
//     // ==================================================

//     const applyOnlineData =
//       (data) => {

//         if (!isMounted)
//           return;


//         console.log(
//           "🔥 COMPLETE ONLINE DATA:",
//           data
//         );

//         console.log(
//           "🔥 HD:",
//           data?.hd
//         );

//         console.log(
//           "🔥 HEART RATE:",
//           data?.hd?.heartRate
//         );

//         console.log(
//           "🔥 SPO2:",
//           data?.hd?.spo2
//         );

//         console.log(
//           "🔥 TEMP:",
//           data?.hd?.temp
//         );

//         console.log(
//           "🔥 RISK SCORE:",
//           data?.riskScore
//         );

//         console.log(
//           "🔥 RISK LEVEL:",
//           data?.riskLevel
//         );

//         console.log(
//           "🔥 RECOMMENDATIONS:",
//           data?.recommendations
//         );


//         // ==================================================
//         // NO DEVICE DATA
//         // ==================================================

//         if (!data?.hd) {

//           console.log(
//             "⚠️ Online API connected but no device data available."
//           );


//           setHealthd({

//             heartRate: 0,

//             spo2: 0,

//             temp: 0,

//           });


//           setRiskScore(
//             data?.riskScore ?? 0
//           );


//           setRiskLevel(
//             data?.riskLevel ??
//             "Normal"
//           );


//           setHealthData(
//             data?.datatimers ?? []
//           );


//           return;

//         }


//         // ==================================================
//         // DEVICE DATA
//         // ==================================================

//         const heartRate =
//           Number(
//             data.hd.heartRate ??
//             data.hd.rawBPM ??
//             0
//           );


//         const spo2 =
//           Number(
//             data.hd.spo2 ??
//             0
//           );


//         // Backend temperature
//         // Celsius → Fahrenheit
//         const rawTemp =
//           data.hd.temp ??
//           data.hd.bodyTemperature ??
//           0;


//         const tempF =
//           rawTemp != null &&
//           Number(rawTemp) !== 0
//             ? (
//                 Number(rawTemp) *
//                   1.8 +
//                 32
//               ).toFixed(1)
//             : 0;


//         setHealthd({

//           heartRate:
//             heartRate,

//           spo2:
//             spo2,

//           temp:
//             tempF,

//         });


//         // ==================================================
//         // RISK DATA
//         // ==================================================

//         const newRiskLevel =
//           data?.riskLevel ??
//           data?.hd?.riskLevel ??
//           data?.status ??
//           "Normal";


//         const newRiskScore =
//           Number(
//             data?.riskScore ??
//             data?.hd?.riskScore ??
//             0
//           );


//         setRiskScore(
//           newRiskScore
//         );


//         setRiskLevel(
//           newRiskLevel
//         );


//         // ==================================================
//         // HEALTH TREND
//         // ==================================================

//         setHealthData(
//           Array.isArray(
//             data?.datatimers
//           )
//             ? data.datatimers
//             : []
//         );

//       };


//     // ==================================================
//     // APPLY LOCAL ESP32 DATA
//     // ==================================================

//     const applyLocalData =
//       (data) => {

//         if (!isMounted)
//           return;


//         console.log(
//           "📡 USING ESP32 OFFLINE DATA:",
//           data
//         );


//         // ==================================================
//         // HEART RATE
//         // ==================================================

//         const heartRate =
//           Number(
//             data?.heartRate ??
//             data?.rawBPM ??
//             0
//           );


//         // ==================================================
//         // SPO2
//         // ==================================================

//         const spo2 =
//           Number(
//             data?.spo2 ??
//             0
//           );


//         // ==================================================
//         // TEMPERATURE
//         // ==================================================

//         const rawTemp =
//           Number(
//             data?.bodyTemperature ??
//             data?.temperature ??
//             0
//           );


//         const tempF =
//           rawTemp > 0
//             ? (
//                 rawTemp *
//                   1.8 +
//                 32
//               ).toFixed(1)
//             : 0;


//         // ==================================================
//         // TINYML STATUS
//         // ==================================================

//         let localRiskLevel =
//           data?.mlStatus ??
//           data?.status ??
//           "NORMAL";


//         const normalizedStatus =
//           String(
//             localRiskLevel
//           ).toUpperCase();


//         if (
//           normalizedStatus ===
//           "CRITICAL"
//         ) {

//           localRiskLevel =
//             "Critical Risk";

//         }
//         else if (
//           normalizedStatus ===
//             "ABNORMAL" ||
//           normalizedStatus ===
//             "HIGH" ||
//           normalizedStatus ===
//             "WARNING"
//         ) {

//           localRiskLevel =
//             "High Risk";

//         }
//         else {

//           localRiskLevel =
//             "Normal";

//         }


//         // ==================================================
//         // TINYML CONFIDENCE
//         // ==================================================

//         let confidence =
//           Number(
//             data?.mlConfidence ??
//             0
//           );


//         // If confidence is 0-1
//         // convert to 0-100
//         if (
//           confidence > 0 &&
//           confidence <= 1
//         ) {

//           confidence =
//             confidence * 100;

//         }


//         // ==================================================
//         // LOCAL RISK SCORE
//         // ==================================================

//         let localRiskScore =
//           0;


//         if (
//           localRiskLevel ===
//           "Critical Risk"
//         ) {

//           localRiskScore =
//             Math.max(
//               80,
//               Math.round(confidence)
//             );

//         }
//         else if (
//           localRiskLevel ===
//           "High Risk"
//         ) {

//           localRiskScore =
//             Math.max(
//               60,
//               Math.round(confidence)
//             );

//         }
//         else {

//           localRiskScore =
//             Math.min(
//               30,
//               Math.round(
//                 confidence
//               )
//             );

//         }


//         // ==================================================
//         // SET LOCAL DATA
//         // ==================================================

//         setHealthd({

//           heartRate:
//             heartRate,

//           spo2:
//             spo2,

//           temp:
//             tempF,

//         });


//         setRiskLevel(
//           localRiskLevel
//         );


//         setRiskScore(
//           localRiskScore
//         );


//         // ==================================================
//         // LOCAL TREND
//         // ==================================================

//         setHealthData(
//           [
//             {
//               time: "Now",
//               score:
//                 localRiskScore,
//             }
//           ]
//         );

//       };


//       // =====================================================
// // 🔥 SOCKET.IO LIVE HEALTH DATA
// // =====================================================

// useEffect(() => {

//   console.log(
//     "🔌 Connecting to HealthTrack Socket.IO..."
//   );


//   const socket = io(
//     "https://healthtrackb.onrender.com",
//     {

//       withCredentials: true,

//       transports: [
//         "websocket",
//         "polling",
//       ],

//     }
//   );


//   // ===================================================
//   // CONNECT
//   // ===================================================

//   socket.on(
//     "connect",
//     () => {

//       console.log(
//         "🟢 SOCKET CONNECTED:",
//         socket.id
//       );

//     }
//   );


//   // ===================================================
//   // LIVE HEALTH DATA
//   // ===================================================

//   socket.on(
//     "healthData",
//     (data) => {

//       console.log(
//         "🔥 LIVE HEALTH DATA:",
//         data
//       );


//       // ===============================================
//       // HEART RATE
//       // ===============================================

//       const heartRate =
//         Number(
//           data?.heartRate ??
//           data?.rawBPM ??
//           0
//         );


//       // ===============================================
//       // SPO2
//       // ===============================================

//       const spo2 =
//         Number(
//           data?.spo2 ??
//           0
//         );


//       // ===============================================
//       // BODY TEMPERATURE
//       // Backend = Celsius
//       // Dashboard = Fahrenheit
//       // ===============================================

//       const rawTemp =
//         Number(
//           data?.temp ??
//           data?.bodyTemperature ??
//           0
//         );


//       const tempF =
//         rawTemp > 0
//           ? (
//               rawTemp * 1.8 +
//               32
//             ).toFixed(1)
//           : 0;


//       // ===============================================
//       // UPDATE DASHBOARD HEALTH CARDS
//       // ===============================================

//       setHealthd({

//         heartRate:
//           heartRate,

//         spo2:
//           spo2,

//         temp:
//           tempF,

//       });


//       // ===============================================
//       // RISK SCORE
//       // ===============================================

//       if (
//         data?.riskScore !== undefined &&
//         data?.riskScore !== null
//       ) {

//         setRiskScore(
//           Number(
//             data.riskScore
//           )
//         );

//       }


//       // ===============================================
//       // RISK LEVEL
//       // ===============================================

//       if (
//         data?.riskLevel
//       ) {

//         setRiskLevel(
//           data.riskLevel
//         );

//       }


//       // ===============================================
//       // UPDATE LIVE GRAPH
//       // ===============================================

//       if (
//         data?.riskScore !== undefined &&
//         data?.riskScore !== null
//       ) {

//         setHealthData(
//           (previousData) => {

//             const newPoint = {

//               time:
//                 new Date()
//                   .toLocaleTimeString(
//                     [],
//                     {
//                       hour:
//                         "2-digit",

//                       minute:
//                         "2-digit",
//                     }
//                   ),

//               score:
//                 Number(
//                   data.riskScore
//                 ),

//             };


//             return [

//               ...previousData.slice(-11),

//               newPoint,

//             ];

//           }
//         );

//       }

//     }
//   );


//   // ===================================================
//   // DISCONNECT
//   // ===================================================

//   socket.on(
//     "disconnect",
//     (reason) => {

//       console.log(
//         "🔴 SOCKET DISCONNECTED:",
//         reason
//       );

//     }
//   );


//   // ===================================================
//   // CONNECTION ERROR
//   // ===================================================

//   socket.on(
//     "connect_error",
//     (error) => {

//       console.error(
//         "❌ SOCKET ERROR:",
//         error.message
//       );

//     }
//   );


//   // ===================================================
//   // CLEANUP
//   // ===================================================

//   return () => {

//     console.log(
//       "🧹 Closing Socket.IO..."
//     );

//     socket.disconnect();

//   };

// }, []);


//     // ==================================================
//     // MAIN FETCH
//     // ==================================================

//     const Hdata =
//       async () => {

//         // ==================================================
//         // 1️⃣ TRY ONLINE BACKEND FIRST
//         // ==================================================

//         try {

//           console.log(
//             "🌐 Trying online health API..."
//           );


//           const onlineData =
//             await fetchOnlineHealthData();


//           // If online response has device data
//           if (
//             onlineData?.hd
//           ) {

//             applyOnlineData(
//               onlineData
//             );

//             console.log(
//               "✅ ONLINE DATA USED"
//             );

//             return;

//           }


//           // If backend response has nested data
//           if (
//             onlineData?.data?.hd
//           ) {

//             applyOnlineData(
//               onlineData.data
//             );

//             console.log(
//               "✅ ONLINE DATA USED"
//             );

//             return;

//           }


//           console.log(
//             "⚠️ Online API has no device data. Trying ESP32..."
//           );

//         }
//         catch (onlineError) {

//           console.log(
//             "❌ Online API unavailable:",
//             onlineError.message
//           );

//           console.log(
//             "📡 Trying ESP32 local API..."
//           );

//         }


//         // ==================================================
//         // 2️⃣ FALLBACK TO ESP32 LOCAL API
//         // ==================================================

//         try {

//           const localData =
//             await fetchESP32LocalData();


//           applyLocalData(
//             localData
//           );


//           console.log(
//             "✅ ESP32 LOCAL DATA USED"
//           );

//         }
//         catch (localError) {

//           console.error(
//             "❌ ONLINE + ESP32 API FAILED:",
//             localError
//           );


//           if (!isMounted)
//             return;


//           // ==================================================
//           // BOTH API FAILED
//           // ==================================================

//           setHealthd({

//             heartRate: 0,

//             spo2: 0,

//             temp: 0,

//           });


//           setRiskScore(
//             0
//           );


//           setRiskLevel(
//             "Normal"
//           );


//           setHealthData(
//             []
//           );

//         }

//       };


//     // ==================================================
//     // INITIAL FETCH
//     // ==================================================

//     Hdata();


//     // ==================================================
//     // AUTO REFRESH EVERY 3 SECONDS
//     // ==================================================

//     const interval =
//       setInterval(
//         () => {

//           Hdata();

//         },
//         3000
//       );


//     // ==================================================
//     // CLEANUP
//     // ==================================================

//     return () => {

//       isMounted =
//         false;

//       clearInterval(
//         interval
//       );


//       if (
//         "speechSynthesis" in window
//       ) {

//         window.speechSynthesis.cancel();

//       }

//     };

//   }, []);


//   // ==================================================
//   // DANGER CHECK
//   // ==================================================

//   const isDangerous =
//     riskLevel === "High Risk" ||
//     riskLevel === "Critical Risk";


//   // ==================================================
//   // RENDER
//   // ==================================================

//   return (

//     <div className="dashboard">


//       {/* ==================================================
//           SIDEBAR
//       ================================================== */}

//       <Sidebar
//         isOpen={menuOpen}
//       />


//       {/* ==================================================
//           MAIN CONTENT
//       ================================================== */}

//       <main className="main">


//         {/* ==================================================
//             HEADER
//         ================================================== */}

//         <header className="header">

//           <div className="header-left">

//             <button
//               className="menu-btn"
//               onClick={() =>
//                 setMenuOpen(
//                   !menuOpen
//                 )
//               }
//             >

//               <Menu size={28} />

//             </button>


//             <div>

//               <h1>

//                 Good Morning, Sonu!
//                 <span>👋</span>

//               </h1>


//               <p>
//                 Here's your health overview
//               </p>

//             </div>

//           </div>


//           <div className="header-right">

//             <div
//               onClick={() =>
//                 navigate("/alerts")
//               }
//               className="notification"
//             >

//               <TriangleAlert
//                 size={28}
//               />

//             </div>


//             <div className="profile-avatar">

//               A

//             </div>

//           </div>

//         </header>


//         {/* ==================================================
//             TOP HEALTH CARDS
//         ================================================== */}

//         <section className="health-cards">


//           {/* HEART RATE */}

//           <HealthCard

//             title="Heart Rate"

//             value={
//               healthd.heartRate
//             }

//             unit="BPM"

//             icon={<HeartPulse />}

//             type="heart"

//             comparison="↑ 22% vs last hour"

//             data={[
//               72, 75, 70,
//               82, 78, 88,
//               85, 92, 118
//             ]}

//           />


//           {/* SPO2 */}

//           <HealthCard

//             title="SpO₂"

//             value={
//               healthd.spo2
//             }

//             unit="%"

//             icon={<Droplets />}

//             type="spo2"

//             comparison="↓ 2% vs last hour"

//             data={[
//               96, 97, 95,
//               96, 95, 97,
//               94, 95, 96
//             ]}

//           />


//           {/* TEMPERATURE */}

//           <HealthCard

//             title="Temperature"

//             value={
//               healthd.temp
//             }

//             unit="F"

//             icon={<Thermometer />}

//             type="temperature"

//             comparison="↑ 2.1°C vs last hour"

//             data={[
//               36.8,
//               37,
//               37.2,
//               37.5,
//               37.8,
//               38,
//               38.5,
//               38.7,
//               39.1,
//             ]}

//           />


//           {/* ACTIVITY */}

//           <HealthCard

//             title="Activity"

//             value="High"

//             unit=""

//             icon={<Footprints />}

//             type="activity"

//             comparison="↑ 24% vs last hour"

//             data={
//               activityData
//             }

//           />

//         </section>


//         {/* ==================================================
//             SECOND ROW
//         ================================================== */}

//         <section className="middle-grid">


//           {/* ==================================================
//               AI RISK SCORE
//           ================================================== */}

//           <div
//             className={`card risk-card ${
//               riskLevel ===
//                 "High Risk" ||
//               riskLevel ===
//                 "Critical Risk"
//                 ? "risk-blink"
//                 : ""
//             }`}
//           >

//             <div className="risk-meter">

//               <div className="gauge">

//                 <div className="gauge-score">

//                   <strong>

//                     {riskScore}

//                   </strong>

//                   <small>
//                     /100
//                   </small>

//                 </div>


//                 <div className="gauge-label">

//                   {riskLevel}

//                 </div>

//               </div>

//             </div>


//             <div
//               className={`risk-warning ${
//                 isDangerous
//                   ? "danger-blink"
//                   : ""
//               }`}
//             >

//               <strong>

//                 You are at{" "}
//                 {riskLevel}.

//               </strong>


//               <span>

//                 {isDangerous

//                   ? "Immediate attention recommended!"

//                   : "Continue monitoring your health."

//                 }

//               </span>

//             </div>


//             {/* ==================================================
//                 STOP VOICE ALERT
//             ================================================== */}

//             {isDangerous && (

//               <button
//                 className="stop-voice-btn"
//                 onClick={() => {

//                   setVoiceAlertStopped(
//                     true
//                   );

//                   if (
//                     "speechSynthesis" in window
//                   ) {

//                     window.speechSynthesis.cancel();

//                   }

//                   if (
//                     voiceIntervalRef.current
//                   ) {

//                     clearInterval(
//                       voiceIntervalRef.current
//                     );

//                     voiceIntervalRef.current =
//                       null;

//                   }

//                 }}
//               >

//                 🔇 Stop Voice Alert

//               </button>

//             )}


//             <button
//               className="risk-link"
//               onClick={() =>
//                 navigate(
//                   "/risk-analysis"
//                 )
//               }
//             >

//               View Risk Analysis

//               <ChevronRight
//                 size={14}
//               />

//             </button>

//           </div>


//           {/* ==================================================
//               HEALTH TREND
//           ================================================== */}

//           <div className="card trend-card">

//             <div className="trend-header">

//               <h3>
//                 Today's Health Trend
//               </h3>

//             </div>


//             <div className="trend-chart">

//               <ResponsiveContainer
//                 width="100%"
//                 height="100%"
//               >

//                 <AreaChart
//                   data={healthData}
//                 >

//                   <defs>

//                     <linearGradient
//                       id="healthGradient"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >

//                       <stop
//                         offset="0%"
//                         stopColor="#ff5d62"
//                         stopOpacity={0.25}
//                       />

//                       <stop
//                         offset="100%"
//                         stopColor="#ff5d62"
//                         stopOpacity={0}
//                       />

//                     </linearGradient>

//                   </defs>


//                   <XAxis
//                     dataKey="time"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{
//                       fontSize: 9,
//                       fill: "#8d95a5",
//                     }}
//                   />


//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{
//                       fontSize: 9,
//                       fill: "#8d95a5",
//                     }}
//                     domain={[
//                       0,
//                       100
//                     ]}
//                     ticks={[
//                       0,
//                       25,
//                       50,
//                       75,
//                       100
//                     ]}
//                   />


//                   <Tooltip />


//                   <Area
//                     type="monotone"
//                     dataKey="score"
//                     stroke="#ed5359"
//                     strokeWidth={2}
//                     fill="url(#healthGradient)"
//                   />

//                 </AreaChart>

//               </ResponsiveContainer>

//             </div>


//             <div className="trend-status">

//               <span>

//                 <i className="low"></i>

//                 Low (0–53)

//               </span>


//               <span>

//                 <i className="moderate"></i>

//                 Moderate (31–66)

//               </span>


//               <span>

//                 <i className="high"></i>

//                 High (61–100)

//               </span>

//             </div>

//           </div>

//         </section>


//         {/* ==================================================
//             BOTTOM GRID
//         ================================================== */}

//         <section className="bottom-grid">


//           {/* ==================================================
//               ENVIRONMENT
//           ================================================== */}

//           <div className="card environment-card">

//             <div className="section-header">

//               <div>

//                 <h3>
//                   Environment Overview
//                 </h3>

//               </div>


//               <button
//                 onClick={() =>
//                   navigate(
//                     "/environment"
//                   )
//                 }
//               >
//                 View all
//               </button>

//             </div>


//             <div className="environment-items">


//               <div className="environment-item">

//                 <div className="env-icon orange">

//                   <Sun size={17} />

//                 </div>


//                 <div>

//                   <span>
//                     Heat Index
//                   </span>

//                   <strong>
//                     42°C
//                   </strong>

//                 </div>

//               </div>


//               <div className="environment-item">

//                 <div className="env-icon gray">

//                   <Wind size={17} />

//                 </div>


//                 <div>

//                   <span>
//                     AQI
//                   </span>

//                   <strong>
//                     186
//                   </strong>

//                 </div>

//               </div>


//               <div className="environment-item">

//                 <div className="env-icon blue">

//                   <Droplets
//                     size={17}
//                   />

//                 </div>


//                 <div>

//                   <span>
//                     Humidity
//                   </span>

//                   <strong>
//                     71%
//                   </strong>

//                 </div>

//               </div>


//               <div className="environment-item">

//                 <div className="env-icon red">

//                   <Thermometer
//                     size={17}
//                   />

//                 </div>


//                 <div>

//                   <span>
//                     Heat Alert
//                   </span>

//                   <strong>
//                     High
//                   </strong>

//                 </div>

//               </div>

//             </div>

//           </div>


//           {/* ==================================================
//               RECENT ALERTS
//           ================================================== */}

//           <div className="card alerts-card">

//             <div className="section-header">

//               <h3>
//                 Recent Alerts
//               </h3>


//               <button
//                 onClick={() =>
//                   navigate(
//                     "/alerts"
//                   )
//                 }
//               >
//                 View all
//               </button>

//             </div>


//             <Alert

//               icon={
//                 <AlertTriangle />
//               }

//               title="High Heat Stress Risk"

//               time="16 May 2025, 08:10 AM"

//               level="High"

//               high

//             />


//             <Alert

//               icon={
//                 <Droplets />
//               }

//               title="Hydration Level Low"

//               time="16 May 2025, 06:30 AM"

//               level="Medium"

//             />


//             <Alert

//               icon={
//                 <Activity />
//               }

//               title="AQI Level Unhealthy"

//               time="16 May 2025, 07:40 AM"

//               level="Medium"

//             />

//           </div>


//           {/* ==================================================
//               QUICK ACTIONS
//           ================================================== */}

//           <div className="card quick-card">

//             <div className="section-header">

//               <h3>
//                 Quick Actions
//               </h3>

//             </div>


//             <button className="quick-action">

//               <span className="qa-icon blue">

//                 <Activity
//                   size={15}
//                 />

//               </span>

//               Start Health Scan

//             </button>


//             <button className="quick-action">

//               <span className="qa-icon blue">

//                 <Droplets
//                   size={15}
//                 />

//               </span>

//               Water Reminder

//             </button>


//             <button className="quick-action">

//               <span className="qa-icon green">

//                 <Pill
//                   size={15}
//                 />

//               </span>

//               Medication Reminder

//             </button>


//             <button className="quick-action">

//               <span className="qa-icon red">

//                 <FileText
//                   size={15}
//                 />

//               </span>

//               Share Health Report

//             </button>

//           </div>

//         </section>

//       </main>

//     </div>

//   );
// }


// // ==================================================
// // HEALTH CARD COMPONENT
// // ==================================================

// function HealthCard({
//   title,
//   value,
//   unit,
//   icon,
//   type,
//   comparison,
//   data,
// }) {

//   const max =
//     Math.max(...data);

//   const min =
//     Math.min(...data);


//   const points =
//     data
//       .map(
//         (value, index) => {

//           const x =
//             (
//               index /
//               (data.length - 1)
//             ) * 100;


//           const y =
//             38 -
//             (
//               (value - min) /
//               (max - min || 1)
//             ) * 30;


//           return `${x},${y}`;

//         }
//       )
//       .join(" ");


//   return (

//     <div
//       className={`health-card ${type}`}
//     >

//       <div className="health-card-top">

//         <div className="health-title">

//           <span className="metric-icon">

//             {React.cloneElement(
//               icon,
//               {
//                 size: 17,
//               }
//             )}

//           </span>


//           <span>
//             {title}
//           </span>

//         </div>

//       </div>


//       <div className="metric-value">

//         <strong>
//           {value}
//         </strong>

//         <span>
//           {unit}
//         </span>

//       </div>


//       <div className="comparison">

//         {comparison}

//       </div>


//       <div className="mini-chart">

//         {type === "activity" ? (

//           <div className="activity-bars">

//             {data.map(
//               (height, i) => (

//                 <span
//                   key={i}
//                   style={{
//                     height:
//                       `${height}%`,
//                   }}
//                 ></span>

//               )
//             )}

//           </div>

//         ) : (

//           <svg
//             viewBox="0 0 100 45"
//             preserveAspectRatio="none"
//           >

//             <polyline
//               points={points}
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.7"
//               vectorEffect="non-scaling-stroke"
//             />

//           </svg>

//         )}

//       </div>

//     </div>

//   );
// }


// // ==================================================
// // ALERT COMPONENT
// // ==================================================

// function Alert({
//   icon,
//   title,
//   time,
//   level,
//   high,
// }) {

//   return (

//     <div className="alert-row">

//       <div
//         className={`alert-icon ${
//           high
//             ? "danger"
//             : "warning"
//         }`}
//       >

//         {React.cloneElement(
//           icon,
//           {
//             size: 14,
//           }
//         )}

//       </div>


//       <div className="alert-info">

//         <strong>
//           {title}
//         </strong>

//         <span>
//           {time}
//         </span>

//       </div>


//       <span
//         className={`alert-level ${
//           high
//             ? "high-level"
//             : ""
//         }`}
//       >

//         {level}

//       </span>

//     </div>

//   );
// }


// export default Dashboard;

// // import React from "react";
// // import { useState, useEffect, useRef } from "react";
// // import "../App.css";
// // import Sidebar from "../components/Sidebar";
// // import { TriangleAlert, Menu } from "lucide-react";
// // import { useNavigate } from "react-router-dom";

// // import {
// //   HeartPulse,
// //   Bell,
// //   AlertTriangle,
// //   Droplets,
// //   Thermometer,
// //   Footprints,
// //   Activity,
// //   Wind,
// //   Pill,
// //   FileText,
// //   ChevronRight,
// //   Sun,
// // } from "lucide-react";

// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   ResponsiveContainer,
// //   Tooltip,
// //   AreaChart,
// //   Area,
// // } from "recharts";

// // const activityData = [
// //   15, 22, 17, 31, 24, 38,
// //   25, 43, 30, 35, 28, 45
// // ];

// // function Dashboard() {

// //   const navigate = useNavigate();

// //   const [menuOpen, setMenuOpen] =
// //     useState(false);

// //   const [healthData, setHealthData] =
// //     useState([]);

// //   const [healthd, setHealthd] =
// //     useState({
// //       heartRate: 70,
// //       spo2: 98,
// //       temp: 96,
// //     });

// //   const [riskScore, setRiskScore] =
// //     useState(0);

// //   const [riskLevel, setRiskLevel] =
// //     useState("Normal");

// //   const [name, setName] =
// //     useState("");

// //   // ==================================================
// //   // 🔊 VOICE ALERT STATE
// //   // ==================================================

// //   const [voiceAlertStopped, setVoiceAlertStopped] =
// //     useState(false);

// //   const voiceIntervalRef =
// //     useRef(null);


// //   // ==================================================
// //   // 🔊 VOICE ALERT FUNCTION
// //   // ==================================================

// //   const speakRiskAlert = (level) => {

// //     if (!("speechSynthesis" in window)) {

// //       console.log(
// //         "❌ Speech synthesis not supported"
// //       );

// //       return;
// //     }

// //     let message = "";

// //     // ==============================
// //     // 🚨 CRITICAL
// //     // ==============================


// // if (level === "Critical Risk") {
// //   message = "Critical health risk detected. Please take immediate action.";
// // }
// // else if (level === "High Risk") {
// //   message = "Warning. High health risk detected. Please check your health condition.";
// // }
// // else {
// //   return;
// // }








// //     // Stop previous speech
// //     window.speechSynthesis.cancel();

// //     const speech =
// //       new SpeechSynthesisUtterance(
// //         message
// //       );

// //     // Hindi voice
// //     speech.lang = "hi-IN";

// //     speech.rate = 0.9;
// //     speech.pitch = 1;
// //     speech.volume = 1;

// //     // Find Hindi voice
// //     const voices =
// //       window.speechSynthesis.getVoices();

// //     const hindiVoice =
// //       voices.find(
// //         (voice) =>
// //           voice.lang &&
// //           voice.lang
// //             .toLowerCase()
// //             .startsWith("hi")
// //       );

// //     if (hindiVoice) {

// //       speech.voice =
// //         hindiVoice;

// //     }

// //     window.speechSynthesis.speak(
// //       speech
// //     );

// //     console.log(
// //       "🔊 VOICE ALERT:",
// //       message
// //     );
// //   };


// //   // ==================================================
// //   // 🔊 START / STOP VOICE ALERT
// //   // ==================================================


// // //   useEffect(() => {
// // //   // Sync check taaki duplicate init na ho
// // //   if (window._oneSignalInitialized) return;
// // //   window._oneSignalInitialized = true; 

// // //   window.OneSignal = window.OneSignal || [];
// // //   window.OneSignal.push(async function() {
// // //     try {
// // //       await window.OneSignal.init({
// // //         appId: "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",
// // //         allowLocalhostAsSecureOrigin: true,
// // //       });
// // //       console.log("OneSignal Initialized Successfully");
// // //     } catch (error) {
// // //       if (!error.message?.includes("already initialized")) {
// // //         console.error("Error during OneSignal init:", error);
// // //       }
// // //     }
// // //   });
// // // }, []);


// //   useEffect(() => {
// //   if (window._oneSignalInitialized) return;
// //   window._oneSignalInitialized = true; 

// //   window.OneSignal = window.OneSignal || [];
// //   window.OneSignal.push(async function() {
// //     try {
// //       await window.OneSignal.init({
// //         appId: "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",
// //         allowLocalhostAsSecureOrigin: true,
// //       });
// //       console.log("OneSignal Initialized Successfully");

// //       // 💡 1. यूजर से नोटिफिकेशन की परमिशन मांगें
// //       await window.OneSignal.Slidedown.promptPush();

// //       // 💡 2. Player ID निकालकर backend पर भेजें
// //       const playerId = window.OneSignal.User.PushSubscription.id;
// //       if (playerId) {
// //         console.log("🔥 Player ID Found:", playerId);
        
// //         const response = await fetch("https://healthtrackb.onrender.com/api/devicedata/onesignalid", {
// //           method: "POST",
// //           credentials: "include",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({ playerId })
// //         });
// //         const data = await response.json();
// //         console.log("✅ Backend Save Response:", data);
// //       } else {
// //         console.log("⚠️ Player ID not generated yet (User might have blocked or ignored prompt).");
// //       }

// //     } catch (error) {
// //       if (!error.message?.includes("already initialized")) {
// //         console.error("Error during OneSignal init:", error);
// //       }
// //     }
// //   });
// // }, []);

  
  

// //   useEffect(() => {

// //     // Clear previous interval
// //     if (voiceIntervalRef.current) {

// //       clearInterval(
// //         voiceIntervalRef.current
// //       );

// //       voiceIntervalRef.current ="warning!"
       

// //     }

// //     // Stop current speech
// //     if (
// //       "speechSynthesis" in window
// //     ) {

// //       window.speechSynthesis.cancel();

// //     }

// //     // ==================================================
// //     // ONLY HIGH / CRITICAL
// //     // ==================================================

// //     if (
// //       riskLevel !== "High Risk" &&
// //       riskLevel !== "Critical Risk"
// //     ) {

// //       // Reset stop state when danger is gone
// //       setVoiceAlertStopped(false);

// //       return;

// //     }


// //     // ==================================================
// //     // USER PRESSED STOP
// //     // ==================================================

// //     if (voiceAlertStopped) {

// //       console.log(
// //         "🔇 Voice alert stopped by user"
// //       );

// //       return;

// //     }


// //     // ==================================================
// //     // SPEAK IMMEDIATELY
// //     // ==================================================

// //     speakRiskAlert(
// //       riskLevel
// //     );


// //     // ==================================================
// //     // REPEAT EVERY 5 SECONDS
// //     // ==================================================

// //     voiceIntervalRef.current =
// //       setInterval(() => {

// //         // Safety check
// //         if (
// //           !voiceAlertStopped &&
// //           (
// //             riskLevel === "High Risk" ||
// //             riskLevel === "Critical Risk"
// //           )
// //         ) {

// //           speakRiskAlert(
// //             riskLevel
// //           );

// //         }

// //       }, 5000);


// //     // ==================================================
// //     // CLEANUP
// //     // ==================================================

// //     return () => {

// //       if (
// //         voiceIntervalRef.current
// //       ) {

// //         clearInterval(
// //           voiceIntervalRef.current
// //         );

// //         voiceIntervalRef.current =
// //           null;

// //       }

// //       if (
// //         "speechSynthesis" in window
// //       ) {

// //         window.speechSynthesis.cancel();

// //       }

// //     };

// //   }, [
// //     riskLevel,
// //     voiceAlertStopped
// //   ]);


// //   // ==================================================
// //   // LOAD HEALTH DATA
// //   // ==================================================

// //   useEffect(() => {

// //     const Hdata = async () => {

// //       try {

// //         const response =
// //           await fetch(
// //             "https://healthtrackb.onrender.com/api/health/gethealthdata",
// //             {
// //               method: "GET",

// //               credentials: "include",

// //               headers: {
// //                 "Content-Type":
// //                   "application/json",
// //               },
// //             }
// //           );


// //         console.log(
// //           "STATUS:",
// //           response.status
// //         );

// //         console.log(
// //           "OK:",
// //           response.ok
// //         );


// //         const data =
// //           await response.json();


// //         console.log(
// //           "🔥 COMPLETE HEALTH DATA:",
// //           data
// //         );

// //         console.log(
// //           "🔥 HD:",
// //           data.hd
// //         );

// //         console.log(
// //           "🔥 HEART RATE:",
// //           data.hd?.heartRate
// //         );

// //         console.log(
// //           "🔥 SPO2:",
// //           data.hd?.spo2
// //         );

// //         console.log(
// //           "🔥 TEMP:",
// //           data.hd?.temp
// //         );

// //         console.log(
// //           "🔥 RISK SCORE:",
// //           data.riskScore
// //         );

// //         console.log(
// //           "🔥 RISK LEVEL:",
// //           data.riskLevel
// //         );

// //         console.log(
// //           "🔥 RECOMMENDATIONS:",
// //           data.recommendations
// //         );


// //         // ==================================================
// //         // NO DEVICE DATA
// //         // ==================================================

// //         if (!data.hd) {

// //           console.log(
// //             "⚠️ No device data available"
// //           );


// //           setHealthd({
// //             heartRate: 0,
// //             spo2: 0,
// //             temp: 0,
// //           });


// //           setRiskScore(
// //             data.riskScore ?? 0
// //           );


// //           setRiskLevel(
// //             data.riskLevel ??
// //             "Normal"
// //           );


// //           setHealthData(
// //             data.datatimers ?? []
// //           );


// //           return;
// //         }


// //         // ==================================================
// //         // DEVICE DATA AVAILABLE
// //         // ==================================================

// //         setHealthd({

// //           heartRate:
// //             data.hd.heartRate ??
// //             0,

// //           spo2:
// //             data.hd.spo2 ??
// //             0,

// //           temp:
// //             data.hd.temp != null
// //               ? (
// //                   (data.hd.temp * 1.8) +
// //                   32
// //                 ).toFixed(1)
// //               : 0,

// //         });


// //         // ==================================================
// //         // 🤖 RISK DATA
// //         // ==================================================

// //         const newRiskLevel =
// //           data.riskLevel ??
// //           "Normal";

// //         const newRiskScore =
// //           data.riskScore ??
// //           0;


// //         // ==================================================
// //         // SAVE RISK DATA
// //         // ==================================================

// //         setRiskScore(
// //           newRiskScore
// //         );

// //         setRiskLevel(
// //           newRiskLevel
// //         );

// //         setHealthData(
// //           data.datatimers ?? []
// //         );

// //       } catch (error) {

// //         console.error(
// //           "❌ Health data fetch error:",
// //           error
// //         );


// //         setHealthd({
// //           heartRate: 0,
// //           spo2: 0,
// //           temp: 0,
// //         });


// //         setRiskScore(0);

// //         setRiskLevel(
// //           "Normal"
// //         );

// //         setHealthData([]);

// //       }

// //     };


// //     // ==================================================
// //     // INITIAL FETCH
// //     // ==================================================

// //     Hdata();


// //     // ==================================================
// //     // AUTO REFRESH EVERY 4 SECONDS
// //     // ==================================================

// //     const interval =
// //       setInterval(() => {

// //         Hdata();

// //       }, 3000);


// //     // // ==================================================
// //     // // CLEANUP
// //     // // ==================================================

// //     return () => {

// //       clearInterval(
// //         interval
// //       );

// //       if (
// //         "speechSynthesis" in window
// //       ) {

// //         window.speechSynthesis.cancel();

// //       }

// //     };

// //   }, []);


// //   // ==================================================
// //   // DANGER CHECK
// //   // ==================================================

// //   const isDangerous =
// //     riskLevel === "High Risk" ||
// //     riskLevel === "Critical Risk";


// //   // ==================================================
// //   // RENDER
// //   // ==================================================

// //   return (

// //     <div className="dashboard">


// //       {/* ==================================================
// //           SIDEBAR
// //       ================================================== */}

// //       <Sidebar
// //         isOpen={menuOpen}
// //       />


// //       {/* ==================================================
// //           MAIN CONTENT
// //       ================================================== */}

// //       <main className="main">


// //         {/* ==================================================
// //             HEADER
// //         ================================================== */}

// //         <header className="header">

// //           <div className="header-left">

// //             <button
// //               className="menu-btn"
// //               onClick={() =>
// //                 setMenuOpen(
// //                   !menuOpen
// //                 )
// //               }
// //             >

// //               <Menu size={28} />

// //             </button>


// //             <div>

// //               <h1>

// //                 Good Morning, Sonu!
// //                 <span>👋</span>

// //               </h1>


// //               <p>
// //                 Here's your health overview
// //               </p>

// //             </div>

// //           </div>


// //           <div className="header-right">

// //             <div
// //               onClick={() =>
// //                 navigate("/alerts")
// //               }
// //               className="notification"
// //             >

// //               <TriangleAlert
// //                 size={28}
// //               />

// //             </div>


// //             <div className="profile-avatar">

// //               A

// //             </div>

// //           </div>

// //         </header>


// //         {/* ==================================================
// //             TOP HEALTH CARDS
// //         ================================================== */}

// //         <section className="health-cards">


// //           {/* HEART RATE */}

// //           <HealthCard

// //             title="Heart Rate"

// //             value={
// //               healthd.heartRate
// //             }

// //             unit="BPM"

// //             icon={<HeartPulse />}

// //             type="heart"

// //             comparison="↑ 22% vs last hour"

// //             data={[
// //               72, 75, 70,
// //               82, 78, 88,
// //               85, 92, 118
// //             ]}

// //           />


// //           {/* SPO2 */}

// //           <HealthCard

// //             title="SpO₂"

// //             value={
// //               healthd.spo2
// //             }

// //             unit="%"

// //             icon={<Droplets />}

// //             type="spo2"

// //             comparison="↓ 2% vs last hour"

// //             data={[
// //               96, 97, 95,
// //               96, 95, 97,
// //               94, 95, 96
// //             ]}

// //           />


// //           {/* TEMPERATURE */}

// //           <HealthCard

// //             title="Temperature"

// //             value={
// //               healthd.temp
// //             }

// //             unit="F"

// //             icon={<Thermometer />}

// //             type="temperature"

// //             comparison="↑ 2.1°C vs last hour"

// //             data={[
// //               36.8,
// //               37,
// //               37.2,
// //               37.5,
// //               37.8,
// //               38,
// //               38.5,
// //               38.7,
// //               39.1,
// //             ]}

// //           />


// //           {/* ACTIVITY */}

// //           <HealthCard

// //             title="Activity"

// //             value="High"

// //             unit=""

// //             icon={<Footprints />}

// //             type="activity"

// //             comparison="↑ 24% vs last hour"

// //             data={
// //               activityData
// //             }

// //           />

// //         </section>


// //         {/* ==================================================
// //             SECOND ROW
// //         ================================================== */}

// //         <section className="middle-grid">


// //           {/* ==================================================
// //               AI RISK SCORE
// //           ================================================== */}

// //           <div
// //             className={`card risk-card ${
// //               riskLevel ===
// //                 "High Risk" ||
// //               riskLevel ===
// //                 "Critical Risk"
// //                 ? "risk-blink"
// //                 : ""
// //             }`}
// //           >

// //             <div className="risk-meter">

// //               <div className="gauge">

// //                 <div className="gauge-score">

// //                   <strong>
                   
// //                     {riskScore}
// //                   </strong>

// //                   <small>
// //                     /100
// //                   </small>

// //                 </div>


// //                 <div className="gauge-label">

// //                   {riskLevel}

// //                 </div>

// //               </div>

// //             </div>


// //             <div
// //               className={`risk-warning ${
// //                 isDangerous
// //                   ? "danger-blink"
// //                   : ""
// //               }`}
// //             >

// //               <strong>

// //                 You are at{" "}
// //                 {riskLevel}.

// //               </strong>


// //               <span>

// //                 {isDangerous

// //                   ? "Immediate attention recommended!"

// //                   : "Continue monitoring your health."

// //                 }

// //               </span>

// //             </div>


// //             {/* ==================================================
// //                 🔇 STOP VOICE ALERT BUTTON
// //             ================================================== */}

// //             {isDangerous && (

// //               <button
// //                 className="stop-voice-btn"
// //                 onClick={() => {

// //                   setVoiceAlertStopped(
// //                     true
// //                   );

// //                   if (
// //                     "speechSynthesis" in window
// //                   ) {

// //                     window.speechSynthesis.cancel();

// //                   }

// //                   if (
// //                     voiceIntervalRef.current
// //                   ) {

// //                     clearInterval(
// //                       voiceIntervalRef.current
// //                     );

// //                     voiceIntervalRef.current =
// //                       null;

// //                   }

// //                 }}
// //               >

// //                 🔇 Stop Voice Alert

// //               </button>

// //             )}


// //             <button
// //               className="risk-link"
// //               onClick={() =>
// //                 navigate(
// //                   "/risk-analysis"
// //                 )
// //               }
// //             >

// //               View Risk Analysis

// //               <ChevronRight
// //                 size={14}
// //               />

// //             </button>

// //           </div>


// //           {/* ==================================================
// //               HEALTH TREND
// //           ================================================== */}

// //           <div className="card trend-card">

// //             <div className="trend-header">

// //               <h3>
// //                 Today's Health Trend
// //               </h3>

// //             </div>


// //             <div className="trend-chart">

// //               <ResponsiveContainer
// //                 width="100%"
// //                 height="100%"
// //               >

// //                 <AreaChart
// //                   data={healthData}
// //                 >

// //                   <defs>

// //                     <linearGradient
// //                       id="healthGradient"
// //                       x1="0"
// //                       y1="0"
// //                       x2="0"
// //                       y2="1"
// //                     >

// //                       <stop
// //                         offset="0%"
// //                         stopColor="#ff5d62"
// //                         stopOpacity={0.25}
// //                       />

// //                       <stop
// //                         offset="100%"
// //                         stopColor="#ff5d62"
// //                         stopOpacity={0}
// //                       />

// //                     </linearGradient>

// //                   </defs>


// //                   <XAxis
// //                     dataKey="time"
// //                     axisLine={false}
// //                     tickLine={false}
// //                     tick={{
// //                       fontSize: 9,
// //                       fill: "#8d95a5",
// //                     }}
// //                   />


// //                   <YAxis
// //                     axisLine={false}
// //                     tickLine={false}
// //                     tick={{
// //                       fontSize: 9,
// //                       fill: "#8d95a5",
// //                     }}
// //                     domain={[
// //                       0,
// //                       100
// //                     ]}
// //                     ticks={[
// //                       0,
// //                       25,
// //                       50,
// //                       75,
// //                       100
// //                     ]}
// //                   />


// //                   <Tooltip />


// //                   <Area
// //                     type="monotone"
// //                     dataKey="score"
// //                     stroke="#ed5359"
// //                     strokeWidth={2}
// //                     fill="url(#healthGradient)"
// //                   />

// //                 </AreaChart>

// //               </ResponsiveContainer>

// //             </div>


// //             <div className="trend-status">

// //               <span>

// //                 <i className="low"></i>

// //                 Low (0–53)

// //               </span>


// //               <span>

// //                 <i className="moderate"></i>

// //                 Moderate (31–66)

// //               </span>


// //               <span>

// //                 <i className="high"></i>

// //                 High (61–100)

// //               </span>

// //             </div>

// //           </div>

// //         </section>


// //         {/* ==================================================
// //             BOTTOM GRID
// //         ================================================== */}

// //         <section className="bottom-grid">


// //           {/* ==================================================
// //               ENVIRONMENT
// //           ================================================== */}

// //           <div className="card environment-card">

// //             <div className="section-header">

// //               <div>

// //                 <h3>
// //                   Environment Overview
// //                 </h3>

// //               </div>


// //               <button
// //                 onClick={() =>
// //                   navigate(
// //                     "/environment"
// //                   )
// //                 }
// //               >
// //                 View all
// //               </button>

// //             </div>


// //             <div className="environment-items">


// //               <div className="environment-item">

// //                 <div className="env-icon orange">

// //                   <Sun size={17} />

// //                 </div>


// //                 <div>

// //                   <span>
// //                     Heat Index
// //                   </span>

// //                   <strong>
// //                     42°C
// //                   </strong>

// //                 </div>

// //               </div>


// //               <div className="environment-item">

// //                 <div className="env-icon gray">

// //                   <Wind size={17} />

// //                 </div>


// //                 <div>

// //                   <span>
// //                     AQI
// //                   </span>

// //                   <strong>
// //                     186
// //                   </strong>

// //                 </div>

// //               </div>


// //               <div className="environment-item">

// //                 <div className="env-icon blue">

// //                   <Droplets
// //                     size={17}
// //                   />

// //                 </div>


// //                 <div>

// //                   <span>
// //                     Humidity
// //                   </span>

// //                   <strong>
// //                     71%
// //                   </strong>

// //                 </div>

// //               </div>


// //               <div className="environment-item">

// //                 <div className="env-icon red">

// //                   <Thermometer
// //                     size={17}
// //                   />

// //                 </div>


// //                 <div>

// //                   <span>
// //                     Heat Alert
// //                   </span>

// //                   <strong>
// //                     High
// //                   </strong>

// //                 </div>

// //               </div>

// //             </div>

// //           </div>


// //           {/* ==================================================
// //               RECENT ALERTS
// //           ================================================== */}

// //           <div className="card alerts-card">

// //             <div className="section-header">

// //               <h3>
// //                 Recent Alerts
// //               </h3>


// //               <button
// //                 onClick={() =>
// //                   navigate(
// //                     "/alerts"
// //                   )
// //                 }
// //               >
// //                 View all
// //               </button>

// //             </div>


// //             <Alert

// //               icon={
// //                 <AlertTriangle />
// //               }

// //               title="High Heat Stress Risk"

// //               time="16 May 2025, 08:10 AM"

// //               level="High"

// //               high

// //             />


// //             <Alert

// //               icon={
// //                 <Droplets />
// //               }

// //               title="Hydration Level Low"

// //               time="16 May 2025, 06:30 AM"

// //               level="Medium"

// //             />


// //             <Alert

// //               icon={
// //                 <Activity />
// //               }

// //               title="AQI Level Unhealthy"

// //               time="16 May 2025, 07:40 AM"

// //               level="Medium"

// //             />

// //           </div>


// //           {/* ==================================================
// //               QUICK ACTIONS
// //           ================================================== */}

// //           <div className="card quick-card">

// //             <div className="section-header">

// //               <h3>
// //                 Quick Actions
// //               </h3>

// //             </div>


// //             <button className="quick-action">

// //               <span className="qa-icon blue">

// //                 <Activity
// //                   size={15}
// //                 />

// //               </span>

// //               Start Health Scan

// //             </button>


// //             <button className="quick-action">

// //               <span className="qa-icon blue">

// //                 <Droplets
// //                   size={15}
// //                 />

// //               </span>

// //               Water Reminder

// //             </button>


// //             <button className="quick-action">

// //               <span className="qa-icon green">

// //                 <Pill
// //                   size={15}
// //                 />

// //               </span>

// //               Medication Reminder

// //             </button>


// //             <button className="quick-action">

// //               <span className="qa-icon red">

// //                 <FileText
// //                   size={15}
// //                 />

// //               </span>

// //               Share Health Report

// //             </button>

// //           </div>

// //         </section>

// //       </main>

// //     </div>
// //   );
// // }


// // // ==================================================
// // // HEALTH CARD COMPONENT
// // // ==================================================

// // function HealthCard({
// //   title,
// //   value,
// //   unit,
// //   icon,
// //   type,
// //   comparison,
// //   data,
// // }) {

// //   const max =
// //     Math.max(...data);

// //   const min =
// //     Math.min(...data);


// //   const points =
// //     data
// //       .map(
// //         (value, index) => {

// //           const x =
// //             (index /
// //               (data.length - 1)) *
// //             100;


// //           const y =
// //             38 -
// //             (
// //               (value - min) /
// //               (max - min || 1)
// //             ) *
// //             30;


// //           return `${x},${y}`;

// //         }
// //       )
// //       .join(" ");


// //   return (

// //     <div
// //       className={`health-card ${type}`}
// //     >

// //       <div className="health-card-top">

// //         <div className="health-title">

// //           <span className="metric-icon">

// //             {React.cloneElement(
// //               icon,
// //               {
// //                 size: 17,
// //               }
// //             )}

// //           </span>


// //           <span>
// //             {title}
// //           </span>

// //         </div>

// //       </div>


// //       <div className="metric-value">

// //         <strong>
// //           {value}
// //         </strong>

// //         <span>
// //           {unit}
// //         </span>

// //       </div>


// //       <div className="comparison">

// //         {comparison}

// //       </div>


// //       <div className="mini-chart">

// //         {type === "activity" ? (

// //           <div className="activity-bars">

// //             {data.map(
// //               (height, i) => (

// //                 <span
// //                   key={i}
// //                   style={{
// //                     height:
// //                       `${height}%`,
// //                   }}
// //                 ></span>

// //               )
// //             )}

// //           </div>

// //         ) : (

// //           <svg
// //             viewBox="0 0 100 45"
// //             preserveAspectRatio="none"
// //           >

// //             <polyline
// //               points={points}
// //               fill="none"
// //               stroke="currentColor"
// //               strokeWidth="1.7"
// //               vectorEffect="non-scaling-stroke"
// //             />

// //           </svg>

// //         )}

// //       </div>

// //     </div>
// //   );
// // }


// // // ==================================================
// // // ALERT COMPONENT
// // // ==================================================

// // function Alert({
// //   icon,
// //   title,
// //   time,
// //   level,
// //   high,
// // }) {

// //   return (

// //     <div className="alert-row">

// //       <div
// //         className={`alert-icon ${
// //           high
// //             ? "danger"
// //             : "warning"
// //         }`}
// //       >

// //         {React.cloneElement(
// //           icon,
// //           {
// //             size: 14,
// //           }
// //         )}

// //       </div>


// //       <div className="alert-info">

// //         <strong>
// //           {title}
// //         </strong>

// //         <span>
// //           {time}
// //         </span>

// //       </div>


// //       <span
// //         className={`alert-level ${
// //           high
// //             ? "high-level"
// //             : ""
// //         }`}
// //       >

// //         {level}

// //       </span>

// //     </div>
// //   );
// // }


// // export default Dashboard;
