require("dotenv").config();
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");

const reminderRoutes = require("./routes/reminder-routes")
const authRoutes = require("./routes/auth-routes")

const PORT = process.env.PORT || 3001

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

// Initialize server
app.listen(PORT, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
