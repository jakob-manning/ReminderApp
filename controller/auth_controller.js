let database = require("../database");

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

  loginSubmit: (req, res) => {
    // implement
  },

  registerSubmit: (req, res) => {
    // implement
  },
};

module.exports = authController;
