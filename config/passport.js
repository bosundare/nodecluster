const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/Users');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: 'username', passwordField : 'password'}, (username, password, done) => {
        // Match user
        Users.findOne({where: {username:username}})
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That Username is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      })
    );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
  Users.findByPk(id).then(function(user) {
    if (user) {
        done(null, user.get());
         } else {
             done(user.errors, null);
         }
     });
 
});

};
