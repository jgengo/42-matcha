// Node framework dependencies
//-----------------------------------------------------------------------------------------------
let express 		= require('express');
let app 			= express();
let bodyParser 		= require('body-parser');
let session 		= require('express-session');

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
  console.log("[matcha] listening on port http://localhost:%s", server.address().port);
});
