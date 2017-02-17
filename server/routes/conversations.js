const
    express = require('express'),
    conversationRouter = express.Router(),
    Conversation = require('../models/Conversation.js')


conversationRouter.route('/')
    .get((req,res) => {
      Conversation.find({}, (err, users) => {
        res.json(users)
      })
    })
    .post((req, res) => {
      var newConversation = new Conversation(req.body)
      newConversation.save((err, conversation) => {
        if (err) console.log(err)
        console.log("The conversation on the server side is: ")
        console.log(conversation)
        res.json(conversation)
      })
    })

conversationRouter.route('/:id')
  .get((req,res) => {
    Conversation.findById(req.params.id , (err, conversation) =>{
      if (err) console.log(err)
      res.json(conversation)
    })
  })
  .patch((req, res) => {
    // console.log(req.params.id)
    Conversation.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, conversation) => {
    // respond here
    console.log("The patched conversation is: ")
    console.log(conversation)
    if (err) console.log(err)
    res.json(conversation)
  })
})

module.exports = conversationRouter
