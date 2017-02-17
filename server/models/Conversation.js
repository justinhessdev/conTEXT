// Conversation.js
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

module.exports = mongoose.model('Conversation', conversationSchema)
