import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  Menu,
  CircleAlert,
  CircleCheck,
  HeartPulse,
  Thermometer,
  Wind,
  Droplets,
  Activity,
} from "lucide-react";

import "../App.css";

function RiskAnalysis() {
  const [menuOpen, setMenuOpen] = useState(false);

  // 7 Sensors State
  const [healthd, setHealthd] = useState({
    heartRate: 0,
    spo2: 0,
    temp: 0, // Body Temp (°C)
    envtemp: 0, // Env Temp (°C)
    humidity: 0,
    ecg: 0,
    dust: 0,
  });

  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Low Risk");
  const [recom, setRecom] = useState([]);
  const [calculatedRiskFactors, setCalculatedRiskFactors] = useState([]);

  // ==========================================
  // 7 SENSOR NORMAL RANGE CHECK & RISK ENGINE
  // ==========================================
  const evaluateSensorRisks = (data) => {
    const factors = [];
    let elevatedCount = 0;

    // Body Temp Conversion to °F
    const bodyTempF = data.temp ? (data.temp * 1.8 + 32).toFixed(1) : 0;

    // 1. Heart Rate (Normal: 60 - 100 BPM)
    if (data.heartRate > 100) {
      elevatedCount++;
      factors.push({
        name: "Heart Rate",
        value: `${data.heartRate} BPM`,
        status: "High (Tachycardia Risk)",
        percentage: Math.min((data.heartRate / 180) * 100, 100),
        isElevated: true,
      });
    } else if (data.heartRate < 60 && data.heartRate > 0) {
      elevatedCount++;
      factors.push({
        name: "Heart Rate",
        value: `${data.heartRate} BPM`,
        status: "Low (Bradycardia Risk)",
        percentage: Math.min((data.heartRate / 100) * 100, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "Heart Rate",
        value: `${data.heartRate} BPM`,
        status: "Normal",
        percentage: Math.min((data.heartRate / 150) * 100, 100),
        isElevated: false,
      });
    }

    // 2. SpO2 (Normal: 95% - 100%)
    if (data.spo2 < 95 && data.spo2 > 0) {
      elevatedCount++;
      factors.push({
        name: "SpO₂",
        value: `${data.spo2}%`,
        status: "Low Oxygen Level",
        percentage: Math.min(data.spo2, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "SpO₂",
        value: `${data.spo2}%`,
        status: "Normal",
        percentage: Math.min(data.spo2, 100),
        isElevated: false,
      });
    }

    // 3. Body Temperature (Normal: 97°F - 99°F)
    if (bodyTempF > 99.5) {
      elevatedCount++;
      factors.push({
        name: "Body Temperature",
        value: `${bodyTempF}°F`,
        status: "High (Fever Risk)",
        percentage: Math.min((bodyTempF / 108) * 100, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "Body Temperature",
        value: `${bodyTempF}°F`,
        status: "Normal",
        percentage: Math.min((bodyTempF / 105) * 100, 100),
        isElevated: false,
      });
    }

    // 4. Environment Temperature (Normal: 18°C - 35°C)
    if (data.envtemp > 35) {
      elevatedCount++;
      factors.push({
        name: "Environment Temperature",
        value: `${data.envtemp}°C`,
        status: "High Heat Exposure",
        percentage: Math.min((data.envtemp / 50) * 100, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "Environment Temperature",
        value: `${data.envtemp}°C`,
        status: "Normal",
        percentage: Math.min((data.envtemp / 45) * 100, 100),
        isElevated: false,
      });
    }

    // 5. Humidity (Normal: 30% - 60%)
    if (data.humidity > 65) {
      elevatedCount++;
      factors.push({
        name: "Humidity",
        value: `${data.humidity}%`,
        status: "High Humidity",
        percentage: Math.min(data.humidity, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "Humidity",
        value: `${data.humidity}%`,
        status: "Normal",
        percentage: Math.min(data.humidity, 100),
        isElevated: false,
      });
    }

    // 6. ECG Status (Normal: 0 -> Normal Sinus Rhythm)
    if (data.ecg !== 0) {
      elevatedCount++;
      factors.push({
        name: "ECG Signal",
        value: `${data.ecg}`,
        status: "Abnormal Waveform",
        percentage: Math.min(Math.abs(data.ecg) * 20, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "ECG Signal",
        value: `${data.ecg}`,
        status: "Normal",
        percentage: 10,
        isElevated: false,
      });
    }

    // 7. Dust Level / AQI (Normal: 0 - 100)
    if (data.dust > 100) {
      elevatedCount++;
      factors.push({
        name: "Dust / Air Quality",
        value: `${data.dust}`,
        status: "High Dust Warning",
        percentage: Math.min((data.dust / 300) * 100, 100),
        isElevated: true,
      });
    } else {
      factors.push({
        name: "Dust / Air Quality",
        value: `${data.dust}`,
        status: "Normal",
        percentage: Math.min((data.dust / 200) * 100, 100),
        isElevated: false,
      });
    }

    // Dynamic Risk Score & Level Calculation
    const calculatedScore = Math.min(
      Math.round((elevatedCount / 7) * 100),
      100
    );
    let level = "Low Risk";

    if (calculatedScore >= 60) {
      level = "Critical Risk";
    } else if (calculatedScore >= 40) {
      level = "High Risk";
    } else if (calculatedScore >= 20) {
      level = "Moderate Risk";
    }

    return { factors, calculatedScore, level };
  };

  // ==========================================
  // FETCH HEALTH DATA
  // ==========================================
  useEffect(() => {
    const Hdata = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/health/gethealthdata",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        const sensorData = data.sensorData || data.hd || {};

        const parsedSensors = {
          heartRate: Number(sensorData.heartRate ?? 0),
          spo2: Number(sensorData.spo2 ?? 0),
          temp: Number(sensorData.temp ?? 0),
          envtemp: Number(sensorData.envtemp ?? 0),
          humidity: Number(sensorData.humidity ?? 0),
          ecg: Number(sensorData.ecg ?? 0),
          dust: Number(sensorData.dust ?? 0),
        };

        setHealthd(parsedSensors);

        // Evaluate All 7 Factors
        const { factors, calculatedScore, level } =
          evaluateSensorRisks(parsedSensors);

        setCalculatedRiskFactors(factors);
        setRiskScore(data.riskScore ?? calculatedScore);
        setRiskLevel(data.riskLevel ?? level);
        setRecom(data.recommendations ?? []);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    Hdata();
    const interval = setInterval(Hdata, 4000);
    return () => clearInterval(interval);
  }, []);

  const getRiskClass = () => {
    if (riskLevel === "Critical Risk") return "critical";
    if (riskLevel === "High Risk") return "high";
    if (riskLevel === "Moderate Risk") return "moderate";
    if (riskLevel === "Low Risk") return "low";
    return "normal";
  };

  const getFactorIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("heart")) return <HeartPulse size={18} />;
    if (lower.includes("spo2")) return <Activity size={18} />;
    if (lower.includes("temp")) return <Thermometer size={18} />;
    if (lower.includes("humidity")) return <Droplets size={18} />;
    if (lower.includes("dust")) return <Wind size={18} />;
    return <Activity size={18} />;
  };

  return (
    <div className="risk-page">
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <Sidebar isOpen={menuOpen} closeSidebar={() => setMenuOpen(false)} />

      <main className="risk-main">
        {/* HEADER */}
        <header className="risk-header">
          <div className="risk-heading">
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={28} />
            </button>
            <div>
              <h1>AI Risk Analysis</h1>
              <p>AI powered health risk assessment</p>
            </div>
          </div>
        </header>

        {/* SUMMARY SECTION */}
        <section className="risk-summary">
          <div className="score-section">
            <h3>Current Risk Score</h3>
            <div className="risk-gauge">
              <div className="gauge-arc"></div>
              <div className="gauge-number">
                <strong>{riskScore}</strong>
                <span>/100</span>
              </div>
              <div className={`gauge-label ${getRiskClass()}`}>
                {riskLevel}
              </div>
            </div>
          </div>

          <div className="risk-level-section">
            <h3>Risk Level</h3>
            <h2 className={getRiskClass()}>{riskLevel}</h2>
            <p>
              AI model analyzes your health and environmental parameters to
              estimate the current health risk.
            </p>

            <div className="confidence-title">AI Confidence</div>
            <div className="confidence-row">
              <div className="confidence-bar">
                <div style={{ width: `${Math.min(riskScore, 100)}%` }} />
              </div>
              <strong>{riskScore}%</strong>
            </div>
          </div>
        </section>

        {/* 7 AI RISK FACTORS WITH HIGH RISK ALERTS */}
        <section className="risk-box">
          <h3>AI Risk Factors</h3>

          <div className="factors">
            {calculatedRiskFactors.map((factor, index) => (
              <div
                className={`factor ${factor.isElevated ? "elevated-risk" : ""}`}
                key={index}
              >
                <div className="factor-name">
                  <strong>
                    {getFactorIcon(factor.name)}
                    {factor.name}
                  </strong>
                  <span
                    style={{
                      color: factor.isElevated ? "#ef4444" : "#64748b",
                      fontWeight: factor.isElevated ? "600" : "400",
                    }}
                  >
                    {factor.status}
                  </span>
                </div>

                <div className="factor-bar">
                  <div
                    style={{
                      width: `${factor.percentage}%`,
                      backgroundColor: factor.isElevated ? "#ef4444" : "#f87171",
                    }}
                  />
                </div>

                <strong className="factor-value">{factor.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* AI RECOMMENDATIONS */}
        <section className="risk-box">
          <h3>AI Recommendations</h3>
          <div className="recommendations">
            {recom.length > 0 ? (
              recom.map((recommendation, index) => (
                <div className="recommendation-item" key={index}>
                  <CircleCheck size={18} />
                  <span>{recommendation}</span>
                </div>
              ))
            ) : (
              <p>No recommendations available</p>
            )}
          </div>
        </section>

        {/* EMERGENCY WARNING */}
        <div className="medical-warning">
          <CircleAlert size={16} />
          <strong>
            If symptoms worsen, contact your medical emergency.
          </strong>
        </div>
      </main>
    </div>
  );
}

export default RiskAnalysis;