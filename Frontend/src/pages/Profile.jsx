import React, { useState } from "react";
import Sidebar from '../components/Sidebar';
import {
  LayoutDashboard,
  HeartPulse,
  Brain,
  Bell,
  Activity,
  CloudSun,
  ShieldAlert,
  User,
  Settings,
  LogOut,
  Edit3,
  UserRound,
  Ruler,
  Weight,
  Droplets,
  CalendarDays,
  ChevronRight,
  Watch,
  Menu
} from "lucide-react";

import "../App.css";


function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [preferences, setPreferences] = useState({
    health: true,
    water: true,
    medication: true,
    reports: false,
  });


  const togglePreference = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };


  return (
    <div className="profile-layout">

      {/* ================= SIDEBAR ================= */}

  <Sidebar
  isOpen={menuOpen}
  closeSidebar={() => setMenuOpen(false)}
/>


      {/* ================= MAIN ================= */}

      <main className="profile-main">

        {/* HEADER */}

        <div className="profile-header">
          <div>
                     <button
  className="menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  <Menu size={28} />
</button>
          </div>
         
          <h1>Profile</h1>

          <p>
            Manage your profile and preferences
          </p>

        </div>


        {/* ================= TOP CARDS ================= */}

        <section className="profile-top-grid">


          {/* PERSONAL INFORMATION */}

          <div className="profile-card personal-card">

            <h3>
              Personal Information
            </h3>


            <div className="personal-content">

              <div className="profile-avatar">

                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Profile"
                />

              </div>


              <div className="personal-details">

                <h2>
                  Aarav Kolanian
                </h2>

                <p>
                  aarav.technical.com
                </p>

                <p>
                  +91 90000 00000
                </p>

                <span>
                  30, Male
                </span>

              </div>

            </div>


            <button className="edit-profile-btn">
              <Edit3 size={15} />
              Edit Profile
            </button>

          </div>


          {/* HEALTH INFORMATION */}

          <div className="profile-card health-card">

            <h3>
              Health Information
            </h3>


            <div className="health-info-list">

              <div>
                <UserRound />
                <span>Age</span>
                <strong>30</strong>
              </div>


              <div>
                <Ruler />
                <span>Height</span>
                <strong>175 cm</strong>
              </div>


              <div>
                <Weight />
                <span>Weight</span>
                <strong>70 kg</strong>
              </div>


              <div>
                <Droplets />
                <span>Blood Group</span>
                <strong>O+</strong>
              </div>


              <div>
                <CalendarDays />
                <span>Date of Birth</span>
                <strong>15 Aug 2000</strong>
              </div>

            </div>

          </div>

        </section>


        {/* ================= HEALTH PREFERENCES ================= */}

        <section className="profile-card preferences-card">

          <h3>
            Health Preferences
          </h3>


          <div className="preference-row">

            <span>
              Stay healthy notifications
            </span>

            <button
              className={
                preferences.health
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() => togglePreference("health")}
            >
              <span></span>
            </button>

          </div>


          <div className="preference-row">

            <span>
              Water reminder
            </span>

            <button
              className={
                preferences.water
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() => togglePreference("water")}
            >
              <span></span>
            </button>

          </div>


          <div className="preference-row">

            <span>
              Medication reminder
            </span>

            <button
              className={
                preferences.medication
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() => togglePreference("medication")}
            >
              <span></span>
            </button>

          </div>


          <div className="preference-row">

            <span>
              Daily health reports
            </span>

            <button
              className={
                preferences.reports
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() => togglePreference("reports")}
            >
              <span></span>
            </button>

          </div>

        </section>


        {/* ================= CONNECTED DEVICES ================= */}

        <section className="profile-card devices-card">

          <h3>
            Connected Devices
          </h3>


          <div className="device-row">

            <div className="watch-icon">
              <Watch size={35} />
            </div>


            <div className="device-info">

              <div className="device-title">

                <strong>
                  Smart Watch
                </strong>

                <span className="connected-badge">
                  Connected
                </span>

              </div>

              <p>
                Last update: 16 May 2025, 06:30 AM
              </p>

            </div>


            <ChevronRight
              className="device-arrow"
              size={22}
            />

          </div>

        </section>


        {/* LOGOUT */}

        <button className="bottom-logout">
          <LogOut size={16} />
          Logout
        </button>

      </main>

    </div>
  );
}


export default Profile;
