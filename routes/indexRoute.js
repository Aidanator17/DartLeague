const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");

router.get("/", (req,res) => {
    res.redirect("/home")
})

router.get("/home", ensureAuthenticated, (req,res) => {
    res.render("testpage")
})

module.exports = router