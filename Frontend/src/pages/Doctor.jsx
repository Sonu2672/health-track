// import React, { useState } from "react";
// import "../App.css";
// import Sidebar from "../components/Sidebar";

// import {
//   Search,
//   Star,
//   Video,
//   MessageCircle,
//   Calendar,
//   Clock,
//   Stethoscope,
//   ShieldCheck,
//   Headphones,
// } from "lucide-react";

// const ConsultDoctor = ({ setIslogin }) => {
//   const [selectedDoctor, setSelectedDoctor] = useState(null);

//   const doctors = [
//     {
//       id: 1,
//       name: "Dr. Arjun Mehta",
//       specialization: "General Physician",
//       experience: "8+ Years Experience",
//       rating: "4.8",
//       reviews: "120+",
//       fee: "₹300",
//       image: "👨‍⚕️",
//       online: true,
//     },
//     {
//       id: 2,
//       name: "Dr. Priya Sharma",
//       specialization: "Cardiologist",
//       experience: "10+ Years Experience",
//       rating: "4.9",
//       reviews: "80+",
//       fee: "₹500",
//       image: "👩‍⚕️",
//       online: true,
//     },
//     {
//       id: 3,
//       name: "Dr. Rohit Verma",
//       specialization: "Pulmonologist",
//       experience: "7+ Years Experience",
//       rating: "4.7",
//       reviews: "50+",
//       fee: "₹400",
//       image: "👨‍⚕️",
//       online: true,
//     },
//   ];

//   return (
//     <div className="app-layout">

//       {/* SIDEBAR */}
//       <Sidebar setIslogin={setIslogin} />

//       {/* MAIN CONTENT */}
//       <main className="consult-page">
//         <div className="consult-container">

//           <div className="consult-header">
//             <div>
//               <h1>Consult Doctor</h1>
//               <p>Connect with experienced doctors and get expert advice</p>
//             </div>
//           </div>

//           <div className="doctor-hero">
//             <div className="hero-content">
//               <h2>Talk to a Doctor, Anytime</h2>

//               <p>
//                 Get professional medical guidance from verified doctors
//                 through chat or video consultation.
//               </p>

//               <div className="hero-features">
//                 <span>
//                   <ShieldCheck size={18} />
//                   Verified Doctors
//                 </span>

//                 <span>🔒 Secure & Private</span>

//                 <span>
//                   <Headphones size={18} />
//                   24/7 Support
//                 </span>
//               </div>
//             </div>

//             <div className="doctor-illustration">
//               <div className="doctor-circle">
//                 <Stethoscope size={75} />
//               </div>
//             </div>
//           </div>

//           <div className="consult-main">

//             {/* LEFT */}
//             <div className="doctor-list-section">

//               <h2>Find a Doctor</h2>

//               <div className="search-box">
//                 <Search size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search by name or specialization..."
//                 />
//               </div>

//               <div className="doctor-filters">
//                 <button className="active-filter">All</button>
//                 <button>General</button>
//                 <button>Cardiologist</button>
//               </div>

//               <div className="doctor-list">

//                 {doctors.map((doctor) => (
//                   <div className="doctor-card" key={doctor.id}>

//                     <div className="doctor-avatar">
//                       {doctor.image}
//                     </div>

//                     <div className="doctor-info">

//                       <div className="doctor-name-row">
//                         <h3>{doctor.name}</h3>

//                         <span
//                           className={
//                             doctor.online
//                               ? "online-status"
//                               : "offline-status"
//                           }
//                         >
//                           ● {doctor.online ? "Online" : "Offline"}
//                         </span>
//                       </div>

//                       <p className="specialization">
//                         {doctor.specialization}
//                       </p>

//                       <p className="experience">
//                         {doctor.experience}
//                       </p>

//                       <div className="doctor-bottom">

//                         <div className="rating">
//                           <Star size={16} fill="currentColor" />
//                           {doctor.rating} ({doctor.reviews})
//                         </div>

//                         <span className="doctor-fee">
//                           {doctor.fee}
//                         </span>

//                         <button
//                           className="consult-btn"
//                           onClick={() => setSelectedDoctor(doctor)}
//                         >
//                           Consult
//                         </button>

//                       </div>
//                     </div>
//                   </div>
//                 ))}

//               </div>
//             </div>

//             {/* RIGHT */}
//             <div className="consult-panel">

//               {selectedDoctor ? (
//                 <>
//                   <div className="selected-doctor">

//                     <div className="selected-avatar">
//                       {selectedDoctor.image}
//                     </div>

//                     <div>
//                       <h2>{selectedDoctor.name}</h2>
//                       <p>{selectedDoctor.specialization}</p>

//                       <span className="online-status">
//                         ● Online
//                       </span>
//                     </div>

//                   </div>

//                   <div className="consult-options">

//                     <h3>How would you like to consult?</h3>

//                     <button className="video-consult">
//                       <Video size={22} />
//                       Start Video Consultation
//                     </button>

//                     <button className="chat-consult">
//                       <MessageCircle size={22} />
//                       Start Chat Consultation
//                     </button>

//                     <button className="appointment-consult">
//                       <Calendar size={22} />
//                       Book Appointment
//                     </button>

//                   </div>
//                 </>
//               ) : (
//                 <div className="select-doctor-message">

//                   <div className="select-icon">
//                     <Stethoscope size={55} />
//                   </div>

//                   <h2>Select a Doctor</h2>

//                   <p>
//                     Choose a doctor from the list to start your consultation.
//                   </p>

//                 </div>
//               )}

//               <div className="consult-info">
//                 <Clock size={22} />

//                 <div>
//                   <h4>Available 24/7</h4>
//                   <p>Get medical guidance whenever you need it.</p>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ConsultDoctor;

























import React, { useState } from "react";
import "../App.css";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
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

    const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [sort, setSort] = useState("");

const navigate = useNavigate();
const doctors = [

  // ================= GENERAL =================

  {
    id: 1,
    name: "Dr. Arjun Mehta",
    specialization: "General",
    experience: "12+ Years of Experience",
    rating: 4.8,
    reviews: 120,
    fee: 300,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 2,
    name: "Dr. Kavita Sharma",
    specialization: "General",
    experience: "9+ Years of Experience",
    rating: 4.7,
    reviews: 95,
    fee: 250,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 3,
    name: "Dr. Raj Verma",
    specialization: "General",
    experience: "15+ Years of Experience",
    rating: 4.9,
    reviews: 210,
    fee: 400,
    image: "👨‍⚕️",
    online: false,
  },


  // ================= CARDIOLOGIST =================

  {
    id: 4,
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "15+ Years of Experience",
    rating: 4.9,
    reviews: 280,
    fee: 700,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 5,
    name: "Dr. Amit Singh",
    specialization: "Cardiologist",
    experience: "11+ Years of Experience",
    rating: 4.8,
    reviews: 190,
    fee: 650,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 6,
    name: "Dr. Neha Kapoor",
    specialization: "Cardiologist",
    experience: "18+ Years of Experience",
    rating: 4.9,
    reviews: 340,
    fee: 900,
    image: "👩‍⚕️",
    online: false,
  },


  // ================= PULMONOLOGIST =================

  {
    id: 7,
    name: "Dr. Rohit Verma",
    specialization: "Pulmonologist",
    experience: "9+ Years of Experience",
    rating: 4.7,
    reviews: 95,
    fee: 500,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 8,
    name: "Dr. Sneha Roy",
    specialization: "Pulmonologist",
    experience: "13+ Years of Experience",
    rating: 4.8,
    reviews: 175,
    fee: 600,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 9,
    name: "Dr. Vivek Kumar",
    specialization: "Pulmonologist",
    experience: "16+ Years of Experience",
    rating: 4.9,
    reviews: 230,
    fee: 750,
    image: "👨‍⚕️",
    online: false,
  },


  // ================= DERMATOLOGIST =================

  {
    id: 10,
    name: "Dr. Anjali Gupta",
    specialization: "Dermatologist",
    experience: "10+ Years of Experience",
    rating: 4.8,
    reviews: 180,
    fee: 600,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 11,
    name: "Dr. Riya Singh",
    specialization: "Dermatologist",
    experience: "7+ Years of Experience",
    rating: 4.6,
    reviews: 110,
    fee: 450,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 12,
    name: "Dr. Karan Malhotra",
    specialization: "Dermatologist",
    experience: "14+ Years of Experience",
    rating: 4.9,
    reviews: 270,
    fee: 800,
    image: "👨‍⚕️",
    online: false,
  },


  // ================= NEUROLOGIST =================

  {
    id: 13,
    name: "Dr. Amit Kumar",
    specialization: "Neurologist",
    experience: "14+ Years of Experience",
    rating: 4.9,
    reviews: 210,
    fee: 900,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 14,
    name: "Dr. Pooja Singh",
    specialization: "Neurologist",
    experience: "11+ Years of Experience",
    rating: 4.8,
    reviews: 150,
    fee: 750,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 15,
    name: "Dr. Rahul Jain",
    specialization: "Neurologist",
    experience: "19+ Years of Experience",
    rating: 4.9,
    reviews: 320,
    fee: 1200,
    image: "👨‍⚕️",
    online: false,
  },


  // ================= PSYCHIATRIST =================

  {
    id: 16,
    name: "Dr. Sneha Gupta",
    specialization: "Psychiatrist",
    experience: "11+ Years of Experience",
    rating: 4.8,
    reviews: 165,
    fee: 700,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 17,
    name: "Dr. Aditya Shah",
    specialization: "Psychiatrist",
    experience: "8+ Years of Experience",
    rating: 4.7,
    reviews: 125,
    fee: 600,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 18,
    name: "Dr. Meera Kapoor",
    specialization: "Psychiatrist",
    experience: "16+ Years of Experience",
    rating: 4.9,
    reviews: 280,
    fee: 1000,
    image: "👩‍⚕️",
    online: false,
  },


  // ================= PSYCHOLOGIST =================

  {
    id: 19,
    name: "Dr. Rahul Sharma",
    specialization: "Psychologist",
    experience: "8+ Years of Experience",
    rating: 4.7,
    reviews: 140,
    fee: 500,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 20,
    name: "Dr. Simran Kaur",
    specialization: "Psychologist",
    experience: "10+ Years of Experience",
    rating: 4.8,
    reviews: 200,
    fee: 650,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 21,
    name: "Dr. Ankit Roy",
    specialization: "Psychologist",
    experience: "15+ Years of Experience",
    rating: 4.9,
    reviews: 260,
    fee: 850,
    image: "👨‍⚕️",
    online: false,
  },


  // ================= ORTHOPEDIC =================

  {
    id: 22,
    name: "Dr. Vikram Singh",
    specialization: "Orthopedic Surgeon",
    experience: "16+ Years of Experience",
    rating: 4.9,
    reviews: 320,
    fee: 800,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 23,
    name: "Dr. Mohit Kumar",
    specialization: "Orthopedic Surgeon",
    experience: "12+ Years of Experience",
    rating: 4.8,
    reviews: 190,
    fee: 700,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 24,
    name: "Dr. Ayesha Khan",
    specialization: "Orthopedic Surgeon",
    experience: "9+ Years of Experience",
    rating: 4.7,
    reviews: 145,
    fee: 600,
    image: "👩‍⚕️",
    online: false,
  },


  // ================= PEDIATRICIAN =================

  {
    id: 25,
    name: "Dr. Anjali Verma",
    specialization: "Pediatrician",
    experience: "13+ Years of Experience",
    rating: 4.8,
    reviews: 250,
    fee: 600,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 26,
    name: "Dr. Nitin Sharma",
    specialization: "Pediatrician",
    experience: "10+ Years of Experience",
    rating: 4.7,
    reviews: 180,
    fee: 500,
    image: "👨‍⚕️",
    online: true,
  },

  {
    id: 27,
    name: "Dr. Renu Gupta",
    specialization: "Pediatrician",
    experience: "18+ Years of Experience",
    rating: 4.9,
    reviews: 350,
    fee: 850,
    image: "👩‍⚕️",
    online: false,
  },


  // ================= GYNECOLOGIST =================

  {
    id: 28,
    name: "Dr. Kavita Singh",
    specialization: "Gynecologist",
    experience: "17+ Years of Experience",
    rating: 4.9,
    reviews: 400,
    fee: 900,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 29,
    name: "Dr. Priyanka Das",
    specialization: "Gynecologist",
    experience: "12+ Years of Experience",
    rating: 4.8,
    reviews: 220,
    fee: 700,
    image: "👩‍⚕️",
    online: true,
  },

  {
    id: 30,
    name: "Dr. Shalini Verma",
    specialization: "Gynecologist",
    experience: "20+ Years of Experience",
    rating: 4.9,
    reviews: 450,
    fee: 1200,
    image: "👩‍⚕️",
    online: false,
  },

];


const filteredDoctors = doctors.filter((doctor) => {
  const matchesSearch =
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesSpecialization =
    specialization === "All" ||
    doctor.specialization === specialization;

  return matchesSearch && matchesSpecialization;
});

const displayedDoctors = filteredDoctors.slice(0, 3);

// const displayedDoctors = filteredDoctors.slice(0, 3);




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
  {[
    "All",
    "General",
    "Cardiologist",
    "Pulmonologist",
    "Dermatologist",
    "Neurologist",
    "Psychiatrist",
    "Psychologist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Gynecologist",
  ].map((item) => (
    <button
      key={item}
      className={
        specialization === item ? "active-filter" : ""
      }
      onClick={() => setSpecialization(item)}
    >
      {item}
    </button>
  ))}
</div>


<select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
>
  <option value="">Sort By</option>
  <option value="rating">Highest Rated</option>
  <option value="experience">Most Experienced</option>
  <option value="lowFee">Lowest Fee</option>
  <option value="highFee">Highest Fee</option>
</select>







              <div className="doctor-list">

           {displayedDoctors.map((doctor) => (
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

                    {/* <button className="video-consult">
                      <Video size={22} />
                      Start Video Consultation
                    </button> */}

                    {/* <button className="chat-consult">
                      <MessageCircle size={22} />
                      Start Chat Consultation
                    </button> */}

                    <button
  onClick={() => navigate("/appointment")}
  className="appointment-consult"
>
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
