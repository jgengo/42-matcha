var express = require('express');

var app = express();

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('welcome here');
})
.get('/admin', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('admin page');
})
.use(function(req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable');
});

var server = app.listen(1336, function() {
  var port = server.address().port

  console.log("[matcha] listening on port http://localhost:%s", port);
});
