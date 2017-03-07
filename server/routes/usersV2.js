// /routes/users.js
const
    express = require('express'),
    userV2Router = express.Router(),
    User = require('../models/User.js')

///////////////////////////////////////////
userV2Router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    console.log(users)
    res.json(users)
  })
})

userV2Router.get('/:id', (req,res) => {
    User.findById(req.params.id , (err, user) =>{
      if (err) console.log(err)
      res.json(user)
    })
  })

module.exports = userV2Router
