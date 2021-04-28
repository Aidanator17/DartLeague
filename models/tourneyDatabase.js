let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
const request = require('request');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

let tournaments = [{
    id: 1,
    active: true,
    title: "Christopher Open",
    subtitle: "Starts May 21st",
    headers: ['Name', 'Wins', 'Losses'],
    history: [],
    enrolled: [],
    scores: []
}]
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
    enroll: async (t_id, currentuser) => {
        request(sites[1]+'/db/tourneydb', function (error, response, body) {
            database[0] = JSON.parse(body)
      })
      let x
      for (tourney in database[0]){
          if (database[0][tourney].id == t_id){
              x = database[0][tourney]
          }
      }
      x.enrolled.push(currentuser.id)
      x.scores.push({
        name:currentuser.name,
        wins:0,
        losses:0
    })
        const update = await prisma.tournament.update({
            where: {
                id: t_id,
            },
            data: {
                enrolled: x.enrolled,
                scores: x.scores
            },
        })
    },
}

module.exports = { database, tourneyModel }