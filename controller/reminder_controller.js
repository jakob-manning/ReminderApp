const mongoose = require("mongoose")

const Reminder = require("../models/reminder");
const User = require("../models/user");

let remindersController = {

  /** LIST - list all reminders for the current user **/
  list: async (req, res, next) => {

    let userID = req.user.id;

    //Find reminders for current user
    let reminders;
    try{
      reminders = await Reminder.find({ creator: userID });
    } catch (e) {
      return next(new Error("Failed to find reminders, please try again,"));
    }
    if(!reminders){
      return next(new Error("No Reminders yet, try creating some."));
    }

    res.render("reminder/index", { reminders: reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: async (req, res, next) => {
    //Find reminder on Database
    let reminderID = req.params.id;
    let reminder;
    try{
      reminder = await Reminder.findById(reminderID);
    } catch (e) {
      return next(new Error("Failed to find reminder, please try again"));
    }
    if(!reminder) return next(new Error("Reminder doesn't exist."));

    //confirm user has permission to view this item
    if(reminder.creator.toString() !== req.user.id){
      return next(new Error("You're not authorized to view this place."))
    }

    res.render("reminder/single-reminder", { reminderItem: reminder });
  },

  create: async (req, res, next) => {
    //TODO: add error handling

    //create reminder object
    const {title, description, dueDate, tags, subTasks} = req.body;

    //split up tags and subtasks into an array
    let tagsArray = [];
    let subTaskArray = [];
    if(tags){
      tagsArray = tags.split(",");
    }
    if(subTasks){
      subTaskArray = subTasks.split(",");
    }

    //push to database
    let newReminder;
    try{
      newReminder = new Reminder (
          {
            title,
            description,
            dueDate,
            tags: tagsArray,
            subTasks: subTaskArray,
            completed: false,
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

  edit: async (req, res, next) => {
    //Find Item
    let reminderID = req.params.id;
    let reminder;
    try{
      reminder = await Reminder.findById(reminderID);
    } catch (e) {
      return next(new Error("Failed to find item, please try again."));
    }
    if(!reminder){
      return next(new Error("Reminder doesn't exist."));
    }

    //confirm that current user is authorized
    if(reminder.creator.toString() !== req.user.id){
      return next(new Error("You're not authorized to edit this place."))
    }

    // res.render("reminder");
    res.render("reminder/edit",
        {
          reminderItem:
              {
                title: reminder.title,
                description: reminder.description,
                completed: reminder.completed,
                dueDate: reminder.dueDate,
                id: reminder.id,
              }
        });
  },

  update: async (req, res, next) => {
    //find specific reminder
    let reminderID = req.params.id;
    let reminder;
    try{
      reminder = await Reminder.findById(reminderID);
    } catch (e) {
      return next(new Error("Failed to find reminder, please try again."))
    }
    if(!reminder){
      return next(new Error("Reminder ID invalid."))
    }

    //check that the current user has permission to edit this place
    if(reminder.creator.toString() !== req.user.id){
      return next(new Error("You're not authorized to edit this place."))
    }

    //edit reminder contents
    const { title, description, completed, dueDate } = req.body;
    try{
      reminder = await Reminder.findByIdAndUpdate(reminderID, {title, description, completed, dueDate});
    } catch (e) {
      return next(new Error("Failed to update place, please try again."));
    }

    res.redirect("/reminder");
  },

  delete: async (req, res, next) => {
    const reminderID = req.params.id;

    //Find place and populate with creator
    let reminderToDelete;
    try {
      reminderToDelete = await Reminder.findById(reminderID).populate("creator");
    } catch (e) {
      return next(new Error("Failed to find place, please try again."));
    }

    //confirm that place exists
    if(!reminderToDelete) return next(new Error("Can't find reminder, invalid ID."));

    //check that the current user has permission to delete this place
    if(reminderToDelete.creator.id !== req.user.id){
      return next(new Error("You're not authorized to delete this place."))
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await reminderToDelete.remove( {session: sess});
      reminderToDelete.creator.reminders.pull(reminderID);
      await reminderToDelete.creator.save({session: sess});
      await sess.commitTransaction()
    } catch (e) {
      console.log(e);
      return next(new Error("Something went wrong, couldn't delete reminder."))
    }

    res.redirect("/reminder");
  },
  };

  module.exports = remindersController;
