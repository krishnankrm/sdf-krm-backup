const express = require('express');
const router = express.Router();
const userService = require('./user.service');
// routes
router.post('/authenticate', authenticate);

module.exports = router;

function authenticate(req, res, next) {
    console.log("login")
    userService.authenticate(req.body)
             .then(user => res.status(200).json(user))
// .then(user => res.json(user))
    .catch(next);
}
