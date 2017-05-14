var express = require('express'),
    mysql = require('mysql'),
    app = express();

app.set('views', './views')
app.set('view engine', 'pug');

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

require('./routes')(app);

var server = app.listen(1336, function() {
  var port = server.address().port

  console.log("[matcha] listening on port http://localhost:%s", port);
});
