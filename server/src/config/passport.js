// server/src/config/passport.js
const passport       = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User           = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Find existing user or create new one
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

        if (user) {
          // Link Google ID if they previously signed up with email
          if (!user.googleId) {
            user.googleId   = profile.id;
            user.isVerified = true;
            await user.save();
          }
        } else {
          user = await User.create({
            name:       profile.displayName,
            email,
            googleId:   profile.id,
            isVerified: true, // Google accounts are pre-verified
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;

