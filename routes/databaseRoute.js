const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport");
const { forwardAuthenticated, ensureAuthenticated } = require("../middleware/checkAuth");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fetch = require('node-fetch');
const { database } = require("../models/userDatabase");
const { transformDocument } = require("@prisma/client/runtime");
let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
let sitenum = 1

router.get("/usersdb", async (req, res) => {

  try {
    const users = await prisma.user.findMany()
    return res.json(users)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" })
  }
})

router.get("/tourneydb", async (req, res) => {
  try {
    const users = await prisma.tournament.findMany()
    return res.json(users)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" + err })
  }
})

router.get("/display", ensureAuthenticated, (req, res) => {
  fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
    return res.text();
  }).then(function (body) {
    console.log(body)
    database[0] = JSON.parse(body)
    let trnm = database[0]
    fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
      return res.text();
    }).then(function (body) {
      let users = []
      users[0] = JSON.parse(body)
      let usr = users[0]
      let currentuser
      for (person in users[0]) {
        if (req.user.id == users[0][person].id) {
          currentuser = users[0][person]
        }
      }
      if (currentuser.role == "admin") {
        res.render("dbdetails", { tournaments: trnm, users: usr, currentuser })
      }
      else {
        res.redirect("/home")
      }
    })
  })
})
module.exports = router;