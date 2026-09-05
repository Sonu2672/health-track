// import React from "react";
// import {useState,useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import "../App.css";
// import { HeartPulse, Activity, Thermometer } from "lucide-react";

// const Patient = () => {

//    const [heartRate,setheartRate]=useState(null);
//    const [spo2,setSpo2]=useState(null);
//    const [temp,setTemp]=useState(null);
// const navigate = useNavigate();
//   const pSubmit=async()=>{
//         const response = await fetch(
//       "https://health-track-2b.onrender.com/api/health/healthdata",
//       {
//         method: "POST",
// //         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//            heartRate,spo2,temp
//         }),
//       },
//     );

//     const data = await response.json();
//     console.log("aacha= ", data.hd);

//     // toast.success("Logout Successful 🚀");
//     // setIsadmin(false);
//     navigate("/dashboard");

    
//   }
   
//   return (
//     <div className="patient-page">
//       <div className="patient-card">

//         {/* Top Health Illustration Section */}
//         <div className="health-banner">
//           <div className="health-circle circle-1"></div>
//           <div className="health-circle circle-2"></div>

//           <div className="banner-icon">
//             <HeartPulse size={55} />
//           </div>

//           <h2>Health Monitoring</h2>
//           <p>Keep track of your vital health information</p>
//         </div>

//         {/* Form */}
//         <div className="health-form">

//           <div className="form-title">
//             <h3>Add Health Data</h3>
//             <p>Enter your current health details</p>
//           </div>

//           <div className="input-group">
//             <label>
//               <HeartPulse size={18} />
//               Heart Rate
//             </label>

//             <div className="input-wrapper">
//               <input onChange={(e)=>setheartRate(e.target.value)} type="number" placeholder="Enter heart rate" />
//               <span>BPM</span>
//             </div>
//           </div>

//           <div className="input-group">
//             <label>
//               <Activity size={18} />
//               SpO₂ Level
//             </label>

//             <div className="input-wrapper">
//               <input onChange={(e)=>setSpo2(e.target.value)} type="number" placeholder="Enter SpO₂ level" />
//               <span>%</span>
//             </div>
//           </div>

//           <div className="input-group">
//             <label>
//               <Thermometer size={18} />
//               Body Temperature
//             </label>
//             <div className="input-wrapper">
//               <input onChange={(e)=>setTemp(e.target.value)} type="number" placeholder="Enter temperature" />
//               <span>°C</span>
//             </div>
//           </div>

//           <button onClick={pSubmit}className="submit-health-btn">
//             Submit Health Data
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patient;


















import React from "react";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { HeartPulse, Activity, Thermometer } from "lucide-react";
// import API_URL from "../config/api";
const Patient = () => {

   const [heartRate,setheartRate]=useState(null);
   const [spo2,setSpo2]=useState(null);
   const [temp,setTemp]=useState(null);
const navigate = useNavigate();
  const pSubmit=async()=>{
        const response = await fetch(
      "https://health-track-2b.onrender.com/api/health/healthdata",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           heartRate,spo2,temp
        }),
      },
    );

    const data = await response.json();
    console.log("aacha= ", data.hd);

    // toast.success("Logout Successful 🚀");
    // setIsadmin(false);
    navigate("/dashboard");

    
  }
   
  return (
    <div className="patient-page">
      <div className="patient-card">

        {/* Top Health Illustration Section */}
        <div className="health-banner">
          <div className="health-circle circle-1"></div>
          <div className="health-circle circle-2"></div>

          <div className="banner-icon">
            <HeartPulse size={55} />
          </div>

          <h2>Health Monitoring</h2>
          <p>Keep track of your vital health information</p>
        </div>

        {/* Form */}
        <div className="health-form">

          <div className="form-title">
            <h3>Add Health Data</h3>
            <p>Enter your current health details</p>
          </div>

          <div className="input-group">
            <label>
              <HeartPulse size={18} />
              Heart Rate
            </label>

            <div className="input-wrapper">
              <input onChange={(e)=>setheartRate(e.target.value)} type="number" placeholder="Enter heart rate" />
              <span>BPM</span>
            </div>
          </div>

          <div className="input-group">
            <label>
              <Activity size={18} />
              SpO₂ Level
            </label>

            <div className="input-wrapper">
              <input onChange={(e)=>setSpo2(e.target.value)} type="number" placeholder="Enter SpO₂ level" />
              <span>%</span>
            </div>
          </div>

          <div className="input-group">
            <label>
              <Thermometer size={18} />
              Body Temperature
            </label>
            <div className="input-wrapper">
              <input onChange={(e)=>setTemp(e.target.value)} type="number" placeholder="Enter temperature" />
              <span>°C</span>
            </div>
          </div>

          <button onClick={pSubmit}className="submit-health-btn">
            Submit Health Data
          </button>

        </div>
      </div>
    </div>
  );
};

export default Patient;














// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import "../App.css";
// import { HeartPulse, Activity, Thermometer } from "lucide-react";

// const Patient = () => {
//   const [heartRate, setheartRate] = useState(null);
//   const [spo2, setSpo2] = useState(null);
//   const [temp, setTemp] = useState(null);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // ---------------- 1. GOOGLE LOGIN TOKEN CATCH LOGIC ----------------
//   useEffect(() => {
//     // Check karein ki kya URL me ?token=... hai (Google redirect se aane par)
//     const tokenFromUrl = searchParams.get("token");

//     if (tokenFromUrl) {
//       // LocalStorage me Token Save karein
//       localStorage.setItem("token", tokenFromUrl);

//       // Clean URL (Clean URL ke liye ?token=... ko remove kar dein)
//       window.history.replaceState({}, document.title, "/patient");
//     }

//     // LocalStorage se Token read karein
//     const existingToken = localStorage.getItem("token");

//     // Agar token nahi milta toh user ko login page par redirect kar dein
//     if (!existingToken && !tokenFromUrl) {
//       console.log("No token found, redirecting to login...");
//       // navigate("/login"); // Enable this line if you want to force login check
//     }
//   }, [searchParams, navigate]);

//   // ---------------- 2. SUBMIT HEALTH DATA ----------------
//   const pSubmit = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         "https://health-track-2f.onrender.com/api/health/healthdata",
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             // Bearer Token Authorization Header
//             Authorization: token ? `Bearer ${token}` : "",
//           },
//           body: JSON.stringify({
//             heartRate,
//             spo2,
//             temp,
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log("Response Data:", data);

//       if (response.ok) {
//         navigate("/dashboard");
//       } else {
//         alert(data.message || "Failed to submit health data");
//       }
//     } catch (error) {
//       console.error("Submission Error:", error);
//     }
//   };

//   return (
//     <div className="patient-page">
//       <div className="patient-card">
//         {/* Top Health Illustration Section */}
//         <div className="health-banner">
//           <div className="health-circle circle-1"></div>
//           <div className="health-circle circle-2"></div>

//           <div className="banner-icon">
//             <HeartPulse size={55} />
//           </div>

//           <h2>Health Monitoring</h2>
//           <p>Keep track of your vital health information</p>
//         </div>

//         {/* Form */}
//         <div className="health-form">
//           <div className="form-title">
//             <h3>Add Health Data</h3>
//             <p>Enter your current health details</p>
//           </div>

//           <div className="input-group">
//             <label>
//               <HeartPulse size={18} />
//               Heart Rate
//             </label>

//             <div className="input-wrapper">
//               <input
//                 onChange={(e) => setheartRate(e.target.value)}
//                 type="number"
//                 placeholder="Enter heart rate"
//               />
//               <span>BPM</span>
//             </div>
//           </div>

//           <div className="input-group">
//             <label>
//               <Activity size={18} />
//               SpO₂ Level
//             </label>

//             <div className="input-wrapper">
//               <input
//                 onChange={(e) => setSpo2(e.target.value)}
//                 type="number"
//                 placeholder="Enter SpO₂ level"
//               />
//               <span>%</span>
//             </div>
//           </div>

//           <div className="input-group">
//             <label>
//               <Thermometer size={18} />
//               Body Temperature
//             </label>
//             <div className="input-wrapper">
//               <input
//                 onChange={(e) => setTemp(e.target.value)}
//                 type="number"
//                 placeholder="Enter temperature"
//               />
//               <span>°C</span>
//             </div>
//           </div>

//           <button onClick={pSubmit} className="submit-health-btn">
//             Submit Health Data
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Patient;
