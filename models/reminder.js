const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    title: { type: String, required: false},
    description: { type: String, required: false},
    completed: { type: Boolean, required: true},
    creationDate: { type: Date, required: true},
    tags: [{type: String, required: false}],
    subTasks: [{type: String, required: false}],
    dueDate: { type: String, required: false},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model("Reminder", reminderSchema)