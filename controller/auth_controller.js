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
    res.render("auth/register", { email });
  },


  registerSubmit: async (req, res, next) => {
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
      password: hashedPassword
    })

    //store user on the database
    try{
      await newUser.save();
    } catch (e) {
      console.log(e);
      return next(new Error("Something went wrong, couldn't create user. Please try again."))
    }

    //proceed to log them in OR redirect to sign-in page (pass a message to indicate sign-in state
    next(res.redirect("auth/login"))
  },
};

module.exports = authController;
