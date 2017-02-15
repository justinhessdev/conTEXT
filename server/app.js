const
    express = require('express'),
    app = express(),
    ejs = require('ejs'),
    ejsLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    passport = require('passport'),
    ///////////////
    passportConfig = require('./config/passport.js'),
    ///////////////
    userRoutes = require('./routes/users.js'),
    Message = require('./models/Message.js')

    // console.log(userRoutes)
    // console.log(passportConfig);
    // console.log(passport);

// environment port
const
    port = process.env.PORT || 3000,
    mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/context-app'

    mongoose.connect(mongoConnectionString, (err) => {
      console.log(err || "Connected to MongoDB (context-app)")
    })

  // will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
});

// middleware

// now app will look for everything in static client directory
// process.env finds the environment of our app .. and we can access the root (pwd)
app.use(express.static(process.env.PWD + '/client'))
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(flash())

// ejs configuration
app.set('view engine', 'ejs')
app.set('views', process.env.PWD+'/client/views');
app.use(ejsLayouts)

// session + passport
app.use(session({
    secret: "boomchakalaka",
    cookie:{maxAge : 60000000},
    resave: true,
    saveUninitialized: false,
    store: store
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    app.locals.currentUser = req.user // currentUser now available in ALL views
    app.locals.loggedIn = !!req.user // a boolean loggedIn now available in ALL views

    next()
})

app.use('/', userRoutes)

// send res (response) back to client when client makes get request at root.
// response contains sendFile of our client index.html so client/chrome will know to populate page
app.get('/', (req, res) => {
  res.render('index')
})

//////////////////

// root / index
// app.get('/users', function(req, res) {
//     User.find({}, function(err, users) { // we put the find criteria in '{}' --> if empty we are looking for all
//       res.json(users)
//     })
// })
//
// app.post('/users', function(req, res) {
//   User.create(req.body, function(err, user) {
//     res.json(user)
//   }) // body belongs to body parser middleware
// })

// API routes here: as opposed to our /#/ routes
// app.get('/api/users', (req, res) => {
//   User.find({}, (err, users) => {
//     res.json(users)
//   })
// })

app.get('/message-test', (req, res) => {
  Message.find({}, (err, message) => {
    res.json(message)
  })
})
app.listen(port, (err) => {
  console.log(err || "Server running")
})
