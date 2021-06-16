const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");
let users = require("../models/userDatabase").database
let tournaments = require("../models/tourneyDatabase").database
let userModel = require("../models/userDatabase").userModel
let tourneyModel = require("../models/tourneyDatabase").tourneyModel
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const challonge = require('challonge');
let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
let sitenum = 0
const client = challonge.createClient({
    apiKey: 'Sks8NJLfTCQAO1c47e6Y4Mbh0Gj1bqHzpiCx1QoZ'
});

router.get("/", (req, res) => {
    res.redirect("/home")
})

router.get("/home", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
            let currentuser
            for (person in users[0]) {
                if (req.user.id == users[0][person].id) {
                    currentuser = users[0][person]
                }
            }
            let tournamentexport = tournaments[0]
            res.render("home", { currentuser, tournaments: tournamentexport })
        })

    })
})

router.get("/tournaments", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
            let currentuser
            for (person in users[0]) {
                if (req.user.id == users[0][person].id) {
                    currentuser = users[0][person]
                }
            }
            let tournamentexport = tournaments[0]
            // console.log(tournamentexport)
            res.render("tournaments", { tournaments: tournamentexport, currentuser })
        })

    })

})

router.get("/tournaments/:id", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
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

            let x
            for (tourney in tournaments[0]) {
                if (tournaments[0][tourney].id == req.params.id) {
                    x = tournaments[0][tourney]
                    break
                }
            }

            let showfinish = true
            for (i in x.matches) {
                if (x.matches[i].winnerid == null) {
                    showfinish = false
                    break
                }
            }
            console.log(x.matches)
            let width
            let height
            if (x.enrolled.length > 4) {
                width = 1350
                height = 670
            }
            else {
                width = 1150
                height = 620
            }
            if (x.started == true){
            tourneyModel.updateMatches(x.id)}
            res.render("single-tournament", { tournament: searchResult, currentuser, height, width, showfinish })
        })
    })

})

router.get("/enroll/:id", ensureAuthenticated, async (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(async function (body) {
            users[0] = JSON.parse(body)
            let currentuser
            for (person in users[0]) {
                if (req.user.id == users[0][person].id) {
                    currentuser = users[0][person]
                }
            }

            let x
            for (tourney in tournaments[0]) {
                if (tournaments[0][tourney].id == req.params.id) {
                    x = tournaments[0][tourney]
                }
            }

            client.participants.create({
                id: x.url.replace('https://challonge.com/', ''),
                participant: {
                    name: req.user.FName + ' ' + req.user.LName
                },
                callback: (err, data) => {
                    console.log(err);
                }
            });



            Promise.all([tourneyModel.enroll(req.params.id, currentuser), userModel.enroll(req.params.id, currentuser)]).then((values) => {
                function red() {
                    res.redirect("/tournaments/" + req.params.id)
                }
                setTimeout(red, 2000)
            }
            )
        })
    })

})

router.get("/createtourney", ensureAuthenticated, (req, res) => {
    res.render("createtourney", { currentuser: req.user })
})

router.post("/createtourney", ensureAuthenticated, async (req, res) => {
    let id = uuidv4();
    let url = id.replace(/-/g, '_')
    let fullurl = "https://challonge.com/" + url
    let title = req.body.title
    let subtitle = req.body.subtitle
    let active = false
    let archived = false
    let type = req.body.type
    let history = []
    let enrolled = []

    await tourneyModel.create(id, fullurl, title, subtitle, active, archived, type, history, enrolled)

    if (req.body.type == 'double elimination') {
        client.tournaments.create({
            tournament: {
                name: title,
                url: url,
                tournamentType: type,
            },
            callback: (err, data) => {
                //   console.log(err, data);
            }
        });
        function cont() {
            client.tournaments.update({
                id: url,
                tournament: {
                    grand_finals_modifier: 'single match',
                },
                callback: (err, data) => {
                    // console.log(err, data);
                }
            });
        }
        setTimeout(cont, 2000)
    }
    else {
        client.tournaments.create({
            tournament: {
                name: title,
                url: url,
                tournamentType: type,
            },
            callback: (err, data) => {
                //   console.log(err, data);
            }
        });
    }

    res.redirect("/tournaments")
})

router.get("/activate/:id", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
            let currenttourney
            for (tourney in tournaments[0]) {
                if (req.params.id == tournaments[0][tourney].id) {
                    currenttourney = tournaments[0][tourney]
                }
            }
            tourneyModel.activate(req.params.id)

            res.redirect("/tournaments/" + req.params.id)
        })
    })

})

router.get("/deactivate/:id", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
            let currenttourney
            for (tourney in tournaments[0]) {
                if (req.params.id == tournaments[0][tourney].id) {
                    currenttourney = tournaments[0][tourney]
                }
            }
            tourneyModel.deactivate(req.params.id)

            res.redirect("/tournaments/" + req.params.id)
        })
    })

})

router.get("/archive/:id", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
            let currenttourney
            for (tourney in tournaments[0]) {
                if (req.params.id == tournaments[0][tourney].id) {
                    currenttourney = tournaments[0][tourney]
                }
            }
            tourneyModel.archive(req.params.id)

            res.redirect("/tournaments/" + req.params.id)
        })
    })

})

router.get("/unarchive/:id", ensureAuthenticated, (req, res) => {
    fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
        fetch(sites[sitenum] + '/db/usersdb').then(function (res) {
            return res.text();
        }).then(function (body) {
            users[0] = JSON.parse(body)
            let currenttourney
            for (tourney in tournaments[0]) {
                if (req.params.id == tournaments[0][tourney].id) {
                    currenttourney = tournaments[0][tourney]
                }
            }
            tourneyModel.unarchive(req.params.id)

            res.redirect("/tournaments/" + req.params.id)
        })
    })

})

router.get("/addresult/:id", ensureAuthenticated, async (req, res) => {
    await fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
    })

    let ctourney
    for (tourney in tournaments[0]) {
        if (tournaments[0][tourney].id == req.params.id) {
            ctourney = tournaments[0][tourney]
            break
        }
    }
    // console.log(tournaments[0])
    res.render("addresult", { currentuser: req.user, tournament: ctourney })
})

router.post("/addresult/:id", ensureAuthenticated, async (req, res) => {
    await fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
        return res.text();
    }).then(function (body) {
        tournaments[0] = JSON.parse(body)
    })


    if (parseInt(req.body.p2score) == parseInt(req.body.p1score)) {
        res.redirect('/tournaments/' + req.params.id)
    }
    else {
        let ctourney
        for (tourney in tournaments[0]) {
            if (tournaments[0][tourney].id == req.params.id) {
                ctourney = tournaments[0][tourney]
                break
            }
        }

        let cmatch
        for (i in ctourney.matches) {
            if (ctourney.matches[i].winnerid == null) {
                if (ctourney.matches[i].title == req.body.title) {
                    cmatch = ctourney.matches[i]
                    break
                }
            }
        }

        let winnerscore = {}
        let loserscore
        if (parseInt(req.body.p1score) > parseInt(req.body.p2score)) {
            winnerscore['id'] = cmatch.player1id
            winnerscore['score'] = req.body.p1score
            loserscore = req.body.p2score
        }
        else if (parseInt(req.body.p2score) > parseInt(req.body.p1score)) {
            winnerscore['id'] = cmatch.player2id
            winnerscore['score'] = req.body.p2score
            loserscore = req.body.p1score
        }




        client.matches.update({
            id: ctourney.url.replace('https://challonge.com/', ''),
            matchId: cmatch.matchid,
            match: {
                scoresCsv: req.body.p1score + '-' + req.body.p2score,
                winnerId: winnerscore.id
            },
            callback: (err, data) => {
                // console.log(err, data);
            }
        });

        res.redirect('/tournaments/' + req.params.id)
    }
})

router.get('/finish/:id', async (req, res) => {
    tourneyModel.finish(req.params.id)
    res.redirect('/tournaments/' + req.params.id)
})

router.get('/start/:id', async (req, res) => {
    tourneyModel.start(req.params.id)
    res.redirect('/tournaments/' + req.params.id)
})

module.exports = router