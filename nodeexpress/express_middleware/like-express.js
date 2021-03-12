// app.use 用来注册中间件，先收集起来
// 遇到 http 请求，根据path和method判断触发那些
// 实现next机制，即上一个通过next触发下一个
const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
       //存放中间件的列表
        this.routes = {
            all: [], //app.use
            get: [], //app.get
            post: [] //app.post
        }
    }
    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            info.stack = slice.call(arguments,1)
        }else {
            info.path = '/'
            info.stack = slice.call(arguments,0)
        }
        return info
    }
    use() {
        const info = this.register.apply(this,arguments)
        this.routes.all.push(info)
    }
    get() {
        const info = this.register.apply(this,arguments)
        this.routes.get.push(info)
    }
    post() {
        const info = this.register.apply(this,arguments)
        this.routes.post.push(info)
    }
    match(method,url) {
        let stack = []
        if (url === '/faviocn.ico'){
            return stack
        }
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])
        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo).path === 0){
                stack = stack.concat(routeInfo.stack)
            }
        })

    }
    handle(req,res,stack) {
        const next = () => {
            const middleware = stack.shift()
            if (middleware) {
                middleware(req,res,next)
            }
        }
        next()
    }
    callback() {
        return (req,res) => {
            res.json = (data) => {
                res.setHeader('Content-type','application/json')
                res.end(JSON.parse(data))
            }
            const url = req.url
            const method = req.method.toLowerCase()
            const resultList = this.match(method,url)
            this.handle(req,res,resultList)
        }
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}
// 工厂函数
module.exports = () => {
    return new LikeExpress()
}
