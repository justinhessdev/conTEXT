// /config/passport.js
const
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../server/models/User.js')

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    User.findById(id, (err, user) => {
        done(err,user)
    })
})

// LOCAL SIGNUP
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'local.email': email}, (err, user) => {
        if(err) return done(err)
        if(user) return done(null, false, req.flash('signupMessage', 'That email is taken.'))
        var newUser = new User()
         newUser.local.name = req.body.name
        newUser.local.email = email
        newUser.local.password = newUser.generateHash(password)
        newUser.save((err) => {
            if(err) throw err
            return done(null, newUser, null)
        })
    })
}))

// LOCAL SIGNIN
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'local.email': email}, (err, user) => {
        if(err) return done(err)
        if(!user) return done(null, false, req.flash('loginMessage', 'No user found...'))
        if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong Password.'))
        return done(null, user)
    })
}))

module.exports = passport
