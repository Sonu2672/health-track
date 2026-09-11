
import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const ConnectDevice = () => {
  const navigate = useNavigate();

  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!deviceId.trim()) {
      setError("Please enter Device ID");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://health-track-2b.onrender.com/api/devicedata/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: deviceId.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Device registration failed");
        return;
      }

      setMessage("Device connected successfully! 🎉");
      setDeviceId("");

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connect-device-container">
      <div className="connect-device-card">

        <div className="device-icon">
          📡
        </div>

        <h2>Connect Your Device</h2>

        <p className="device-subtitle">
          Connect your ESP32 health monitoring device to your account.
        </p>

        <form onSubmit={handleRegister}>

          <label htmlFor="deviceId">
            Device ID
          </label>

          <div className="device-input-wrapper">
            <span className="input-icon">🔗</span>

            <input
              id="deviceId"
              type="text"
              placeholder="ESP32-A4CF12456789"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            />
          </div>

          <p className="device-hint">
            You can find the Device ID on your ESP32 serial monitor.
          </p>

          <button
            type="submit"
            className="connect-device-btn"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Device"}
          </button>

        </form>

        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        <div className="device-info">
          <div className="info-icon">💡</div>

          <div>
            <strong>How it works?</strong>

            <p>
              Enter your ESP32 Device ID once. After registration,
              your health data will automatically appear on your dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConnectDevice;

