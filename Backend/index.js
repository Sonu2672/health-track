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
  origin: "http://localhost:5173",
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
// app.use("/api/admin", adminRoutes);


// app.use("/api/user", userRoutes);
// app.use("/api/profile",profileRoutes);

















app.get('/auth/google',
    passport.authenticate('google', { scope: ["profile", "email"],}));
 

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  async (req, res) => {
    try {
      console.log("USER:", req.user);

      if (!req.user) {
        return res.status(401).send("Google auth failed");
      }
          


      const token = jwt.sign(
        { 
        googleId: req.user.id,
        id: req.user._id,
        role:req.user.role,
        email:req.user.email,
        firstname: req.user.firstname,
        lastname: req.user.lastname , 

        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

  res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
});
      
// if(req.user.role==="admin")
// {
//   return res.redirect("http://localhost:5173/dashboard");
// }
      res.redirect("http://localhost:5173/patient");

    } catch (err) {
      console.log("ERROR:", err);
      return res.status(500).send("Internal Server Error");
    }
  }
);