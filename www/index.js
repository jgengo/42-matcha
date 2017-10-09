// Node framework dependencies
//-----------------------------------------------------------------------------------------------
const express           = require('express');
const app               = express();
const server            = require('http').createServer(app);
const io                = require('socket.io')(server);
const socketIOSession   = require("socket.io.session");
const session           = require('express-session');
const RedisStore        = require('connect-redis')(session);

const redis             = require("redis");
const client            = redis.createClient();

const favicon           = require('serve-favicon')
const bodyParser        = require('body-parser');
const path              = require("path")

const moment            = require('moment');
const validator         = require('validator');
const helmet			      = require('helmet');
const crypto            = require('crypto');

const chalk             = require('chalk');
const log               = console.log
const info              = chalk.magenta
const title             = chalk.bold.yellow


const redis_options     = { store: new RedisStore({}), secret: 'wonderful42', resave: true, saveUninitialized: true, cookie: { secure: false } }
let socketSession       = socketIOSession(redis_options);
let users               = {}

// model
//-----------------------------------------------------------------------------------------------
const Message           = require('./models/message');
const Checker           = require('./models/checker');
const User              = require('./models/user');
const Stalk             = require('./models/stalk');
const Like              = require('./models/like');

// redis
//-----------------------------------------------------------------------------------------------
client.on('connect', function() {
    log(title('[Redis]') + " Connected to Redis")
})

// socket.io
//-----------------------------------------------------------------------------------------------
io.use(socketSession.parser)
io.on('connection', socket => {
  var user = socket.session.user;
  users[user.id] = socket.id;

  log(title('[Socket.IO]')+' user_id: '+info(user.id)+' connected.');
  User.set_online(user.id, 1);

  socket.on('disconnect', () => {
    User.set_online(user.id, 0);
    log(title('[Socket.IO]')+' user_id: '+info(user.id)+' has just disconnected.');
  })





  socket.on('timeline ls', data => { Stalk.ls(user.id).then( data => { socket.emit('timeline ls', data); }) });
  socket.on('messages ls', data => { Message.messages_to(user.id).then( messages => { socket.emit('messages ls', messages) }) })
  socket.on('messages cat', data => {
    Message.messages_from_to(data, user.id).then( messages => { socket.emit('messages cat', messages)})
  })
  socket.on('messages ping', data => {
    User.ping(data).then( data => { socket.emit('messages pong', data) })
  })
  socket.on('geoloc', data => {
    data.id = user.id
    User.update(data)
  })
  socket.on('messages send', data => {
    Checker.messages_send(data)
    .then( () => {
      data.recipient_id = data.id
      data.sender_id = socket.session.user.id
      delete data.id
      data.content = validator.escape(data.content);

      Message.create(data)
      .then( (create) => {
        socket.emit('messages show', create);
        socket.broadcast.to(users[data.recipient_id]).emit('messages show', create);
      })
      .catch( (err) => { 
        console.log('oups: ' +err)
      })
     })
    .catch( (err) => { log(title('[Socket.IO]')+' user_id: '+info(user.id)+' send bad formated data.\n\t'+err) })
  })
  


  socket.on('profil ls', user_id => { 
    Like.count(user_id).then( data => { socket.emit('profil ls', data); })
  })


})





// Static & middlewares
//-----------------------------------------------------------------------------------------------
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use('/semantic', express.static(__dirname + '/public/assets/semantic/dist'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

app.use(session(redis_options))
app.use(require(__dirname + '/middlewares/flash.js'))

// Views & templating engine
//-----------------------------------------------------------------------------------------------
app.set('views', './views')
app.set('view engine', 'ejs');

// Global variables
//-----------------------------------------------------------------------------------------------
app.locals = {
  moment: moment,
  site: {
    title: "Matcha"
  } 
};

// Routes
//-----------------------------------------------------------------------------------------------
require('./routes')(app);

// Start server
//-----------------------------------------------------------------------------------------------
server.listen(1336, () => {
  log('------------------------------------------------------------------------------------------>');
  log(title('[Express]') + " listening on port " + chalk.underline("http://localhost:%s"), server.address().port);
});