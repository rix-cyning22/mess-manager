const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoSessionConnect = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
require("dotenv").config();

const sessionStore = new MongoSessionConnect({
    uri: process.env.MongoURI,
    collection: "user-sessions"
});
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "pug");
app.use(flash());

app.use(session({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

const authenticated = (req, res, next) => {
    if (req.session && req.session.user) 
        next();
    else
        res.redirect("/auth/login");
}

app.use("/admin", authenticated, adminRoutes);
app.use("/auth", authRoutes);
app.use(authenticated, studentRoutes);
app.use((req, res) => {
    var userType = "";
    if (req.session && req.session.user)
        userType = req.session.user.userType;
    res.status(404).render("404.pug", {
        userType: userType
    })
})

mongoose.connect(process.env.MongoURI)
    .then(result => {
        app.listen(3000);
        console.log("database conected!!");
    })
    .catch(err => console.log(err));