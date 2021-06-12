const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const router = express.Router();
const userModel = require("../models/userDatabase").userModel
const getUserByEmailIdAndPassword = require("../controllers/userController").getUserByEmailIdAndPassword
const sgMail = require('@sendgrid/mail')
var config = require("../config")
sgMail.setApiKey(config.SENDGRID_API_KEY)
const sendMail = require("../controllers/mailController").sendMail
const { v4: uuidv4 } = require('uuid');

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("auth/login", { currentuser: {} })
})

router.post("/login", (req, res) => {
  passport.authenticate('local', function (err, user, info) {

    if (!user) {
      console.log("ERROR",user,err); 
      return res.redirect('/auth/login'); 
    }

    else if (user.verified == false) {
      console.log("NOT VERIFIED",user); 
      sendMail(user.email, 'https://robsonlinedarts.herokuapp.com/verify/id/'+user.id, user.name)
      res.render("auth/verify", { currentuser: {}, email: user.email })
      req.logOut()
    }

    else {
      req.logIn(user, (err)=>{
        console.log(err)
      })
      console.log(user);
      res.redirect("/home")
    }

  })(req, res);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("auth/register", { currentuser: {} })
})

router.post("/register", async (req, res) => {
  if (req.body.fname == "" || req.body.lname == "") {
    res.render("auth/error/register/name_empty", { fname: req.body.fname, lname: req.body.lname, email: req.body.email, currentuser: {} })
  }
  else if (req.body.email == "") {
    res.render("auth/error/register/email_empty", { fname: req.body.fname, lname: req.body.lname, email: req.body.email, currentuser: {} })
  }
  else if (req.body.password == "") {
    res.render("auth/error/register/pw_empty", { fname: req.body.fname, lname: req.body.lname, email: req.body.email, currentuser: {} })
  }
  else if (req.body.password !== req.body.passwordC) {
    res.render("auth/error/register/confirm_pw", { fname: req.body.fname, lname: req.body.lname, email: req.body.email, currentuser: {} })
  }
  else {
    let uu = uuidv4();
    let cont = await userModel.register_local(uu, req.body.fname, req.body.lname, req.body.email, req.body.password)
    if (cont) {
      console.log('pog!')
      await sendMail(req.body.email, 'https://robsonlinedarts.herokuapp.com/verify/id/'+uu, req.body.fname)
      res.render("auth/verify", { currentuser: {}, email: req.body.email })
    }
    else {
      console.log('Error!')
      res.redirect("/auth/login")
    }
  }

})

module.exports = router