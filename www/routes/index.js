let fs = require('fs');

module.exports = (app) => {

    // ---- USERS -----
    app.get('/register', (req, res) => {
        res.render('users/register')
    })
    app.post('/register', (req, res) => {
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
                res.render('users/index', {
                    user: user,
                    validate: validate
                })
            })
        })
    })
    app.get('/login', (req, res) => {
        res.render('users/login')
    })
    app.post('/login', (req, res) => {
      let User = require('../models/user')
      User.sign_in(req.body, (callback) => {
        if (callback !== true) {
          req.flash('error', callback)
          res.redirect('login')
        } else {
          
        }
      })
    })

}