const User = require("../models/user");
const mongoose = require("mongoose");
const axios = require("axios");

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

        //User Image API
        let userAPIResponse;
        try{
            userAPIResponse = await axios.get(`https://randomuser.me/api/?results=30`);
        } catch (e) {
            console.log("image api error")
            console.log(e);
        }
        let imageData;
        try{
            imageData = userAPIResponse.data;
        } catch (e) {
            imageData = {};
            imageData.results = []
            let imageURL = "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Tetsumonchi_profile_picture.png/160px-Tetsumonchi_profile_picture.png"
            for( let i = 0; i < 50; i ++){
                imageData.results[i] = {};
                imageData.results[i].picture = {};
                imageData.results[i].picture.medium = imageURL
            }
        }

        //render users in an EJS view
        res.render("collaborate/index", { users: users, currentUser: userID, imageData });
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

        res.redirect("/collaborate");
    },

};

module.exports = collaborateController;