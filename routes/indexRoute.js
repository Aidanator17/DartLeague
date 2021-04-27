const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").users
let tournaments = require("../models/tournyDatabase")

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", ensureAuthenticated, (req, res) => {
    let currentuser
    for (person in users) {
        if (req.user.id == users[person].id) {
            currentuser = users[person]
        }
    }
    res.render("home", { currentuser })
})

router.get("/tournaments", ensureAuthenticated, (req, res) => {
    res.render("tournaments", { tournaments })
})

router.get("/t1", ensureAuthenticated, (req, res) => {
    res.render("single-tournament", { tournaments })
})

router.post("/addresult", ensureAuthenticated, (req, res) => {
    let winner = req.body.winner
    let loser = req.body.loser
    console.log(winner,loser)
    for (aevent in tournaments[0].scores) {
            if (tournaments[0].scores[aevent].name == winner) {
                tournaments[0].scores[aevent].wins++
            }
            if (tournaments[0].scores[aevent].name == loser) {
                tournaments[0].scores[aevent].losses++
            
        }
    }

    res.redirect("/t1")
})

module.exports = router