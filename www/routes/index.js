let fs = require('fs');

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
    let Checker = require('../models/checker')
    let User = require('../models/user')
    Checker.register(req.body, (callback) => {
      if (callback !== 'ok') {
        req.flash('error', callback)
        res.redirect('register')
      } else {
        User.create(req.body, (callback) => {
          if (callback === 'success')
            req.flash('success', "Welcome to matcha site!")
          res.redirect('register')  
        })
      }
    })
  })
app.get('/users/:id', (req, res) => {
  let id = req.params.id;
  let User = require('../models/user')
  User.is_complete(id, (validate) => {
    User.find(id, (user) => {
      res.render('users/index', {user: user, validate: validate})
    })
  })
})
  // app.get('/users', (req, res) => {
  //   let User = require('../models/user')
  //   User.all(function (users) {
  //     res.render('users/index', {users: users})  
  //   })
  // })

  app.get('/users/login', (req, res) => {
    res.render('users/login')
  })

}