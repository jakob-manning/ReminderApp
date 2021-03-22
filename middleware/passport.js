const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const GitHubStrategy = require('passport-github').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

const User = require("../models/user");

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    // function(username, password, cb) {
    //     console.log("Authenticating:")
    //     console.log(username)
    //     return cb(null, username)
    // }
    // (email, password, done) => {
    //     console.log("Passport Local Strategy Authenticating")
    //     console.log(email);
    //     console.log(password);
    //
    //     if ( email === "jakobmanning@gmail.com" ){
    //         if (password === "testing"){
    //             done(null, email);
    //         }
    //     }
    //     return done(null, false);
    // }

    async (email, password, done) => {

        console.log(email);
        console.log(password);

        //get user by email
        let user;
        try{
            user = await User.findOne( {email})
        }catch (e) {
            return done(new Error("Unable to login. Please try again."));
        }

        //confirm that user exists
        if(!user){
            return done(new Error("User doesn't exist, please try again."));
        }

        //ask bcrypt to match passwords
        let isValidPassword = false;
        try{
            isValidPassword = await bcrypt.compare(password, user.password);
        } catch (e) {
            return done(new Error("Unable to log you in, please try again."));
        }
        if(!isValidPassword){
            return done(new Error("Wrong credentials, please try again."));
        }

        //return login state accordingly
        console.log("User Object:")
        console.log(user);
        return user
            ? done(null, user)
            : done(null, false, {
                message: "Your login details are not valid. Please try again",
            });
    }
));

// passport.use(new GitHubStrategy(
//     {
//         clientID: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_SECRET,
//         callbackURL: process.env.GITHUB_RETURN_URL
//     },
//     function(accessToken, refreshToken, user, cb){
//         // In this example, the user's GitHub profile is supplied as the user
//         // record.  In a production-quality application, the profile should
//         // be associated with a user record in the application's database, which
//         // allows for account linking and authentication with other identity
//         // providers.
//         console.log("logging in")
//         console.log(user);
//         return cb(null, user);
//     }
// ));
//
// passport.use(new FacebookStrategy({
//         clientID: process.env['FACEBOOK_CLIENT_ID'],
//         clientSecret: process.env['FACEBOOK_SECRET'],
//         callbackURL: process.env.FACEBOOK_RETURN_URL
//     },
//     function(accessToken, refreshToken, profile, cb) {
//         // In this example, the user's Facebook profile is supplied as the user
//         // record.  In a production-quality application, the Facebook profile should
//         // be associated with a user record in the application's database, which
//         // allows for account linking and authentication with other identity
//         // providers.
//         console.log("logging in")
//         console.log(profile);
//         return cb(null, profile);
//     })
// );

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id, "-password", {},function (err, user){
        if(err) return cb(err)
        return cb(null, user)
    });
});

module.exports = passport;
