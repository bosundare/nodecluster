const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


require('./config/passport')(passport);

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);



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











