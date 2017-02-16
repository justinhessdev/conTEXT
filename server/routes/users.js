// /routes/users.js
const
    express = require('express'),
    passport = require('passport'),
    userRouter = express.Router(),
    User = require('../models/User.js')

userRouter.route('/login')
    .get((req,res) => {
        res.render('login', {message: req.flash('loginMessage')})
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }))

userRouter.route('/signup')
    .get((req,res) => {
        // render create account form
        res.render('signup', {message: req.flash('signupMessage')})
    })
    .post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    }))

userRouter.get('/profile', isLoggedIn, (req,res) => {
    res.render('profile', {user: req.user})
})

userRouter.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})

userRouter.get('/status', (req, res) => {
  if (!req.isAuthenticated()) return res.status(200).json({ status: false })
  res.status(200).json({ status: true, user: req.user })
})

///////////////////////////////////////////
userRouter.get('/users', isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    res.json(users)
  })
})

// a method used to authorize a user BEFORE allowing them to proceed to the profile page:
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next()
    res.redirect('/')
}

module.exports = userRouter
