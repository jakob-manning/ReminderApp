const User = require("../models/user");

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/auth/login");
    },

    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/reminder");
    },

    ensureAuthenticatedAdmin: async function (req, res, next){

        //confirm user is authenticated
        if (!req.isAuthenticated()) {
            return next(new Error("Unable to authenticate user. Please try again."))
        }

        //confirm that user is an admin
        let user;
        try{
           user = await User.findById(req.user.id)
        }catch (e) {
            return next(new Error("Unable to authenticate admin user. Please try again."))
        }
        if(!!user){
            if(user.type === "admin") return next()
        }
        //TODO: implement a forbidden route
        return res.redirect("/forbidden")
    }
};
