const express = require('express');

const passport = require("../middleware/passport")
const authController = require("../controller/auth_controller");

const router = express.Router();

router.get("/register", authController.register);

router.post("/register/fromEmail", authController.registerFromEmail);

router.get("/login", authController.login);

router.get("/logout", ((req, res) => {
    req.logout();
    res.redirect("/");
}));

router.get("/*", (req, res) => res.redirect("/auth/login"));

router.post("/register", authController.registerSubmit);

router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/reminder",
        failureRedirect: "/failed",
    })
);

module.exports = router;