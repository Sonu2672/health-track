import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Video,
  MessageCircle,
  Stethoscope,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

import "../App.css";

function Appointment() {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [consultType, setConsultType] = useState("video");

  const dates = [
    { day: "Today", date: "03", month: "Sep" },
    { day: "Tomorrow", date: "04", month: "Sep" },
    { day: "Friday", date: "05", month: "Sep" },
    { day: "Saturday", date: "06", month: "Sep" },
  ];

  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  return (
    <div className="appointment-layout">

      {/* EXISTING SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="appointment-main">

        {/* HEADER */}
        <div className="appointment-top">

          <div className="appointment-title">
            <ArrowLeft size={20} />

            <div>
              <h1>Book an Appointment</h1>
              <p>Choose a convenient time for your consultation</p>
            </div>
          </div>

          <div className="booking-progress">
            <span>Step 1 of 1</span>
            <div className="progress-line">
              <div></div>
            </div>
          </div>

        </div>


        <div className="appointment-content">

          {/* LEFT SIDE */}
          <section className="booking-section">

            {/* DATE SECTION */}
            <div className="booking-card">

              <div className="section-heading">

                <div className="section-icon">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h2>Select a Date</h2>
                  <p>Choose your preferred appointment date</p>
                </div>

              </div>


              <div className="date-options">

                {dates.map((item, index) => (

                  <button
                    key={index}
                    className={`date-card ${
                      selectedDate === index ? "selected" : ""
                    }`}
                    onClick={() => setSelectedDate(index)}
                  >

                    <span>{item.day}</span>

                    <strong>{item.date}</strong>

                    <small>{item.month}</small>

                  </button>

                ))}

              </div>

            </div>


            {/* TIME SECTION */}
            <div className="booking-card">

              <div className="section-heading">

                <div className="section-icon">
                  <Clock size={20} />
                </div>

                <div>
                  <h2>Available Time Slots</h2>
                  <p>Select a suitable consultation time</p>
                </div>

              </div>


              <div className="time-slots">

                {times.map((time, index) => (

                  <button
                    key={index}
                    className={`time-slot ${
                      selectedTime === time ? "selected" : ""
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>

                ))}

              </div>

            </div>


            {/* CONSULTATION TYPE */}
            <div className="booking-card">

              <div className="section-heading">

                <div className="section-icon">
                  <Stethoscope size={20} />
                </div>

                <div>
                  <h2>Consultation Type</h2>
                  <p>Choose how you want to consult</p>
                </div>

              </div>


              <div className="consultation-options">

                <button
                  className={`consult-card ${
                    consultType === "video" ? "selected" : ""
                  }`}
                  onClick={() => setConsultType("video")}
                >

                  <Video size={25} />

                  <div>
                    <strong>Video Consultation</strong>
                    <span>Talk face-to-face with your doctor</span>
                  </div>

                </button>


                <button
                  className={`consult-card ${
                    consultType === "chat" ? "selected" : ""
                  }`}
                  onClick={() => setConsultType("chat")}
                >

                  <MessageCircle size={25} />

                  <div>
                    <strong>Chat Consultation</strong>
                    <span>Consult your doctor through chat</span>
                  </div>

                </button>

              </div>

            </div>

          </section>


          {/* RIGHT SIDE SUMMARY */}
          <aside className="appointment-summary">

            <div className="summary-header">
              <h2>Appointment Summary</h2>
              <p>Review your booking details</p>
            </div>


            {/* DOCTOR */}
            <div className="summary-doctor">

              <div className="summary-avatar">
                👨‍⚕️
              </div>

              <div>
                <h3>Dr. Arjun Mehta</h3>
                <p>General Physician</p>

                <span className="online-status">
                  ● Available
                </span>
              </div>

            </div>


            <div className="summary-line"></div>


            {/* DETAILS */}
            <div className="summary-details">

              <div className="summary-item">

                <CalendarDays size={19} />

                <div>
                  <span>Date</span>

                  <strong>
                    {dates[selectedDate].day},{" "}
                    {dates[selectedDate].date}{" "}
                    {dates[selectedDate].month}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                <Clock size={19} />

                <div>
                  <span>Time</span>

                  <strong>
                    {selectedTime || "Select a time"}
                  </strong>
                </div>

              </div>


              <div className="summary-item">

                {consultType === "video" ? (
                  <Video size={19} />
                ) : (
                  <MessageCircle size={19} />
                )}

                <div>
                  <span>Consultation</span>

                  <strong>
                    {consultType === "video"
                      ? "Video Consultation"
                      : "Chat Consultation"}
                  </strong>
                </div>

              </div>

            </div>


            <div className="summary-line"></div>


            {/* PRICE */}
            <div className="appointment-price">

              <span>Consultation Fee</span>

              <strong>
                <IndianRupee size={18} />
                300
              </strong>

            </div>


            {/* BUTTON */}
            <button
              className="confirm-booking"
              disabled={!selectedTime}
            >

              <CheckCircle2 size={20} />

              Confirm Appointment

            </button>


            <p className="booking-note">
              You can cancel or reschedule your appointment later.
            </p>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Appointment;