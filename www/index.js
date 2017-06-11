// Node framework dependencies
//-----------------------------------------------------------------------------------------------
let express       = require('express');
let app           = express();
let bodyParser    = require('body-parser');
let session       = require('express-session');
const moment      = require('moment');

const chalk       = require('chalk');
const log         = console.log

// Static & middlewares
//-----------------------------------------------------------------------------------------------
app.use(express.static(__dirname + '/public'));
app.use('/semantic', express.static(__dirname + '/public/assets/semantic/dist'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: 'wonderful42', resave: false, saveUninitialized: true, cookie: { secure: false } }))
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
  log(chalk.bold.yellow('[express]') + " listening on port " + chalk.underline("http://localhost:%s"), server.address().port);
});
