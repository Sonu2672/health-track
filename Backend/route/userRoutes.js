

import express from "express";
const Router = express.Router(); 
import{login,Signup} from "../controller/userController.js"
import {signupValidation,loginValidation} from "../middlewares/validation.js";
import {auth} from "../middlewares/userAuth.js"



// POST route to save OneSignal Player ID
Router.post("/api/users/save-onesignal-id", auth, async (req, res) => {
  try {
    const { playerId } = req.body;
    const userId = req.user._id; // Jo user logged-in hai uska ID (aapke auth middleware ke mutabiq)

    if (!playerId) {
      return res.status(400).json({ success: false, message: "Player ID is required" });
    }

    // User model mein player ID update/save karein
    await User.findByIdAndUpdate(userId, { oneSignalPlayerId: playerId });

    console.log(`Player ID saved for user ${userId}: ${playerId}`);
    res.status(200).json({ success: true, message: "Player ID saved successfully" });
  } catch (error) {
    console.error("Error saving player ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});













Router.post("/login",loginValidation,login)

Router.post("/signup",signupValidation,Signup)

Router.get("/islogin", auth , (req,res)=>
   
{
    //token se nikalo ki ye admin hai ya ni agar admin hua tho msg bhjenge admin
    console.log("bhai",req.user);
    if(req.user.role==="admin")
    {
      return res.json({message:"admin"});
    }

     else if(req.user.role==="patient")
    {
      return res.json({message:"patient"});
    }

     else if(req.user.role==="doctor")
    {
      return res.json({message:"doctor"});
    }

    
})


Router.get("/islogout", (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  });

  return res.json({ message: "logout successfully" });
});


Router.get("/userdata",auth,(req,res)=>{
  console.log({firstname:req.user.firstname,
              lastname:req.user.lastname,
              email:req.user.email,
              password:req.user.password});

    res.json({firstname:req.user.firstname,
              lastname:req.user.lastname,
              email:req.user.email,
              password:req.user.password
            })

});

//normal profile me update hoskata hai 
Router.post("/updateuserdata",auth,(req,res)=>{
  const {firstname,lastname,email}=req.body;
  
})

export default  Router;
