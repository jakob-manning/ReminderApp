require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const path = require("path");
const morgan = require("morgan");

const reminderRoutes = require("./routes/reminder-routes");
const authRoutes = require("./routes/auth-routes");
const collaborateRoutes = require("./routes/collaborate-routes");
const checkAuth = require("./middleware/checkAuth");

const PORT = process.env.PORT || 3001;
const SESSION_DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.49781.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`

const app = express();

app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended: false}));

app.use(ejsLayouts);

app.use(
    session({
        secret: process.env.COOKIE_SECRET || "Cookie_Secret",
        store: MongoStore.create({mongoUrl: SESSION_DB_URL, collection: 'sessions'}),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

//Initialize Passport
const passport = require("./middleware/passport")
app.use(passport.initialize());
app.use(passport.session());


//TEST ROUTES FOR PASSPORT
// Define routes.
app.get('/failed',
    function (req, res) {
        res.send("login failed");
    });

app.get('/loggedIn',
    function (req, res) {
        res.send("You are logged in!");
    });

app.get('/login',
    (req, res, next) => {
        req.body.username = "Jake";
        req.body.password = "secret";
        return next();
    },
    passport.authenticate('local', {failureRedirect: '/failed'}),
    function (req, res) {
        res.redirect('/loggedIn');
    });

// Reminder Routes
app.use('/reminder', checkAuth.ensureAuthenticated, reminderRoutes);

// Auth Routes
app.use('/auth', authRoutes);

//Collaborate Routes
app.use("/collaborate", checkAuth.ensureAuthenticated, collaborateRoutes)

app.use((req, res, next) => {
    console.log(`User details are: `);
    console.log(req.user);

    console.log("Entire session object:");
    console.log(req.session);

    console.log(`Passport Session details are: `);
    console.log(req.session.passport);

    next();
});

// 404 Errors
app.get('/*', (req, res) => {
    res.render("util/404");
});

//Error Handling
app.use((error, req, res, next) => {

    //redirect to a nice error page
    res.render("util/error", {error: error.message});

})

//Initialize Connection to Mongo-DB
const DB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.49781.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`
mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // Initialize server
    app.listen(PORT, function () {
        console.log(
            `Server running on port:${PORT} 🚀`
        );
    });
});
