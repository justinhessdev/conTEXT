const
    dotenv = require('dotenv').load({silent:true}),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    // server  = app.listen(8080);
    io = require('socket.io').listen(server),
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
    userV2Routes = require('./routes/usersV2.js'),
    conversationRoutes = require('./routes/conversations.js'),
    messageRoutes = require('./routes/messages.js')

var users = []
var connections = []

// environment port
const
    port = process.env.PORT || 8080,
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
app.use('/resources', express.static(path.join(__dirname, 'resources')))
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
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods','GET,PUT,PATCH,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.use('/', userRoutes)
app.use('/usersV2', userV2Routes)
app.use('/conversations', conversationRoutes)
app.use('/messages', messageRoutes)

// send res (response) back to client when client makes get request at root.
// response contains sendFile of our client index.html so client/chrome will know to populate page
app.get('/', (req, res) => {
  res.render('index')
})

// when there is an event of type 'connection'
io.sockets.on('connection', (socket) => {
  connections.push(socket)
  console.log('user is connected');
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s sockets connected', connections.length);
  })

  socket.on('send-message', (data) => {
    console.log("Messages received from client are: ")
    console.log(data)
    io.sockets.emit('new-message', data)
  })
})

server.listen(port, (err) => {
  console.log(err || 'listening on my very special port ' + port)
})
