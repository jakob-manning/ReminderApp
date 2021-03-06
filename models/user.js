const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6 },
    friends: [{type: mongoose.Types.ObjectId, required: true, ref: 'User'}],
    followedBy: [{type: mongoose.Types.ObjectId, required: true, ref: 'User'}],
    reminders: [{type: mongoose.Types.ObjectId, required: true, ref: 'Reminder'}],
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema)