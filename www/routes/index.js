const fs          = require('fs');
const escape      = require('escape-html');

// Model
//-----------------------------------------------------------------------------------------------
const User        = require('../models/user');
const Checker     = require('../models/checker');
const Tag         = require('../models/tag');
const TagsUser    = require('../models/tagsuser');
const Mail        = require('../models/mail');

// Functions
//-----------------------------------------------------------------------------------------------
function isAuth(req, res, next) {
  if (req.session.user === undefined) {
      req.toastr('error', 'You need to be logged', 'Forbidden')
      res.redirect('/login')
  } else {
   next()
  }
}
function isNotAuth(req, res, next) {
  if (req.session.user !== undefined) {
    res.redirect('/')
  } else {
    next()
  }
}
function isValidated(req, res, next) {
  if (req.session.user !== undefined && req.session.user.validate_step !== undefined) {
    if (req.session.user.validate_step !== 0) { res.redirect('/register/step/') }
    else { next() }
  } 
else { next() }
}
function isNotValidated(req, res, next) {
  if (req.session.user !== undefined && req.session.user.validate_step != undefined) {
    if (req.session.user.validate_step === 0) { res.redirect('/') }
    else { next() }
  }
  else { next() }
}

// Routes
//-----------------------------------------------------------------------------------------------
module.exports = (app) => {

    app.get('/', isAuth, isValidated, (req, res) => {
        req.active('home')
        res.render('index', { current_user: req.session.user })
    })

    app.get('/profil/:id', isAuth, isValidated, (req, res) => {
      req.active('profil')
      User.find(req.params['id'])
        .then( (user) => { 
          User.getTags(user.id)
            .then( (tags) => {
              res.render('profil', { user: user, current_user: req.session.user, tags: tags })
            })
        })
    })
    app.get('/profil/:id/edit', isAuth, isValidated, (req, res) => {
      req.active('profil')
      User.find(req.params['id'])
      .then( (user) => {
        if (user.id == req.session.user.id) {
          User.getTags(user.id)
          .then( (tags) => {
            res.render('profil_edit', { user: user, current_user: req.session.user, tags: tags })
          })
        } else {
          req.toastr('error', 'You are not supposed to be here', 'Forbidden')
          res.redirect('/')
        }
      })
    })
    app.post('/profil/:id/edit/:colomn', isAuth, isValidated, (req, res) => {
      Checker.profil_edit(req.body)
        .then( () => {
          User.update(req)
            .then( () => { res.redirect('/profil/'+req.params['id']); })
            .catch( () => { res.redirect('/profil/'+req.params['id']); })
        })
        .catch( () => { res.redirect('/profil/'+req.params['id']); })
    })
    // Users
    //-------------------------------------------------------------------------------------------
    app
    .get('/register', isNotAuth, (req, res) => {
        res.render('users/register')
    })
    .post('/register', isNotAuth, (req, res) => {  
      Checker.register(req.body)
      .then( () => {
        User.create(req.body)
        .then( () => {
          req.flash('success', "Welcome to matcha site!")
          res.redirect('register')
        })
        .catch ( (err) => {
          if (err === 'ER_DUP_ENTRY') {
            req.flash('error', ["E-mail already taken!"])
            res.redirect('register')
          }
        })
      })
      .catch ( (err) => {
        req.flash('error', err);
        res.redirect('register');
      })
    })

    app
    .get('/destroy', isAuth, isValidated, (req, res) => {
      User.destroy(req.session.user)
        .then( () =>  {
          req.session.user = undefined
          req.flash('success', 'Your account has been deleted!')
          res.redirect('/login')
        })
    })
    .get('/logout', isAuth, isValidated, (req, res) => {
      req.session.user = undefined
      req.toastr('success', 'You are logged out', 'Success')
      res.redirect('login')
    })
    .get('/login', isNotAuth, (req, res) => {
        res.render('users/login')
    })
    .post('/login', isNotAuth, (req, res) => {
      Checker.login (req.body)
        .then( () => {
          User.sign_in(req.body)
            .then( (user) => {
              if (req.session.user === undefined) {
                req.session.user = { 
                  id: user.id, 
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  validate_step: user.validate_step 
                }
                res.redirect('/');
              }
            })
            .catch( (err) => {
              req.flash('error', err);
              res.redirect('login');
            })
      })
      .catch ( (err) => {
        req.flash('error', err);
        res.redirect('login');
      })
    })

    // Step registeration
    //-------------------------------------------------------------------------------------------
    app.get('/register/step/', isAuth, isNotValidated, (req, res) => {
      res.render('users/step', {user: req.session.user})
    })
    app.post('/register/step', isAuth, isNotValidated, (req, res) => {
      
      // ------ step 1 ------
      if (req.session.user.validate_step == 1) {
        Checker.register_step_1(req.body)
          .then( () => {
            if ( (req.body.interested_by && req.body.interested_by.length == 2) || !req.body.interested_by)
              req.body.interested_by = 'both'

            if (req.body.birthdate == '') 
              delete req.body.birthdate

            User.update(req)
              .then( () => { req.session.user.validate_step = 2; res.redirect('step'); } )
              .catch( (err) => { req.flash('Error', err) })
          })
          .catch( (err) => { req.flash('error', err); res.redirect('step'); })
      }
      
      // ------ step 2 ------
      else if (req.session.user.validate_step == 2) {
        Checker.register_step_2(req.body)
          .then( () => {
            req.body.tags.toLowerCase().split(',').forEach( (tag) => { 
              Tag.create(tag.trim())
                .then( () => { TagsUser.create(req.session.user, tag.trim()); })
                .then( () => {
                  delete req.body.tags

                  if (req.body.bio == '')
                    delete req.body.bio

                  User.update(req)
                    .then( () => { req.session.user.validate_step = 0; res.redirect('/') })
                }) 
            })
          })
          .catch( (err) =>  {
            req.flash('error', err);
            res.redirect('step');
          })
        } 

        else
          res.redirect('/')
  })


    // Views
    //-------------------------------------------------------------------------------------------
    app
    .get('/settings', isAuth, isValidated, (req, res) => {
      res.render('settings', { current_user: req.session.user })
    })
    .get('/contact', isAuth, isValidated, (req, res) => {
      res.render('contact', { current_user: req.session.user })
    })
    .post('/contact', isAuth, isValidated, (req, res) => {
    
      Checker.mail_issue(req.body)
        .then( () => { 
          Mail.admin_contact(req.body, req.session.user)
            .then( () => { 
              req.toastr('success', "mail is successfully sent.")
              res.redirect('/') 
            })
            .catch( () => { 
              req.toastr("Failed", "mail has not been sent for some reason.")
              res.redirect('/') 
            })
    
        })
        .catch( (err) => {
          req.flash('error', err);
          res.redirect('/contact')
        })
    })


    app.post('/endpoint/:colomn', isAuth, isValidated, (req, res) => {
      let obj = {}
      Checker.bio_edit(req.body)
        .then( () => {
          User.update(req)
            .then( () => { res.status(200).send(req.body) })
            .catch( () => { res.redirect('/profil/'+req.params['id']); })
        })
        .catch( () => { res.status(404).send('error')  })

      
    })

}