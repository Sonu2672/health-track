import React from "react";

import {
  HeartPulse,
  ShieldCheck,
  Target,
  Users,
  Brain,
} from "lucide-react";

import Navbar from "../components/Navbar";

import "../App.css";


function About() {
  return (
    <>
      {/* Navbar */}
      <Navbar />


      {/* Page Content */}
      <main className="page">

        {/* ================= HERO ================= */}

        <section className="page-hero">

          <div className="page-badge">
            <HeartPulse size={17} />
            About PHC
          </div>


          <h1>
            Healthcare That Puts
            <span> You First.</span>
          </h1>


          <p>
            PHC is a personal health companion designed to make health
            monitoring smarter, simpler and more accessible.
          </p>

        </section>


        {/* ================= ABOUT ================= */}

        <section className="about-main">

          <div className="about-text">

            <h2>
              Your Health.
              <br />
              <span>Our Priority.</span>
            </h2>


            <p>
              We believe healthcare should not only react to problems,
              but help prevent them.
            </p>


            <p>
              PHC brings together real-time health monitoring,
              artificial intelligence and personalized insights
              to help people understand their health better.
            </p>


            <p>
              Our goal is simple — make advanced healthcare technology
              easy to use in everyday life.
            </p>

          </div>


          {/* ================= VISUAL ================= */}

          <div className="about-visual">

            <div className="about-circle">

              <HeartPulse size={70} />

              <h3>
                PHC
              </h3>

              <p>
                Personal Health
                <br />
                Companion
              </p>

            </div>

          </div>

        </section>


        {/* ================= MISSION ================= */}

        <section className="mission-grid">

          <div className="mission-card">

            <Target />

            <h3>
              Our Mission
            </h3>

            <p>
              Make preventive healthcare accessible to everyone.
            </p>

          </div>


          <div className="mission-card">

            <Brain />

            <h3>
              AI Driven
            </h3>

            <p>
              Use intelligent technology to understand health risks.
            </p>

          </div>


          <div className="mission-card">

            <ShieldCheck />

            <h3>
              Privacy First
            </h3>

            <p>
              Keep personal health information secure and protected.
            </p>

          </div>


          <div className="mission-card">

            <Users />

            <h3>
              User Focused
            </h3>

            <p>
              Build simple experiences around real user needs.
            </p>

          </div>

        </section>

      </main>
    </>
  );
}


export default About;
