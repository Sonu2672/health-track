import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  HeartPulse,
  Activity,
  Thermometer,
  Droplets,
  Footprints,
  Moon,
  ArrowRight,
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


const historyData = [
  { date: "01 May", value: 52 },
  { date: "03 May", value: 88 },
  { date: "05 May", value: 118 },
  { date: "07 May", value: 92 },
  { date: "09 May", value: 105 },
  { date: "10 May", value: 116 },
  { date: "12 May", value: 91 },
  { date: "14 May", value: 110 },
  { date: "15 May", value: 128 },
  { date: "16 May", value: 118 },
  { date: "18 May", value: 91 },
  { date: "20 May", value: 78 },
  { date: "22 May", value: 96 },
  { date: "24 May", value: 80 },
  { date: "26 May", value: 103 },
  { date: "28 May", value: 85 },
  { date: "30 May", value: 92 },
];


const records = [
  {
    date: "16 May 2025, 09:10 AM",
    heart: "118 BPM",
    spo2: "96%",
    temperature: "39.1°C",
    activity: "High",
    risk: "High",
  },
  {
    date: "15 May 2025, 06:00 AM",
    heart: "100 BPM",
    spo2: "97%",
    temperature: "38.7°C",
    activity: "Moderate",
    risk: "Medium",
  },
  {
    date: "15 May 2025, 06:00 PM",
    heart: "68 BPM",
    spo2: "99%",
    temperature: "36.5°C",
    activity: "Low",
    risk: "Low",
  },
];


const metrics = [
  {
    name: "Heart Rate",
    icon: <HeartPulse />,
  },
  {
    name: "SpO₂",
    icon: <Droplets />,
  },
  {
    name: "Temperature",
    icon: <Thermometer />,
  },
  {
    name: "Blood Pressure",
    icon: <Activity />,
  },
  {
    name: "Steps",
    icon: <Footprints />,
  },
  {
    name: "Sleep",
    icon: <Moon />,
  },
];


function HealthHistory() {

  const [period, setPeriod] = useState("15 Days");

  const [metric, setMetric] = useState("Heart Rate");


  return (

    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <Sidebar />


      {/* MAIN CONTENT */}
      <main className="history-page">

        {/* HEADER */}

        <header className="history-header">

          <div>

            <h1>
              Health History
            </h1>

            <p>
              View your health trends over time
            </p>

          </div>


          {/* PERIOD FILTER */}

          <div className="period-tabs">

            {["7 Days", "15 Days", "30 Days"].map(
              (item) => (

                <button
                  key={item}
                  className={
                    period === item
                      ? "active"
                      : ""
                  }
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </button>

              )
            )}

          </div>

        </header>


        {/* METRIC TABS */}

        <div className="metric-tabs">

          {metrics.map((item) => (

            <button
              key={item.name}
              className={
                metric === item.name
                  ? "active"
                  : ""
              }
              onClick={() =>
                setMetric(item.name)
              }
            >

              {React.cloneElement(item.icon, {
                size: 12,
              })}

              {item.name}

            </button>

          ))}

        </div>


        {/* TREND CARD */}

        <section className="history-chart-card">

          <h3>
            {metric} Trend
          </h3>


          <div className="history-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={historyData}
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
                  domain={[0, 150]}
                  ticks={[0, 50, 100, 150]}
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
                  dot={{
                    r: 2,
                    fill: "#6547d7",
                  }}
                  activeDot={{
                    r: 4,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* SUMMARY CARDS */}

        <section className="history-summary">

          <SummaryCard
            type="lowest"
            title="Lowest"
            value="98"
            unit="BPM"
            icon={<Activity />}
          />

          <SummaryCard
            type="average"
            title="Average"
            value="68"
            unit="BPM"
            icon={<Activity />}
          />

          <SummaryCard
            type="highest"
            title="Highest"
            value="134"
            unit="BPM"
            icon={<HeartPulse />}
          />

          <SummaryCard
            type="today"
            title="Today"
            value="118"
            unit="BPM"
            icon={<HeartPulse />}
          />

        </section>


        {/* RECENT RECORDS */}

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


            {records.map((record, index) => (

              <div
                className="table-row"
                key={index}
              >

                <span>
                  {record.date}
                </span>


                <strong>
                  {record.heart}
                </strong>


                <strong>
                  {record.spo2}
                </strong>


                <strong className="temperature-value">
                  {record.temperature}
                </strong>


                <span>

                  <b
                    className={`activity-pill ${record.activity.toLowerCase()}`}
                  >
                    {record.activity}
                  </b>

                </span>


                <span>

                  <b
                    className={`risk-pill ${record.risk.toLowerCase()}`}
                  >
                    {record.risk}
                  </b>

                </span>

              </div>

            ))}

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


/* ================= SUMMARY CARD ================= */

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