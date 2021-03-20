const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const GitHubStrategy = require('passport-github').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

const User = require("../models/user");
// const userController = require("../controllers/userController");

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {

        //get user by email
        let user;
        try{
            user = await User.findOne( {email})
        }catch (e) {
            return done(new Error("Unable to login. Please try again."), false);
        }

        //confirm that user exists
        if(!user){
            return done(new Error("User doesn't exist, please try again."), false);
        }

        //ask bcrypt to match passwords
        let isValidPassword = false;
        try{
            isValidPassword = await bcrypt.compare(password, user.password);
        } catch (e) {
            return done(new Error("Unable to log you in, please try again."), false);
        }
        if(!isValidPassword){
            return done(new Error("Wrong credentials, please try again."), false);
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

passport.serializeUser(function (user, done) {
    if(user.displayName){
        user.name = user.displayName;
    }
    console.log("serializing user")
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("deserializing user")
    console.log(obj);
    done(null, obj);

    // let user = userController.getUserById(id);
    // if (user) {
    //   done(null, user);
    // } else {
    //   done({ message: "User not found" }, null);
    // }
});

module.exports = passport;
