

import React from "react";
import { useState, useEffect, useRef } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import { TriangleAlert, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const activityData = [
  15, 22, 17, 31, 24, 38,
  25, 43, 30, 35, 28, 45
];

function Dashboard() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [healthData, setHealthData] =
    useState([]);

  const [healthd, setHealthd] =
    useState({
      heartRate: 70,
      spo2: 98,
      temp: 96,
    });

  const [riskScore, setRiskScore] =
    useState(0);

  const [riskLevel, setRiskLevel] =
    useState("Normal");

  const [name, setName] =
    useState("");

  // ==================================================
  // 🔊 VOICE ALERT STATE
  // ==================================================

  const [voiceAlertStopped, setVoiceAlertStopped] =
    useState(false);

  const voiceIntervalRef =
    useRef(null);


  // ==================================================
  // 🔊 VOICE ALERT FUNCTION
  // ==================================================

  const speakRiskAlert = (level) => {

    if (!("speechSynthesis" in window)) {

      console.log(
        "❌ Speech synthesis not supported"
      );

      return;
    }

    let message = "";

    // ==============================
    // 🚨 CRITICAL
    // ==============================


if (level === "Critical Risk") {
  message = "Critical health risk detected. Please take immediate action.";
}
else if (level === "High Risk") {
  message = "Warning. High health risk detected. Please check your health condition.";
}
else {
  return;
}








    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        message
      );

    // Hindi voice
    speech.lang = "hi-IN";

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    // Find Hindi voice
    const voices =
      window.speechSynthesis.getVoices();

    const hindiVoice =
      voices.find(
        (voice) =>
          voice.lang &&
          voice.lang
            .toLowerCase()
            .startsWith("hi")
      );

    if (hindiVoice) {

      speech.voice =
        hindiVoice;

    }

    window.speechSynthesis.speak(
      speech
    );

    console.log(
      "🔊 VOICE ALERT:",
      message
    );
  };


  // ==================================================
  // 🔊 START / STOP VOICE ALERT
  // ==================================================


//   useEffect(() => {
//   // Sync check taaki duplicate init na ho
//   if (window._oneSignalInitialized) return;
//   window._oneSignalInitialized = true; 

//   window.OneSignal = window.OneSignal || [];
//   window.OneSignal.push(async function() {
//     try {
//       await window.OneSignal.init({
//         appId: "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",
//         allowLocalhostAsSecureOrigin: true,
//       });
//       console.log("OneSignal Initialized Successfully");
//     } catch (error) {
//       if (!error.message?.includes("already initialized")) {
//         console.error("Error during OneSignal init:", error);
//       }
//     }
//   });
// }, []);


  useEffect(() => {
  if (window._oneSignalInitialized) return;
  window._oneSignalInitialized = true; 

  window.OneSignal = window.OneSignal || [];
  window.OneSignal.push(async function() {
    try {
      await window.OneSignal.init({
        appId: "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",
        allowLocalhostAsSecureOrigin: true,
      });
      console.log("OneSignal Initialized Successfully");

      // 💡 1. यूजर से नोटिफिकेशन की परमिशन मांगें
      await window.OneSignal.Slidedown.promptPush();

      // 💡 2. Player ID निकालकर backend पर भेजें
      const playerId = window.OneSignal.User.PushSubscription.id;
      if (playerId) {
        console.log("🔥 Player ID Found:", playerId);
        
        const response = await fetch("https://healthtrackb.onrender.com/api/devicedata/onesignalid", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerId })
        });
        const data = await response.json();
        console.log("✅ Backend Save Response:", data);
      } else {
        console.log("⚠️ Player ID not generated yet (User might have blocked or ignored prompt).");
      }

    } catch (error) {
      if (!error.message?.includes("already initialized")) {
        console.error("Error during OneSignal init:", error);
      }
    }
  });
}, []);

  
  

  useEffect(() => {

    // Clear previous interval
    if (voiceIntervalRef.current) {

      clearInterval(
        voiceIntervalRef.current
      );

      voiceIntervalRef.current ="warning!"
       

    }

    // Stop current speech
    if (
      "speechSynthesis" in window
    ) {

      window.speechSynthesis.cancel();

    }

    // ==================================================
    // ONLY HIGH / CRITICAL
    // ==================================================

    if (
      riskLevel !== "High Risk" &&
      riskLevel !== "Critical Risk"
    ) {

      // Reset stop state when danger is gone
      setVoiceAlertStopped(false);

      return;

    }


    // ==================================================
    // USER PRESSED STOP
    // ==================================================

    if (voiceAlertStopped) {

      console.log(
        "🔇 Voice alert stopped by user"
      );

      return;

    }


    // ==================================================
    // SPEAK IMMEDIATELY
    // ==================================================

    speakRiskAlert(
      riskLevel
    );


    // ==================================================
    // REPEAT EVERY 5 SECONDS
    // ==================================================

    voiceIntervalRef.current =
      setInterval(() => {

        // Safety check
        if (
          !voiceAlertStopped &&
          (
            riskLevel === "High Risk" ||
            riskLevel === "Critical Risk"
          )
        ) {

          speakRiskAlert(
            riskLevel
          );

        }

      }, 5000);


    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {

      if (
        voiceIntervalRef.current
      ) {

        clearInterval(
          voiceIntervalRef.current
        );

        voiceIntervalRef.current =
          null;

      }

      if (
        "speechSynthesis" in window
      ) {

        window.speechSynthesis.cancel();

      }

    };

  }, [
    riskLevel,
    voiceAlertStopped
  ]);


  // ==================================================
  // LOAD HEALTH DATA

  
  // ==================================================


  // ==================================================
// 📡 LOAD HEALTH DATA
// 🌐 ONLINE API + 📡 ESP32 LOCAL API FALLBACK
// ==================================================

useEffect(() => {

  const Hdata = async () => {

    let data = null;
    let source = "NONE";

    // ==================================================
    // 1️⃣ FIRST TRY ONLINE API
    // ==================================================

    try {

      console.log("🌐 Trying ONLINE API...");

      const response = await fetch(
        "https://healthtrackb.onrender.com/api/health/gethealthdata",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(3000),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Online API HTTP ${response.status}`
        );
      }

      data = await response.json();

      source = "ONLINE";

      console.log(
        "🟢 ONLINE API CONNECTED"
      );

      console.log(
        "🌐 ONLINE DATA:",
        data
      );

    } catch (onlineError) {

      console.log(
        "🟡 ONLINE API unavailable"
      );

      console.log(
        "📡 Switching to ESP32 LOCAL API..."
      );


      // ==================================================
      // 2️⃣ TRY ESP32 LOCAL API
      // ==================================================

      try {

        const localResponse = await fetch(
          "http://192.168.4.1/api/data",
          {
            method: "GET",
            signal: AbortSignal.timeout(2000),
          }
        );

        if (!localResponse.ok) {
          throw new Error(
            `ESP32 HTTP ${localResponse.status}`
          );
        }

        const esp32 = await localResponse.json();

        console.log(
          "🟢 ESP32 LOCAL API CONNECTED"
        );

        console.log(
          "📡 ESP32 DATA:",
          esp32
        );


        // ==================================================
        // CONVERT ESP32 DATA → DASHBOARD FORMAT
        // ==================================================

        data = {

          hd: {

            heartRate:
              esp32.heart_rate ??
              esp32.heartRate ??
              0,

            spo2:
              esp32.spo2 ??
              0,

            temp:
              esp32.temperature ??
              esp32.body_temperature ??
              esp32.bodyTemperature ??
              0,

          },

          humidity:
            esp32.humidity ??
            0,

          dust:
            esp32.dust ??
            esp32.dust_density ??
            esp32.dustDensity ??
            0,

          riskLevel:
            esp32.status ??
            esp32.ml_status ??
            esp32.mlStatus ??
            "Normal",

          riskScore:
            esp32.confidence ??
            esp32.ml_confidence ??
            0,

          datatimers:
            esp32.datatimers ??
            [],

        };

        source = "OFFLINE";


      } catch (localError) {

        console.error(
          "🔴 ESP32 LOCAL API also unavailable",
          localError
        );

        data = null;

      }

    }


    // ==================================================
    // 3️⃣ NO DATA FROM BOTH APIs
    // ==================================================

    if (!data) {

      setHealthd({

        heartRate: 0,

        spo2: 0,

        temp: 0,

      });

      setRiskScore(0);

      setRiskLevel(
        "Normal"
      );

      setHealthData([]);

      return;

    }


    // ==================================================
    // 4️⃣ HEART RATE
    // ==================================================

    const heartRate = Number(
      data.hd?.heartRate ??
      data.heart_rate ??
      data.heartRate ??
      0
    );


    // ==================================================
    // 5️⃣ SpO2
    // ==================================================

    const spo2 = Number(
      data.hd?.spo2 ??
      data.spo2 ??
      0
    );


    // ==================================================
    // 6️⃣ BODY TEMPERATURE
    // ==================================================

    const temperature = Number(
      data.hd?.temp ??
      data.temperature ??
      data.body_temperature ??
      data.bodyTemperature ??
      0
    );


    // ==================================================
    // 7️⃣ UPDATE HEALTH CARDS
    // ==================================================

    setHealthd({

      heartRate:
        heartRate,

      spo2:
        spo2,

      // ESP32 temperature = Celsius
      // Dashboard displays Fahrenheit

      temp:
        temperature !== 0
          ? (
              (temperature * 1.8) +
              32
            ).toFixed(1)
          : 0,

    });


    // ==================================================
    // 8️⃣ TINYML RISK LEVEL
    // ==================================================

    let newRiskLevel =
      data.riskLevel ??
      data.status ??
      "Normal";


    // ESP32 → Dashboard labels

    if (
      newRiskLevel === "Critical" ||
      newRiskLevel === "Abnormal"
    ) {

      newRiskLevel =
        "Critical Risk";

    }

    else if (
      newRiskLevel === "Warning"
    ) {

      newRiskLevel =
        "High Risk";

    }


    // ==================================================
    // 9️⃣ TINYML RISK SCORE
    // ==================================================

    let newRiskScore = Number(
      data.riskScore ??
      0
    );


    // Confidence can be:
    // 0.00 → 1.00
    // OR
    // 0 → 100

    if (
      newRiskScore > 0 &&
      newRiskScore <= 1
    ) {

      newRiskScore =
        Math.round(
          newRiskScore * 100
        );

    }


    // Keep score inside 0–100

    newRiskScore =
      Math.max(
        0,
        Math.min(
          100,
          newRiskScore
        )
      );


    // ==================================================
    // 🔟 SAVE RISK DATA
    // ==================================================

    setRiskScore(
      newRiskScore
    );

    setRiskLevel(
      newRiskLevel
    );


    // ==================================================
    // 1️⃣1️⃣ HEALTH TREND
    // ==================================================

    setHealthData(
      data.datatimers ??
      []
    );


    // ==================================================
    // 1️⃣2️⃣ CONNECTION STATUS
    // ==================================================

    if (source === "ONLINE") {

      console.log(
        "🟢 DATA SOURCE: ONLINE API"
      );

    }

    else if (source === "OFFLINE") {

      console.log(
        "🟡 DATA SOURCE: ESP32 LOCAL API"
      );

    }

  };


  // ==================================================
  // INITIAL DATA LOAD
  // ==================================================

  Hdata();


  // ==================================================
  // AUTO REFRESH EVERY 3 SECONDS
  // ==================================================

  const interval =
    setInterval(() => {

      Hdata();

    }, 3000);


  // ==================================================
  // CLEANUP
  // ==================================================

  return () => {

    clearInterval(
      interval
    );

  };

}, []);
  

  // useEffect(() => {

  //   const Hdata = async () => {

  //     try {

  //       const response =
  //         await fetch(
  //           "https://healthtrackb.onrender.com/api/health/gethealthdata",
  //           {
  //             method: "GET",

  //             credentials: "include",

  //             headers: {
  //               "Content-Type":
  //                 "application/json",
  //             },
  //           }
  //         );


  //       console.log(
  //         "STATUS:",
  //         response.status
  //       );

  //       console.log(
  //         "OK:",
  //         response.ok
  //       );


  //       const data =
  //         await response.json();


  //       console.log(
  //         "🔥 COMPLETE HEALTH DATA:",
  //         data
  //       );

  //       console.log(
  //         "🔥 HD:",
  //         data.hd
  //       );

  //       console.log(
  //         "🔥 HEART RATE:",
  //         data.hd?.heartRate
  //       );

  //       console.log(
  //         "🔥 SPO2:",
  //         data.hd?.spo2
  //       );

  //       console.log(
  //         "🔥 TEMP:",
  //         data.hd?.temp
  //       );

  //       console.log(
  //         "🔥 RISK SCORE:",
  //         data.riskScore
  //       );

  //       console.log(
  //         "🔥 RISK LEVEL:",
  //         data.riskLevel
  //       );

  //       console.log(
  //         "🔥 RECOMMENDATIONS:",
  //         data.recommendations
  //       );


  //       // ==================================================
  //       // NO DEVICE DATA
  //       // ==================================================

  //       if (!data.hd) {

  //         console.log(
  //           "⚠️ No device data available"
  //         );


  //         setHealthd({
  //           heartRate: 0,
  //           spo2: 0,
  //           temp: 0,
  //         });


  //         setRiskScore(
  //           data.riskScore ?? 0
  //         );


  //         setRiskLevel(
  //           data.riskLevel ??
  //           "Normal"
  //         );


  //         setHealthData(
  //           data.datatimers ?? []
  //         );


  //         return;
  //       }


  //       // ==================================================
  //       // DEVICE DATA AVAILABLE
  //       // ==================================================

  //       setHealthd({

  //         heartRate:
  //           data.hd.heartRate ??
  //           0,

  //         spo2:
  //           data.hd.spo2 ??
  //           0,

  //         temp:
  //           data.hd.temp != null
  //             ? (
  //                 (data.hd.temp * 1.8) +
  //                 32
  //               ).toFixed(1)
  //             : 0,

  //       });


  //       // ==================================================
  //       // 🤖 RISK DATA
  //       // ==================================================

  //       const newRiskLevel =
  //         data.riskLevel ??
  //         "Normal";

  //       const newRiskScore =
  //         data.riskScore ??
  //         0;


  //       // ==================================================
  //       // SAVE RISK DATA
  //       // ==================================================

  //       setRiskScore(
  //         newRiskScore
  //       );

  //       setRiskLevel(
  //         newRiskLevel
  //       );

  //       setHealthData(
  //         data.datatimers ?? []
  //       );

  //     } catch (error) {

  //       console.error(
  //         "❌ Health data fetch error:",
  //         error
  //       );


  //       setHealthd({
  //         heartRate: 0,
  //         spo2: 0,
  //         temp: 0,
  //       });


  //       setRiskScore(0);

  //       setRiskLevel(
  //         "Normal"
  //       );

  //       setHealthData([]);

  //     }

  //   };


  //   // ==================================================
  //   // INITIAL FETCH
  //   // ==================================================

  //   Hdata();


  //   // ==================================================
  //   // AUTO REFRESH EVERY 4 SECONDS
  //   // ==================================================

  //   const interval =
  //     setInterval(() => {

  //       Hdata();

  //     }, 3000);


  //   // // ==================================================
  //   // // CLEANUP
  //   // // ==================================================

  //   return () => {

  //     clearInterval(
  //       interval
  //     );

  //     if (
  //       "speechSynthesis" in window
  //     ) {

  //       window.speechSynthesis.cancel();

  //     }

  //   };

  // }, []);


  // ==================================================
  // DANGER CHECK
  // ==================================================

  const isDangerous =
    riskLevel === "High Risk" ||
    riskLevel === "Critical Risk";


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="dashboard">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        isOpen={menuOpen}
      />


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="main">


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="header">

          <div className="header-left">

            <button
              className="menu-btn"
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
            >

              <Menu size={28} />

            </button>


            <div>

              <h1>

                Good Morning, Sonu!
                <span>👋</span>

              </h1>


              <p>
                Here's your health overview
              </p>

            </div>

          </div>


          <div className="header-right">

            <div
              onClick={() =>
                navigate("/alerts")
              }
              className="notification"
            >

              <TriangleAlert
                size={28}
              />

            </div>


            <div className="profile-avatar">

              A

            </div>

          </div>

        </header>


        {/* ==================================================
            TOP HEALTH CARDS
        ================================================== */}

        <section className="health-cards">


          {/* HEART RATE */}

          <HealthCard

            title="Heart Rate"

            value={
              healthd.heartRate
            }

            unit="BPM"

            icon={<HeartPulse />}

            type="heart"

            comparison="↑ 22% vs last hour"

            data={[
              72, 75, 70,
              82, 78, 88,
              85, 92, 118
            ]}

          />


          {/* SPO2 */}

          <HealthCard

            title="SpO₂"

            value={
              healthd.spo2
            }

            unit="%"

            icon={<Droplets />}

            type="spo2"

            comparison="↓ 2% vs last hour"

            data={[
              96, 97, 95,
              96, 95, 97,
              94, 95, 96
            ]}

          />


          {/* TEMPERATURE */}

          <HealthCard

            title="Temperature"

            value={
              healthd.temp
            }

            unit="F"

            icon={<Thermometer />}

            type="temperature"

            comparison="↑ 2.1°C vs last hour"

            data={[
              36.8,
              37,
              37.2,
              37.5,
              37.8,
              38,
              38.5,
              38.7,
              39.1,
            ]}

          />


          {/* ACTIVITY */}

          <HealthCard

            title="Activity"

            value="High"

            unit=""

            icon={<Footprints />}

            type="activity"

            comparison="↑ 24% vs last hour"

            data={
              activityData
            }

          />

        </section>


        {/* ==================================================
            SECOND ROW
        ================================================== */}

        <section className="middle-grid">


          {/* ==================================================
              AI RISK SCORE
          ================================================== */}

          <div
            className={`card risk-card ${
              riskLevel ===
                "High Risk" ||
              riskLevel ===
                "Critical Risk"
                ? "risk-blink"
                : ""
            }`}
          >

            <div className="risk-meter">

              <div className="gauge">

                <div className="gauge-score">

                  <strong>
                   
                    {riskScore}
                  </strong>

                  <small>
                    /100
                  </small>

                </div>


                <div className="gauge-label">

                  {riskLevel}

                </div>

              </div>

            </div>


            <div
              className={`risk-warning ${
                isDangerous
                  ? "danger-blink"
                  : ""
              }`}
            >

              <strong>

                You are at{" "}
                {riskLevel}.

              </strong>


              <span>

                {isDangerous

                  ? "Immediate attention recommended!"

                  : "Continue monitoring your health."

                }

              </span>

            </div>


            {/* ==================================================
                🔇 STOP VOICE ALERT BUTTON
            ================================================== */}

            {isDangerous && (

              <button
                className="stop-voice-btn"
                onClick={() => {

                  setVoiceAlertStopped(
                    true
                  );

                  if (
                    "speechSynthesis" in window
                  ) {

                    window.speechSynthesis.cancel();

                  }

                  if (
                    voiceIntervalRef.current
                  ) {

                    clearInterval(
                      voiceIntervalRef.current
                    );

                    voiceIntervalRef.current =
                      null;

                  }

                }}
              >

                🔇 Stop Voice Alert

              </button>

            )}


            <button
              className="risk-link"
              onClick={() =>
                navigate(
                  "/risk-analysis"
                )
              }
            >

              View Risk Analysis

              <ChevronRight
                size={14}
              />

            </button>

          </div>


          {/* ==================================================
              HEALTH TREND
          ================================================== */}

          <div className="card trend-card">

            <div className="trend-header">

              <h3>
                Today's Health Trend
              </h3>

            </div>


            <div className="trend-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={healthData}
                >

                  <defs>

                    <linearGradient
                      id="healthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#ff5d62"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#ff5d62"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>


                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#8d95a5",
                    }}
                  />


                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: "#8d95a5",
                    }}
                    domain={[
                      0,
                      100
                    ]}
                    ticks={[
                      0,
                      25,
                      50,
                      75,
                      100
                    ]}
                  />


                  <Tooltip />


                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#ed5359"
                    strokeWidth={2}
                    fill="url(#healthGradient)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>


            <div className="trend-status">

              <span>

                <i className="low"></i>

                Low (0–53)

              </span>


              <span>

                <i className="moderate"></i>

                Moderate (31–66)

              </span>


              <span>

                <i className="high"></i>

                High (61–100)

              </span>

            </div>

          </div>

        </section>


        {/* ==================================================
            BOTTOM GRID
        ================================================== */}

        <section className="bottom-grid">


          {/* ==================================================
              ENVIRONMENT
          ================================================== */}

          <div className="card environment-card">

            <div className="section-header">

              <div>

                <h3>
                  Environment Overview
                </h3>

              </div>


              <button
                onClick={() =>
                  navigate(
                    "/environment"
                  )
                }
              >
                View all
              </button>

            </div>


            <div className="environment-items">


              <div className="environment-item">

                <div className="env-icon orange">

                  <Sun size={17} />

                </div>


                <div>

                  <span>
                    Heat Index
                  </span>

                  <strong>
                    42°C
                  </strong>

                </div>

              </div>


              <div className="environment-item">

                <div className="env-icon gray">

                  <Wind size={17} />

                </div>


                <div>

                  <span>
                    AQI
                  </span>

                  <strong>
                    186
                  </strong>

                </div>

              </div>


              <div className="environment-item">

                <div className="env-icon blue">

                  <Droplets
                    size={17}
                  />

                </div>


                <div>

                  <span>
                    Humidity
                  </span>

                  <strong>
                    71%
                  </strong>

                </div>

              </div>


              <div className="environment-item">

                <div className="env-icon red">

                  <Thermometer
                    size={17}
                  />

                </div>


                <div>

                  <span>
                    Heat Alert
                  </span>

                  <strong>
                    High
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              RECENT ALERTS
          ================================================== */}

          <div className="card alerts-card">

            <div className="section-header">

              <h3>
                Recent Alerts
              </h3>


              <button
                onClick={() =>
                  navigate(
                    "/alerts"
                  )
                }
              >
                View all
              </button>

            </div>


            <Alert

              icon={
                <AlertTriangle />
              }

              title="High Heat Stress Risk"

              time="16 May 2025, 08:10 AM"

              level="High"

              high

            />


            <Alert

              icon={
                <Droplets />
              }

              title="Hydration Level Low"

              time="16 May 2025, 06:30 AM"

              level="Medium"

            />


            <Alert

              icon={
                <Activity />
              }

              title="AQI Level Unhealthy"

              time="16 May 2025, 07:40 AM"

              level="Medium"

            />

          </div>


          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="card quick-card">

            <div className="section-header">

              <h3>
                Quick Actions
              </h3>

            </div>


            <button className="quick-action">

              <span className="qa-icon blue">

                <Activity
                  size={15}
                />

              </span>

              Start Health Scan

            </button>


            <button className="quick-action">

              <span className="qa-icon blue">

                <Droplets
                  size={15}
                />

              </span>

              Water Reminder

            </button>


            <button className="quick-action">

              <span className="qa-icon green">

                <Pill
                  size={15}
                />

              </span>

              Medication Reminder

            </button>


            <button className="quick-action">

              <span className="qa-icon red">

                <FileText
                  size={15}
                />

              </span>

              Share Health Report

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}


// ==================================================
// HEALTH CARD COMPONENT
// ==================================================

function HealthCard({
  title,
  value,
  unit,
  icon,
  type,
  comparison,
  data,
}) {

  const max =
    Math.max(...data);

  const min =
    Math.min(...data);


  const points =
    data
      .map(
        (value, index) => {

          const x =
            (index /
              (data.length - 1)) *
            100;


          const y =
            38 -
            (
              (value - min) /
              (max - min || 1)
            ) *
            30;


          return `${x},${y}`;

        }
      )
      .join(" ");


  return (

    <div
      className={`health-card ${type}`}
    >

      <div className="health-card-top">

        <div className="health-title">

          <span className="metric-icon">

            {React.cloneElement(
              icon,
              {
                size: 17,
              }
            )}

          </span>


          <span>
            {title}
          </span>

        </div>

      </div>


      <div className="metric-value">

        <strong>
          {value}
        </strong>

        <span>
          {unit}
        </span>

      </div>


      <div className="comparison">

        {comparison}

      </div>


      <div className="mini-chart">

        {type === "activity" ? (

          <div className="activity-bars">

            {data.map(
              (height, i) => (

                <span
                  key={i}
                  style={{
                    height:
                      `${height}%`,
                  }}
                ></span>

              )
            )}

          </div>

        ) : (

          <svg
            viewBox="0 0 100 45"
            preserveAspectRatio="none"
          >

            <polyline
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              vectorEffect="non-scaling-stroke"
            />

          </svg>

        )}

      </div>

    </div>
  );
}


// ==================================================
// ALERT COMPONENT
// ==================================================

function Alert({
  icon,
  title,
  time,
  level,
  high,
}) {

  return (

    <div className="alert-row">

      <div
        className={`alert-icon ${
          high
            ? "danger"
            : "warning"
        }`}
      >

        {React.cloneElement(
          icon,
          {
            size: 14,
          }
        )}

      </div>


      <div className="alert-info">

        <strong>
          {title}
        </strong>

        <span>
          {time}
        </span>

      </div>


      <span
        className={`alert-level ${
          high
            ? "high-level"
            : ""
        }`}
      >

        {level}

      </span>

    </div>
  );
}


export default Dashboard;
