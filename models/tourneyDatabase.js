const challonge = require('challonge');
let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
const client = challonge.createClient({
    apiKey: 'Sks8NJLfTCQAO1c47e6Y4Mbh0Gj1bqHzpiCx1QoZ'
});
const request = require('request');
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
let sitenum = 1

var database = []
request(sites[1] + '/db/tourneydb', function (error, response, body) {
    database.push(JSON.parse(body))
})

const tourneyModel = {
    activate: async (t_id) => {
        const update = await prisma.tournament.update({
            where: {
                id: t_id,
            },
            data: {
                active: true,
            },
        })
    },
    deactivate: async (t_id) => {
        const update = await prisma.tournament.update({
            where: {
                id: t_id,
            },
            data: {
                active: false,
            },
        })
    },
    archive: async (t_id) => {
        const update = await prisma.tournament.update({
            where: {
                id: t_id,
            },
            data: {
                archived: true,
            },
        })
    },
    unarchive: async (t_id) => {
        const update = await prisma.tournament.update({
            where: {
                id: t_id,
            },
            data: {
                archived: false,
            },
        })
    },
    enroll: async (t_id, currentuser) => {
        var database = []
        fetch(sites[sitenum] + '/db/tourneydb').then(function (res) {
            return res.text();
        }).then(async function (body) {
            database[0] = JSON.parse(body)
            let x
            for (tourney in database[0]) {
                if (database[0][tourney].id == t_id) {
                    x = database[0][tourney]
                }
            }
            x.enrolled.push(currentuser.id)
            // console.log(x)
            const update = await prisma.tournament.update({
                where: {
                    id: t_id,
                },
                data: {
                    enrolled: x.enrolled
                },
            })
        })
    },
    create: async (id, url, title, subtitle, active, archived, type, history, enrolled) => {
        let matches = {}
        let started = false
        try {
            const tournament = await prisma.tournament.create({
                data: { id, url, active, archived, started, title, subtitle, type, matches, history, enrolled }
            });
        } catch (err) {
            console.log('ERROR CODE:', err)
        }
    },
    updateMatches: async (t_id) => {

        client.participants.index({
            id: t_id.replace(/-/g, '_'),
            callback: (err, data) => {
                // console.log(err, data);
                let people = {}
                
                for (person in data) {
                    people[person] = {}
                    people[person]['name'] = data[person].participant.displayName
                    people[person]['id'] = data[person].participant.id
                }
                // console.log("PEOPLE:", people)
                client.matches.index({
                    id: t_id.replace(/-/g, '_'),
                    callback: async (err, data) => {
                        let match = {}
                        for (i in data) {
                            match[i] = {}
                            match[i]['matchid'] = data[i].match.id
                            match[i]['player1id'] = data[i].match.player1Id
                            match[i]['player1name'] = ''
                            match[i]['player2id'] = data[i].match.player2Id
                            match[i]['player2name'] = ''
                            match[i]['winnerid'] = data[i].match.winnerId
                            match[i]['loserid'] = data[i].match.loserId
                        }
                        for (i in match) {
                            for (a in people) {
                                if (match[i].player1id == people[a].id) {
                                    match[i].player1name = people[a].name
                                }
                                if (match[i].player2id == people[a].id) {
                                    match[i].player2name = people[a].name
                                }
                            }
                        }
                        for (i in match) {
                            match[i]['title'] = String(match[i].player1name+" vs "+match[i].player2name)
                        }
                        // console.log("MATCHES:", match)
                        const update = await prisma.tournament.update({
                            where: {
                                id: t_id,
                            },
                            data: {
                                matches: match,
                            },
                        })
                    }
                })
            }
        })

    },
    finish: async (t_id) => {
        client.tournaments.finalize({
            id: t_id.replace(/-/g,'_'),
            callback: (err, data) => {
            //   console.log(err, data);
            }
          });
    }
}

module.exports = { database, tourneyModel }