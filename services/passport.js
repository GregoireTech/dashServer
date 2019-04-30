
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

// Callback function
const handleGoogleLogin = require('../controllers/authController').googleHandler;

// Create a new instance of Google Auth Strategy
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: 'http://localhost:8888/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
    handleGoogleLogin(profile);
}
));