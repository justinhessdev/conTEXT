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

conversationRouter.get('/:id', (req,res) => {
    Conversation.findById(req.params.id , (err, conversation) =>{
      if (err) console.log(err)
      res.json(conversation)
    })
  })

module.exports = conversationRouter
