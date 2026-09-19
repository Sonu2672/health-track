import React, { useState, useEffect } from "react";
import "../App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Features from "../pages/Features";
import HowItWorks from "../pages/Howitworks";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Patient from "../pages/Patient";
import Login from "../pages/Login";

import Sidebar from "../components/Sidebar";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import HealthMonitor from "../pages/HealthMonitor";
import RiskAnalysis from "../pages/RiskAnalysis";
import Alerts from "../pages/Alerts";
import HealthHistory from "../pages/HealthHistory";
import Enviroment from "../pages/Enviroment";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";
import Doctor from "../pages/Doctor";
import Appointment from "../pages/Appointment";
import ConnectedDevice from "../pages/ConnectedDevice";

import DoctorDashboard from "../role/DoctorDashboard";
import AdminDashboard from "../role/AdminDashboard";
import DoctorManagement from "../role/DoctorManagement";
import PatientManagement from "../role/PatientManagement";

import DisasterAlert from "../pages/DisasterAlert";
import Document from "../pages/Document";


// ==============================
// UNIVERSAL LOADER
// ==============================
function PageLoader() {
  return (
    <div className="global-loader">
      <div className="loader-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}


// ==============================
// ROUTE CHANGE LOADER
// ==============================
function RouteChangeLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return <PageLoader />;
}


// ==============================
// APP ROUTES
// ==============================
function AppRoutes() {

  // null = checking login
  // true = logged in
  // false = not logged in
  const [islogin, setIslogin] = useState(null);
  const [isadmin, setIsadmin] = useState(null);


  // ==============================
  // CHECK LOGIN
  // ==============================
  useEffect(() => {

    const checklogin = async () => {

      try {

        const response = await fetch(
          "https://healthtrackb.onrender.com/api/users/islogin",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        console.log(data.message);


        if (data.message === "admin") {

          toast.success("Hlw Admin sir 🚀");

          setIslogin(true);
          setIsadmin(true);

        }

        else if (data.message === "patient") {

          setIslogin(true);

        }

        else if (data.message === "doctor") {

          setIslogin(true);

        }

        else {

          setIslogin(false);

        }

      }

      catch (error) {

        console.error(error);

        setIslogin(false);

      }

    };

    checklogin();

  }, []);


  // ==============================
  // IMPORTANT
  // Don't show Home/Login while
  // authentication is being checked
  // ==============================

  if (islogin === null) {

    return <PageLoader />;

  }


  return (

    <BrowserRouter>

      {/* Universal route loading */}
      <RouteChangeLoader />


      <Routes>

        <Route
          path="/upload"
          element={<Document />}
        />


        {/* Wrong URL → Home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />


        {/* =========================
            ROLE BASED ACCESS
        ========================= */}

        <Route
          path="/admindash"
          element={
            islogin
              ? <AdminDashboard setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/doctorm"
          element={
            islogin
              ? <DoctorManagement setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/patientm"
          element={
            islogin
              ? <PatientManagement setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/doctordash"
          element={
            islogin
              ? <DoctorDashboard setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/register"
          element={<ConnectedDevice />}
        />


        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route
          path="/"
          element={
            islogin
              ? <Dashboard setIslogin={setIslogin} />
              : <Home setIslogin={setIslogin} />
          }
        />

        <Route
          path="/features"
          element={<Features />}
        />

        <Route
          path="/howitworks"
          element={<HowItWorks />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login setIslogin={setIslogin} />}
        />


        {/* =========================
            PROTECTED PAGES
        ========================= */}

        <Route
          path="/patient"
          element={
            islogin
              ? <Patient setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/connected"
          element={
            islogin
              ? <ConnectedDevice setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/dashboard"
          element={
            islogin
              ? <Dashboard setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/monitor"
          element={
            islogin
              ? <HealthMonitor setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/risk"
          element={
            islogin
              ? <RiskAnalysis setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/alerts"
          element={
            islogin
              ? <Alerts setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/history"
          element={
            islogin
              ? <HealthHistory setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/doctor"
          element={
            islogin
              ? <Doctor setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/disaster"
          element={<DisasterAlert />}
        />

        <Route
          path="/enviroment"
          element={
            islogin
              ? <Enviroment setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/profile"
          element={
            islogin
              ? <Profile setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/setting"
          element={
            islogin
              ? <Setting setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

        <Route
          path="/sidebar"
          element={<Sidebar />}
        />

        <Route
          path="/appointment"
          element={
            islogin
              ? <Appointment setIslogin={setIslogin} />
              : <Login setIslogin={setIslogin} />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default AppRoutes;


// import React from "react";
// import "../App.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Link } from "react-router-dom";
// import Features from "../pages/Features"
// import HowItWorks from "../pages/Howitworks"
// import About from "../pages/About"
// import Contact from "../pages/Contact"
// import Patient from "../pages/Patient"
// import Login from "../pages/Login"
// import Sidebar from '../components/Sidebar';
// import Home from '../pages/Home';
// import Dashboard from '../pages/Dashboard';
// import HealthMonitor from '../pages/HealthMonitor';
// import RiskAnalysis from '../pages/RiskAnalysis';
// import Alerts from '../pages/Alerts';
// import HealthHistory from '../pages/HealthHistory';
// import Enviroment from '../pages/Enviroment';
// // import Emergency from './pages/Emergency';
// import Profile from '../pages/Profile';
// import Setting from '../pages/Setting';
// import Doctor  from "../pages/Doctor"
// import Appointment from "../pages/Appointment"
// import ConnectedDevice from "../pages/ConnectedDevice"

// import DoctorDashboard from "../role/DoctorDashboard"
// import AdminDashboard from "../role/AdminDashboard"
// import DoctorManagement from "../role/DoctorManagement"
// import PatientManagement from "../role/PatientManagement"
// import DisasterAlert from "../pages/DisasterAlert"
// import {useState, useEffect} from "react";
// import OneSignal from 'react-onesignal';
// import Document from "../pages/Document"
// function AppRoutes() {
//   const [islogin, setIslogin] = useState(null);
//   const [isadmin, setIsadmin] = useState(null);

//   // OneSignal Initialization Effect


//   useEffect(() => {
//     const checklogin = async () => {
//       try {
//          const response = await fetch("https://healthtrackb.onrender.com/api/users/islogin", {
//           method: "GET",
//           credentials: "include",
//         });

//         const data = await response.json();
//         console.log(data.message);

//         if (data.message === "admin") {
//           toast.success("Hlw Admin sir  🚀");
//           setIslogin(true);
//         } 

//         else  if (data.message === "patient") {
//           setIslogin(true);
//         }

//          else  if (data.message === "doctor") {
//           setIslogin(true);
//         }
//       } catch (error) {
//         console.error(error);
//         setIslogin(false);
//       }
//     };

//     checklogin();
//   }, [])
// // 
//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route path="/upload" element={<Document/>} />

//         <Route path="*" element={<Navigate to="/" replace />} />

        
//        {/* Role wise acess */}
//         <Route path="/admindash" element={islogin ? <AdminDashboard setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />} />
//         <Route path="/doctorm" element={islogin ? <DoctorManagement setIslogin={setIslogin}/> : <Login setIslogin={setIslogin} />} />
//         <Route path="/patientm" element={islogin ? <PatientManagement setIslogin={setIslogin}/> : <Login setIslogin={setIslogin}/>} />
//         <Route path="/doctordash" element={islogin ? <DoctorDashboard setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />} />
//         <Route path="/register" element={<ConnectedDevice/>} />


//         <Route path="/"  element={islogin ? <Dashboard setIslogin={setIslogin} /> : <Home setIslogin={setIslogin} />} />
//          <Route path="/features" element={<Features/>} />
//         <Route path="/howitworks" element={<HowItWorks />} />
//         <Route path="/about" element={<About />} />
//          <Route path="/contact" element={<Contact />} />


//         <Route path="/login" element={<Login setIslogin={setIslogin} />} />
//        <Route path="/patient" element={islogin ? <Patient setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />}/>
//         <Route path="/connected" element={islogin ? <ConnectedDevice setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />}/>
 
//         <Route path="/dashboard" element={islogin ? <Dashboard setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />}/>
//         <Route path="/monitor" element={islogin ? <HealthMonitor setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />} />
//         <Route path="/risk" element={islogin ? <RiskAnalysis setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
//         <Route path="/alerts" element={islogin ? <Alerts setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
//          <Route path="/history" element={islogin ? <HealthHistory setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
//         <Route path="/doctor" element={islogin ? <Doctor setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
//          <Route path="/disaster" element={<DisasterAlert />} />

//          <Route path="/enviroment" element={islogin ? <Enviroment setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
//          <Route path="/profile" element={islogin ? <Profile setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
//          <Route path="/setting" element={islogin ? <Setting setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
         
//          <Route path="/sidebar" element={<Sidebar />} />

//       <Route path="/appointment" element={islogin ? <Appointment setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;





