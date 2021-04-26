const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").users

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

module.exports = router