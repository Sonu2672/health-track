import React, { useState } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";

import {
  Search,
  Star,
  Video,
  MessageCircle,
  Calendar,
  Clock,
  Stethoscope,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const ConsultDoctor = ({ setIslogin }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Arjun Mehta",
      specialization: "General Physician",
      experience: "8+ Years Experience",
      rating: "4.8",
      reviews: "120+",
      fee: "₹300",
      image: "👨‍⚕️",
      online: true,
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialization: "Cardiologist",
      experience: "10+ Years Experience",
      rating: "4.9",
      reviews: "80+",
      fee: "₹500",
      image: "👩‍⚕️",
      online: true,
    },
    {
      id: 3,
      name: "Dr. Rohit Verma",
      specialization: "Pulmonologist",
      experience: "7+ Years Experience",
      rating: "4.7",
      reviews: "50+",
      fee: "₹400",
      image: "👨‍⚕️",
      online: true,
    },
  ];

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <Sidebar setIslogin={setIslogin} />

      {/* MAIN CONTENT */}
      <main className="consult-page">
        <div className="consult-container">

          <div className="consult-header">
            <div>
              <h1>Consult Doctor</h1>
              <p>Connect with experienced doctors and get expert advice</p>
            </div>
          </div>

          <div className="doctor-hero">
            <div className="hero-content">
              <h2>Talk to a Doctor, Anytime</h2>

              <p>
                Get professional medical guidance from verified doctors
                through chat or video consultation.
              </p>

              <div className="hero-features">
                <span>
                  <ShieldCheck size={18} />
                  Verified Doctors
                </span>

                <span>🔒 Secure & Private</span>

                <span>
                  <Headphones size={18} />
                  24/7 Support
                </span>
              </div>
            </div>

            <div className="doctor-illustration">
              <div className="doctor-circle">
                <Stethoscope size={75} />
              </div>
            </div>
          </div>

          <div className="consult-main">

            {/* LEFT */}
            <div className="doctor-list-section">

              <h2>Find a Doctor</h2>

              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                />
              </div>

              <div className="doctor-filters">
                <button className="active-filter">All</button>
                <button>General</button>
                <button>Cardiologist</button>
              </div>

              <div className="doctor-list">

                {doctors.map((doctor) => (
                  <div className="doctor-card" key={doctor.id}>

                    <div className="doctor-avatar">
                      {doctor.image}
                    </div>

                    <div className="doctor-info">

                      <div className="doctor-name-row">
                        <h3>{doctor.name}</h3>

                        <span
                          className={
                            doctor.online
                              ? "online-status"
                              : "offline-status"
                          }
                        >
                          ● {doctor.online ? "Online" : "Offline"}
                        </span>
                      </div>

                      <p className="specialization">
                        {doctor.specialization}
                      </p>

                      <p className="experience">
                        {doctor.experience}
                      </p>

                      <div className="doctor-bottom">

                        <div className="rating">
                          <Star size={16} fill="currentColor" />
                          {doctor.rating} ({doctor.reviews})
                        </div>

                        <span className="doctor-fee">
                          {doctor.fee}
                        </span>

                        <button
                          className="consult-btn"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          Consult
                        </button>

                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* RIGHT */}
            <div className="consult-panel">

              {selectedDoctor ? (
                <>
                  <div className="selected-doctor">

                    <div className="selected-avatar">
                      {selectedDoctor.image}
                    </div>

                    <div>
                      <h2>{selectedDoctor.name}</h2>
                      <p>{selectedDoctor.specialization}</p>

                      <span className="online-status">
                        ● Online
                      </span>
                    </div>

                  </div>

                  <div className="consult-options">

                    <h3>How would you like to consult?</h3>

                    <button className="video-consult">
                      <Video size={22} />
                      Start Video Consultation
                    </button>

                    <button className="chat-consult">
                      <MessageCircle size={22} />
                      Start Chat Consultation
                    </button>

                    <button className="appointment-consult">
                      <Calendar size={22} />
                      Book Appointment
                    </button>

                  </div>
                </>
              ) : (
                <div className="select-doctor-message">

                  <div className="select-icon">
                    <Stethoscope size={55} />
                  </div>

                  <h2>Select a Doctor</h2>

                  <p>
                    Choose a doctor from the list to start your consultation.
                  </p>

                </div>
              )}

              <div className="consult-info">
                <Clock size={22} />

                <div>
                  <h4>Available 24/7</h4>
                  <p>Get medical guidance whenever you need it.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsultDoctor;