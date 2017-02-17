// Conversation.js

var User = require('./User.js')

const
    mongoose = require('mongoose'),
    conversationSchema = new mongoose.Schema({
            user1: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            user2: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    }, {timestamps: true})

conversationSchema.pre('findOne', function() {
  this.populate('user1 user2 messages')
})

conversationSchema.pre('find', function() {
  this.populate('user1 user2 messages')
})

// conversationSchema.pre('save', function(next) {
//   var self = this
//   User.findById(self.user1, function(err, user) {
//     if (err) console.log((err))
//     self.populate('user1 user2')
//   })
//   next()
// })

module.exports = mongoose.model('Conversation', conversationSchema)
