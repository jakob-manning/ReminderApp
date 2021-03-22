const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("../middleware/passport")

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register", { email: undefined });
  },

  registerFromEmail: (req, res) => {
    const email = req.body.email;
    console.log(email)
    res.render("auth/register", { email });
  },


  //TODO: clean up this file

  // loginSubmit: (req, res) => {
  //   console.log("login submitted");
  //   console.log(req.body);
  //   passport.authenticate("local", {
  //     successRedirect: "/loggedIn",
  //     failureRedirect: "/failed",
  //   })
  // },

  // loginSubmit: async (req, res, done) => {
  //   const {email, password} = req.body;

    // //get user by email
    // let user;
    // try{
    //   user = await User.findOne( {email})
    // }catch (e) {
    //   return done(new Error("Unable to login. Please try again."));
    // }
    //
    // //confirm that user exists
    // if(!user){
    //   return done(new Error("User doesn't exist, please try again."));
    // }
    //
    // //ask bcrypt to match passwords
    // let isValidPassword = false;
    // try{
    //   isValidPassword = await bcrypt.compare(password, user.password);
    // } catch (e) {
    //   return done(new Error("Unable to log you in, please try again."));
    // }
    // if(!isValidPassword){
    //   return done(new Error("Wrong credentials, please try again."));
    // }
    //
    // //return login state accordingly
    // console.log("User Object:")
    // console.log(user);
    // return (isValidPassword
    //     ? console.log("login successful")
    //     : console.log("login rejected"));
  // },

  registerSubmit: async (req, res, next) => {
    //TODO: update error handling. Redirect on error to a message page.

    const { email, password } = req.body;

    //ensure email isn't already in the database
    let existingUser;
    try {
      existingUser = await User.findOne({email});
    } catch (e) {
      return next (new Error("Couldn't create user. Please try again."))
    }
    if(!!existingUser){
      return next (new Error("User already exists, try signing in?"))
    }

    //hash password
    let hashedPassword;
    try{
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
      return next(new Error("unable to create user. Please try again."))
    }

    //create user
    const newUser = new User({
      email,
      password: hashedPassword,
      // reminders: []
    })

    //store user on the database
    try{
      await newUser.save();
      console.log(newUser);
    } catch (e) {
      return next(new Error("Something went wrong, couldn't create user. Please try again."))
    }

    //proceed to log them in OR redirect to sign-in page (pass a message to indicate sign-in state
    next(res.redirect("auth/login"))
  },
};

module.exports = authController;
