import  { useEffect, useState } from "react";


import React from "react";
import { useState, useEffect, useRef } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import { TriangleAlert, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";


import {
  Activity,
  HeartPulse,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  User,
  LogOut,
  Menu,
  Wifi,
  WifiOff,
  Brain,
  RefreshCw,
  Stethoscope,
} from "lucide-react";



// ================================================================
//                         API CONFIG
// ================================================================

// ONLINE BACKEND
const ONLINE_GET_API =
  "https://healthtrackb.onrender.com/api/health/getHealthData";

// ESP32 LOCAL API
const ESP32_LOCAL_API =
  "http://192.168.4.1/data";

// Refresh interval
const REFRESH_INTERVAL = 5000;

// ================================================================
//                         HELPERS
// ================================================================

const getOnlineData = async () => {
  const response = await fetch(
    ONLINE_GET_API,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Online API Error: ${response.status}`
    );
  }

  return await response.json();
};

const getLocalData = async () => {
  const response = await fetch(
    ESP32_LOCAL_API,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `ESP32 API Error: ${response.status}`
    );
  }

  return await response.json();
};

// ================================================================
//                 NORMALIZE ONLINE DATA
// ================================================================

const normalizeOnlineData = (response) => {
  // Backend may return:
  // { data: {...} }
  // OR
  // direct object

  const result =
    response?.data ?? response;

  // Some backend responses may contain
  // health data inside "hd"
  const hd =
    result?.hd ?? result;

  return {
    deviceId:
      hd?.deviceId ??
      result?.deviceId ??
      "ESP32_HEALTH_01",

    heartRate:
      Number(
        hd?.heartRate ??
        hd?.heart_rate ??
        result?.heartRate ??
        result?.heart_rate ??
        0
      ),

    rawBPM:
      Number(
        hd?.rawBPM ??
        hd?.raw_bpm ??
        result?.rawBPM ??
        result?.raw_bpm ??
        0
      ),

    spo2:
      Number(
        hd?.spo2 ??
        hd?.SpO2 ??
        result?.spo2 ??
        result?.SpO2 ??
        0
      ),

    bodyTemperature:
      Number(
        hd?.bodyTemperature ??
        hd?.body_temperature ??
        result?.bodyTemperature ??
        0
      ),

    environmentTemperature:
      Number(
        hd?.environmentTemperature ??
        hd?.environment_temperature ??
        result?.environmentTemperature ??
        0
      ),

    humidity:
      Number(
        hd?.humidity ??
        result?.humidity ??
        0
      ),

    ecg:
      Number(
        hd?.ecg ??
        result?.ecg ??
        0
      ),

    ecgLeadOff:
      Boolean(
        hd?.ecgLeadOff ??
        hd?.ecg_lead_off ??
        result?.ecgLeadOff ??
        false
      ),

    dustDensity:
      Number(
        hd?.dustDensity ??
        hd?.dust_density ??
        result?.dustDensity ??
        0
      ),

    mlStatus:
      hd?.mlStatus ??
      hd?.ml_status ??
      result?.mlStatus ??
      result?.ml_status ??
      result?.status ??
      "NORMAL",

    mlConfidence:
      Number(
        hd?.mlConfidence ??
        hd?.ml_confidence ??
        result?.mlConfidence ??
        result?.ml_confidence ??
        result?.confidence ??
        0
      ),

    mlNormalScore:
      Number(
        hd?.mlNormalScore ??
        result?.mlNormalScore ??
        0
      ),

    mlWarningScore:
      Number(
        hd?.mlWarningScore ??
        result?.mlWarningScore ??
        0
      ),

    mlAbnormalScore:
      Number(
        hd?.mlAbnormalScore ??
        result?.mlAbnormalScore ??
        0
      ),

    datatimers:
      result?.datatimers ??
      hd?.datatimers ??
      [],

    recommendations:
      result?.recommendations ??
      hd?.recommendations ??
      [],
  };
};

// ================================================================
//                 NORMALIZE ESP32 LOCAL DATA
// ================================================================

const normalizeLocalData = (data) => {
  return {
    deviceId:
      data?.deviceId ??
      "ESP32_HEALTH_01",

    heartRate:
      Number(
        data?.heartRate ?? 0
      ),

    rawBPM:
      Number(
        data?.rawBPM ?? 0
      ),

    spo2:
      Number(
        data?.spo2 ?? 0
      ),

    bodyTemperature:
      Number(
        data?.bodyTemperature ?? 0
      ),

    environmentTemperature:
      Number(
        data?.environmentTemperature ?? 0
      ),

    humidity:
      Number(
        data?.humidity ?? 0
      ),

    ecg:
      Number(
        data?.ecg ?? 0
      ),

    ecgLeadOff:
      Boolean(
        data?.ecgLeadOff ?? false
      ),

    dustDensity:
      Number(
        data?.dustDensity ?? 0
      ),

    mlStatus:
      data?.mlStatus ??
      "NORMAL",

    mlConfidence:
      Number(
        data?.mlConfidence ?? 0
      ),

    mlNormalScore:
      Number(
        data?.mlNormalScore ?? 0
      ),

    mlWarningScore:
      Number(
        data?.mlWarningScore ?? 0
      ),

    mlAbnormalScore:
      Number(
        data?.mlAbnormalScore ?? 0
      ),

    datatimers: [],

    recommendations: [],
  };
};

// ================================================================
//                         DASHBOARD
// ================================================================

const Dashboard = () => {
  const navigate = useNavigate();

  // --------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------

  const [healthData, setHealthData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [connectionMode, setConnectionMode] =
    useState("checking");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [voiceAlertStopped, setVoiceAlertStopped] =
    useState(false);

  // ==============================================================
  //                      FETCH HEALTH DATA
  // ==============================================================

  const fetchHealthData = async () => {
    try {
      setRefreshing(true);

      // ----------------------------------------------------------
      // FIRST TRY ONLINE BACKEND
      // ----------------------------------------------------------

      try {
        const onlineResponse =
          await getOnlineData();

        const onlineData =
          normalizeOnlineData(
            onlineResponse
          );

        // Check whether online response
        // actually contains health data.

        const hasOnlineHealthData =
          onlineData.heartRate > 0 ||
          onlineData.spo2 > 0 ||
          onlineData.bodyTemperature > 0 ||
          onlineData.humidity > 0 ||
          onlineData.dustDensity > 0;

        if (hasOnlineHealthData) {
          setHealthData(
            onlineData
          );

          setConnectionMode(
            "online"
          );

          setLastUpdated(
            new Date()
          );

          setLoading(false);
          setRefreshing(false);

          return;
        }

        throw new Error(
          "Online health data unavailable"
        );
      } catch (onlineError) {
        console.log(
          "Online API unavailable:",
          onlineError
        );
      }

      // ----------------------------------------------------------
      // FALLBACK TO ESP32 LOCAL API
      // ----------------------------------------------------------

      try {
        const localResponse =
          await getLocalData();

        const localData =
          normalizeLocalData(
            localResponse
          );

        setHealthData(
          localData
        );

        setConnectionMode(
          "offline"
        );

        setLastUpdated(
          new Date()
        );

        setLoading(false);
        setRefreshing(false);

        return;
      } catch (localError) {
        console.log(
          "ESP32 Local API unavailable:",
          localError
        );
      }

      // ----------------------------------------------------------
      // BOTH FAILED
      // ----------------------------------------------------------

      setConnectionMode(
        "disconnected"
      );

      setLoading(false);

      toast.error(
        "Unable to connect to online backend or ESP32."
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // ==============================================================
  //                       INITIAL LOAD
  // ==============================================================

  useEffect(() => {
    fetchHealthData();

    const interval =
      setInterval(
        fetchHealthData,
        REFRESH_INTERVAL
      );

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==============================================================
  //                  NORMALIZED VALUES
  // ==============================================================

  const data =
    healthData ?? {
      heartRate: 0,
      rawBPM: 0,
      spo2: 0,
      bodyTemperature: 0,
      environmentTemperature: 0,
      humidity: 0,
      ecg: 0,
      ecgLeadOff: false,
      dustDensity: 0,
      mlStatus: "NORMAL",
      mlConfidence: 0,
      mlNormalScore: 0,
      mlWarningScore: 0,
      mlAbnormalScore: 0,
      datatimers: [],
      recommendations: [],
    };

  // ==============================================================
  //                  STATUS NORMALIZATION
  // ==============================================================

  const normalizedStatus =
    String(
      data.mlStatus ?? "NORMAL"
    ).toUpperCase();

  const isDangerous =
    normalizedStatus === "ABNORMAL" ||
    normalizedStatus === "CRITICAL" ||
    normalizedStatus === "DANGER";

  const isWarning =
    normalizedStatus === "WARNING" ||
    normalizedStatus === "WARN";

  const isNormal =
    !isDangerous &&
    !isWarning;

  // ==============================================================
  //                    CONFIDENCE
  // ==============================================================

  let confidence =
    Number(
      data.mlConfidence ?? 0
    );

  if (confidence <= 1) {
    confidence =
      confidence * 100;
  }

  confidence =
    Math.min(
      100,
      Math.max(
        0,
        confidence
      )
    );

  // ==============================================================
  //                    TEMPERATURE
  // ==============================================================

  const bodyTempF =
    data.bodyTemperature
      ? (
          data.bodyTemperature *
            9 /
            5
        ) + 32
      : 0;

  const environmentTempF =
    data.environmentTemperature
      ? (
          data.environmentTemperature *
            9 /
            5
        ) + 32
      : 0;

  // ==============================================================
  //                      ECG
  // ==============================================================

  const ecgText =
    data.ecgLeadOff
      ? "LEAD OFF"
      : data.ecg ?? 0;

  // ==============================================================
  //                     VOICE ALERT
  // ==============================================================

  useEffect(() => {
    if (
      isDangerous &&
      !voiceAlertStopped &&
      typeof window !==
        "undefined" &&
      "speechSynthesis" in window
    ) {
      const message =
        new SpeechSynthesisUtterance(
          "Warning. Abnormal health condition detected. Please check your health immediately."
        );

      message.rate = 0.9;
      message.pitch = 1;

      window.speechSynthesis.cancel();

      window.speechSynthesis.speak(
        message
      );
    }

    if (isNormal) {
      setVoiceAlertStopped(
        false
      );
    }
  }, [
    isDangerous,
    isNormal,
    voiceAlertStopped,
  ]);

  // ==============================================================
  //                      LOGOUT
  // ==============================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login"
    );
  };

  // ==============================================================
  //                     LOADING
  // ==============================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw
          size={35}
          className="loading-spin"
        />

        <p>
          Loading health data...
        </p>
      </div>
    );
  }

  // ==============================================================
  //                     DASHBOARD UI
  // ==============================================================

  return (
    <div className="dashboard-page">

      {/* ========================================================
                         SIDEBAR
      ========================================================= */}

      <aside
        className={
          sidebarOpen
            ? "dashboard-sidebar open"
            : "dashboard-sidebar"
        }
      >

        <div className="sidebar-logo">

          <div className="logo-icon">
            <HeartPulse
              size={25}
            />
          </div>

          <div>
            <h2>
              HealthTrack
            </h2>

            <span>
              AI Health Monitor
            </span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <button
            className="sidebar-item active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <Activity
              size={20}
            />

            <span>
              Dashboard
            </span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/health")
            }
          >
            <HeartPulse
              size={20}
            />

            <span>
              Health Data
            </span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/reports")
            }
          >
            <Calendar
              size={20}
            />

            <span>
              Reports
            </span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              navigate("/profile")
            }
          >
            <User
              size={20}
            />

            <span>
              Profile
            </span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="sidebar-item logout-item"
            onClick={
              handleLogout
            }
          >
            <LogOut
              size={20}
            />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ========================================================
                         MAIN CONTENT
      ========================================================= */}

      <main className="dashboard-main">

        {/* ======================================================
                             NAVBAR
        ======================================================= */}

        <header className="dashboard-navbar">

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            <Menu
              size={23}
            />
          </button>

          <div className="navbar-title">

            <h1>
              Health Dashboard
            </h1>

            <p>
              Real-time health monitoring
            </p>

          </div>

          <div className="navbar-actions">

            {/* CONNECTION STATUS */}

            <div
              className={
                connectionMode ===
                "online"
                  ? "connection-status online"
                  : connectionMode ===
                    "offline"
                  ? "connection-status offline"
                  : "connection-status disconnected"
              }
            >

              {connectionMode ===
              "online" ? (
                <>
                  <Wifi
                    size={17}
                  />

                  <span>
                    Online
                  </span>
                </>
              ) : connectionMode ===
                "offline" ? (
                <>
                  <WifiOff
                    size={17}
                  />

                  <span>
                    ESP32 Local
                  </span>
                </>
              ) : (
                <>
                  <WifiOff
                    size={17}
                  />

                  <span>
                    Disconnected
                  </span>
                </>
              )}

            </div>

            {/* REFRESH */}

            <button
              className="refresh-btn"
              onClick={
                fetchHealthData
              }
              disabled={
                refreshing
              }
              title="Refresh"
            >
              <RefreshCw
                size={19}
                className={
                  refreshing
                    ? "loading-spin"
                    : ""
                }
              />
            </button>

            {/* NOTIFICATION */}

            <button
              className="navbar-icon-btn"
              onClick={() =>
                navigate(
                  "/notifications"
                )
              }
            >
              <Bell
                size={20}
              />
            </button>

            {/* PROFILE */}

            <div className="navbar-profile">

              <div className="profile-avatar">
                <User
                  size={18}
                />
              </div>

            </div>

          </div>

        </header>

        {/* ======================================================
                       CONTENT
        ======================================================= */}

        <div className="dashboard-content">

          {/* ====================================================
                       CONNECTION INFO
          ===================================================== */}

          <div
            className={
              connectionMode ===
              "online"
                ? "connection-banner online-banner"
                : connectionMode ===
                  "offline"
                ? "connection-banner offline-banner"
                : "connection-banner error-banner"
            }
          >

            {connectionMode ===
            "online" ? (
              <>
                <Wifi
                  size={19}
                />

                <span>
                  Connected to online backend. Health data is being read from MongoDB.
                </span>
              </>
            ) : connectionMode ===
              "offline" ? (
              <>
                <WifiOff
                  size={19}
                />

                <span>
                  Internet unavailable. Connected directly to ESP32 local API.
                </span>
              </>
            ) : (
              <>
                <WifiOff
                  size={19}
                />

                <span>
                  Unable to connect to ESP32 or online backend.
                </span>
              </>
            )}

          </div>

          {/* ==================================================
                         HEALTH STATUS
          =================================================== */}

          <section className="health-status-section">

            <div
              className={
                isDangerous
                  ? "health-status-card danger"
                  : isWarning
                  ? "health-status-card warning"
                  : "health-status-card normal"
              }
            >

              <div className="status-icon">

                {isDangerous ? (
                  <AlertTriangle
                    size={35}
                  />
                ) : isWarning ? (
                  <AlertTriangle
                    size={35}
                  />
                ) : (
                  <ShieldCheck
                    size={35}
                  />
                )}

              </div>

              <div className="status-content">

                <span className="status-label">
                  AI Health Status
                </span>

                <h2>
                  {normalizedStatus}
                </h2>

                <p>
                  TinyML confidence:
                  {" "}
                  {confidence.toFixed(1)}%
                </p>

              </div>

              <div className="status-device">

                <span>
                  Device
                </span>

                <strong>
                  {data.deviceId}
                </strong>

              </div>

            </div>

          </section>

          {/* ==================================================
                       VITAL CARDS
          =================================================== */}

          <section className="vitals-grid">

            {/* HEART RATE */}

            <div className="vital-card">

              <div className="vital-card-top">

                <div className="vital-icon heart-icon">
                  <HeartPulse
                    size={23}
                  />
                </div>

                <span>
                  Heart Rate
                </span>

              </div>

              <div className="vital-value">

                {data.heartRate > 0
                  ? data.heartRate
                  : "--"}

                <small>
                  BPM
                </small>

              </div>

              <div className="vital-footer">
                Latest detected BPM
              </div>

            </div>

            {/* SPO2 */}

            <div className="vital-card">

              <div className="vital-card-top">

                <div className="vital-icon spo2-icon">
                  <Droplets
                    size={23}
                  />
                </div>

                <span>
                  SpO₂
                </span>

              </div>

              <div className="vital-value">

                {data.spo2 > 0
                  ? data.spo2
                  : "--"}

                <small>
                  %
                </small>

              </div>

              <div className="vital-footer">
                Blood oxygen saturation
              </div>

            </div>

            {/* BODY TEMPERATURE */}

            <div className="vital-card">

              <div className="vital-card-top">

                <div className="vital-icon temp-icon">
                  <Thermometer
                    size={23}
                  />
                </div>

                <span>
                  Body Temperature
                </span>

              </div>

              <div className="vital-value">

                {data.bodyTemperature > 0
                  ? bodyTempF.toFixed(1)
                  : "--"}

                <small>
                  °F
                </small>

              </div>

              <div className="vital-footer">

                {data.bodyTemperature > 0
                  ? `${data.bodyTemperature.toFixed(
                      1
                    )} °C`
                  : "Waiting for sensor"}

              </div>

            </div>

            {/* HUMIDITY */}

            <div className="vital-card">

              <div className="vital-card-top">

                <div className="vital-icon humidity-icon">
                  <Droplets
                    size={23}
                  />
                </div>

                <span>
                  Humidity
                </span>

              </div>

              <div className="vital-value">

                {data.humidity > 0
                  ? data.humidity.toFixed(
                      1
                    )
                  : "--"}

                <small>
                  %
                </small>

              </div>

              <div className="vital-footer">
                Environment humidity
              </div>

            </div>

          </section>

          {/* ==================================================
                     SECONDARY DATA
          =================================================== */}

          <section className="dashboard-two-column">

            {/* ENVIRONMENT */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h3>
                    Environment Overview
                  </h3>

                  <p>
                    ESP32 environmental sensors
                  </p>
                </div>

                <Wind
                  size={22}
                />

              </div>

              <div className="environment-grid">

                <div className="environment-item">

                  <span>
                    Temperature
                  </span>

                  <strong>
                    {environmentTempF > 0
                      ? `${environmentTempF.toFixed(
                          1
                        )} °F`
                      : "--"}

                  </strong>

                  <small>
                    {data.environmentTemperature > 0
                      ? `${data.environmentTemperature.toFixed(
                          1
                        )} °C`
                      : "No data"}
                  </small>

                </div>

                <div className="environment-item">

                  <span>
                    Humidity
                  </span>

                  <strong>
                    {data.humidity > 0
                      ? `${data.humidity.toFixed(
                          1
                        )}%`
                      : "--"}
                  </strong>

                  <small>
                    DHT22
                  </small>

                </div>

                <div className="environment-item">

                  <span>
                    Dust Density
                  </span>

                  <strong>
                    {data.dustDensity > 0
                      ? `${data.dustDensity.toFixed(
                          1
                        )}`
                      : "--"}
                  </strong>

                  <small>
                    µg/m³
                  </small>

                </div>

              </div>

            </div>

            {/* ECG */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>
                  <h3>
                    ECG Monitor
                  </h3>

                  <p>
                    AD8232 signal
                  </p>
                </div>

                <Activity
                  size={22}
                />

              </div>

              <div className="ecg-display">

                <div className="ecg-value">

                  {data.ecgLeadOff ? (
                    <span className="ecg-off">
                      LEAD OFF
                    </span>
                  ) : (
                    <>
                      {ecgText}

                      <small>
                        ADC
                      </small>
                    </>
                  )}

                </div>

                <div className="ecg-status">

                  <span
                    className={
                      data.ecgLeadOff
                        ? "status-dot danger-dot"
                        : "status-dot"
                    }
                  />

                  {data.ecgLeadOff
                    ? "Check electrodes"
                    : "Signal connected"}

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
                        TINYML ANALYSIS
          =================================================== */}

          <section className="dashboard-card tinyml-card">

            <div className="card-header">

              <div>

                <h3>
                  TinyML Analysis
                </h3>

                <p>
                  On-device health classification
                </p>

              </div>

              <Brain
                size={25}
              />

            </div>

            <div className="tinyml-content">

              <div className="tinyml-main">

                <div
                  className={
                    isDangerous
                      ? "ml-status danger"
                      : isWarning
                      ? "ml-status warning"
                      : "ml-status normal"
                  }
                >
                  {normalizedStatus}
                </div>

                <div className="confidence-bar">

                  <div className="confidence-label">

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {confidence.toFixed(
                        1
                      )}%
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${confidence}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

              <div className="ml-scores">

                <div className="ml-score">

                  <span>
                    Normal
                  </span>

                  <strong>
                    {(
                      Number(
                        data.mlNormalScore
                      ) * 100
                    ).toFixed(1)}
                    %
                  </strong>

                </div>

                <div className="ml-score">

                  <span>
                    Warning
                  </span>

                  <strong>
                    {(
                      Number(
                        data.mlWarningScore
                      ) * 100
                    ).toFixed(1)}
                    %
                  </strong>

                </div>

                <div className="ml-score">

                  <span>
                    Abnormal
                  </span>

                  <strong>
                    {(
                      Number(
                        data.mlAbnormalScore
                      ) * 100
                    ).toFixed(1)}
                    %
                  </strong>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
                       RECOMMENDATIONS
          =================================================== */}

          <section className="dashboard-card">

            <div className="card-header">

              <div>

                <h3>
                  Health Recommendations
                </h3>

                <p>
                  Based on current monitoring data
                </p>

              </div>

              <Stethoscope
                size={23}
              />

            </div>

            <div className="recommendations-list">

              {data.recommendations &&
              data.recommendations.length >
                0 ? (
                data.recommendations.map(
                  (
                    recommendation,
                    index
                  ) => (
                    <div
                      className="recommendation-item"
                      key={index}
                    >
                      <ShieldCheck
                        size={18}
                      />

                      <span>
                        {typeof recommendation ===
                        "string"
                          ? recommendation
                          : recommendation?.text ??
                            recommendation?.message ??
                            "Follow healthy practices."}
                      </span>
                    </div>
                  )
                )
              ) : isDangerous ? (
                <div className="recommendation-item danger-recommendation">

                  <AlertTriangle
                    size={18}
                  />

                  <span>
                    Abnormal health condition detected. Please check the readings and seek medical attention if symptoms persist.
                  </span>

                </div>
              ) : isWarning ? (
                <div className="recommendation-item warning-recommendation">

                  <AlertTriangle
                    size={18}
                  />

                  <span>
                    Some readings require attention. Continue monitoring your health data.
                  </span>

                </div>
              ) : (
                <div className="recommendation-item">

                  <ShieldCheck
                    size={18}
                  />

                  <span>
                    Your current monitored values are within the detected normal classification.
                  </span>

                </div>
              )}

            </div>

          </section>

          {/* ==================================================
                        LAST UPDATED
          =================================================== */}

          <div className="dashboard-footer-info">

            <div>

              <Clock
                size={16}
              />

              <span>
                Last updated:
                {" "}
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString()
                  : "--"}
              </span>

            </div>

            <div>

              <Activity
                size={16}
              />

              <span>
                Auto refresh:
                {" "}
                every 5 seconds
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Dashboard;
