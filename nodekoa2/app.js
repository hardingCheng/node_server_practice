var session = require('koa-generic-session');
var redisStore = require('koa-redis');
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const static = require('koa-static')
const {REDIS_CONFIG} = require('./conf/db')
const blog = require('./routes/blog')
const users = require('./routes/users')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(static(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
app.keys = ['hardingCheng'];
app.use(session({
  cookie:{
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //one day in ms,
  },
  store: redisStore({
    all:`${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`
  })
}));
const env = process.env.NODE_ENV
if (env !== 'production') {
  app.use(morgan('dev'));
} else {
  const logFileName = path.join(__dirname, 'logs','access.log');
  const writeStream = fs.createWriteStream(logFileName,{
    flags: 'a'
  })
  app.use(morgan('combined',{
    stream: writeStream
  }));
}
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
