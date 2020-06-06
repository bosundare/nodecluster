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
const { check, validationResult } = require('express-validator/check');
const logger = require('../config/logger')

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
                logger.info('New user '+username + ' added')
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

//Change Password Page
router.get('/passwd', ensureAuthenticated, function(req, res){
  res.render('changepwd', {user:req.user.username});
  
});

//Change Password 
router.post('/passwd', ensureAuthenticated, 
[
   check('password')
  .isLength({min:5}).trim().withMessage('Minimum 5 Character Password')
  .custom((value,{req}) => {
   if (value !== req.body.password2) {
       // throw error if passwords do not match
       throw new Error("Passwords don't match");
   } else {
       return value;
   }
}),
  ], (req, res)=>{
  const {username, password,password2} = req.body;
  let errors = req.validationErrors();
  if (errors) {
    console.log(errors);
       res.render('changepwd',
        { 
         errors: errors, 
         user: req.user.username,
         username,
         password,
         password2
        });
     } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          req.body.password = hash;
          User.findOne({where: {username: req.user.username}})
          .then(users =>{
            users.update({
              password:req.body.password
              })
              .then(user => {
              req.flash('success_msg','Password successfully updated');
              res.redirect('/users/passwd');
            }).catch(user => {
      
              req.flash('error_msg','Update failed, Check input');
              res.redirect('/users/passwd');
        })
        })
         .catch(err => console.log(err));
        });
      });
     }

})
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
    logger.info('User '+ user.username + 'logged out')
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

  module.exports = router;