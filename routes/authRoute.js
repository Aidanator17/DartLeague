const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const router = express.Router(); 
const userModel = require("../models/userDatabase").userModel
const getUserByEmailIdAndPassword = require("../controllers/userController").getUserByEmailIdAndPassword

router.get("/login", forwardAuthenticated, (req,res) => {
    res.render("auth/login")
})

router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/auth/login"
    })
  );

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/auth/login");
  });

router.get("/register", forwardAuthenticated, (req,res) => {
    res.render("auth/register")
})

router.post("/register", (req,res) => {
  console.log(req.body.name,req.body.email,req.body.password,req.body.passwordC)
  if (req.body.name == ""){
    res.render("auth/error/register/name_empty", {fullname:req.body.name,email:req.body.email})
  }
  else if (req.body.email == ""){
    res.render("auth/error/register/email_empty", {fullname:req.body.name,email:req.body.email})
  }
  else if (req.body.password == ""){
    res.render("auth/error/register/pw_empty", {fullname:req.body.name,email:req.body.email})
  }
  else if (!req.body.password == req.body.passwordC){
    res.render("auth/error/register/confirm_pw", {fullname:req.body.name,email:req.body.email})
  }
  else {
    userModel.register_local(req.body.name,req.body.email,req.body.password)
    res.redirect("/auth/login")
  }

})

module.exports = router