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
    res.render("home", { currentuser, tournaments })
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

router.get("/tournaments/:id", ensureAuthenticated, (req, res) => {
    let currentuser
    for (person in users) {
        if (req.user.id == users[person].id) {
            currentuser = users[person]
        }
    }
    let reminderToFind = req.params.id;
    let searchResult = tournaments.find(function (tourney) {
      return tourney.id == reminderToFind;
    });
    console.log(searchResult)

    res.render("single-tournament", { tournament:searchResult, currentuser, })
})

router.post("/addresult/:id", ensureAuthenticated, (req, res) => {
    let winner = req.body.winner
    let loser = req.body.loser
    let scorelist = req.body.score.split('-')
    let currenttourney
    for (tourney in tournaments){
        if (req.params.id == tourney.id){
            currenttourney = tournaments[tourney]
        }
    }
    for (aevent in currenttourney.scores) {
            if (currenttourney.scores[aevent].name == winner) {
                currenttourney.scores[aevent].wins++
            }
            if (currenttourney.scores[aevent].name == loser) {
                currenttourney.scores[aevent].losses++
            
        }
    }
    currenttourney.history.unshift({
        first:winner,
        second:loser,
        firstscore:scorelist[0],
        secondscore:scorelist[1]
    })

    res.redirect("/tournaments/"+req.params.id)
})

router.get("/enroll/:id", ensureAuthenticated, (req,res) => {
    let currentuser
    for (person in users) {
        if (req.user.id == users[person].id) {
            currentuser = users[person]
        }
    }
    let currenttourney
    for (tourney in tournaments){
        if (req.params.id == tournaments[tourney].id){
            currenttourney = tournaments[tourney]
        }
    }
    currenttourney.scores.push({
        name:currentuser.name,
        wins:0,
        losses:0
    })
    currenttourney.enrolled.push(currentuser.id)
    currentuser.enrolledin.push(currenttourney.id)
    res.redirect("/tournaments/"+req.params.id)
})

router.get("/createtourney", ensureAuthenticated, (req,res) => {
    res.render("createtourney")
})

router.post("/createtourney", ensureAuthenticated, (req,res) => {
    let idindex = 0
    for (i in tournaments){
        if (tournaments[i].id > idindex){
            idindex = tournaments[i].id
        }
    }
    tournaments.push({
        id:idindex+1,
        active:false,
        title:req.body.title,
        subtitle:req.body.subtitle,
        headers:req.body.headers.split(','),
        history:[],
        enrolled:[],
        scores:[]
    })
    console.log(tournaments)
    res.redirect("/tournaments")
})

router.get("/activate/:id", ensureAuthenticated, (req,res) => {
    let currenttourney
    for (tourney in tournaments){
        if (req.params.id == tournaments[tourney].id){
            currenttourney = tournaments[tourney]
        }
    }
    currenttourney.active = true

    res.redirect("/tournaments/"+currenttourney.id)
})

router.get("/deactivate/:id", ensureAuthenticated, (req,res) => {
    let currenttourney
    for (tourney in tournaments){
        if (req.params.id == tournaments[tourney].id){
            currenttourney = tournaments[tourney]
        }
    }
    currenttourney.active = false

    res.redirect("/tournaments/"+currenttourney.id)
})
module.exports = router