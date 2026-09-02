import React from "react";
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Brain,
  Bell,
  Activity,
  Users,
  ArrowRight,
  Moon,
  Sun,
  Thermometer,
  Footprints,
  UserRound,
  Clock3,
} from "lucide-react";

import "../App.css";

const features = [
  {
    icon: <HeartPulse />,
    title: "Continuous Monitoring",
    text: "Track your vital signs in real-time with our advanced sensors and AI.",
    color: "purple",
  },
  {
    icon: <Brain />,
    title: "AI Risk Analysis",
    text: "Our AI analyzes your data and predicts health risks before they happen.",
    color: "green",
  },
  {
    icon: <Bell />,
    title: "Early Alerts",
    text: "Get instant alerts and recommendations to prevent potential health issues.",
    color: "red",
  },
  {
    icon: <Activity />,
    title: "Health Insights",
    text: "Understand your health trends with detailed reports and analytics.",
    color: "blue",
  },
  {
    icon: <Users />,
    title: "Emergency Support",
    text: "Quick access to emergency contacts and medical assistance.",
    color: "orange",
  },
];

function Home() {
  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}
      <Navbar/>


      {/* ================= HERO ================= */}
      <section className="hero">

        {/* LEFT */}
        <div className="hero-left">

          <div className="top-badge">
            <ShieldCheck size={17} />
            <span>AI-Powered</span>
            <b>•</b>
            <span>Smart</span>
            <b>•</b>
            <span>Preventive</span>
          </div>

          <h1>
            Your Health.
            <br />
            Our <span>Priority.</span>
          </h1>

          <p className="hero-description">
            PHC is your personal health companion that monitors your vital
            signs, analyzes risks in real-time and alerts you early to keep
            you safe, always.
          </p>

          {/* SMALL FEATURES */}
          <div className="mini-features">

            <div>
              <HeartPulse />
              <span>Real-time Monitoring</span>
            </div>

            <div>
              <Brain />
              <span>AI Risk Analysis</span>
            </div>

            <div>
              <Bell />
              <span>Early Warnings</span>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="hero-buttons">

            <Link to="/login" className="get-started">
              Get Started

              <span>
                <ArrowRight size={21} />
              </span>
            </Link>

            <Link to="/features" className="explore-btn">
              Explore Features
            </Link>

          </div>

          {/* USERS */}
          <div className="trusted">

            <div className="avatars">
              <div>👨🏻</div>
              <div>👨🏽</div>
              <div>👨🏻</div>
              <div>👨🏼</div>
            </div>

            <p>
              Trusted by <strong>10,000+</strong> users
              <br />
              for a healthier tomorrow
            </p>

          </div>

        </div>


        {/* RIGHT */}
        <div className="hero-right">

          <div className="glow-circle"></div>

          {/* AI CARD */}
          <div className="ai-card">

            <ShieldCheck />

            <div>
              <strong>AI Protection</strong>
              <p>Your health is<br />monitored 24/7</p>
            </div>

          </div>


          {/* PHONE */}
          <div className="phone">

            <div className="phone-notch"></div>

            <div className="phone-screen">

              <div className="phone-header">
                <div>
                  <small>9:41</small>
                  <h4>Hello, Aarav 👋</h4>
                  <b>Good Morning!</b>
                </div>

                <Bell size={20} />
              </div>

              <p className="overview-title">
                Today's Health Overview
              </p>


              <div className="health-grid">

                <div className="health-box">
                  <div className="box-title">
                    <HeartPulse size={15} />
                    Heart Rate
                  </div>

                  <strong>118 <small>BPM</small></strong>
                  <span>Normal</span>

                  <div className="fake-line"></div>
                </div>


                <div className="health-box">
                  <div className="box-title">
                    💧 SpO₂ Level
                  </div>

                  <strong>96<small>%</small></strong>
                  <span>Normal</span>

                  <div className="fake-line blue-line"></div>
                </div>


                <div className="health-box">
                  <div className="box-title">
                    <Thermometer size={15} />
                    Temperature
                  </div>

                  <strong>36.8°C</strong>
                  <span>Normal</span>

                  <div className="fake-line orange-line"></div>
                </div>


                <div className="health-box">
                  <div className="box-title">
                    <Footprints size={15} />
                    Activity
                  </div>

                  <strong>8,247</strong>
                  <span>Steps</span>

                  <div className="bars">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </div>

              </div>


              {/* RISK */}
              <div className="risk-card">

                <div className="risk-title">
                  <ShieldCheck size={15} />
                  AI Risk Score
                </div>

                <div className="risk-circle">
                  <strong>87</strong>
                  <small>/100</small>
                </div>

                <b className="high-risk">High Risk</b>

                <p>
                  Stay hydrated and avoid heat exposure.
                </p>

                <a href="#">
                  View Analysis →
                </a>

              </div>


              <div className="phone-menu">
                <div className="selected">
                  🏠
                  <small>Home</small>
                </div>

                <div>
                  ◔
                  <small>History</small>
                </div>

                <div>
                  🔔
                  <small>Alerts</small>
                </div>

                <div>
                  👤
                  <small>Profile</small>
                </div>
              </div>

            </div>
          </div>


          {/* WATCH */}
          <div className="watch">

            <div className="watch-screen">
              <HeartPulse size={26} />
              <strong>118</strong>
              <span>BPM</span>

              <div className="watch-line"></div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="feature-section">

        <div className="feature-container">

          {features.map((item, index) => (
            <div className="feature-card" key={index}>

              <div className={`feature-icon ${item.color}`}>
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;