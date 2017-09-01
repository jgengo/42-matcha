// Node framework dependencies
//-----------------------------------------------------------------------------------------------
let express       = require('express');
let favicon       = require('serve-favicon')
let app           = express();
let bodyParser    = require('body-parser');
let session       = require('express-session');
let RedisStore    = require('connect-redis')(session);
let redis         = require("redis");
let path          = require("path")
let client        = redis.createClient();
const moment      = require('moment');
const helmet			= require('helmet');


const chalk       = require('chalk');
const log         = console.log

// redis
//-----------------------------------------------------------------------------------------------
client.on('connect', function() {
    log(chalk.bold.yellow('[Redis]') + " Connected to Redis")
})

// Static & middlewares
//-----------------------------------------------------------------------------------------------
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use('/semantic', express.static(__dirname + '/public/assets/semantic/dist'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())

app.use(session({ store: new RedisStore({}), secret: 'wonderful42', resave: true, saveUninitialized: true, cookie: { secure: false } }))
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
let server = app.listen(1336, () => {
  log('------------------------------------------------------------------------------------------>');
  log(chalk.bold.yellow('[Express]') + " listening on port " + chalk.underline("http://localhost:%s"), server.address().port);
});