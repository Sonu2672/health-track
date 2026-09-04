// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   HeartPulse,
//   LayoutDashboard,
//   MapPin,
//   Bell,
//   CloudSun,
//   Siren,
//   UserRound,
//   Settings,
//   ShieldCheck,
// } from "lucide-react";
// import {  Stethoscope } from "lucide-react";
// import "../css/Sidebar.css";

// const Sidebar = ({ menuOpen }) => {
//   return (
//     <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
//       {/* <div className={`sidebar ${menuOpen ? "open" : ""}`}></div> */}

//       {/* Brand */}
//       <div className="brand">
//         <div className="brand-icon">
//           <HeartPulse size={20} />
//         </div>

//         <div>
//           <h2>PHC</h2>
//           <span>
//             Personal Health
//             <br />
//             Companion
//           </span>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="sidebar-nav">

//         <div className="nav-item active">
//           <LayoutDashboard size={17} />
//            <Link to="/dashboard">
//            Dashboard
//           </Link>
         
//         </div>

//         <div className="nav-item">
//           <HeartPulse size={17} />
//         <Link to="/monitor">
//            Health Monitor
//         </Link>
//         </div>

//         <div className="nav-item">
//           <MapPin size={17} />
//           <Link to="/risk">
//            Risk Analysis
//         </Link>
//         </div>

//         <div className="nav-item">
//           <Bell size={17} />
//            <Link to="/alerts">
//            Alerts
//         </Link>
//           <b className="alert-count">3</b>
//         </div>

//       <div className="nav-item">
//         <Stethoscope size={17} />
//         <Link to="/doctor">
//           Consult Doctor
//         </Link>
//       </div>


//         <div className="nav-item">
//           <CloudSun size={17} />
//            <Link to="/history">
//            Health History
//         </Link>
//         </div>

//         <div className="nav-item">
//           <Siren size={17} />
//            <Link to="/enviroment">
//            Enviroment
//         </Link>
//         </div>

//         <div className="nav-item">
//           <UserRound size={17} />
//            <Link to="/profile">
//            Profile
//         </Link>
//         </div>

//         <div className="nav-item">
//           <Settings size={17} />
//            <Link to="/setting">
//            Settings
//         </Link>
          
//         </div>

//       </nav>

//       {/* Bottom Card */}
//       <div className="sidebar-bottom">
//         <div className="safe-card">

//           <div className="safe-title">
//             Stay Safe, Stay Healthy
//           </div>

//           <p>
//             AI-powered remote monitoring
//             <br />
//             for a safer you.
//           </p>

//           <div className="safe-illustration">
//             <ShieldCheck size={52} />
//           </div>

//         </div>
//       </div>

//     </aside>
//   );
// };

// export default Sidebar;












import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Bell,
  CloudSun,
  Siren,
  UserRound,
  Settings,
  ShieldCheck,
  Plus
} from "lucide-react";
import {  Stethoscope } from "lucide-react";
import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="brand">
        <div className="brand-icon">
          <HeartPulse size={20} />
        </div>

        <div>
          <h2>PHC</h2>
          <span>
            Personal Health
            <br />
            Companion
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <div className="nav-item measure-item">
    <Plus size={18} />

    <Link to="/patient">
      New Measurement
    </Link>
  </div>



        <div className="nav-item active">
          <LayoutDashboard size={17} />
           <Link to="/dashboard">
           Dashboard
          </Link>
         
        </div>

        <div className="nav-item">
          <HeartPulse size={17} />
        <Link to="/monitor">
           Health Monitor
        </Link>
        </div>

        <div className="nav-item">
          <MapPin size={17} />
          <Link to="/risk">
           Risk Analysis
        </Link>
        </div>

        <div className="nav-item">
          <Bell size={17} />
           <Link to="/alerts">
           Alerts
        </Link>
          <b className="alert-count">3</b>
        </div>

      <div className="nav-item">
        <Stethoscope size={17} />
        <Link to="/doctor">
          Consult Doctor
        </Link>
      </div>


        <div className="nav-item">
          <CloudSun size={17} />
           <Link to="/history">
           Health History
        </Link>
        </div>

        <div className="nav-item">
          <Siren size={17} />
           <Link to="/enviroment">
           Enviroment
        </Link>
        </div>

        <div className="nav-item">
          <UserRound size={17} />
           <Link to="/profile">
           Profile
        </Link>
        </div>

        <div className="nav-item">
          <Settings size={17} />
           <Link to="/setting">
           Settings
        </Link>
          
        </div>

      </nav>

      {/* Bottom Card */}
      <div className="sidebar-bottom">
        <div className="safe-card">

          <div className="safe-title">
            Stay Safe, Stay Healthy
          </div>

          <p>
            AI-powered remote monitoring
            <br />
            for a safer you.
          </p>

          <div className="safe-illustration">
            <ShieldCheck size={52} />
          </div>

        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
