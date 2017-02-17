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
      console.log("server - the new message we received from client is")
      console.log(newMessage)
      newMessage.save((err, message) => {
        if(err) console.log(err)
        res.json(message)
      })
    })


messageRouter.route('/:id')
  .get((req,res) => {
    Message.findById(req.params.id , (err, message) =>{
      if (err) console.log(err)
      res.json(message)
    })
  })

module.exports = messageRouter
