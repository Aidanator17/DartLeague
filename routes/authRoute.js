const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const router = express.Router(); 

router.get("/login", forwardAuthenticated, (req,res) => {
    res.render("auth/login")
})

router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/auth/login",
    })
  );

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/auth/login");
  });

router.get("/register", forwardAuthenticated, (req,res) => {
    res.render("auth/register")
})

module.exports = router