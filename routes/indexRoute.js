const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").users
let tournaments = require("../models/tourneyDatabase")

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
    let currentuser
    for (person in users) {
        if (req.user.id == users[person].id) {
            currentuser = users[person]
        }
    }
    res.render("tournaments", { tournaments, currentuser })
})

router.get("/t1", ensureAuthenticated, (req, res) => {
    let currentuser
    for (person in users) {
        if (req.user.id == users[person].id) {
            currentuser = users[person]
        }
    }

    res.render("single-tournament", { tournaments, currentuser })
})

router.post("/addresult", ensureAuthenticated, (req, res) => {
    let winner = req.body.winner
    let loser = req.body.loser
    let scorelist = req.body.score.split('-')
    console.log(winner,loser)
    for (aevent in tournaments[0].scores) {
            if (tournaments[0].scores[aevent].name == winner) {
                tournaments[0].scores[aevent].wins++
            }
            if (tournaments[0].scores[aevent].name == loser) {
                tournaments[0].scores[aevent].losses++
            
        }
    }
    tournaments[0].history.unshift({
        first:winner,
        second:loser,
        firstscore:scorelist[0],
        secondscore:scorelist[1]
    })

    res.redirect("/t1")
})

router.get("/enroll", ensureAuthenticated, (req,res) => {
    let currentuser
    for (person in users) {
        if (req.user.id == users[person].id) {
            currentuser = users[person]
        }
    }
    tournaments[0].scores.push({
        name:currentuser.name,
        wins:0,
        losses:0
    })
    tournaments[0].enrolled.push(currentuser.id)
    res.redirect("/t1")
})

module.exports = router