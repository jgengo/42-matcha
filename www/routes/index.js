var fs = require('fs');

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.end('welcome here')
  })

  app.get('/test', (req, res) => {
    res.render('test')
  })

  // ---- USERS -----
  app.get('/users/register', (req, res) => {
    res.render('users/register')
  })
  app.post('/users/register', (req, res) => {
    if (req.body.firstName === undefined || req.body.firstName === '') {
      req.flash('error', "firstName :(")
      res.redirect('register')
    } else {
      let User = require('../models/user')
      User.create(req.body, function (callback) {
        if (callback === 'success')
          req.flash('success', "Welcome to matcha site!")
        res.redirect('register')  
      })
    }
  })
  // app.get('/users', (req, res) => {
  //   let User = require('../models/user')
  //   User.all(function (users) {
  //     res.render('users/index', {users: users})  
  //   })
  // })
  app.get('/users/login', (req, res) => {
    if (req.session.error) {
      res.locals.error = req.session.error
      req.session.error = undefined
    }
    res.render('users/login')
  })

}