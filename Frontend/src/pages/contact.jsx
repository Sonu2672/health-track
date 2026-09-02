import React from "react";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";

import "../App.css";


function Contact() {
  return (
    <>
      {/* Navbar */}
      <Navbar />


      {/* Page Content */}
      <main className="page">

        {/* ================= HERO ================= */}

        <section className="page-hero">

          <div className="page-badge">
            <MessageCircle size={17} />
            Get In Touch
          </div>


          <h1>
            We're Here to
            <span> Help.</span>
          </h1>


          <p>
            Have a question, suggestion or need assistance?
            We'd love to hear from you.
          </p>

        </section>


        {/* ================= CONTACT ================= */}

        <section className="contact-section">

          {/* LEFT SIDE */}

          <div className="contact-info">

            <h2>
              Let's Talk
            </h2>


            <p>
              Whether you have a question about PHC, our features,
              or anything else, our team is ready to help.
            </p>


            {/* EMAIL */}

            <div className="contact-item">

              <div>
                <Mail />
              </div>

              <section>
                <small>
                  Email
                </small>

                <strong>
                  support@phc.com
                </strong>
              </section>

            </div>


            {/* PHONE */}

            <div className="contact-item">

              <div>
                <Phone />
              </div>

              <section>
                <small>
                  Phone
                </small>

                <strong>
                  +91 98765 43210
                </strong>
              </section>

            </div>


            {/* LOCATION */}

            <div className="contact-item">

              <div>
                <MapPin />
              </div>

              <section>
                <small>
                  Location
                </small>

                <strong>
                  India
                </strong>
              </section>

            </div>

          </div>


          {/* ================= FORM ================= */}

          <div className="contact-form">

            <h2>
              Send us a Message
            </h2>


            <div className="form-row">

              <input
                type="text"
                placeholder="First Name"
              />

              <input
                type="text"
                placeholder="Last Name"
              />

            </div>


            <input
              type="email"
              placeholder="Email Address"
            />


            <input
              type="text"
              placeholder="Subject"
            />


            <textarea
              placeholder="Write your message..."
              rows="5"
            ></textarea>


            <button type="button">

              Send Message

              <Send size={17} />

            </button>

          </div>

        </section>

      </main>
    </>
  );
}


export default Contact;