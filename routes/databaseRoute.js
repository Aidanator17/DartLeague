const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport");
const { forwardAuthenticated, ensureAuthenticated } = require("../middleware/checkAuth");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get("/usersdb", async (req,res) => {

    try {
      const users = await prisma.user.findMany({
        select: {
          id:true,
          name:true,
          email:true,
          password:true,
          method:true,
          role:true,
          enrolledin:true,
          imageURL:true
        }
      })
      return res.json(users)
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong" })
    }
  })

router.get("/tourneydb", async (req,res) => {
    try {
      const users = await prisma.tournament.findMany({
        select: {
          id:true,
          active:true,
          title:true,
          subtitle:true,
          headers:true,
          history:true,
          enrolled:true,
          scores:true
        }
      })
      return res.json(users)
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong"+err })
    }
  })

module.exports = router;