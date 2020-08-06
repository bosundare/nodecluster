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
const logger = require('./config/logger')
const methodOverride = require('method-override')
const reservationservice = require('./services/reservation')
const alertservice = require('./services/alerts')
const Alert = require('./models/alert');
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
const Reservation = require('./models/reservation');
const Cluster = require('./models/cluster');
// Test DB
db.authenticate()
  .then(() => logger.info('Database Connected'))
  .then(User.findOne({ where: {username: 'admin'}})
  .then(user=>{
    if(user) {
      logger.info('Admin user exists, skipping first time user creation')
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
              logger.info('admin user created with default password of "password"')
                })
            .catch(err => logger.crit(err));
        });
      });
    }
  })
  
  )
  .catch(err => logger.crit('Error: ' + err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)


// Creates the global user only if logged in
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});
// Calls the background service process
alertservice
reservationservice

// Welcome Page
app.get('/', (req, res) => res.render('index'));
// app.get('/reservation', (req, res) => res.render('resindex'));
// Call the index routes
app.use('/cluster', require('./routes/cluster'));

app.use('/api', require('./routes/api'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server Started on Port ${PORT}`));