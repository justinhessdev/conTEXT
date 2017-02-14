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

  console.log(process.env.PWD)

  // now app will look for everything in static client directory
  // process.env finds the environment of our app .. and we can access the root (pwd)
  app.use(express.static(process.env.PWD + '/client'))

  // send res (response) back to client when client makes get request at root.
  // response contains sendFile of our client index.html so client/chrome will know to populate page
  app.get('/', (req, res) => {
    res.sendFile(process.env.PWD + '/client/index.html')
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
