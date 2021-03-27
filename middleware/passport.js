const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

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
