const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").database
let tournaments = require("../models/tourneyDatabase").database
let userModel = require("../models/userDatabase").userModel
let tourneyModel = require("../models/tourneyDatabase").tourneyModel
const fetch = require('node-fetch');
let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
let sitenum = 0

router.get("/id/:id", (req, res) => {
    fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
        return res.text();
    }).then(function (body) {
        users = JSON.parse(body)
        for (user in users){
            if (req.params.id == users[user].id){
                userModel.verify(req.params.id)
                console.log("Verified",users[user].name)
                res.redirect("/verify/complete")
            }
        }
    })
})

router.get("/complete", (req,res)=>{
    function red() {
        res.render("auth/verifycomplete", {currentuser: {}})
    }
    setTimeout(red, 2000)
})

module.exports = router