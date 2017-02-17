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
  .patch((req, res) => {
    Message.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, message) => {
    // respond here
    // console.log("The patched message is: ")
    // console.log(message)
    if (err) console.log(err)
    res.json(message)
    })
  })
  .delete((req, res) => {
    Message.findByIdAndRemove(req.params.id , (err) =>{
      if (err) console.log(err)
      res.json({message: "deleted"})
    })
  })

module.exports = messageRouter
