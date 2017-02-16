// Conversation.js
const
    mongoose = require('mongoose'),
    conversationSchema = new mongoose.Schema({
            user1: {type: String},
            user2: {type: String},
            messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
    }, {timestamps: true})

conversationSchema.pre('findOne', function() {
  this.populate('messages')
})

module.exports = mongoose.model('Conversation', conversationSchema)
