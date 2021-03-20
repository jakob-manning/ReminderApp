require("dotenv").config();
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const reminderRoutes = require("./routes/reminder-routes");
const authRoutes = require("./routes/auth-routes");

const PORT = process.env.PORT || 3001;

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.use(
    session({
      secret: process.env.COOKIE_SECRET || "Cookie_Secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
);

// Reminder Routes
app.use('/reminder', reminderRoutes);

// Auth Routes
app.use('/auth', authRoutes);

// 404
//TODO: update this with a 404 page
app.get('/*', (req, res) => res.redirect("/"));

//Initialize Connection to Mongo-DB
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.49781.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`

// mongoose
//     .connect(DB_URI, {
//         useMongoClient: true,
//         reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
//         reconnectInterval: 500, // Reconnect every 500ms
//         poolSize: 10, // Maintain up to 10 socket connections
//         bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
//         useUnifiedTopology: true
// });

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // Initialize server
    app.listen(PORT, function () {
        console.log(
            "Server running. Visit: localhost:3001 in your browser 🚀"
        );
    });

    const kittySchema = new mongoose.Schema({
        name: String
    });

    const Kitten = mongoose.model('Kitten', kittySchema);

    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name); // 'Silence'

    silence.save();

    Kitten.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
    })

    Kitten.findOne({name: "Silence"}, (err, result) => console.log("We found a kitten: " + result));

});

// mongoose
//     .connect(DB_URI)
//     .then( ()=> {
//         app.listen(PORT)
//     })
//     .catch( err => {
//         console.log(err)
//     })