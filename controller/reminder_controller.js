let database = require("../database");

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

  create: (req, res) => {
    //TODO: generalize away from Cindy
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
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
