const
    express = require('express'),
    conversationRouter = express.Router(),
    Conversation = require('../models/Conversation.js')
    User = require('../models/User.js')


conversationRouter.route('/')
    .get((req,res) => {
      Conversation.find({}, (err, users) => {
        res.json(users)
      })
    })
    .post((req, res) => {
      var user1, user2
      var newConversation = new Conversation(req.body)
      newConversation.save((err, conversation) => {
        if (err) console.log(err)


        User.findById(conversation.user1, (err, user) => {
          if (err) console.log(err)
          // console.log("User 1 is")
          user1 = user
          // console.log(user1)



          User.findById(conversation.user2, (err, user) => {
            if (err) console.log(err)
            // console.log("User 2 is")
            user2 = user
            // console.log(user2)

            conversation.user1 = user1
            conversation.user2 = user2

            res.json({conversation})
          })

        })



        // res.json({conversation: conversation, user1: user1, user2: user2})

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
    // console.log("The patched conversation is: ")
    // console.log(conversation)
    if (err) console.log(err)
    res.json(conversation)
  })
})

module.exports = conversationRouter
