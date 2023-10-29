const express=require('express')
const router=express.Router()
const User=require('../models/user')
const passport=require('passport')


router.get("/login",(req,res)=>{
    res.render("login")
})

router.post("/login",passport.authenticate('local'),async(req,res)=>{
        res.redirect('/home');
    
})

router.get("/register",(req,res)=>{
    res.render("register")
})

router.post("/register",async(req,res)=>{
    const {username, email, password} = req.body;
    try{
 
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);           
            res.redirect('/home');
        })

    } catch(error){
        res.status(500).json({message: error.message})
        
    }
})

router.get("/logout",async(req,res,next)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    res.redirect('/home');
})});


module.exports=router;