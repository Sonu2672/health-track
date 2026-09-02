import React from "react";
import Sidebar from '../components/Sidebar';
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
  Sun,
  Droplets,
  Wind,
  CloudFog,
  CircleCheck,
} from "lucide-react";

import "../App.css";

const pollutants = [
  { name: "PM2.5", value: "306" },
  { name: "PM10", value: "249", danger: true },
  { name: "NO₂", value: "36" },
  { name: "SO₂", value: "16" },
  { name: "CO", value: "6.4" },
  { name: "O₃", value: "34" },
];

const precautions = [
  "Avoid outdoor activities",
  "Wear a mask when outside",
  "Keep windows closed",
  "Use air purifier if available",
  "Stay hydrated and take breaks",
];

function Environment() {
  return (
    <div className="environment-page">

      {/* ================= SIDEBAR ================= */}

      <Sidebar/>

      {/* ================= MAIN ================= */}

      <main className="environment-main">

        {/* HEADER */}

        <header className="environment-header">

          <div>
            <h1>Environment</h1>

            <p>
              Real-time environment conditions
            </p>
          </div>

        </header>


        {/* ================= TOP CARDS ================= */}

        <section className="environment-stats">

          <EnvironmentCard
            icon={<Sun />}
            title="Temperature"
            value="42°C"
            status="Extremely Hot"
            type="temperature"
          />

          <EnvironmentCard
            icon={<CloudFog />}
            title="AQI"
            value="186"
            status="Unhealthy"
            type="aqi"
          />

          <EnvironmentCard
            icon={<Droplets />}
            title="Humidity"
            value="71%"
            status="High"
            type="humidity"
          />

          <EnvironmentCard
            icon={<Wind />}
            title="Wind Speed"
            value="12"
            unit="kmph"
            status="Moderate"
            type="wind"
          />

        </section>


        {/* ================= AQI + POLLUTANTS ================= */}

        <section className="aqi-pollution">

          {/* AQI GAUGE */}

          <div className="aqi-card">

            <h3>AQI Score Index</h3>

            <div className="aqi-gauge">

              <div className="aqi-arc">
                <div className="aqi-inner"></div>
              </div>

              <div className="aqi-number">
                <strong>186</strong>

                <span>
                  Unhealthy
                </span>
              </div>

              <div className="aqi-scale">
                <span>0</span>
                <span>500</span>
              </div>

            </div>

          </div>


          {/* POLLUTANTS */}

          <div className="pollution-card">

            <h3>
              Pollutants (µg/m³)
            </h3>

            <div className="pollution-list">

              {pollutants.map(
                (pollutant, index) => (

                  <div
                    className="pollution-row"
                    key={index}
                  >

                    <span>
                      {pollutant.name}
                    </span>

                    <strong
                      className={
                        pollutant.danger
                          ? "danger-value"
                          : ""
                      }
                    >
                      {pollutant.value}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </section>


        {/* ================= HEALTH IMPACT ================= */}

        <section className="health-impact">

          <h3>Health Impact</h3>

          <p>
            Exposure to high AQI levels can cause respiratory issues,
            reduce lung functions, and aggravate heart conditions.
          </p>


          <h3 className="precautions-title">
            Precautions
          </h3>


          <div className="precautions-list">

            {precautions.map(
              (item, index) => (

                <div
                  className="precaution"
                  key={index}
                >

                  <CircleCheck size={13} />

                  <span>{item}</span>

                </div>

              )
            )}

          </div>


          {/* UPDATE INFO */}

          <div className="environment-update">

            <span>
              Data updated: 16 May 2025, 06:30 AM
            </span>

            <span>
              Data Source: CPCB
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================= NAV ITEM ================= */

function NavItem({
  icon,
  text,
  active,
  badge,
}) {
  return (
    <div
      className={`environment-nav-item ${
        active ? "active" : ""
      }`}
    >

      {React.cloneElement(icon, {
        size: 17,
      })}

      <span>{text}</span>

      {badge && (
        <b className="environment-badge">
          {badge}
        </b>
      )}

    </div>
  );
}


/* ================= ENVIRONMENT CARD ================= */

function EnvironmentCard({
  icon,
  title,
  value,
  unit,
  status,
  type,
}) {
  return (
    <div
      className={`environment-stat-card ${type}`}
    >

      <div className="environment-card-top">

        <div className="environment-card-icon">
          {React.cloneElement(icon, {
            size: 18,
          })}
        </div>

        <span>{title}</span>

      </div>


      <div className="environment-value">

        <strong>{value}</strong>

        {unit && (
          <small>{unit}</small>
        )}

      </div>


      <div className="environment-status">
        {status}
      </div>

    </div>
  );
}

export default Environment;