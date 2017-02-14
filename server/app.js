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
    passport = require('passport')

  // environment port
  const
      port = process.env.PORT || 3000,
      mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/context-app'

  const
    userSchema = mongoose.Schema({
      name:String,
      number:String,
      email:String,
      password:String
    }),
    User = mongoose.model('User', userSchema)

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


  // send res (response) back to client when client makes get request at root.
  // response contains sendFile of our client index.html so client/chrome will know to populate page
  // app.get('/', (req, res) => {
  //   res.render('/client/views/index')
  // })

  app.get('/', (req, res) => {
    res.render('index')
  })

  // API routes here: as opposed to our /#/ routes
  // app.get('/api/users', (req, res) => {
  //   User.find({}, (err, users) => {
  //     res.json(users)
  //   })
  // })

  app.listen(port, (err) => {
    console.log(err || "Server running")
  })
