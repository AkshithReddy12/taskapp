const express = require('express');
const mongoose = require('mongoose');
const Task=require("./models/task")
const User=require("./models/user")
const validator=require("validator")
const bcrypt=require("bcrypt")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const session=require("express-session")
const passport=require('passport')
const LocalStrategy = require('passport-local');
const path=require('path')
const app = express();
const userRoutes=require('./routes/user')
const taskRoutes=require('./routes/tasks')


mongoose.connect('mongodb://127.0.0.1:27017/taskapp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine','ejs')
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/',userRoutes)
app.use('/',taskRoutes)


app.get("/",(req,res)=>{
    res.send("welcome")
})

app.get("/home",(req,res)=>{
    res.render("home")
})

app.listen(3000, () => {
  console.log("Server is running on port :3000");
});
