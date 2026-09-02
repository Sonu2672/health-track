import React from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Features from "../pages/Features"
import HowItWorks from "../pages/Howitworks"
import About from "../pages/About"
import Contact from "../pages/Contact"
import Patient from "../pages/Patient"
import Login from "../pages/Login"
import Sidebar from '../components/Sidebar';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import HealthMonitor from '../pages/HealthMonitor';
import RiskAnalysis from '../pages/RiskAnalysis';
import Alerts from '../pages/Alerts';
import HealthHistory from '../pages/HealthHistory';
import Enviroment from '../pages/Enviroment';
// import Emergency from './pages/Emergency';
import Profile from '../pages/Profile';
import Setting from '../pages/Setting';
import Doctor  from "../pages/Doctor"

import {useState,useEffect} from "react";

function AppRoutes() {
  const [islogin, setIslogin] = useState(null);
  const [isadmin, setIsadmin] = useState(null);

  useEffect(() => {
    const checklogin = async () => {
      try {
        const response = await fetch("https://health-track-2b.onrender.com/api/users/islogin", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log(data.message);

        if (data.message === "admin") {
          toast.success("Hlw Admin sir  🚀");
          setIslogin(true);
        } else if (data.message === "already login") {
          setIslogin(true);
        }
      } catch (error) {
        console.error(error);
        setIslogin(false);
      }
    };

    checklogin();
  }, [])
// 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
         <Route path="/features" element={<Features/>} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />


        <Route path="/login" element={<Login setIslogin={setIslogin} />} />
       <Route path="/patient" element={islogin ? <Patient setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />}/>

        <Route path="/dashboard" element={islogin ? <Dashboard setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />}/>
        <Route path="/monitor" element={islogin ? <HealthMonitor setIslogin={setIslogin} /> : <Login setIslogin={setIslogin} />} />
        <Route path="/risk" element={islogin ? <RiskAnalysis setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
        <Route path="/alerts" element={islogin ? <Alerts setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
         <Route path="/history" element={islogin ? <HealthHistory setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
        <Route path="/doctor" element={islogin ? <Doctor setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />

         <Route path="/enviroment" element={islogin ? <Enviroment setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
         <Route path="/profile" element={islogin ? <Profile setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />
         <Route path="/setting" element={islogin ? <Setting setIslogin={setIslogin} /> :<Login setIslogin={setIslogin} />} />

         <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;


//  {/* <Route path="/risk" element={<RiskAnalysis />} />
//         <Route path="/alerts" element={<Alerts />} />
//         <Route path="/history" element={<HealthHistory />} />
//         <Route path="/environment" element={<Environment />} />
//         <Route path="/emergency" element={<Emergency />} />
//         <Route path="/profile" element={<Profile />} /> */ 
