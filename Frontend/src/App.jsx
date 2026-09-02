import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import AppRoutes from "./routes/AppRoutes"
import "./App.css"

function App() {



 return (
     <>
     <ToastContainer style={{ zIndex: 99999 }}      
  position="top-right"
  autoClose={1000}
  hideProgressBar
  newestOnTop
  closeOnClick
  draggable={false}
  theme="dark"
/>
      <AppRoutes/> 
      </>  
 )
}

export default App;
 
