var fs = require('fs');

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.end('welcome here')
  })

  app.get('/test', (req, res) => {
    res.render('test')
  })



}