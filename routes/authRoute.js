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
      sendMail(user.email, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', user.name)
      res.render("auth/verify", { currentuser: {}, email: user.email })
      req.logOut()
    }

    else {
      req.logIn(user, (err)=>{
        console.log(err)
      })
      console.log('WWWWWWW',user,req.isAuthenticated());
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
  if (req.body.name == "") {
    res.render("auth/error/register/name_empty", { fullname: req.body.name, email: req.body.email, currentuser: {} })
  }
  else if (req.body.email == "") {
    res.render("auth/error/register/email_empty", { fullname: req.body.name, email: req.body.email, currentuser: {} })
  }
  else if (req.body.password == "") {
    res.render("auth/error/register/pw_empty", { fullname: req.body.name, email: req.body.email, currentuser: {} })
  }
  else if (!req.body.password == req.body.passwordC) {
    res.render("auth/error/register/confirm_pw", { fullname: req.body.name, email: req.body.email, currentuser: {} })
  }
  else {
    let cont = await userModel.register_local(req.body.name, req.body.email, req.body.password)
    if (cont) {
      await sendMail(req.body.email, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', req.body.name)
      res.render("auth/verify", { currentuser: {}, email: req.body.email })
    }
    else {
      console.log('Error!')
      res.redirect("/auth/login")
    }
  }

})

module.exports = router