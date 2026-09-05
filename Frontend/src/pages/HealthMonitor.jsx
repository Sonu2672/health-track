// import React from "react";
// import Sidebar from "../components/Sidebar"
// import { useState, useEffect } from "react";
// // import {

// //   Menu
// //   // baaki icons
// // } from "lucide-react";
// import {
//   ArrowLeft,
//   HeartPulse,
//   Droplets,
//   Thermometer,
//   Wind,
//   Activity,
//   Brain,
//   Footprints,
//   Flame,
//   MapPin,
//   Bell,
//   Cloud,
//   UserRound,
//   Settings,
//   ShieldAlert,
//   LayoutDashboard,
//   Menu,
//   CloudSun,
// } from "lucide-react";

// import "../App.css";





// function HealthMonitor() {
//   const [menuOpen, setMenuOpen] = useState(false);
//     const [riskScore,setRiskScore]=useState(null);
//     const [riskLevel,setRiskLevel]=useState("");

//     const [healthd, setHealthd] = useState({
//       // deviceId: "",
//       heartRate: "",
//       spo2: "",
//       temp: "",
//     });

//   useEffect(() => {
//     const Hdata = async () => {
//     const response = await fetch(
//       "https://health-track-2b.onrender.com/api/health/getdata",
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // body: JSON.stringify({
        
//         // }),
//       },
//     );

//     const data = await response.json();
//     console.log("aacha= ", data.hd);

//     // toast.success("Logout Successful 🚀");
//     // setIsadmin(false);
//     // navigate("/");

//     setHealthd({
//       // deviceId: data.hd.deviceId,
//       heartRate: data.hd.heartRate,
//       spo2: data.hd.spo2,
//       temp: data.hd.temp ?? data.hd.temp ?? "",
//     });
//     setRiskScore(data.riskScore);
//     setRiskLevel(data.riskLevel)
//   };

//     Hdata();
//   }, []);




  
// const cards = [
//   {
//     title: "Heart Rate",
//     value: healthd.heartRate ?? "--",
//     unit: "BPM",
//     change: "↑ 12% vs last hour",
//     type: "heart",
//     icon: <HeartPulse />,
//     data: [55, 48, 57, 51, 56, 52, 60, 55, 75, 62, 88],
//   },
//   {
//     title: "SpO₂ Level",
//     value: healthd.spo2 ?? "--",
//     unit: "%",
//     change: "↓ 2% vs last hour",
//     type: "spo2",
//     icon: <Droplets />,
//     data: [65, 58, 60, 59, 66, 61, 57, 64, 78, 68],
//   },
//   {
//     title: "Body Temperature",
//     value: `${healthd.temp ?? "--"}°C`,
//     unit: "",
//     change: "↑ 1.2°C vs last hour",
//     type: "temperature",
//     icon: <Thermometer />,
//     data: [48, 52, 45, 55, 60, 50, 58, 66, 58, 78, 65],
//   },
//   {
//     title: "Respiratory Rate",
//     value: "22",
//     unit: "/min",
//     change: "+ Normal",
//     type: "respiratory",
//     icon: <Wind />,
//     data: [58, 52, 62, 57, 65, 55, 61, 72, 63],
//   },
//   {
//     title: "Blood Pressure",
//     value: "128/84",
//     unit: "mmHg",
//     change: "+ Normal",
//     type: "pressure",
//     icon: <Activity />,
//     data: [48, 52, 45, 57, 48, 58, 46, 55, 48, 61, 50],
//   },
//   {
//     title: "Stress Level",
//     value: "High",
//     unit: "",
//     change: "⌖ 15% vs last hour",
//     type: "stress",
//     bars: [45, 85, 55, 75, 42, 88, 53, 82, 45, 73, 58],
//     icon: <Brain />,
//   },
//   {
//     title: "Steps",
//     value: "8,247",
//     unit: "steps",
//     change: "",
//     type: "steps",
//     bars: [75, 45, 88, 55, 72, 38, 80, 52, 65, 35, 50, 42],
//     icon: <Footprints />,
//     progress: "60%",
//     progressText: "Goal: 10,000 steps",
//   },
//   {
//     title: "Calories",
//     value: "523",
//     unit: "kcal",
//     change: "",
//     type: "calories",
//     data: [48, 55, 49, 65, 52, 72, 58, 70, 61, 78, 68],
//     icon: <Flame />,
//     progress: "62%",
//     progressText: "Goal: 1200 kcal",
//   },
// ];

//   return (
//     <div className="hm-page">

//       {/* SIDEBAR */}

//       <Sidebar menuOpen={menuOpen} />

//       {/* MAIN */}
//       <main className="hm-main">

//         {/* HEADER */}
//         <header className="hm-header">

//           <div className="hm-heading">

//             <div className="hm-title-row">
//                 <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
               
//                  <Menu size={28} />
//                  </button>

//               <div>
//                 <h1>Health Monitor</h1>

//                 <p>
//                   Real-time tracking of your vital signs
//                 </p>
//               </div>
//             </div>

//           </div>


//           <div className="hm-refresh">

//             <span>Auto-refresh</span>

//             <label className="switch">
//               <input type="checkbox" defaultChecked />
//               <span className="slider"></span>
//             </label>

//           </div>

//         </header>


//         {/* HEALTH GRID */}
//         <section className="hm-grid">

//           {cards.map((card, index) => (
//             <MetricCard
//               key={index}
//               {...card}
//             />
//           ))}

//         </section>

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
//     <div className={`hm-nav-item ${active ? "active" : ""}`}>

//       {React.cloneElement(icon, {
//         size: 17,
//       })}

//       <span>{text}</span>

//       {badge && (
//         <b className="hm-badge">
//           {badge}
//         </b>
//       )}

//     </div>
//   );
// }


// /* METRIC CARD */

// function MetricCard({
//   title,
//   value,
//   unit,
//   change,
//   type,
//   icon,
//   data,
//   bars,
//   progress,
//   progressText,
// }) {

//   return (
//     <div className={`metric-card ${type}`}>

//       {/* CARD HEADER */}
//       <div className="metric-header">

//         <div className="metric-icon">
//           {React.cloneElement(icon, {
//             size: 17,
//           })}
//         </div>

//         <h3>{title}</h3>

//       </div>


//       {/* VALUE */}
//       <div className="metric-number">

//         <strong>{value}</strong>

//         {unit && (
//           <span>{unit}</span>
//         )}

//       </div>


//       {/* CHANGE */}
//       {change && (
//         <div className="metric-change">
//           {change}
//         </div>
//       )}


//       {/* GRAPH */}
//       {data && (
//         <MiniLineChart data={data} />
//       )}


//       {/* BAR GRAPH */}
//       {bars && (
//         <div className="mini-bars">

//           {bars.map((height, index) => (
//             <span
//               key={index}
//               style={{
//                 height: `${height}%`,
//               }}
//             />
//           ))}

//         </div>
//       )}


//       {/* PROGRESS */}
//       {progress && (
//         <div className="goal-area">

//           <div className="goal-text">
//             <span>{progressText}</span>
//             <strong>{progress}</strong>
//           </div>

//           <div className="goal-bar">
//             <div
//               style={{
//                 width: progress,
//               }}
//             />
//           </div>

//         </div>
//       )}

//     </div>
//   );
// }


// /* SVG LINE GRAPH */

// function MiniLineChart({ data }) {

//   const max = Math.max(...data);
//   const min = Math.min(...data);

//   const points = data
//     .map((value, index) => {

//       const x =
//         (index / (data.length - 1)) * 100;

//       const y =
//         38 -
//         ((value - min) / (max - min || 1)) * 27;

//       return `${x},${y}`;

//     })
//     .join(" ");

//   return (
//     <div className="mini-line">

//       <svg
//         viewBox="0 0 100 45"
//         preserveAspectRatio="none"
//       >

//         <polyline
//           points={points}
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.7"
//           vectorEffect="non-scaling-stroke"
//         />

//         {data.map((value, index) => {

//           const x =
//             (index / (data.length - 1)) * 100;

//           const y =
//             38 -
//             ((value - min) / (max - min || 1)) * 27;

//           return (
//             <circle
//               key={index}
//               cx={x}
//               cy={y}
//               r="1"
//               fill="currentColor"
//             />
//           );

//         })}

//       </svg>

//     </div>
//   );
// }


// export default HealthMonitor;






















import React from "react";
import Sidebar from "../components/Sidebar"
import API_URL from "../config/api";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  HeartPulse,
  Droplets,
  Thermometer,
  Wind,
  Activity,
  Brain,
  Footprints,
  Flame,
  MapPin,
  Bell,
  Cloud,
  UserRound,
  Settings,
  ShieldAlert,
  LayoutDashboard,
  Menu,
  CloudSun,
} from "lucide-react";

import "../App.css";
// import Sidebar from "../components/Sidebar";




function HealthMonitor() {
const [menuOpen, setMenuOpen] = useState(false);
    const [dtrend, setDtrend] = useState({
  heartRateData: [],
  spo2Data: [],
  tempData: [],
});
   
    const [riskScore,setRiskScore]=useState(null);
    const [riskLevel,setRiskLevel]=useState("");
        
    const [healthd, setHealthd] = useState({
      // deviceId: "",
      heartRate: "",
      spo2: "",
      temp: "",
    });

  useEffect(() => {
    const Hdata = async () => {
    const response = await fetch(
     `${API_URL}/api/health/getdata`,
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
      temp: data.hd.temp ?? data.hd.temp ?? "",
    });
    setRiskScore(data.riskScore);
    setRiskLevel(data.riskLevel)
    setDtrend({
  heartRateData: data.heartRateData,
  spo2Data: data.spo2Data,
  tempData: data.tempData,
   
});

       
  };

    Hdata();
  }, []);




  
const cards = [
  {
    title: "Heart Rate",
    value: healthd.heartRate ?? "--",
    unit: "BPM",
    change: "↑ 12% vs last hour",
    type: "heart",
    icon: <HeartPulse />,
    data: dtrend.heartRateData || [],
  },
  {
    title: "SpO₂ Level",
    value: healthd.spo2 ?? "--",
    unit: "%",
    change: "↓ 2% vs last hour",
    type: "spo2",
    icon: <Droplets />,
    data: dtrend.spo2Data || [],
  },
  {
    title: "Body Temperature",
    value: healthd.temp ?? "--",
    unit: "°C",
    change: "↑ 1.2°C vs last hour",
    type: "temperature",
    icon: <Thermometer />,
    data: dtrend.tempData || [],
  },
  {
    title: "Respiratory Rate",
    value: "22",
    unit: "/min",
    change: "+ Normal",
    type: "respiratory",
    icon: <Wind />,
    data: [58, 52, 62, 57, 65, 55, 61, 72, 63],
  },
  {
    title: "Blood Pressure",
    value: "128/84",
    unit: "mmHg",
    change: "+ Normal",
    type: "pressure",
    icon: <Activity />,
    data: [48, 52, 45, 57, 48, 58, 46, 55, 48, 61, 50],
  },
  {
    title: "Stress Level",
    value: "High",
    unit: "",
    change: "⌖ 15% vs last hour",
    type: "stress",
    bars: [45, 85, 55, 75, 42, 88, 53, 82, 45, 73, 58],
    icon: <Brain />,
  },
  {
    title: "Steps",
    value: "8,247",
    unit: "steps",
    change: "",
    type: "steps",
    bars: [75, 45, 88, 55, 72, 38, 80, 52, 65, 35, 50, 42],
    icon: <Footprints />,
    progress: "60%",
    progressText: "Goal: 10,000 steps",
  },
  {
    title: "Calories",
    value: "523",
    unit: "kcal",
    change: "",
    type: "calories",
    data: [48, 55, 49, 65, 52, 72, 58, 70, 61, 78, 68],
    icon: <Flame />,
    progress: "62%",
    progressText: "Goal: 1200 kcal",
  },
];

  return (
    <div className="hm-page">

      {/* SIDEBAR */}

   <Sidebar
  isOpen={menuOpen}
  closeSidebar={() => setMenuOpen(false)}
/>
      {/* MAIN */}
      <main className="hm-main">

        {/* HEADER */}
        <header className="hm-header">

          <div className="hm-heading">

            <div className="hm-title-row">

              <button
  className="menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  <Menu size={28} />
</button>
              {/* <ArrowLeft size={17} /> */}

              <div>
                <h1>Health Monitor</h1>

                <p>
                  Real-time tracking of your vital signs
                </p>
              </div>
            </div>

          </div>


          <div className="hm-refresh">

            <span>Auto-refresh</span>

            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>

          </div>

        </header>


        {/* HEALTH GRID */}
        <section className="hm-grid">

          {cards.map((card, index) => (
            <MetricCard
              key={index}
              {...card}
            />
          ))}

        </section>

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
    <div className={`hm-nav-item ${active ? "active" : ""}`}>

      {React.cloneElement(icon, {
        size: 17,
      })}

      <span>{text}</span>

      {badge && (
        <b className="hm-badge">
          {badge}
        </b>
      )}

    </div>
  );
}


/* METRIC CARD */

function MetricCard({
  title,
  value,
  unit,
  change,
  type,
  icon,
  data,
  bars,
  progress,
  progressText,
}) {

  return (
    <div className={`metric-card ${type}`}>

      {/* CARD HEADER */}
      <div className="metric-header">

        <div className="metric-icon">
          {React.cloneElement(icon, {
            size: 17,
          })}
        </div>

        <h3>{title}</h3>

      </div>


      {/* VALUE */}
      <div className="metric-number">

        <strong>{value}</strong>

        {unit && (
          <span>{unit}</span>
        )}

      </div>


      {/* CHANGE */}
      {change && (
        <div className="metric-change">
          {change}
        </div>
      )}


      {/* GRAPH */}
      {data && (
        <MiniLineChart data={data} />
      )}


      {/* BAR GRAPH */}
      {bars && (
        <div className="mini-bars">

          {bars.map((height, index) => (
            <span
              key={index}
              style={{
                height: `${height}%`,
              }}
            />
          ))}

        </div>
      )}


      {/* PROGRESS */}
      {progress && (
        <div className="goal-area">

          <div className="goal-text">
            <span>{progressText}</span>
            <strong>{progress}</strong>
          </div>

          <div className="goal-bar">
            <div
              style={{
                width: progress,
              }}
            />
          </div>

        </div>
      )}

    </div>
  );
}


/* SVG LINE GRAPH */

function MiniLineChart({ data }) {

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((value, index) => {

      const x =
        (index / (data.length - 1)) * 100;

      const y =
        38 -
        ((value - min) / (max - min || 1)) * 27;

      return `${x},${y}`;

    })
    .join(" ");

  return (
    <div className="mini-line">

      <svg
        viewBox="0 0 100 45"
        preserveAspectRatio="none"
      >

        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          vectorEffect="non-scaling-stroke"
        />

        {data.map((value, index) => {

          const x =
            (index / (data.length - 1)) * 100;

          const y =
            38 -
            ((value - min) / (max - min || 1)) * 27;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill="currentColor"
            />
          );

        })}

      </svg>

    </div>
  );
}


export default HealthMonitor;
