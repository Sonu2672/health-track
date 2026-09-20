import React from "react";
import { useState, useEffect, useRef } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import { TriangleAlert, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  HeartPulse,
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
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
} from "recharts";

// ==================================================
// 🌐 API CONFIGURATION
// ==================================================

const BACKEND_URL =
  "https://healthtrackb.onrender.com";

// ==================================================
// API 1
// ESP32 → Backend → MongoDB
//
// POST /api/health/healthdata
//
// IMPORTANT:
// Dashboard DOES NOT call this API.
// ESP32 .ino will call this endpoint.
// ==================================================

const ESP32_UPLOAD_API =
  `${BACKEND_URL}/api/health/healthdata`;

// ==================================================
// API 2
// MongoDB → Backend → Dashboard
//
// GET /api/health/getHealthData
// ==================================================

const ONLINE_GET_API =
  `${BACKEND_URL}/api/health/getHealthData`;

// ==================================================
// API 3
// ESP32 → Dashboard
//
// OFFLINE LOCAL ESP32 API
// GET /data
// ==================================================

const ESP32_LOCAL_API =
  "http://192.168.4.1/data";

// ==================================================
// ACTIVITY DATA
// ==================================================

const activityData = [
  15,
  22,
  17,
  31,
  24,
  38,
  25,
  43,
  30,
  35,
  28,
  45,
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

    if (
      !("speechSynthesis" in window)
    ) {

      console.log(
        "❌ Speech synthesis not supported"
      );

      return;
    }

    let message = "";

    if (
      level === "Critical Risk"
    ) {

      message =
        "Critical health risk detected. Please take immediate action.";

    }

    else if (
      level === "High Risk"
    ) {

      message =
        "Warning. High health risk detected. Please check your health condition.";

    }

    else {

      return;

    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        message
      );

    speech.lang = "hi-IN";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

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
  // 🔔 ONESIGNAL
  // ==================================================

  useEffect(() => {

    if (
      window._oneSignalInitialized
    ) {

      return;

    }

    window._oneSignalInitialized =
      true;

    window.OneSignal =
      window.OneSignal || [];

    window.OneSignal.push(
      async function () {

        try {

          await window.OneSignal.init({
            appId:
              "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",

            allowLocalhostAsSecureOrigin:
              true,
          });

          console.log(
            "OneSignal Initialized Successfully"
          );

          await window.OneSignal.Slidedown.promptPush();

          const playerId =
            window.OneSignal
              .User
              .PushSubscription
              .id;

          if (playerId) {

            console.log(
              "🔥 Player ID Found:",
              playerId
            );

            const response =
              await fetch(
                `${BACKEND_URL}/api/devicedata/onesignalid`,
                {
                  method: "POST",

                  credentials:
                    "include",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body:
                    JSON.stringify({
                      playerId,
                    }),
                }
              );

            const data =
              await response.json();

            console.log(
              "✅ Backend Save Response:",
              data
            );

          }

          else {

            console.log(
              "⚠️ Player ID not generated yet"
            );

          }

        }

        catch (error) {

          if (
            !error.message?.includes(
              "already initialized"
            )
          ) {

            console.error(
              "Error during OneSignal init:",
              error
            );

          }

        }

      }
    );

  }, []);

  // ==================================================
  // 🔊 START / STOP VOICE ALERT
  // ==================================================

  useEffect(() => {

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

    if (
      riskLevel !== "High Risk" &&
      riskLevel !== "Critical Risk"
    ) {

      setVoiceAlertStopped(false);

      return;

    }

    if (voiceAlertStopped) {

      console.log(
        "🔇 Voice alert stopped by user"
      );

      return;

    }

    speakRiskAlert(
      riskLevel
    );

    voiceIntervalRef.current =
      setInterval(
        () => {

          if (
            !voiceAlertStopped &&
            (
              riskLevel ===
                "High Risk" ||
              riskLevel ===
                "Critical Risk"
            )
          ) {

            speakRiskAlert(
              riskLevel
            );

          }

        },
        5000
      );

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
    voiceAlertStopped,
  ]);

  // ==================================================
  // 📡 HEALTH DATA
  //
  // 3 API ARCHITECTURE
  //
  // API 1:
  // POST /api/health/healthdata
  //
  // ESP32 → Backend → MongoDB
  //
  // Dashboard does NOT call it.
  //
  //
  // API 2:
  // GET /api/health/getHealthData
  //
  // MongoDB → Backend → Dashboard
  //
  //
  // API 3:
  // GET http://192.168.4.1/data
  //
  // ESP32 → Dashboard
  //
  // Online GET has priority.
  // If online fails → local ESP32.
  // ==================================================

  useEffect(() => {

    let isMounted = true;

    // ==================================================
    // FETCH WITH TIMEOUT
    // ==================================================

    const fetchWithTimeout =
      async (
        url,
        options = {},
        timeout = 5000
      ) => {

        const controller =
          new AbortController();

        const timer =
          setTimeout(
            () =>
              controller.abort(),
            timeout
          );

        try {

          const response =
            await fetch(
              url,
              {
                ...options,

                signal:
                  controller.signal,
              }
            );

          return response;

        }

        finally {

          clearTimeout(
            timer
          );

        }

      };

    // ==================================================
    // CONVERT ESP32 LOCAL DATA
    // INTO COMMON DASHBOARD FORMAT
    // ==================================================

    const convertESP32Data =
      (esp32) => {

        return {

          hd: {

            heartRate:
              esp32?.heart_rate ??
              esp32?.heartRate ??
              esp32?.hr ??
              0,

            spo2:
              esp32?.spo2 ??
              esp32?.SpO2 ??
              esp32?.oxygen ??
              0,

            temp:
              esp32?.temperature ??
              esp32?.body_temperature ??
              esp32?.bodyTemperature ??
              esp32?.temp ??
              0,

          },

          humidity:
            esp32?.humidity ??
            0,

          dust:
            esp32?.dust ??
            esp32?.dust_density ??
            esp32?.dustDensity ??
            0,

          riskLevel:
            esp32?.riskLevel ??
            esp32?.status ??
            esp32?.ml_status ??
            esp32?.mlStatus ??
            "Normal",

          riskScore:
            esp32?.riskScore ??
            esp32?.confidence ??
            esp32?.ml_confidence ??
            0,

          datatimers:
            Array.isArray(
              esp32?.datatimers
            )
              ? esp32.datatimers
              : [],

        };

      };

    // ==================================================
    // NORMALIZE RISK LEVEL
    // ==================================================

    const normalizeRiskLevel =
      (level) => {

        if (!level) {

          return "Normal";

        }

        const normalized =
          String(level)
            .trim()
            .toLowerCase();

        if (
          normalized ===
            "critical" ||
          normalized ===
            "critical risk" ||
          normalized ===
            "abnormal"
        ) {

          return "Critical Risk";

        }

        if (
          normalized ===
            "warning" ||
          normalized ===
            "high" ||
          normalized ===
            "high risk"
        ) {

          return "High Risk";

        }

        return "Normal";

      };

    // ==================================================
    // NORMALIZE RISK SCORE
    // ==================================================

    const normalizeRiskScore =
      (value) => {

        let score =
          Number(value ?? 0);

        if (
          !Number.isFinite(score)
        ) {

          score = 0;

        }

        // 0.00 - 1.00 → percentage

        if (
          score > 0 &&
          score <= 1
        ) {

          score =
            Math.round(
              score * 100
            );

        }

        return Math.max(
          0,
          Math.min(
            100,
            Math.round(score)
          )
        );

      };

    // ==================================================
    // MAIN HEALTH DATA FUNCTION
    // ==================================================

    const Hdata = async () => {

      let data = null;

      let source = "NONE";

      // ==================================================
      // 1️⃣ ONLINE BACKEND
      //
      // GET /api/health/getHealthData
      // ==================================================

      try {

        console.log(
          "🌐 Trying ONLINE BACKEND..."
        );

        const response =
          await fetchWithTimeout(

            ONLINE_GET_API,

            {
              method: "GET",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },
            },

            6000

          );

        console.log(
          "🌐 ONLINE STATUS:",
          response.status
        );

        if (!response.ok) {

          throw new Error(
            `Online API HTTP ${response.status}`
          );

        }

        const result =
          await response.json();

        console.log(
          "🟢 ONLINE RESPONSE:",
          result
        );

        // Supports:
        //
        // { hd: {...} }
        //
        // OR
        //
        // { data: {...} }

        data =
          result?.data ??
          result;

        source =
          "ONLINE";

        console.log(
          "🟢 DATA SOURCE: ONLINE BACKEND"
        );

      }

      catch (onlineError) {

        console.warn(
          "🟡 ONLINE API FAILED:",
          onlineError.message
        );

        console.log(
          "📡 Trying LOCAL ESP32..."
        );

        // ==================================================
        // 2️⃣ OFFLINE ESP32
        //
        // GET /data
        // ==================================================

        try {

          const localResponse =
            await fetchWithTimeout(

              ESP32_LOCAL_API,

              {
                method: "GET",

                headers: {
                  "Content-Type":
                    "application/json",
                },
              },

              2500

            );

          console.log(
            "📡 ESP32 LOCAL STATUS:",
            localResponse.status
          );

          if (!localResponse.ok) {

            throw new Error(
              `ESP32 HTTP ${localResponse.status}`
            );

          }

          const esp32 =
            await localResponse.json();

          console.log(
            "🟢 ESP32 LOCAL RESPONSE:",
            esp32
          );

          data =
            convertESP32Data(
              esp32
            );

          source =
            "OFFLINE";

          console.log(
            "🟡 DATA SOURCE: ESP32 LOCAL /data"
          );

        }

        catch (localError) {

          console.error(
            "🔴 BOTH ONLINE AND LOCAL APIs FAILED:",
            localError.message
          );

          data = null;

          source = "NONE";

        }

      }

      // ==================================================
      // 3️⃣ NO DATA
      // ==================================================

      if (
        !data ||
        !isMounted
      ) {

        if (!isMounted) {

          return;

        }

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

      const heartRate =
        Number(

          data?.hd?.heartRate ??

          data?.heart_rate ??

          data?.heartRate ??

          data?.hr ??

          0

        );

      // ==================================================
      // 5️⃣ SpO2
      // ==================================================

      const spo2 =
        Number(

          data?.hd?.spo2 ??

          data?.spo2 ??

          data?.SpO2 ??

          data?.oxygen ??

          0

        );

      // ==================================================
      // 6️⃣ TEMPERATURE
      // ==================================================

      const temperature =
        Number(

          data?.hd?.temp ??

          data?.temperature ??

          data?.body_temperature ??

          data?.bodyTemperature ??

          data?.temp ??

          0

        );

      // ==================================================
      // 7️⃣ UPDATE HEALTH CARDS
      // ==================================================

      setHealthd({

        heartRate:
          Number.isFinite(
            heartRate
          )
            ? heartRate
            : 0,

        spo2:
          Number.isFinite(
            spo2
          )
            ? spo2
            : 0,

        // ESP32 temperature:
        // Celsius → Fahrenheit

        temp:
          temperature !== 0 &&
          Number.isFinite(
            temperature
          )

            ? (
                temperature *
                  1.8 +
                32
              ).toFixed(1)

            : 0,

      });

      // ==================================================
      // 8️⃣ RISK LEVEL
      // ==================================================

      const rawRiskLevel =
        data?.riskLevel ??
        data?.status ??
        data?.ml_status ??
        data?.mlStatus ??
        "Normal";

      const newRiskLevel =
        normalizeRiskLevel(
          rawRiskLevel
        );

      // ==================================================
      // 9️⃣ RISK SCORE
      // ==================================================

      const rawRiskScore =
        data?.riskScore ??
        data?.confidence ??
        data?.ml_confidence ??
        0;

      const newRiskScore =
        normalizeRiskScore(
          rawRiskScore
        );

      // ==================================================
      // 🔟 SAVE RISK
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

      let trendData = [];

      if (
        Array.isArray(
          data?.datatimers
        )
      ) {

        trendData =
          data.datatimers;

      }

      else if (
        Array.isArray(
          data?.data?.datatimers
        )
      ) {

        trendData =
          data.data.datatimers;

      }

      setHealthData(
        trendData
      );

      // ==================================================
      // 1️⃣2️⃣ SOURCE LOG
      // ==================================================

      if (
        source === "ONLINE"
      ) {

        console.log(
          "🌐 FINAL SOURCE: BACKEND / MONGODB"
        );

      }

      else if (
        source === "OFFLINE"
      ) {

        console.log(
          "📡 FINAL SOURCE: ESP32 /data"
        );

      }

    };

    // ==================================================
    // INITIAL LOAD
    // ==================================================

    Hdata();

    // ==================================================
    // AUTO REFRESH EVERY 3 SECONDS
    // ==================================================

    const interval =
      setInterval(
        () => {

          Hdata();

        },
        3000
      );

    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {

      isMounted = false;

      clearInterval(
        interval
      );

    };

  }, []);

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

      {/* SIDEBAR */}

      <Sidebar
        isOpen={menuOpen}
      />

      {/* MAIN */}

      <main className="main">

        {/* HEADER */}

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

                <span>
                  👋
                </span>

              </h1>

              <p>
                Here's your health overview
              </p>

            </div>

          </div>

          <div className="header-right">

            <div
              onClick={() =>
                navigate(
                  "/alerts"
                )
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

          <HealthCard

            title="Heart Rate"

            value={
              healthd.heartRate
            }

            unit="BPM"

            icon={
              <HeartPulse />
            }

            type="heart"

            comparison="Live ESP32 data"

            data={[
              72,
              75,
              70,
              82,
              78,
              88,
              85,
              92,
              118,
            ]}

          />

          <HealthCard

            title="SpO₂"

            value={
              healthd.spo2
            }

            unit="%"

            icon={
              <Droplets />
            }

            type="spo2"

            comparison="Live ESP32 data"

            data={[
              96,
              97,
              95,
              96,
              95,
              97,
              94,
              95,
              96,
            ]}

          />

          <HealthCard

            title="Temperature"

            value={
              healthd.temp
            }

            unit="F"

            icon={
              <Thermometer />
            }

            type="temperature"

            comparison="Live ESP32 data"

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

          <HealthCard

            title="Activity"

            value="High"

            unit=""

            icon={
              <Footprints />
            }

            type="activity"

            comparison="Activity status"

            data={
              activityData
            }

          />

        </section>

        {/* ==================================================
            SECOND ROW
        ================================================== */}

        <section className="middle-grid">

          {/* AI RISK SCORE */}

          <div
            className={`card risk-card ${
              isDangerous
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

            {isDangerous && (

              <button
                className="stop-voice-btn"
                onClick={() => {

                  setVoiceAlertStopped(
                    true
                  );

                  if (
                    "speechSynthesis"
                    in window
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
                  data={
                    healthData
                  }
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

          {/* ENVIRONMENT */}

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

          {/* RECENT ALERTS */}

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

          {/* QUICK ACTIONS */}

          <div className="card quick-card">

            <div className="section-header">

              <h3>
                Quick Actions
              </h3>

            </div>

            <button
              className="quick-action"
            >

              <span className="qa-icon blue">

                <Activity
                  size={15}
                />

              </span>

              Start Health Scan

            </button>

            <button
              className="quick-action"
            >

              <span className="qa-icon blue">

                <Droplets
                  size={15}
                />

              </span>

              Water Reminder

            </button>

            <button
              className="quick-action"
            >

              <span className="qa-icon green">

                <Pill
                  size={15}
                />

              </span>

              Medication Reminder

            </button>

            <button
              className="quick-action"
            >

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
            data.length > 1
              ? (
                  index /
                  (data.length - 1)
                ) * 100
              : 50;

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
