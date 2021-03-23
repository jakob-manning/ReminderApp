const mongoose = require("mongoose")

let database = require("../database");
const Reminder = require("../models/reminder");
const User = require("../models/user");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    //TODO: generalize away from Cindy

    let reminderToFind = parseInt(req.params.id);
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id === reminderToFind;
    });
    if (!!searchResult) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      // res.render("reminder/index", { reminders: database.cindy.reminders });
      res.redirect("/reminder");
    }
  },

  create: async (req, res, next) => {
    //TODO: add error handling

    //create reminder object
    const {title, description, dueDate, image, address} = req.body;

    //push to database
    let newReminder;
    try{
      newReminder = new Reminder (
          {
            title,
            description,
            dueDate,
            image,
            address,
            creationDate: new Date().getTime(),
            creator: req.user.id,
          }
      )
    } catch (e) {
      return next(new Error("Unable to create reminder, please try again."))
    }

    //look for valid user
    let user;
    try {
      user = await User.findById(req.user.id);
    } catch (e) {
      return next(new Error("Creating reminder failed, please try again."))
    }
    if(!user){
      return next(new Error("Couldn't find user for provided ID."))
    }

    //save reminder and update user information as well
    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await newReminder.save( {session: sess});
      user.reminders.push(newReminder);
      await user.save({session: sess});
      await sess.commitTransaction()
    } catch (err) {
      console.log(err)
      return next(new Error("Failed to save reminder, please try again"))
    }

    //redirect
    res.redirect("/reminder");
  },

  edit: (req, res) => {
    //TODO: generalize away from Cindy
    let reminderToFind = parseInt(req.params.id);
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id === reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res, next) => {
    const idOfReqParam = parseInt(req.params.id);

    let reminderIndex;
    try{

      //find item in database with the requested ID
      reminderIndex = database.cindy.reminders.findIndex(reminder => reminder.id === idOfReqParam);

      //confirm that the item exists
      if(reminderIndex === undefined){
        throw new Error();
      }

      console.log("Reminder Index");
      console.log(reminderIndex);

      //destructure form data
      const { title, description, completed } = req.body;

      //confirm that form data exists
      if(!title || !description || completed === undefined){
        throw new Error();
      }


      //overwrite item
      database.cindy.reminders[reminderIndex] = { id:idOfReqParam, title, description, completed: !!completed}

    } catch (e) {
      //TODO: redirect to a proper error handling page (create a new view + payload for accepting error message?)
      return next(new Error("Couldn't update that entry."))
    }
    res.redirect("/reminder");
  },

  delete: (req, res, next) => {
    const idOfReqParam = parseInt(req.params.id);

    let reminderIndex;
    try {

      //find item in database with the requested ID
      reminderIndex = database.cindy.reminders.findIndex(reminder => reminder.id === idOfReqParam);

      //confirm that the item exists
      if(reminderIndex === undefined){
        throw new Error();
      }

      //delete that item (using splice)
      database.cindy.reminders.splice(reminderIndex, 1);

    } catch (e) {
      //TODO: redirect to a proper error handling page (create a new view + payload for accepting error message?)
      return next(new Error("Couldn't delete that entry."))
    }
    res.redirect("/reminder");
  },
};

module.exports = remindersController;
