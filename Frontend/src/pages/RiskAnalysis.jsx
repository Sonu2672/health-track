


import React from "react";
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from "react";
import GaugeComponent from "react-gauge-component";
import {
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Bell,
  CloudSun,
  Cloud,
  Siren,
  UserRound,
  Settings,
  ShieldCheck,
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Menu
} from "lucide-react";

import "../App.css";
// import API_URL from "../config/api";


function RiskAnalysis() {
  const [menuOpen, setMenuOpen] = useState(false);
   const [riskFactors, setRiskFactors] = useState([]);

    const [healthd, setHealthd] = useState({
      // deviceId: "",
      heartRate: "",
      spo2: "",
      temperature: "",
    });
  
    const [riskScore,setRiskScore]=useState(null);
    const [riskLevel,setRiskLevel]=useState("");
    const [recom,setRecom]=useState([]);
    
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

      console.log("aacha= ", data.hd);

      console.log("🔥 RISK FACTORS:", data.riskFactors);

      setHealthd({
        heartRate: data.hd.heartRate,
        spo2: data.hd.spo2,
        temp: data.hd.temp,
      });

      setRiskScore(data.riskScore);
      setRiskLevel(data.riskLevel);

      setRecom(data.recommendations);
      setRiskFactors(data.riskFactors);

      console.log("Recommendations:", data.recommendations);

    } catch (error) {
      console.error("Risk analysis fetch error:", error);
    }
  };

  // 🚀 Page load hote hi ek baar
  Hdata();

  // 🔄 Har 4 seconds mein
  const interval = setInterval(() => {
    Hdata();
  }, 4000);

  // 🧹 Component unmount hone par interval band
  return () => clearInterval(interval);

}, []);




   

  return (
    <div className="risk-page">

      {/* SIDEBAR */}
  {menuOpen && (
    <div
      className="sidebar-overlay"
      onClick={() => setMenuOpen(false)}
    />
  )}

  <Sidebar
    isOpen={menuOpen}
    closeSidebar={() => setMenuOpen(false)}
  />


      {/* MAIN */}
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

            {/* <ArrowLeft size={17} /> */}

            <div>
              <h1>AI Risk Analysis</h1>
              <p>AI powered health risk assessment</p>
            </div>

          </div>

        </header>


        {/* TOP RISK SECTION */}
        <section className="risk-summary">

          {/* SCORE */}
          <div className="score-section">

            <h3>Current Risk Score</h3>

            <div className="risk-gauge">

              <div className="gauge-arc"></div>

              <div className="gauge-number">
                <strong>{riskScore}</strong>
                <span>/100</span>
              </div>

              <div className="gauge-label">
                {riskLevel}
              </div>

            </div>

          </div>


          {/* RISK LEVEL */}
          <div className="risk-level-section">

            <h3>Risk Level</h3>

            <h2>{riskLevel}</h2>

            <p>
              Your current health indicates cogent
              deviations in vital signs and
              environment.
            </p>

            <div className="confidence-title">
              AI Confidence
            </div>

            <div className="confidence-row">

              <div className="confidence-bar">
                <div></div>
              </div>

              <strong>60%</strong>

            </div>

          </div>

        </section>


        {/* RISK FACTORS */}
     <section className="risk-box">
  <h3>Risk Factors Contributing</h3>

  <div className="factors">
    {riskFactors.length > 0 ? (
      riskFactors.map((factor, index) => {
        const value = Number(factor.value) || 0;

        return (
          <div className="factor" key={index}>

            <div className="factor-name">
              <strong>{factor.factor}</strong>

              <span>
                {factor.status} — {value}
              </span>
            </div>

            <div className="factor-bar">
              <div
                style={{
                  width: `${Math.min(value, 100)}%`,
                }}
              ></div>
            </div>

            <strong className="factor-value">
              {value}%
            </strong>

          </div>
        );
      })
    ) : (
      <p>No risk factor data available</p>
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


/* NAV ITEM */

function NavItem({
  icon,
  text,
  active,
  badge,
}) {

  return (
    <div
      className={`risk-nav-item ${
        active ? "active" : ""
      }`}
    >

      {React.cloneElement(icon, {
        size: 17,
      })}

      <span>{text}</span>

      {badge && (
        <b className="risk-badge">
          {badge}
        </b>
      )}

    </div>
  );
}

export default RiskAnalysis;
