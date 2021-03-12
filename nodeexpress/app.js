var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
let RedisStore = require('connect-redis')(session)
let redisClient = require('./db/redis')

var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session({
  secret: 'HardingCheng521',
  store: new RedisStore({ client: redisClient }),
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge:24*60*60*1000
  }
}))
const env = process.env.NODE_ENV
if (env !== 'production') {
  app.use(logger('dev'));
} else {
  const logFileName = path.join(__dirname, 'logs','access.log');
  const writeStream = fs.createWriteStream(logFileName,{
    flags: 'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', usersRouter);
app.use('/api/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
