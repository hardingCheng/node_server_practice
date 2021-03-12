const http = require('http')
const port = 3000
const serverHandle = require('../app')
const app = http.createServer(serverHandle)

app.listen(port)
console.log("服务器启动成功")
