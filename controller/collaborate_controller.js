const User = require("../models/user");

let collaborateController = {
    list: async (req, res, next) => {
        let userID = req.user.id;

        //get all users
        let users;
        try{
            users = await User.find({ _id: {$ne: userID} })
        } catch (e) {
            return next("Failed to find users.");
        }

        if(!users){
            return next("No other users yet!");
        }

        //render them in an EJS view
        res.render("collaborate/index", { users: users });
    }

};

module.exports = collaborateController;