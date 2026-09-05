// import React from "react";
// import Sidebar from '../components/Sidebar';
// import { useState, useEffect } from "react";
// import {
//   HeartPulse,
//   LayoutDashboard,
//   MapPin,
//   Bell,
//   CloudSun,
//   Cloud,
//   Siren,
//   UserRound,
//   Settings,
//   ShieldCheck,
//   ArrowLeft,
//   CircleAlert,
//   CircleCheck,
// } from "lucide-react";

// import "../App.css";



// function RiskAnalysis() {


//     const [healthd, setHealthd] = useState({
//       // deviceId: "",
//       heartRate: "",
//       spo2: "",
//       temperature: "",
//     });
  
//     const [riskScore,setRiskScore]=useState(null);
//     const [riskLevel,setRiskLevel]=useState("");
//     const [recom,setRecom]=useState([]);
    
//     useEffect(() => {
//       const Hdata = async () => {
//       const response = await fetch(
//         "https://health-track-2b.onrender.com/api/health/getdata",
//         {
//           method: "GET",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           // body: JSON.stringify({
          
//           // }),
//         },
//       );
  
//       const data = await response.json();
//       console.log("aacha= ", data.hd);
  
//       // toast.success("Logout Successful 🚀");
//       // setIsadmin(false);
//       // navigate("/");
  
//       setHealthd({
//         // deviceId: data.hd.deviceId,
//         heartRate: data.hd.heartRate,
//         spo2: data.hd.spo2,
//         temp: data.hd.temp,
//       });
      
//       setRiskScore(data.riskScore);
//       setRiskLevel(data.riskLevel)
//       console.log(riskScore,riskLevel)
//       setRecom(data.recommendations)
//       console.log(data.recommendations)

//     };
  
//       Hdata();
//     }, []);




//       const riskFactors = [
//     { 
//       title: "High Body Temperature", //temp
//       sub: "(>39°C)",
//       value: 95,
//     },
//     {
//       title: "Elevated Heart Rate", //bpm
//       sub: "(>100 BPM)",
//       value: 78,
//     },
//     {
//       title: "High Ambient Temperature", //temp
//       sub: "(>40°C)",
//       value: 76,
//     },
//     {
//       title: "Poor/Low Activity Level", //activity
//       sub: "(Past 8h)",
//       value: 70,
//     },
//     {                                  //hydration
//       title: "Low Hydration",
//       sub: "(Under 30%)",
//       value: 59,
//     },
//   ];


//   return (
//     <div className="risk-page">

//       {/* SIDEBAR */}
//       <Sidebar/>


//       {/* MAIN */}
//       <main className="risk-main">

//         {/* HEADER */}
//         <header className="risk-header">

//           <div className="risk-heading">

//             <ArrowLeft size={17} />

//             <div>
//               <h1>AI Risk Analysis</h1>
//               <p>AI powered health risk assessment</p>
//             </div>

//           </div>

//         </header>


//         {/* TOP RISK SECTION */}
//         <section className="risk-summary">

//           {/* SCORE */}
//           <div className="score-section">

//             <h3>Current Risk Score</h3>

//             <div className="risk-gauge">

//               <div className="gauge-arc"></div>

//               <div className="gauge-number">
//                 <strong>{riskScore}</strong>
//                 <span>/100</span>
//               </div>

//               <div className="gauge-label">
//                 {riskLevel}
//               </div>

//             </div>

//           </div>


//           {/* RISK LEVEL */}
//           <div className="risk-level-section">

//             <h3>Risk Level</h3>

//             <h2>{riskLevel}</h2>

//             <p>
//               Your current health indicates cogent
//               deviations in vital signs and
//               environment.
//             </p>

//             <div className="confidence-title">
//               AI Confidence
//             </div>

//             <div className="confidence-row">

//               <div className="confidence-bar">
//                 <div></div>
//               </div>

//               <strong>60%</strong>

//             </div>

//           </div>

//         </section>


//         {/* RISK FACTORS */}
//         <section className="risk-box">

//           <h3>Risk Factors Contributing</h3>

//           <div className="factors">

//             {riskFactors.map((factor, index) => (

//               <div className="factor" key={index}>

//                 <div className="factor-name">

//                   <strong>{factor.title}</strong>

//                   <span>{factor.sub}</span>

//                 </div>

//                 <div className="factor-bar">

//                   <div
//                     style={{
//                       width: `${factor.value}%`,
//                     }}
//                   ></div>

//                 </div>

//                 <strong className="factor-value">
//                   {factor.value}%
//                 </strong>

//               </div>

//             ))}

//           </div>

//         </section>


//         {/* RECOMMENDATIONS */}
//         <section className="risk-box recommendations">

//           <h3>Recommendations</h3>

//           <div className="recommendation-list">

//             {recom.map((item, index) => (

//               <div
//                 className="recommendation"
//                 key={index}
//               >

//                 <CircleCheck size={13} />

//                 <span>{item}</span>

//               </div>

//             ))}

//           </div>

//         </section>


//         {/* EMERGENCY WARNING */}
//         <div className="medical-warning">

//           <CircleAlert size={16} />

//           <strong>
//             If symptoms worsen, contact your medical emergency.
//           </strong>

//         </div>

//       </main>

//     </div>
//   );
// }


// /* NAV ITEM */

// function NavItem({
//   icon,
//   text,
//   active,
//   badge,
// }) {

//   return (
//     <div
//       className={`risk-nav-item ${
//         active ? "active" : ""
//       }`}
//     >

//       {React.cloneElement(icon, {
//         size: 17,
//       })}

//       <span>{text}</span>

//       {badge && (
//         <b className="risk-badge">
//           {badge}
//         </b>
//       )}

//     </div>
//   );
// }

// export default RiskAnalysis;












import React from "react";
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from "react";
import GaugeComponent from "react-gauge-component";
import {
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Bell,
  CloudSun,
  Cloud,
  Siren,
  UserRound,
  Settings,
  ShieldCheck,
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Menu
} from "lucide-react";

import "../App.css";
import API_URL from "../config/api";


function RiskAnalysis() {
  const [menuOpen, setMenuOpen] = useState(false);
   const [riskFactors, setRiskFactors] = useState([]);

    const [healthd, setHealthd] = useState({
      // deviceId: "",
      heartRate: "",
      spo2: "",
      temperature: "",
    });
  
    const [riskScore,setRiskScore]=useState(null);
    const [riskLevel,setRiskLevel]=useState("");
    const [recom,setRecom]=useState([]);
    
    useEffect(() => {
      const Hdata = async () => {
      const response = await fetch(
          "https://health-track-2b.onrender.com/api/health/getdata",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({
          
          // }),
        },
      );
  
      const data = await response.json();
      console.log("aacha= ", data.hd);
  
      // toast.success("Logout Successful 🚀");
      // setIsadmin(false);
      // navigate("/");
  
      setHealthd({
        // deviceId: data.hd.deviceId,
        heartRate: data.hd.heartRate,
        spo2: data.hd.spo2,
        temp: data.hd.temp,
      });
      
      setRiskScore(data.riskScore);
      setRiskLevel(data.riskLevel)
      console.log(riskScore,riskLevel)
      setRecom(data.recommendations)
      console.log(data.recommendations)
      setRiskFactors(data.riskFactors);

    };
  
      Hdata();
    }, []);




   

  return (
    <div className="risk-page">

      {/* SIDEBAR */}
  {menuOpen && (
    <div
      className="sidebar-overlay"
      onClick={() => setMenuOpen(false)}
    />
  )}

  <Sidebar
    isOpen={menuOpen}
    closeSidebar={() => setMenuOpen(false)}
  />


      {/* MAIN */}
      <main className="risk-main">

        {/* HEADER */}
        <header className="risk-header">

          <div className="risk-heading">
                       <button
  className="menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  <Menu size={28} />
</button>

            {/* <ArrowLeft size={17} /> */}

            <div>
              <h1>AI Risk Analysis</h1>
              <p>AI powered health risk assessment</p>
            </div>

          </div>

        </header>


        {/* TOP RISK SECTION */}
        <section className="risk-summary">

          {/* SCORE */}
          <div className="score-section">

            <h3>Current Risk Score</h3>

            <div className="risk-gauge">

              <div className="gauge-arc"></div>

              <div className="gauge-number">
                <strong>{riskScore}</strong>
                <span>/100</span>
              </div>

              <div className="gauge-label">
                {riskLevel}
              </div>

            </div>

          </div>


          {/* RISK LEVEL */}
          <div className="risk-level-section">

            <h3>Risk Level</h3>

            <h2>{riskLevel}</h2>

            <p>
              Your current health indicates cogent
              deviations in vital signs and
              environment.
            </p>

            <div className="confidence-title">
              AI Confidence
            </div>

            <div className="confidence-row">

              <div className="confidence-bar">
                <div></div>
              </div>

              <strong>60%</strong>

            </div>

          </div>

        </section>


        {/* RISK FACTORS */}
        <section className="risk-box">

          <h3>Risk Factors Contributing</h3>

          <div className="factors">

            {riskFactors.map((factor, index) => (

              <div className="factor" key={index}>

                <div className="factor-name">

                  <strong>{factor.title}</strong>

                  <span>{factor.sub}</span>

                </div>

                <div className="factor-bar">

                  <div
                    style={{
                      width: `${factor.value}%`,
                    }}
                  ></div>

                </div>

                <strong className="factor-value">
                  {factor.value}%
                </strong>

              </div>

            ))}

          </div>

        </section>


        {/* RECOMMENDATIONS */}
        <section className="risk-box recommendations">

          <h3>Recommendations</h3>

          <div className="recommendation-list">

            {recom.map((item, index) => (

              <div
                className="recommendation"
                key={index}
              >

                <CircleCheck size={13} />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </section>


        {/* EMERGENCY WARNING */}
        <div className="medical-warning">

          <CircleAlert size={16} />

          <strong>
            If symptoms worsen, contact your medical emergency.
          </strong>

        </div>

      </main>

    </div>
  );
}


/* NAV ITEM */

function NavItem({
  icon,
  text,
  active,
  badge,
}) {

  return (
    <div
      className={`risk-nav-item ${
        active ? "active" : ""
      }`}
    >

      {React.cloneElement(icon, {
        size: 17,
      })}

      <span>{text}</span>

      {badge && (
        <b className="risk-badge">
          {badge}
        </b>
      )}

    </div>
  );
}

export default RiskAnalysis;
