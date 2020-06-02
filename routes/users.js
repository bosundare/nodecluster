const flash = require('connect-flash');
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const passport = require('passport');
// Load User model
const User = require('../models/Users');
const session = require('express-session');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const {userValidationRules} = require('../config/validation');

// Gets the login page
router.get('/login', forwardAuthenticated, function(req, res, next){
    res.render('login');
    next();
  });

 // Register Page
  router.get('/register', ensureAuthenticated, (req, res) => res.render('register', {user: req.user}));

// Registration 
router.post('/register', ensureAuthenticated, userValidationRules(), (req,res) =>{
 const {username, password,password2} = req.body;
 let errors = req.validationErrors();
 if (errors) {
  console.log(errors);
     res.render('register',
      { 
       errors: errors, 
       user: req.user,
       username,
       password,
       password2
      });
   } else {
    User.findOne({ where: {username: req.body.username}}).then(user => {
      if (user) {
        let errors = [];
        errors.push({ msg: 'Username already exists' });
        res.render('register', {
          user: req.user,
          errors,
          username,
          password,
          password2
        });
      } else {
        const newUser = new User({
          username,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'User has been successfully added'
                );
                res.redirect('/users/register');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

    // Login Process
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', {
          successRedirect: '/cluster',
          failureRedirect: '/users/login',
          failureFlash: true
        })(req, res, next);
      });

// logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

  module.exports = router;