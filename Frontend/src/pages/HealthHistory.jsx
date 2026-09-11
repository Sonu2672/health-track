import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

import {
  HeartPulse,
  Activity,
  Thermometer,
  Droplets,
  ArrowRight,
  Menu,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../App.css";


// ======================================================
// HEALTH HISTORY
// ======================================================

function HealthHistory() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [period, setPeriod] = useState("15 Days");

  const [metric, setMetric] = useState("heartRate");

  const [healthData, setHealthData] = useState(null);

  const days = Number(period.split(" ")[0]);


  // ======================================================
  // 7 SENSOR METRICS
  // ======================================================

  const metrics = [
    {
      name: "Heart Rate",
      key: "heartRate",
      icon: <HeartPulse />,
    },

    {
      name: "SpO₂",
      key: "spo2",
      icon: <Droplets />,
    },

    {
      name: "Temperature",
      key: "temperature",
      icon: <Thermometer />,
    },

    {
      name: "Environment Temp",
      key: "envtemp",
      icon: <Thermometer />,
    },

    {
      name: "Humidity",
      key: "humidity",
      icon: <Droplets />,
    },

    {
      name: "ECG",
      key: "ecg",
      icon: <Activity />,
    },

    {
      name: "Dust",
      key: "dust",
      icon: <Activity />,
    },
  ];


  // ======================================================
  // DATE FORMAT
  // ======================================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  // ======================================================
  // GET HEALTH HISTORY
  // ======================================================

  const getHealthHistory = async () => {
    try {
      const response = await fetch(
        `https://health-track-2b.onrender.com/api/health/history?days=${days}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("HEALTH HISTORY DATA:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch health history"
        );
      }

      setHealthData(data);

    } catch (error) {
      console.error("HEALTH HISTORY API ERROR:", error);
    }
  };


  // ======================================================
  // FETCH WHEN PERIOD CHANGES
  // ======================================================

  useEffect(() => {
    getHealthHistory();
  }, [period]);


  // ======================================================
  // GET VALUE FROM RECORD
  // ======================================================

  const getRecordValue = (item, key) => {
    if (!item) return 0;

    switch (key) {
      case "heartRate":
        return Number(item.heartRate ?? 0);

      case "spo2":
        return Number(item.spo2 ?? 0);

      case "temperature":
        return Number(
          item.temperature ??
          item.temp ??
          0
        );

      case "envtemp":
        return Number(item.envtemp ?? 0);

      case "humidity":
        return Number(item.humidity ?? 0);

      case "ecg":
        return Number(item.ecg ?? 0);

      case "dust":
        return Number(item.dust ?? 0);

      default:
        return 0;
    }
  };


  // ======================================================
  // CREATE TREND FROM RECENT RECORDS
  // FALLBACK IF API DOES NOT SEND trends
  // ======================================================

  const createTrendFromRecords = (key) => {
    const records = healthData?.recentRecords || [];

    return records.map((item) => ({
      date: formatDate(
        item.date ??
        item.createdAt ??
        item.timestamp
      ),

      value: getRecordValue(item, key),
    }));
  };


  // ======================================================
  // ALL 7 TRENDS
  // ======================================================

  const allTrends = {

    heartRate:
      healthData?.trends?.heartRate?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("heartRate"),


    spo2:
      healthData?.trends?.spo2?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("spo2"),


    temperature:
      healthData?.trends?.temperature?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("temperature"),


    envtemp:
      healthData?.trends?.envtemp?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("envtemp"),


    humidity:
      healthData?.trends?.humidity?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("humidity"),


    ecg:
      healthData?.trends?.ecg?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("ecg"),


    dust:
      healthData?.trends?.dust?.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })) ||
      createTrendFromRecords("dust"),
  };


  // ======================================================
  // RECENT RECORDS
  // ======================================================

  const records = healthData?.recentRecords || [];


  // ======================================================
  // RECORD DATE
  // ======================================================

  const formatRecordDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  // ======================================================
  // RISK LEVEL
  // ======================================================

  const getRiskLevel = (record) => {

    const heartRate = Number(
      record.heartRate ?? 0
    );

    const spo2 = Number(
      record.spo2 ?? 0
    );

    const temperature = Number(
      record.temperature ??
      record.temp ??
      0
    );

    const envtemp = Number(
      record.envtemp ?? 0
    );

    const humidity = Number(
      record.humidity ?? 0
    );

    const ecg = Number(
      record.ecg ?? 0
    );

    const dust = Number(
      record.dust ?? 0
    );


    // Critical
    if (
      heartRate > 150 ||
      heartRate < 40 ||
      spo2 < 85 ||
      temperature > 40 ||
      temperature < 34 ||
      ecg > 2 ||
      dust > 400
    ) {
      return "High";
    }


    // Moderate
    if (
      heartRate > 100 ||
      heartRate < 60 ||
      spo2 < 95 ||
      temperature > 37.5 ||
      envtemp > 40 ||
      humidity > 80 ||
      dust > 150
    ) {
      return "Medium";
    }


    return "Low";
  };


  // ======================================================
  // SELECTED CHART
  // ======================================================

  const chartData =
    allTrends[metric] || [];


  // ======================================================
  // METRIC SUMMARY
  // ======================================================

  const getMetricSummary = () => {

    const data = chartData
      .map((item) => Number(item.value))
      .filter((value) => !Number.isNaN(value));


    if (!data.length) {
      return {
        lowest: 0,
        average: 0,
        highest: 0,
        today: 0,
      };
    }


    return {

      lowest: Math.min(...data),

      average: (
        data.reduce(
          (sum, value) => sum + value,
          0
        ) / data.length
      ).toFixed(
        metric === "temperature" ||
        metric === "envtemp"
          ? 1
          : metric === "ecg"
          ? 2
          : 0
      ),

      highest: Math.max(...data),

      today: data[data.length - 1],
    };
  };


  const summary = getMetricSummary();


  // ======================================================
  // SELECTED METRIC
  // ======================================================

  const selectedMetric = metrics.find(
    (item) => item.key === metric
  );


  // ======================================================
  // UNIT
  // ======================================================

  const getUnit = () => {

    switch (metric) {

      case "heartRate":
        return "BPM";

      case "spo2":
        return "%";

      case "temperature":
        return "°C";

      case "envtemp":
        return "°C";

      case "humidity":
        return "%";

      case "ecg":
        return "";

      case "dust":
        return "µg/m³";

      default:
        return "";
    }
  };


  // ======================================================
  // Y AXIS DOMAIN
  // ======================================================

  const getYAxisDomain = () => {

    switch (metric) {

      case "spo2":
        return [0, 100];

      case "temperature":
        return [0, 45];

      case "envtemp":
        return [0, 50];

      case "humidity":
        return [0, 100];

      case "ecg":
        return [-3, 3];

      case "dust":
        return [0, 500];

      case "heartRate":
      default:
        return [0, 150];
    }
  };


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="dashboard-layout">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        isOpen={menuOpen}
        closeSidebar={() => setMenuOpen(false)}
      />


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="history-page">


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="history-header">

          <div className="header-left">

            <button
              className="menu-btn"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
            >
              <Menu size={28} />
            </button>


            <div>

              <h1>
                Health History
              </h1>

              <p>
                View your health trends over time
              </p>

            </div>

          </div>


          {/* PERIOD */}

          <div className="period-tabs">

            {[
              "7 Days",
              "15 Days",
              "30 Days",
            ].map((item) => (

              <button
                key={item}
                className={
                  period === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPeriod(item)
                }
              >
                {item}
              </button>

            ))}

          </div>

        </header>


        {/* ==================================================
            METRIC TABS
        ================================================== */}

        <div className="metric-tabs">

          {metrics.map((item) => (

            <button
              key={item.name}
              className={
                metric === item.key
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMetric(item.key)
              }
            >

              {React.cloneElement(
                item.icon,
                {
                  size: 12,
                }
              )}

              {item.name}

            </button>

          ))}

        </div>


        {/* ==================================================
            TREND CARD
        ================================================== */}

        <section className="history-chart-card">

          <h3>
            {selectedMetric?.name} Trend
          </h3>


          <div className="history-chart">

            {chartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    stroke="#edf0f5"
                    vertical={false}
                  />


                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 8,
                      fill: "#7d8491",
                    }}
                  />


                  <YAxis
                    domain={getYAxisDomain()}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 8,
                      fill: "#7d8491",
                    }}
                  />


                  <Tooltip />


               <Line
  type="monotone"
  dataKey="value"
  stroke="#6547d7"
  strokeWidth={2}
  dot={false}
  activeDot={false}
/>

                </LineChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7d8491",
                  fontSize: "13px",
                }}
              >
                No {selectedMetric?.name} data available
              </div>

            )}

          </div>

        </section>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <section className="history-summary">

          <SummaryCard
            type="lowest"
            title="Lowest"
            value={summary.lowest}
            unit={getUnit()}
            icon={<Activity />}
          />


          <SummaryCard
            type="average"
            title="Average"
            value={summary.average}
            unit={getUnit()}
            icon={<Activity />}
          />


          <SummaryCard
            type="highest"
            title="Highest"
            value={summary.highest}
            unit={getUnit()}
            icon={<HeartPulse />}
          />


          <SummaryCard
            type="today"
            title="Today"
            value={summary.today}
            unit={getUnit()}
            icon={<HeartPulse />}
          />

        </section>


        {/* ==================================================
            RECENT RECORDS
        ================================================== */}

        <section className="records-card">

          <h3>
            Recent Records
          </h3>


          <div className="records-table">

            <div className="table-header">

              <span>Date & Time</span>

              <span>Heart Rate</span>

              <span>SpO₂</span>

              <span>Temperature</span>

              <span>Activity</span>

              <span>Risk Level</span>

            </div>


            {records.length > 0 ? (

              records.map((record, index) => {

                const risk =
                  getRiskLevel(record);


                const recordDate =
                  record.date ??
                  record.createdAt ??
                  record.timestamp;


                const temperature =
                  record.temperature ??
                  record.temp ??
                  0;


                return (

                  <div
                    className="table-row"
                    key={
                      record.id ??
                      record._id ??
                      index
                    }
                  >

                    <span>
                      {formatRecordDate(
                        recordDate
                      )}
                    </span>


                    <strong>
                      {record.heartRate ?? 0} BPM
                    </strong>


                    <strong>
                      {record.spo2 ?? 0}%
                    </strong>


                    <strong className="temperature-value">
                      {temperature}°C
                    </strong>


                    <span>

                      <b className="activity-pill low">
                        Low
                      </b>

                    </span>


                    <span>

                      <b
                        className={`risk-pill ${risk.toLowerCase()}`}
                      >
                        {risk}
                      </b>

                    </span>

                  </div>

                );

              })

            ) : (

              <p>
                No health records found
              </p>

            )}

          </div>


          <button className="view-history">

            View All History

            <ArrowRight size={13} />

          </button>

        </section>

      </main>

    </div>
  );
}


// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({
  type,
  title,
  value,
  unit,
  icon,
}) {
  return (
    <div className={`summary-card ${type}`}>

      <div className="summary-icon">
        {React.cloneElement(icon, {
          size: 15,
        })}
      </div>

      <div className="summary-content">

        <span>
          {title}
        </span>

        <div>
          <strong>
            {value}
          </strong>

          <small>
            {unit}
          </small>
        </div>

      </div>

    </div>
  );
}

export default HealthHistory;
