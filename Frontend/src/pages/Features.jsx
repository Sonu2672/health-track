import React from "react";
import Navbar from "../components/Navbar";

import {
  HeartPulse,
  Brain,
  Bell,
  Activity,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import "../App.css";

const features = [
  {
    icon: <HeartPulse />,
    title: "Real-Time Health Monitoring",
    text: "Monitor your heart rate, oxygen level, temperature and activity continuously.",
    color: "purple",
  },
  {
    icon: <Brain />,
    title: "AI Risk Analysis",
    text: "Our AI analyzes your health data and identifies possible risks before they become serious.",
    color: "green",
  },
  {
    icon: <Bell />,
    title: "Early Health Alerts",
    text: "Receive instant notifications when unusual health patterns are detected.",
    color: "red",
  },
  {
    icon: <Activity />,
    title: "Health Insights",
    text: "Get meaningful insights and understand how your health changes over time.",
    color: "blue",
  },
  {
    icon: <ShieldCheck />,
    title: "AI Protection",
    text: "Your health information is protected with secure and privacy-focused technology.",
    color: "orange",
  },
  {
    icon: <TrendingUp />,
    title: "Health Reports",
    text: "View detailed reports and track your health progress with simple analytics.",
    color: "purple",
  },
];

function Features() {
  return (
    <>
      {/* Navbar completely separate */}
      <Navbar />

      {/* Only Features content */}
      <main className="page">

        <section className="page-hero">

          <div className="page-badge">
            <Activity size={17} />
            Smart Healthcare
          </div>

          <h1>
            Powerful Features for
            <span> Better Health.</span>
          </h1>

          <p>
            PHC combines AI, real-time monitoring and intelligent alerts
            to help you understand and improve your health.
          </p>

        </section>


        <section className="features-grid">

          {features.map((feature, index) => (
            <div
              className="big-feature-card"
              key={index}
            >

              <div
                className={`big-feature-icon ${feature.color}`}
              >
                {feature.icon}
              </div>

              <h2>{feature.title}</h2>

              <p>{feature.text}</p>

              <div className="feature-link">
                Learn more →
              </div>

            </div>
          ))}

        </section>

      </main>
    </>
  );
}

export default Features;