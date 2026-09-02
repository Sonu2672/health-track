import React from "react";

import {
  UserPlus,
  Smartphone,
  Brain,
  BellRing,
  ArrowDown,
} from "lucide-react";

import Navbar from "../components/Navbar";

import "../App.css";


const steps = [
  {
    number: "01",
    icon: <UserPlus />,
    title: "Create Your Account",
    text: "Sign up and create your personal PHC health profile.",
  },
  {
    number: "02",
    icon: <Smartphone />,
    title: "Connect Your Device",
    text: "Connect your smartwatch or compatible health monitoring device.",
  },
  {
    number: "03",
    icon: <Brain />,
    title: "AI Analyzes Your Data",
    text: "Our AI continuously analyzes your health information and detects unusual patterns.",
  },
  {
    number: "04",
    icon: <BellRing />,
    title: "Get Early Alerts",
    text: "Receive timely warnings and personalized recommendations when needed.",
  },
];


function HowItWorks() {
  return (
    <>
      {/* Navbar */}
      <Navbar />


      {/* Page Content */}
      <main className="page">

        <section className="page-hero">

          <div className="page-badge">
            <Brain size={17} />
            Simple & Intelligent
          </div>


          <h1>
            How <span>PHC</span> Works
          </h1>


          <p>
            From monitoring your health to providing intelligent insights,
            PHC makes healthcare simple and proactive.
          </p>

        </section>


        <section className="steps-container">

          {steps.map((step, index) => (

            <React.Fragment key={index}>

              <div className="step-card">

                <div className="step-number">
                  {step.number}
                </div>


                <div className="step-icon">
                  {step.icon}
                </div>


                <div className="step-content">

                  <h2>
                    {step.title}
                  </h2>

                  <p>
                    {step.text}
                  </p>

                </div>

              </div>


              {/* Arrow between steps */}

              {index !== steps.length - 1 && (
                <div className="step-arrow">
                  <ArrowDown />
                </div>
              )}

            </React.Fragment>

          ))}

        </section>

      </main>
    </>
  );
}


export default HowItWorks;