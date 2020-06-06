const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');
const User = require('./models/Users');
const bcrypt = require('bcryptjs');


require('./config/passport')(passport);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Database
const db = require('./config/database');
// Test DB
db.authenticate()
  .then(() => console.log('Database Connected'))
  .then(User.findOne({ where: {username: 'admin'}})
  .then(user=>{
    if(user) {
      console.log('Admin user exists, skipping first time user creation')
    } else {
      const newUser = new User ({
        username: 'admin',password: 'password'
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              console.log('admin user created with default password of "password"')
                })
            .catch(err => console.log(err));
        });
      });
    }
  })
  )
  .catch(err => console.log('Error: ' + err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Creates the global user only if logged in
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Welcome Page
app.get('/', (req, res) => res.render('index'));
// Call the index routes
app.use('/cluster', require('./routes/cluster'));

app.use('/api', require('./routes/api'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server Started on Port ${PORT}`));