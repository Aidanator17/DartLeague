const express = require("express");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const request = require('request');
let sites = ['https://robsonlinedarts.herokuapp.com', 'http://localhost:8000']

// let users = [
//     {
//         id: 1,
//         name: "Aidan Christopher",
//         email: "aidan.r.christopher@gmail.com",
//         password: "A1dan123!",
//         method: "local",
//         role: "admin",
//         enrolledin:[],
//         imageURL: "",
//     },{
//         id: 2,
//         name: "Rob Christopher",
//         email: "roblizaidan@gmail.com",
//         password: "A1dan123",
//         method: "local",
//         role: "user",
//         enrolledin:[],
//         imageURL: "",
//     }]

var database = []
request(sites[0] + '/db/usersdb', function (error, response, body) {
  database.push(JSON.parse(body))
})

const userModel = {
  findOne: (email) => {
    request(sites[0] + '/db/usersdb', function (error, response, body) {
      database[0] = JSON.parse(body)
    })
    //   console.log("users:",database)
    const user = database[0].find((user) => user.email === email);
    if (user) {
      return user;
    }
    return new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    request(sites[0] + '/db/usersdb', function (error, response, body) {
      database[0] = JSON.parse(body)
    })
    const user = database[0].find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  OUTSIDEfindById: (id) => {
    request(sites[0] + '/db/usersdb', function (error, response, body) {
      database[0] = JSON.parse(body)
    })
    const user = database[0].find((user) => user.id === id);
    if (user) {
      return user;
    }
  },
  createUserWithOutsideId: async (u_id, u_name, u_url, u_method, u_email, u_password) => {
    let name = u_name
    let email = u_email
    let password = u_password
    let method = u_method
    let imageURL = u_url
    let id = u_id
    try {
      const user = await prisma.user.create({
        data: { id, name, email, password, imageURL, method }
      });
      res.redirect('/auth/login')
    } catch (err) {
      console.log('ERROR CODE:', err)

    }
  },
  enroll: async (t_id, currentuser) => {

    request(sites[0] + '/db/usersdb', function (error, response, body) {
      database[0] = JSON.parse(body)
    })

    currentuser.enrolledin.push(t_id)

    const update = await prisma.user.update({
      where: {
        id: currentuser.id,
      },
      data: {
        enrolledin: currentuser.enrolledin,
      },
    })

  },
  register_local: async (u_id, u_fname, u_lname, u_email, u_password, imageURL='') => {
    let FName = u_fname
    let LName = u_lname
    let email = u_email
    let password = u_password
    let method = 'local'
    let role = 'user'
    let verified = false
    let value = true
    let id = u_id
    try {
      const user = await prisma.user.create({
        data: { id, FName, LName, email, password, method, role, method, imageURL, verified }
      });
    } catch (err) {
      console.log('ERROR CODE:', err)
      value = false
    }
    return value
  },
  verify: async (lookupID) => {
    const updateUser = await prisma.user.update({
      where: {
        id: lookupID,
      },
      data: {
        verified: true,
      },
    })
  }
};
module.exports = { userModel, database }