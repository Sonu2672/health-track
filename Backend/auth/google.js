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
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile);

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google email not found"), null);
        }

        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          const nameParts = (profile.displayName || "")
            .trim()
            .split(/\s+/);

          const firstName = nameParts[0] || "User";
          const lastName = nameParts.slice(1).join(" ") || "";

          user = await User.create({
            googleId: profile.id,
            firstname: firstName,
            lastname: lastName,
            email: email,
          });

          console.log("New Google user created:", user.email);
        } else {
          console.log("Existing Google user found:", user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        return done(error, null);
      }
    }
  )
);
