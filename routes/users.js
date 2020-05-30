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

// Gets the login page
router.get('/login', forwardAuthenticated, function(req, res, next){
    res.render('login');
    next();
  });

 // Register Page
  router.get('/register', ensureAuthenticated, (req, res) => res.render('register', {user: req.user}));

// Registration 
  router.post('/register', (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];
  
    if (!username || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        username,
        password,
        password2
      });         
    } else {
      User.findOne({ where: {username: req.body.username}}).then(user => {
        if (user) {
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
                    'You are now registered and can log in'
                  );
                  let msg = "You are now registered and can log in below"
                  res.render('login', {user: req.user, username, msg});
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
    console.log('User logged out')
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
  });

  module.exports = router;