import React from "react";
import { useState, useEffect } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";

// import { useEffect } from "react";
import {
  LayoutDashboard,
  HeartPulse,
  MapPin,
  Bell,
  AlertTriangle,
  CloudSun,
  Siren,
  UserRound,
  Settings,
  Droplets,
  Thermometer,
  Footprints,
  ShieldCheck,
  Activity,
  Wind,
  Clock,
  Pill,
  FileText,
  ChevronRight,
  Sun,
  CloudRain,
  CircleAlert,
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

// import "./Dashboard.css";

const healthData = [
  { time: "12 AM", score: 38 },
  { time: "02 AM", score: 45 },
  { time: "04 AM", score: 55 },
  { time: "06 AM", score: 65 },
  { time: "08 AM", score: 48 },
  { time: "10 AM", score: 58 },
  { time: "12 PM", score: 52 },
  { time: "02 PM", score: 72 },
  { time: "04 PM", score: 63 },
  { time: "06 PM", score: 88 },
  { time: "08 PM", score: 96 },
];

const activityData = [15, 22, 17, 31, 24, 38, 25, 43, 30, 35, 28, 45];
// const deviceId = "ESP32_001";
function Dashboard() {
  const [healthd, setHealthd] = useState({
    // deviceId: "",
    heartRate: "",
    spo2: "",
    temperature: "",
  });

  const [riskScore,setRiskScore]=useState(null);
  const [riskLevel,setRiskLevel]=useState("");
  const [name,setName]=useState("");
  
  useEffect(() => {
    const Hdata = async () => {
    const response = await fetch(
      "https://health-track-2b.onrender.com/api/health/getdata",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        
        // }),
      },
    );

    const data = await response.json();
    console.log("aacha= ", data.hd);

    // toast.success("Logout Successful 🚀");
    // setIsadmin(false);
    // navigate("/");

    setHealthd({
      // deviceId: data.hd.deviceId,
      heartRate: data.hd.heartRate,
      spo2: data.hd.spo2,
      temp: data.hd.temp,
    });
    setRiskScore(data.riskScore);
    setRiskLevel(data.riskLevel)
    
  };

    Hdata();
  }, []);

   return (
    <div className="dashboard">
      {/* SIDEBAR */}
     <Sidebar menuOpen={menuOpen} />

      {/* MAIN CONTENT */}
      <main className="main">
        {/* HEADER */}
        <header className="header">
          <div>

          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
               
                 <Menu size={28} />
          </button>

            <h1>
              Good Morning, Sonu! <span>👋</span>
            </h1>

            <p>Here's your health overview</p>
          </div>

          <div className="header-right">
            <div className="notification">
              <Bell size={21} />
              <span></span>
            </div>

            <div className="profile-avatar">A</div>
          </div>
        </header>

        {/* TOP HEALTH CARDS */}
        <section className="health-cards">
          <HealthCard
            title="Heart Rate"
            value={healthd.heartRate}
            unit="BPM"
            icon={<HeartPulse />}
            type="heart"
            comparison="↑ 22% vs last hour"
            data={[72, 75, 70, 82, 78, 88, 85, 92, 118]}
          />

          <HealthCard
            title="SpO₂"
            value={healthd.spo2}
            unit="%"
            icon={<Droplets />}
            type="spo2"
            comparison="↓ 2% vs last hour"
            data={[96, 97, 95, 96, 95, 97, 94, 95, 96]}
          />

          <HealthCard
            title="Temperature"
            value={healthd.temp}
            unit="°C"
            icon={<Thermometer />}
            type="temperature"
            comparison="↑ 2.1°C vs last hour"
            data={[36.8, 37, 37.2, 37.5, 37.8, 38, 38.5, 38.7, 39.1]}
          />

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

        {/* SECOND ROW */}
        <section className="middle-grid">
          {/* AI SCORE */}
          <div className="card risk-card">
            <div className="card-title">
              <ShieldCheck size={18} />
              <span>AI Health Risk Score</span>
            </div>

            <div className="risk-meter">
              <div className="gauge">
                <div className="gauge-score">
                  <strong>{riskScore}</strong>
                  <small>/100</small>
                </div>

                <div className="gauge-label">{riskLevel}</div>
              </div>
            </div>

            <div className="risk-warning">
              <strong>You are at {riskLevel}.</strong>
              <span>Take immediate precautions.</span>
            </div>

            <button className="risk-link">
              View Risk Analysis <ChevronRight size={14} />
            </button>
          </div>

          {/* HEALTH TREND */}
          <div className="card trend-card">
            <div className="trend-header">
              <h3>Today's Health Trend</h3>
            </div>

            <div className="trend-chart">
              <ResponsiveContainer width="100%" height="100%">
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

                      <stop offset="100%" stopColor="#ff5d62" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#8d95a5" }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#8d95a5" }}
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

        {/* BOTTOM GRID */}
        <section className="bottom-grid">
          {/* ENVIRONMENT */}
          <div className="card environment-card">
            <div className="section-header">
              <div>
                <h3>Environment Overview</h3>
              </div>

              <button>View all</button>
            </div>

            <div className="environment-items">
              <div className="environment-item">
                <div className="env-icon orange">
                  <Sun size={17} />
                </div>

                <div>
                  <span>Heat Index</span>
                  <strong>42°C</strong>
                </div>
              </div>

              <div className="environment-item">
                <div className="env-icon gray">
                  <Wind size={17} />
                </div>

                <div>
                  <span>AQI</span>
                  <strong>186</strong>
                </div>
              </div>

              <div className="environment-item">
                <div className="env-icon blue">
                  <Droplets size={17} />
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>71%</strong>
                </div>
              </div>

              <div className="environment-item">
                <div className="env-icon red">
                  <Thermometer size={17} />
                </div>

                <div>
                  <span>Heat Alert</span>
                  <strong>High</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ALERTS */}
          <div className="card alerts-card">
            <div className="section-header">
              <h3>Recent Alerts</h3>

              <button>View all</button>
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

          {/* QUICK ACTIONS */}
          <div className="card quick-card">
            <div className="section-header">
              <h3>Quick Actions</h3>
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

/* HEALTH CARD COMPONENT */

function HealthCard({ title, value, unit, icon, type, comparison, data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;

      const y = 38 - ((value - min) / (max - min || 1)) * 30;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={`health-card ${type}`}>
      <div className="health-card-top">
        <div className="health-title">
          <span className="metric-icon">
            {React.cloneElement(icon, { size: 17 })}
          </span>

          <span>{title}</span>
        </div>
      </div>

      <div className="metric-value">
        <strong>{value}</strong>

        <span>{unit}</span>
      </div>

      <div className="comparison">{comparison}</div>

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
          <svg viewBox="0 0 100 45" preserveAspectRatio="none">
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

/* ALERT COMPONENT */

function Alert({ icon, title, time, level, high }) {
  return (
    <div className="alert-row">
      <div className={`alert-icon ${high ? "danger" : "warning"}`}>
        {React.cloneElement(icon, { size: 14 })}
      </div>

      <div className="alert-info">
        <strong>{title}</strong>

        <span>{time}</span>
      </div>

      <span className={`alert-level ${high ? "high-level" : ""}`}>{level}</span>
    </div>
  );
}

export default Dashboard;
