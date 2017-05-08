var express = require('express'),
    fs = require('fs'),
    haml = require('hamljs'),
    mysql = require('mysql'),
    app = express();


var connection = mysql.createConnection({
  host: 'localhost',
  port: '1338',
  user: 'root',
  password: 'root'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('[mysql] You are now connected...');
});

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('welcome here');
})
.get('/test', function(req, res) {
  var hamlView = fs.readFileSync('views/test.haml', 'utf8');
  res.end(haml.render(hamlView));
})
.use(function(req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable');
});

var server = app.listen(1336, function() {
  var port = server.address().port

  console.log("[matcha] listening on port http://localhost:%s", port);
});
