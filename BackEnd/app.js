/**
 * Game Of Drones
 * @author       Juan Nicholls <jdnichollsc@hotmail.com>
 * @copyright    2016 Juan Nicholls - https://github.com/jdnichollsc/Game-of-Drones
 * @license      {@link http://opensource.org/licenses/MIT}
 * @version 1.0.0
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var databaseConfig = require('./config/database');
var migrations = require('./migrations/seed');

var routes = require('./routes/index');
var game = require('./routes/game');
var move = require('./routes/move');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/**
 * Configure database connection
 */
var connectWithRetry = function () {
    return mongoose.connect(databaseConfig.url, { server: { auto_reconnect: true } }, function (err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log("Connected to the database...");
            migrations.initialize();
        }
    });
};
connectWithRetry();


app.use('/', routes);
app.use('/game', game);
app.use('/move', move);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
