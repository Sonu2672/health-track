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

```
async (accessToken, refreshToken, profile, done) => {
  try {
    // Get email safely
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(new Error("Google account email not found"), null);
    }

    console.log("Google login attempt:", email);

    // Find user using Google ID OR email
    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: email }
      ]
    });

    // If user does not exist, create new user
    if (!user) {
      const nameParts = (profile.displayName || "User")
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

      console.log("New Google user created:", email);
    }

    // Existing email user -> connect Google account
    else if (!user.googleId) {
      user.googleId = profile.id;
      await user.save();

      console.log("Google account linked to existing user:", email);
    }

    // Existing Google user
    else {
      console.log("Existing Google user logged in:", email);
    }

    return done(null, user);

  } catch (error) {
    console.error("Google Authentication Error:", error);
    return done(error, null);
  }
}
```

)
);

// Serialize user
passport.serializeUser((user, done) => {
done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
try {
const user = await User.findById(id);
done(null, user);
} catch (error) {
done(error, null);
}
});
