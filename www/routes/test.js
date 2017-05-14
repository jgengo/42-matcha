 var  fs = require('fs'),
      haml = require('hamljs');
      
module.exports = function(app) {
  app.get('/test', function(req, res) {
    var hamlView = fs.readFileSync('views/test.haml', 'utf8');
    res.end(haml.render(hamlView));
  })
};