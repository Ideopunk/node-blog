var express = require("express");
var router = express.Router({ mergeParams: true });
const User = require("../models/User");
const Code = require("../models/Code");

router.get("/:id/:secret", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        Code.findById(user.)
        if (req.params.secret === )
    })
})

module.exports = router;