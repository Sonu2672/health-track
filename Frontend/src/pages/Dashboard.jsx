




import React from "react";
import { useState, useEffect } from "react";
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

const activityData = [15, 22, 17, 31, 24, 38, 25, 43, 30, 35, 28, 45];

function Dashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [healthData, setHealthData] = useState([]);

  const [healthd, setHealthd] = useState({
    heartRate: 0,
    spo2: 0,
    temp: 0,
  });

  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("Normal");
  const [name, setName] = useState("");



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

      console.log("STATUS:", response.status);
      console.log("OK:", response.ok);

      const data = await response.json();

      console.log("🔥 COMPLETE HEALTH DATA:", data);
console.log("🔥 HD:", data.hd);
console.log("🔥 HEART RATE:", data.hd?.heartRate);
console.log("🔥 SPO2:", data.hd?.spo2);
console.log("🔥 TEMP:", data.hd?.temp);
console.log("🔥 RISK SCORE:", data.riskScore);
console.log("🔥 RISK LEVEL:", data.riskLevel);
console.log("🔥 RECOMMENDATIONS:", data.recommendations);

      // ==========================================
      // NO DEVICE DATA
      // ==========================================

      if (!data.hd) {
        console.log("⚠️ No device data available");

        setHealthd({
          heartRate: 0,
          spo2: 0,
          temp: 0,
        });

        setRiskScore(data.riskScore ?? 0);
        setRiskLevel(data.riskLevel ?? "Normal");
        setHealthData(data.datatimers ?? []);

        return;
      }

      // ==========================================
      // DEVICE DATA AVAILABLE
      // ==========================================
        
      // setHealthd({
      //   heartRate: data.hd.heartRate ?? 0,
      //   spo2: data.hd.spo2 ?? 0,
      //   temp: ((data.hd.temp * 1.8) + 32).toFixed(1) ?? 0,
      // });
      setHealthd({
  heartRate: data.hd.heartRate ?? 0,
  spo2: data.hd.spo2 ?? 0,
  temp: data.hd.temp != null
    ? ((data.hd.temp * 1.8) + 32).toFixed(1)
    : 0,
});

      setRiskScore(data.riskScore ?? 0);
      setRiskLevel(data.riskLevel ?? "Normal");
      setHealthData(data.datatimers ?? []);

    } catch (error) {
      console.error("❌ Health data fetch error:", error);

      setHealthd({
        heartRate: 0,
        spo2: 0,
        temp: 0,
      });

      setRiskScore(0);
      setRiskLevel("Normal");
      setHealthData([]);
    }
  };

  // 🚀 Dashboard open hote hi ek baar fetch
  Hdata();

  // 🔄 Har 4 seconds mein automatically fetch
  const interval = setInterval(() => {
    Hdata();
  }, 4000);

  // 🧹 Component band/unmount hone par interval clear
  return () => clearInterval(interval);

}, []);

  // ==========================================
  // DANGER CHECK
  // ==========================================

  const isDangerous =
    riskLevel === "High Risk" ||
    riskLevel === "Critical Risk";


  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <Sidebar isOpen={menuOpen} />


      {/* MAIN CONTENT */}

      <main className="main">


        {/* ======================================
            HEADER
        ====================================== */}

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


            <div className="profile-avatar">
              A
            </div>

          </div>

        </header>



        {/* ======================================
            TOP HEALTH CARDS
        ====================================== */}

        <section className="health-cards">


          {/* HEART RATE */}

          <HealthCard
            title="Heart Rate"
            value={healthd.heartRate}
            unit="BPM"
            icon={<HeartPulse />}
            type="heart"
            comparison="↑ 22% vs last hour"
            data={[72, 75, 70, 82, 78, 88, 85, 92, 118]}
          />


          {/* SPO2 */}

          <HealthCard
            title="SpO₂"
            value={healthd.spo2}
            unit="%"
            icon={<Droplets />}
            type="spo2"
            comparison="↓ 2% vs last hour"
            data={[96, 97, 95, 96, 95, 97, 94, 95, 96]}
          />


          {/* TEMPERATURE */}

          <HealthCard
            title="Temperature"
            value={healthd.temp}
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
            data={activityData}
          />

        </section>



        {/* ======================================
            SECOND ROW
        ====================================== */}

        <section className="middle-grid">


          {/* ==================================
              AI RISK SCORE
          ================================== */}

          <div
            className={`card risk-card ${
              riskLevel === "High Risk" ||
              riskLevel === "Critical Risk"
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
                You are at {riskLevel}.
              </strong>


              <span>

                {isDangerous
                  ? "Immediate attention recommended!"
                  : "Continue monitoring your health."}

              </span>

            </div>


            <button className="risk-link">

              View Risk Analysis

              <ChevronRight size={14} />

            </button>

          </div>



          {/* ==================================
              HEALTH TREND
          ================================== */}

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

                <AreaChart data={healthData}>

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
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
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



        {/* ======================================
            BOTTOM GRID
        ====================================== */}

        <section className="bottom-grid">


          {/* ==================================
              ENVIRONMENT
          ================================== */}

          <div className="card environment-card">

            <div className="section-header">

              <div>

                <h3>
                  Environment Overview
                </h3>

              </div>


              <button>
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

                  <Droplets size={17} />

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

                  <Thermometer size={17} />

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



          {/* ==================================
              RECENT ALERTS
          ================================== */}

          <div className="card alerts-card">

            <div className="section-header">

              <h3>
                Recent Alerts
              </h3>


              <button>
                View all
              </button>

            </div>


            <Alert
              icon={<AlertTriangle />}
              title="High Heat Stress Risk"
              time="16 May 2025, 08:10 AM"
              level="High"
              high
            />


            <Alert
              icon={<Droplets />}
              title="Hydration Level Low"
              time="16 May 2025, 06:30 AM"
              level="Medium"
            />


            <Alert
              icon={<Activity />}
              title="AQI Level Unhealthy"
              time="16 May 2025, 07:40 AM"
              level="Medium"
            />

          </div>



          {/* ==================================
              QUICK ACTIONS
          ================================== */}

          <div className="card quick-card">

            <div className="section-header">

              <h3>
                Quick Actions
              </h3>

            </div>


            <button className="quick-action">

              <span className="qa-icon blue">

                <Activity size={15} />

              </span>

              Start Health Scan

            </button>


            <button className="quick-action">

              <span className="qa-icon blue">

                <Droplets size={15} />

              </span>

              Water Reminder

            </button>


            <button className="quick-action">

              <span className="qa-icon green">

                <Pill size={15} />

              </span>

              Medication Reminder

            </button>


            <button className="quick-action">

              <span className="qa-icon red">

                <FileText size={15} />

              </span>

              Share Health Report

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}



/* ==========================================
   HEALTH CARD COMPONENT
========================================== */

function HealthCard({
  title,
  value,
  unit,
  icon,
  type,
  comparison,
  data,
}) {

  const max = Math.max(...data);

  const min = Math.min(...data);


  const points = data
    .map((value, index) => {

      const x =
        (index / (data.length - 1)) * 100;

      const y =
        38 -
        ((value - min) /
          (max - min || 1)) *
          30;

      return `${x},${y}`;

    })
    .join(" ");


  return (

    <div className={`health-card ${type}`}>

      <div className="health-card-top">

        <div className="health-title">

          <span className="metric-icon">

            {React.cloneElement(icon, {
              size: 17,
            })}

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

            {data.map((height, i) => (

              <span
                key={i}
                style={{
                  height: `${height}%`,
                }}
              ></span>

            ))}

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



/* ==========================================
   ALERT COMPONENT
========================================== */

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
          high ? "danger" : "warning"
        }`}
      >

        {React.cloneElement(icon, {
          size: 14,
        })}

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
          high ? "high-level" : ""
        }`}
      >
        {level}
      </span>

    </div>
  );
}


export default Dashboard;
// ```

// ### Bas ek aur important correction

// Tumhare **schema me `temp`** hai, isliye backend me bhi `temp` hi use hona chahiye. Uploaded controller me ab `temp` use ho raha hai, jo correct hai.

// Aur routes:

// ```js
// app.use("/api/devicedata", deviceRoutes);
// ```

// ```js
// Router.post("/", auth, receiveDeviceData);
// Router.get("/", auth, getdevicedata);
// ```

// ### Ab expected behavior

// **MongoDB me data hai:**

// ```text
// Heart Rate: 78 BPM
// SpO₂: 97%
// Temperature: 36.5°C
// ```

// **Data nahi hai:**

// ```text
// Heart Rate: 0 BPM
// SpO₂: 0%
// Temperature: 0°C
// Risk: 0/100
// ```

// Aur **`Cannot read properties of null (reading 'heartRate')` nahi aayega.**
