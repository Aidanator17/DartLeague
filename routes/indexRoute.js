const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").database
let tournaments = require("../models/tourneyDatabase").database
let userModel = require("../models/userDatabase").userModel
let tourneyModel = require("../models/tourneyDatabase").tourneyModel
const request = require('request');
let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
let sitenum = 1

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", ensureAuthenticated, (req, res) => {
    let currentuser
    for (person in users[0]) {
        if (req.user.id == users[0][person].id) {
            currentuser = users[0][person]
        }
    }
    res.render("home", { currentuser, tournaments })
})

router.get("/tournaments", ensureAuthenticated, (req, res) => {
    request(sites[sitenum] + '/db/tourneydb', function (error, response, body) {
        tournaments[0] = JSON.parse(body)
    })
    request(sites[sitenum] + '/db/usersdb', function (error, response, body) {
        users[0] = JSON.parse(body)
    })
    let currentuser
    for (person in users[0]) {
        if (req.user.id == users[0][person].id) {
            currentuser = users[0][person]
        }
    }
    let tournamentexport = tournaments[0]
    res.render("tournaments", { tournaments: tournamentexport, currentuser })
})

router.get("/tournaments/:id", ensureAuthenticated, (req, res) => {
    request(sites[sitenum] + '/db/tourneydb', function (error, response, body) {
        tournaments[0] = JSON.parse(body)
    })
    request(sites[sitenum] + '/db/usersdb', function (error, response, body) {
        users[0] = JSON.parse(body)
    })
    let currentuser
    for (person in users[0]) {
        if (req.user.id == users[0][person].id) {
            currentuser = users[0][person]
        }
    }
    let reminderToFind = req.params.id;
    let searchResult = tournaments[0].find(function (tourney) {
        return tourney.id == reminderToFind;
    });

    res.render("single-tournament", { tournament: searchResult, currentuser, })
})

router.get("/enroll/:id", ensureAuthenticated, (req, res) => {
    request(sites[sitenum] + '/db/tourneydb', function (error, response, body) {
        tournaments[0] = JSON.parse(body)
    })
    request(sites[sitenum] + '/db/usersdb', function (error, response, body) {
        users[0] = JSON.parse(body)
    })
    let currentuser
    for (person in users[0]) {
        if (req.user.id == users[0][person].id) {
            currentuser = users[0][person]
        }
    }

    tourneyModel.enroll(req.params.id, currentuser)
    userModel.enroll(req.params.id, currentuser)

    res.redirect("/tournaments/" + req.params.id)
})

router.get("/createtourney", ensureAuthenticated, (req, res) => {
    res.render("createtourney")
})

router.post("/createtourney", ensureAuthenticated, (req, res) => {
    let idindex = 0
    for (i in tournaments[0]) {
        if (tournaments[0][i].id > idindex) {
            idindex = tournaments[0][i].id
        }
    }
    tournaments[0].push({
        id: idindex + 1,
        active: false,
        title: req.body.title,
        subtitle: req.body.subtitle,
        headers: req.body.headers.split(','),
        history: [],
        enrolled: [],
        scores: []
    })
    res.redirect("/tournaments")
})

router.get("/activate/:id", ensureAuthenticated, (req, res) => {
    request(sites[sitenum] + '/db/tourneydb', function (error, response, body) {
        tournaments[0] = JSON.parse(body)
    })
    request(sites[sitenum] + '/db/usersdb', function (error, response, body) {
        users[0] = JSON.parse(body)
    })
    let currenttourney
    for (tourney in tournaments[0]) {
        if (req.params.id == tournaments[0][tourney].id) {
            currenttourney = tournaments[0][tourney]
        }
    }
    tourneyModel.activate(req.params.id)

    res.redirect("/tournaments/" + req.params.id)
})

router.get("/deactivate/:id", ensureAuthenticated, (req, res) => {
    request(sites[sitenum] + '/db/tourneydb', function (error, response, body) {
        tournaments[0] = JSON.parse(body)
    })
    request(sites[sitenum] + '/db/usersdb', function (error, response, body) {
        users[0] = JSON.parse(body)
    })
    let currenttourney
    for (tourney in tournaments[0]) {
        if (req.params.id == tournaments[0][tourney].id) {
            currenttourney = tournaments[0][tourney]
        }
    }
    tourneyModel.deactivate(req.params.id)

    res.redirect("/tournaments/" + req.params.id)
})
module.exports = router