import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Lock,
  UserRound,
  Moon,
  ChevronRight,
  LogOut,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "../App.css";

const Settings = ({setIslogin}) => {
  const [notifications, setNotifications] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

const navigate = useNavigate();
    const logouthandler = async () => {
    const response = await fetch("https://health-track-2b.onrender.com/api/users/islogout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(),
    });

    const data = await response.json();
    console.log("aacha= ", data.message);
    toast.success("Logout Successful 🚀");
    setIslogin(false);
    navigate("/");
  };



  

  return (
    <div className="settings-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="settings-main">

        {/* Header */}
        <div className="settings-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your preferences and account settings</p>
          </div>

          <div className="settings-page-tag">
            8. Settings
          </div>
        </div>


        {/* Account Section */}
        <section className="settings-section">

          <div className="section-title">
            <UserRound size={18} />
            <div>
              <h2>Account</h2>
              <p>Manage your personal account information</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Profile Information</h3>
              <p>Update your name, email and personal details</p>
            </div>

            <button className="arrow-btn">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Change Password</h3>
              <p>Update your account password</p>
            </div>

            <button className="arrow-btn">
              <ChevronRight size={18} />
            </button>
          </div>

        </section>


        {/* Notifications */}
        <section className="settings-section">

          <div className="section-title">
            <Bell size={18} />
            <div>
              <h2>Notifications</h2>
              <p>Control how you receive alerts</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Push Notifications</h3>
              <p>Receive notifications about your health</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Health Alerts</h3>
              <p>Get notified when unusual health activity is detected</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={healthAlerts}
                onChange={() => setHealthAlerts(!healthAlerts)}
              />
              <span className="slider"></span>
            </label>
          </div>

        </section>


        {/* Privacy & Security */}
        <section className="settings-section">

          <div className="section-title">
            <Shield size={18} />
            <div>
              <h2>Privacy & Security</h2>
              <p>Control your data and security preferences</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Privacy Settings</h3>
              <p>Manage your health data privacy</p>
            </div>

            <button className="arrow-btn">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>

            <button className="arrow-btn">
              <ChevronRight size={18} />
            </button>
          </div>

        </section>


        {/* Appearance */}
        <section className="settings-section">

          <div className="section-title">
            <Moon size={18} />
            <div>
              <h2>Appearance</h2>
              <p>Customize how PHC looks for you</p>
            </div>
          </div>

          <div className="settings-row">
            <div className="setting-info">
              <h3>Dark Mode</h3>
              <p>Use dark theme throughout the application</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
            </label>
          </div>

        </section>


        {/* Logout */}
        <button onClick={logouthandler}className="logout-button">
          <LogOut size={17} />
          Log Out
        </button>

      </main>
    </div>
  );
};

export default Settings;