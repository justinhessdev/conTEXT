// /routes/users.js
const
    express = require('express'),
    passport = require('passport'),
    userV2Router = express.Router(),
    User = require('../models/User.js')


///////////////////////////////////////////
userV2Router.get('/users', isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    console.log(users)
    res.json(users)
  })
})

// a method used to authorize a user BEFORE allowing them to proceed to the profile page:
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/')
}

module.exports = userV2Router
