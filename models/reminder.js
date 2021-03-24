const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    completed: { type: Boolean, required: true},
    dueDate: { type: String, required: false},
    creationDate: { type: Date, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model("Reminder", reminderSchema)