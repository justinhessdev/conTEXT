// /routes/users.js
const
    express = require('express'),
    passport = require('passport'),
    userV2Router = express.Router(),
    User = require('../models/User.js')


///////////////////////////////////////////
userV2Router.get('/', isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    console.log(users)
    res.json(users)
  })
})

userV2Router.route('/:id')
  .get((req,res) => {
    User.findById(req.params.id , (err, user) =>{
      if (err) console.log(err)
      res.json(user)
    })
  })

// a method used to authorize a user BEFORE allowing them to proceed to the profile page:
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/')
}

module.exports = userV2Router
