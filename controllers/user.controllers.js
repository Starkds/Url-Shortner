const User = require('../models/user.model.js');
const { v4 : uuidv4 }  = require('uuid');
const {setUser} = require('../service/auth.services.js');
async  function handleUserSignUp(req, res){
   const {name , email, password } = req.body;
   
   await User.create({
    name ,
    email,
     password,   
   });
   return  res.redirect("/"); 
}


async  function handleUserLogin(req, res){
    const { email, password } = req.body;
 
    const user =  await User.findOne({email, password});
console.log("User", user);
  if(!user)   return res.render("login",{
    error: "invalid password or username",
  })

  
   const token = setUser(user);
  res.cookie('uid', token);
    return  res.redirect("/"); 
 }


module.exports = {
    handleUserSignUp,
    handleUserLogin 
}