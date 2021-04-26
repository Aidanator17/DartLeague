const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").users
let tournaments = require("../models/tournyDatabase")

router.get("/", (req,res) => {
    res.redirect("/home")
})

router.get("/home", ensureAuthenticated, (req,res) => {
    let currentuser
    for (person in users){
        if (req.user.id == users[person].id){
            currentuser = users[person]
        } 
    } 
    res.render("home", { currentuser })
})

router.get("/tournaments", ensureAuthenticated, (req,res) => {
    res.render("tournaments", {tournaments})
})

router.get("/t1", ensureAuthenticated, (req,res) => {
    res.render("single-tournament", {tournaments})
})

module.exports = router