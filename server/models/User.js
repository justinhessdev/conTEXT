// User.js
const
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    userSchema = new mongoose.Schema({
        local: {
            name: String,
            number: String,
            email: String,
            password: String
        }
    }, {timestamps: true})

userSchema.pre('findOne', function() {
  this.populate('posts')
})

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
