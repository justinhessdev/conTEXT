const
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser')

// environment port
const
    port = process.env.PORT || 3000,
    mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/context-app'


var userSchema = new mongoose.Schema({
      name:String,
      number:String,
      email:String,
      password:String
  })

 var User = mongoose.model('User', userSchema)

mongoose.connect(mongoConnectionString, (err) => {
  console.log(err || "Connected to MongoDB (context-app)")
})

// now app will look for everything in static client directory
// process.env finds the environment of our app .. and we can access the root (pwd)
app.use(express.static(process.env.PWD + '/client'))

//////////////////

app.use(bodyParser.json())
app.use(logger('dev'))

// send res (response) back to client when client makes get request at root.
// response contains sendFile of our client index.html so client/chrome will know to populate page
app.get('/', (req, res) => {
  res.sendFile(process.env.PWD + '/client/index.html')
})

// root / index
app.get('/users', function(req, res) {
    User.find({}, function(err, users) { // we put the find criteria in '{}' --> if empty we are looking for all
      res.json(users)
    })
})

app.post('/users', function(req, res) {
  User.create(req.body, function(err, user) {
    res.json(user)
  }) // body belongs to body parser middleware
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
