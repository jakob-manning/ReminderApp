const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const GitHubStrategy = require('passport-github').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;

const userController = require("../controllers/userController");

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    (email, password, done) => {
        const user = userController.getUserIdByEmailAndPassword(email, password);
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
