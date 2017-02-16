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
      newConversation.save((err, conversation) => res.json(conversation))
    })

conversationRouter.route('/:id')
  .get((req,res) => {
    Conversation.findById(req.params.id , (err, conversation) =>{
      if (err) console.log(err)
      res.json(conversation)
    })
  })
  .patch((req, res) => {
    console.log("The body of the patch request is: ")
    console.log(req.body)
    // console.log(req.params.id)
    Conversation.findByIdAndUpdate(req.params.id, req.body, (err, conversation) => {
    // respond here
    console.log("The patched conversation is: ")
    console.log(conversation)
    if (err) console.log(err)
    res.json(conversation)
  })
})

module.exports = conversationRouter
