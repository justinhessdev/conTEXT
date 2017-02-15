// Message.js
const
    mongoose = require('mongoose'),
    messageSchema = new mongoose.Schema({
      _author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      body: {type: String}
    }, {timestamps: true})

// middleware that runs before it returns User object back to you
// Instead of just getting objectId it grabs the user matching the objectId
messageSchema.pre('findOne', function() {
  this.populate('_author to')
})
messageSchema.pre('find', function() {
  this.populate('_author to')
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message

// Message.create({_author: "58a3a7d9c8a707068b15dd1d", to: "58a3a7d9c8a707068b15dd1d", body: "Booom"}, (err, message) => {
//   console.log(err || message)
// })
// "58a3a7d9c8a707068b15dd1d"
