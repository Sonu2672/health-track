
import express from "express";
import "./auth/google.js";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import jwt from "jsonwebtoken";
// import authGoogle from "./auth/google.js"

import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/Db.js";
import healthRoutes from "./route/healthRoutes.js";
import userRoutes from "./route/userRoutes.js";
import  receiveDeviceData from "./route/healthRoutes.js";
// import VITE_FRONTEND_URL from "../config/api.js"
import doctorRoutes from "./route/doctorRoutes.js";

import dns from "dns";
dns.setServers(["1.1.1.1" , "8.8.8.8"])
dotenv.config();

const app = express();

// ---------------- DB CONNECT ----------------
connectDB().then(() => {
  app.listen(process.env.PORT,"0.0.0.0", () => {
    console.log("Server running on port", process.env.PORT);
  });
});

// ---------------- MIDDLEWARE ----------------
app.use(cors({
   origin: "https://health-track-2f.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());
// ---------------- ROUTES ----------------
// app.use("/api/note", NoteRoutes);


app.use("/api/users", userRoutes);
app.use("/api/health",healthRoutes);
app.use("/api/doctors", doctorRoutes);
// app.use("/api/admin", adminRoutes);


// app.use("/api/user", userRoutes);
// app.use("/api/profile",profileRoutes);

//esp32 calling my api
app.use("/api/devicedata",receiveDeviceData)















app.get('/auth/google',
    passport.authenticate('google', { scope: ["profile", "email"],}));
 

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/",
//   }),
//   async (req, res) => {
//     try {
//       console.log("USER:", req.user);

//       if (!req.user) {
//         return res.status(401).send("Google auth failed");
//       }
          


//       const token = jwt.sign(
//         { 
//         googleId: req.user.id,
//         id: req.user._id,
//         role:req.user.role,
//         email:req.user.email,
//         firstname: req.user.firstname,
//         lastname: req.user.lastname , 

//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );

// res.cookie("token", token, {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",
// });
      
// // if(req.user.role==="admin")
// // {
// //   return res.redirect("http://localhost:5173/dashboard");
// // }
//       res.redirect("https://health-track-2f.onrender.com/patient");

//     } catch (err) {
//       console.log("ERROR:", err);
//       return res.status(500).send("Internal Server Error");
//     }
//   }
// );


app.get("/auth/google/callback", (req, res, next) => {
console.log("🔥 GOOGLE CALLBACK HIT");

passport.authenticate(
"google",
{ session: false },
(err, user, info) => {
console.log("AUTH ERROR:", err);
console.log("AUTH USER:", user);
console.log("AUTH INFO:", info);


  if (err) {
    console.error("❌ GOOGLE AUTH ERROR:", err);
    return res.status(500).send("Google Authentication Error");
  }

  if (!user) {
    console.log("❌ USER NOT FOUND");
    return res.status(401).send("Google authentication failed");
  }

  try {
    console.log("✅ USER FOUND:", user.email);

    console.log(
      "JWT SECRET EXISTS:",
      Boolean(process.env.JWT_SECRET)
    );

    const token = jwt.sign(
      {
        googleId: user.googleId || user.id,
        id: user._id,
        role: user.role,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("✅ JWT TOKEN CREATED");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ COOKIE SET");

    return res.redirect(
      "https://health-track-2f.onrender.com/patient"
    );

  } catch (error) {
    console.error("❌ CALLBACK ERROR:", error);
    return res.status(500).send("Internal Server Error");
  }
}
  )(req, res, next);
  }
