// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import User from "../model/user.js";

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           const nameParts = profile.displayName.trim().split(" ");
//           const firstName = nameParts[0];
//           const lastName = nameParts.slice(1).join(" ");

//             user = await User.create({
//             googleId: profile.id,
//             firstname: firstName,
//             lastname: lastName ,
//             email: profile.emails[0].value,
            
//           });
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     },
//   ),
// );

// // session (agar use kar raha hai)
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });




import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../model/user.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      proxy: true, // Render / Heroku Reverse Proxy Trust
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google Email not found"), null);
        }

        // 1. Google ID OR Email dono se check karein (Duplicate Email Crash se bachne ke liye)
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        // 2. Agar user bilkul naya hai
        if (!user) {
          const nameParts = (profile.displayName || "Google User").trim().split(/\s+/);
          const firstName = nameParts[0] || "User";
          const lastName = nameParts.slice(1).join(" ") || " "; // Empty string mat rakhein

          user = await User.create({
            googleId: profile.id,
            firstname: firstName,
            lastname: lastName,
            email: email,
          });

          console.log("✅ New Google User Created:", email);
        } 
        // 3. Agar User pehle se email se signed up tha, toh Google ID link kar dein
        else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
          console.log("✅ Google ID Linked to Existing User:", email);
        }

        return done(null, user);
      } catch (error) {
        console.error("❌ GOOGLE STRATEGY MONGOOSE ERROR:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


