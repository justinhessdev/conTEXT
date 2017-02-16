const
    express = require('express'),
    messageRouter = express.Router(),
    Message = require('../models/Message.js')

messageRouter.route('/')
    .get((req,res) => {
      Message.find({}, (err, users) => {
        res.json(users)
      })
    })
    .post((req, res) => {
      var newMessage = new Message(req.body)
      newMessage.save((err, message) => res.json(message))
    })

module.exports = messageRouter
