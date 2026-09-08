import React, { useState } from "react";
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
  AlertTriangle,
  Droplets,
  Activity,
  CheckCircle2,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

import "../App.css";

const alertsData = [
  {
    id: 1,
    title: "High Heat Stress Risk",
    date: "16 May 2025, 09:10 AM",
    description:
      "Your vital signs indicate a high heart rate. Risk of heat stress.",
    level: "High",
    type: "high",
    icon: <AlertTriangle />,
  },
  {
    id: 2,
    title: "Hydration Level Low",
    date: "16 May 2025, 05:10 AM",
    description:
      "Your hydration level is below optimal range.",
    level: "Medium",
    type: "medium",
    icon: <Droplets />,
  },
  {
    id: 3,
    title: "AQI Level Unhealthy",
    date: "16 May 2025, 06:56 AM",
    description:
      "AQI quality is unhealthy. Limit outdoor activities.",
    level: "Medium",
    type: "medium",
    icon: <AlertTriangle />,
  },
  {
    id: 4,
    title: "High Activity Detected",
    date: "16 May 2025, 08:00 AM",
    description:
      "High activity is safely detected for a longer period.",
    level: "Low",
    type: "low",
    icon: <Activity />,
  },
];

function Alerts() {
  const [filter, setFilter] = useState("All Alerts");
const [menuOpen, setMenuOpen] = useState(false);
  const filteredAlerts =
    filter === "All Alerts"
      ? alertsData
      : filter === "Active"
      ? alertsData.filter((alert) => alert.type !== "low")
      : [];

  return (
    <div className="alerts-page">

      {/* SIDEBAR */}
   <Sidebar
  isOpen={menuOpen}
  closeSidebar={() => setMenuOpen(false)}
/>
      {/* MAIN */}
      <main className="alerts-main">

        {/* HEADER */}
        <header className="alerts-header">

          <div className="alerts-heading">
                          <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={28} />
            </button>

            {/* <ArrowLeft size={17} /> */}

            <div>
              <h1>Alerts</h1>

              <p>
                Stay informed about your health
              </p>
            </div>

          </div>

        </header>


        {/* FILTER TABS */}
        <div className="alert-tabs">

          <button
            className={
              filter === "All Alerts"
                ? "active"
                : ""
            }
            onClick={() => setFilter("All Alerts")}
          >
            All Alerts
          </button>

          <button
            className={
              filter === "Active"
                ? "active"
                : ""
            }
            onClick={() => setFilter("Active")}
          >
            Active

            <span className="active-count">
              3
            </span>
          </button>

          <button
            className={
              filter === "Resolved"
                ? "active"
                : ""
            }
            onClick={() => setFilter("Resolved")}
          >
            Resolved
          </button>

        </div>


        {/* ALERT LIST */}
        <section className="alert-list">

          {filteredAlerts.length === 0 ? (

            <div className="no-alerts">
              <CheckCircle2 size={30} />
              <p>No resolved alerts</p>
            </div>

          ) : (

            filteredAlerts.map((alert) => (

              <AlertCard
                key={alert.id}
                alert={alert}
              />

            ))

          )}

        </section>


        {/* CLEAR BUTTON */}
        <button className="clear-alerts">

          <CheckCircle2 size={14} />

          Clear All Resolved Alerts

        </button>

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
      className={`alerts-nav-item ${
        active ? "active" : ""
      }`}
    >

      {React.cloneElement(icon, {
        size: 17,
      })}

      <span>{text}</span>

      {badge && (
        <b className="alerts-badge">
          {badge}
        </b>
      )}

    </div>
  );
}


/* ALERT CARD */

function AlertCard({ alert }) {

  return (

    <div
      className={`alert-card ${alert.type}`}
    >

      {/* ICON */}
      <div className="alert-card-icon">

        {React.cloneElement(alert.icon, {
          size: 17,
        })}

      </div>


      {/* CONTENT */}
      <div className="alert-content">

        <div className="alert-title-row">

          <div>

            <h3>
              {alert.title}
            </h3>

            <span className="alert-date">
              {alert.date}
            </span>

          </div>

          <span className="alert-level">
            {alert.level}
          </span>

        </div>


        <p>
          {alert.description}
        </p>


        <button className="view-details">
          View Details
        </button>

      </div>

    </div>
  );
}


export default Alerts;
