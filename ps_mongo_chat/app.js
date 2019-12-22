'use strict';
const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const dbConfig = require('./db');
const mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
const passport = require('passport');
const expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({
  secret: 'KHjLxmkFB3VyKkPSmaLnUB75vA4aZDAF',
  key: 'sid'
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store
// messages in session
// and displaying in templates
const flash = require('connect-flash');
app.use(flash());
var connections = [];
// Initialize Passport
const initPassport = require('./passport/init');
initPassport(passport);
const routes = require('./routes/index')(passport);
app.use('/', routes);
app.get('/client.js', function (req, res) {
  console.log('send client js');
  res.sendFile(path.join(__dirname, 'client.js'));
});

/*
 * On our 'msg' event, we get the session id of the connected user
 */

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('404');
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

module.exports = app;
