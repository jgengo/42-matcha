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
const helmet			      = require('helmet');
const crypto            = require('crypto');

const chalk             = require('chalk');
const log               = console.log
const info              = chalk.magenta
const title             = chalk.bold.yellow


const redis_options     = { store: new RedisStore({}), secret: 'wonderful42', resave: true, saveUninitialized: true, cookie: { secure: false } }
let socketSession       = socketIOSession(redis_options);


// model
//-----------------------------------------------------------------------------------------------
const Message           = require('./models/message');


// redis
//-----------------------------------------------------------------------------------------------
client.on('connect', function() {
    log(title('[Redis]') + " Connected to Redis")
})

// socket.io
//-----------------------------------------------------------------------------------------------
io.use(socketSession.parser)
io.on('connection', socket => {
  var user = socket.session.user

  log(title('[Socket.IO]')+' user_id: '+info(user.id)+' connected.');


  socket.on('messages ls', data => {
      Message.messages_to(user.id)
      .then( messages => { socket.emit('messages '+data+' ls', messages) })
  })
  socket.on('messages cat', data => {
    md5 = crypto.createHash('md5').update(`${user.id}`).digest("hex");
    Message.messages_from_to(data, user.id)
    .then( messages => { socket.emit('messages '+md5+' cat', messages)})
  })
  // Message.unread_messages(user.id)
  // .then( messages => { socket.emit('messages', messages); })

  // socket.on('join', data => {
  //   console.log(data);
  // })
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