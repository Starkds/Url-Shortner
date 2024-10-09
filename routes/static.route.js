const express = require('express');
const URL = require('../models/url.models');
const router = express.Router();


router.get("/", async  (req,res) => {
    if(!req.user) return res.redirect("/login");
    const allurls = await URL.find({ createdBy: req.user._id});    
    return res.render('home',{
       
        urls: allurls,
    });
});

router.get("/signup", async( req,res) =>{
    return res.render("signUp");
})

router.get("/login",(req,res) =>{
    return res.render("login"); 
})

module.exports = router;