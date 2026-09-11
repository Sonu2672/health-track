import React from "react";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

import {
  HeartPulse,
  Activity,
  Droplets,
  Wind,
  CloudFog,
  CircleCheck,
  Menu,
  Sun,
} from "lucide-react";

import "../App.css";


// ======================================================
// PRECAUTIONS
// ======================================================

const precautions = [
  "Avoid outdoor activities during high pollution",
  "Wear a mask when outside",
  "Keep windows closed when dust levels are high",
  "Use an air purifier if available",
  "Stay hydrated and take breaks",
];


// ======================================================
// ENVIRONMENT
// ======================================================

function Environment() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [environmentData, setEnvironmentData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ======================================================
  // FETCH REAL-TIME ENVIRONMENT DATA
  // ======================================================

  const fetchEnvironmentData = async () => {

    try {

      const response = await fetch(
        "https://health-track-2b.onrender.com/api/health/gethealthdata",
        {
          credentials: "include",
        }
      );


      const data = await response.json();


      console.log(
        "ENVIRONMENT DATA:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data?.message ||
          "Failed to fetch environment data"
        );
      }


      if (data.success) {

        setEnvironmentData(data);

      }

    } catch (error) {

      console.error(
        "Environment API Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // ======================================================
  // INITIAL FETCH + AUTO REFRESH
  // ======================================================

  useEffect(() => {

    fetchEnvironmentData();


    const interval = setInterval(() => {

      fetchEnvironmentData();

    }, 5000);


    return () => clearInterval(interval);

  }, []);


  // ======================================================
  // GET SENSOR DATA
  // ======================================================

  const sensor =
    environmentData?.sensorData ||
    environmentData?.hd ||
    {};


  // ======================================================
  // REAL VALUES
  // ======================================================

  const envTemp = Number(
    sensor.envtemp ?? 0
  );


  const humidity = Number(
    sensor.humidity ?? 0
  );


  const dust = Number(
    sensor.dust ?? 0
  );


  const ecg = Number(
    sensor.ecg ?? 0
  );


  // ======================================================
  // ENVIRONMENT STATUS
  // ======================================================

  const getTemperatureStatus = () => {

    if (envTemp >= 40) {
      return "Extremely Hot";
    }

    if (envTemp >= 35) {
      return "Very Hot";
    }

    if (envTemp >= 30) {
      return "Hot";
    }

    if (envTemp < 15) {
      return "Cold";
    }

    return "Normal";
  };


  const getHumidityStatus = () => {

    if (humidity >= 80) {
      return "High";
    }

    if (humidity < 30) {
      return "Low";
    }

    return "Normal";
  };


  const getDustStatus = () => {

    if (dust >= 400) {
      return "Very High";
    }

    if (dust >= 300) {
      return "High";
    }

    if (dust >= 150) {
      return "Moderate";
    }

    return "Low";
  };


  // ======================================================
  // DUST COLOR / STATUS
  // ======================================================

  const dustDanger =
    dust >= 300;


  // ======================================================
  // UPDATE TIME
  // ======================================================

  const updatedTime =
    environmentData?.hd?.createdAt;


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="environment-page">


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        isOpen={menuOpen}
        closeSidebar={() =>
          setMenuOpen(false)
        }
      />


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="environment-main">


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="environment-header">

          <div>

            <button
              className="menu-btn"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
            >
              <Menu size={28} />
            </button>

          </div>


          <div>

            <h1>
              Environment
            </h1>

            <p>
              Real-time environment conditions
            </p>

          </div>

        </header>


        {/* ==================================================
            TOP CARDS
        ================================================== */}

        <section className="environment-stats">


          {/* ENVIRONMENT TEMPERATURE */}

          <EnvironmentCard
            icon={<Sun />}
            title="Temperature"
            value={
              loading
                ? "--"
                : `${envTemp}°C`
            }
            status={
              loading
                ? "Loading..."
                : getTemperatureStatus()
            }
            type="temperature"
          />


          {/* DUST */}

          <EnvironmentCard
            icon={<CloudFog />}
            title="Dust"
            value={
              loading
                ? "--"
                : dust
            }
            unit="µg/m³"
            status={
              loading
                ? "Loading..."
                : getDustStatus()
            }
            type="aqi"
          />


          {/* HUMIDITY */}

          <EnvironmentCard
            icon={<Droplets />}
            title="Humidity"
            value={
              loading
                ? "--"
                : `${humidity}%`
            }
            status={
              loading
                ? "Loading..."
                : getHumidityStatus()
            }
            type="humidity"
          />


          {/* WIND SPEED */}

          <EnvironmentCard
            icon={<Wind />}
            title="Wind Speed"
            value="N/A"
            unit="kmph"
            status="Sensor unavailable"
            type="wind"
          />

        </section>


        {/* ==================================================
            DUST + ENVIRONMENT DATA
        ================================================== */}

        <section className="aqi-pollution">


          {/* DUST GAUGE */}

          <div className="aqi-card">

            <h3>
              Dust Level Index
            </h3>


            <div className="aqi-gauge">

              <div className="aqi-arc">

                <div className="aqi-inner"></div>

              </div>


              <div className="aqi-number">

                <strong>
                  {loading
                    ? "--"
                    : dust}
                </strong>


                <span>
                  {loading
                    ? "Loading"
                    : getDustStatus()}
                </span>

              </div>


              <div className="aqi-scale">

                <span>
                  0
                </span>

                <span>
                  500
                </span>

              </div>

            </div>

          </div>


          {/* SENSOR VALUES */}

          <div className="pollution-card">

            <h3>
              Environment Sensors
            </h3>


            <div className="pollution-list">


              {/* ENV TEMP */}

              <div className="pollution-row">

                <span>
                  Environment Temp
                </span>

                <strong>
                  {loading
                    ? "--"
                    : `${envTemp}°C`}
                </strong>

              </div>


              {/* HUMIDITY */}

              <div className="pollution-row">

                <span>
                  Humidity
                </span>

                <strong>
                  {loading
                    ? "--"
                    : `${humidity}%`}
                </strong>

              </div>


              {/* DUST */}

              <div className="pollution-row">

                <span>
                  Dust
                </span>

                <strong
                  className={
                    dustDanger
                      ? "danger-value"
                      : ""
                  }
                >
                  {loading
                    ? "--"
                    : `${dust} µg/m³`}
                </strong>

              </div>


              {/* ECG */}

              <div className="pollution-row">

                <span>
                  ECG
                </span>

                <strong>
                  {loading
                    ? "--"
                    : ecg}
                </strong>

              </div>


              {/* AQI */}

              <div className="pollution-row">

                <span>
                  AQI
                </span>

                <strong>
                  N/A
                </strong>

              </div>


              {/* WIND */}

              <div className="pollution-row">

                <span>
                  Wind Speed
                </span>

                <strong>
                  N/A
                </strong>

              </div>


            </div>

          </div>

        </section>


        {/* ==================================================
            HEALTH IMPACT
        ================================================== */}

        <section className="health-impact">

          <h3>
            Health Impact
          </h3>


          <p>

            {dust >= 300

              ? "High dust levels may increase respiratory irritation and can affect people with breathing or cardiovascular problems."

              : dust >= 150

              ? "Moderate dust levels may cause discomfort and respiratory irritation. Continue monitoring the environment."

              : "Current dust levels are relatively low. Continue monitoring environmental conditions."
            }

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

                  <span>
                    {item}
                  </span>

                </div>

              )
            )}

          </div>


          {/* ==================================================
              UPDATE INFO
          ================================================== */}

          <div className="environment-update">

            <span>

              Data updated:{" "}

              {updatedTime
                ? new Date(
                    updatedTime
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )
                : "Waiting for sensor data"}

            </span>


            <span>
              Data Source: ESP32 Sensors
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}


// ======================================================
// ENVIRONMENT CARD
// ======================================================

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

          {React.cloneElement(
            icon,
            {
              size: 18,
            }
          )}

        </div>


        <span>
          {title}
        </span>

      </div>


      <div className="environment-value">

        <strong>
          {value}
        </strong>


        {unit && (

          <small>
            {unit}
          </small>

        )}

      </div>


      <div className="environment-status">

        {status}

      </div>

    </div>
  );
}


export default Environment;
