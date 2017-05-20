var express = require('express'),
    app = express();
    bodyParser = require('body-parser')
    session = require('express-session')

// ---- template engine ----
app.set('views', './views')
app.set('view engine', 'ejs');

// ---- middleware ----
app.use(express.static(__dirname + '/public'));
app.use('/semantic', express.static(__dirname + '/public/assets/semantic/dist'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: 'wonderful42',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(require(__dirname + '/middlewares/flash.js'))

require('./routes')(app);

var server = app.listen(1336, function() {
  var port = server.address().port

  console.log("[matcha] listening on port http://localhost:%s", port);
});
