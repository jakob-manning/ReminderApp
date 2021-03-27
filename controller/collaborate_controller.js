const User = require("../models/user");
const mongoose = require("mongoose");

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
        res.render("collaborate/index", { users: users, currentUser: userID });
    },

    add: async (req, res, next) => {
        //ID's
        let currentUserID = req.user.id;
        let newFriendID = req.params.id;

        // initialize variables
        let currentUser;
        let newFriend;

        try{
            currentUser = await User.findById(currentUserID);
            newFriend = await User.findById(newFriendID);
        } catch (e) {
            return next(new Error("Failed to find new friend, please try again."));
        }

        if(!currentUser || !newFriend){
            return next(new Error("Invalid UserID."));
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            currentUser.friends.push(newFriendID);
            newFriend.followedBy.push(currentUserID);
            await currentUser.save( {session: sess});
            await newFriend.save( {session: sess});
            await sess.commitTransaction()
        } catch (e) {
            return next(new Error("Failed to add new friend, please try again."));
        }

        console.log(currentUser.email);
        console.log(newFriend.email);

        res.redirect("/collaborate");
    },

    remove: async (req, res, next) => {
        //ID's
        let currentUserID = req.user.id;
        let oldFriendID = req.params.id;

        // initialize variables
        let currentUser;
        let oldFriend;

        try{
            currentUser = await User.findById(currentUserID);
            oldFriend = await User.findById(oldFriendID);
        } catch (e) {
            return next(new Error("Failed to find your or your friend, please try again."));
        }

        if(!currentUser || !oldFriend){
            return next(new Error("Invalid UserID."));
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            currentUser.friends.pull(oldFriendID);
            oldFriend.followedBy.pull(currentUserID);
            await currentUser.save( {session: sess});
            await oldFriend.save( {session: sess});
            await sess.commitTransaction()
        } catch (e) {
            return next(new Error("Failed to remove friend, please try again."));
        }

        console.log(currentUser.email);
        console.log(oldFriend.email);

        res.redirect("/collaborate");
    },

};

module.exports = collaborateController;