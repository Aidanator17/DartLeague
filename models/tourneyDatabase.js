let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']
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
            console.log(x)
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
    create: async (id,url,title,subtitle,active,type,history,enrolled) => {
        try {
            const tournament = await prisma.tournament.create({
                data: { id,url,active,title,subtitle,type,history,enrolled }
            });
        } catch (err) {
            console.log('ERROR CODE:', err)
        }
    }
}

module.exports = { database, tourneyModel }