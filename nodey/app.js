const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const {handleUserRouter,getCookieExpires} = require('./src/router/user')
const {access} = require('./src/utils/log')
const SESSION_DATA = {}
const getPostData = req => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data',(chunk) => {
            postData += chunk.toString()
        })
        req.on('end',(chunk) =>{
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}
const serverHandle = (req,res) => {
    access(` ${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)
    res.setHeader('Content-Type', 'application/json')
    const url = req.url
    req.path = url.split('?')[0]
    req.query = querystring.parse(url.split('?')[1])
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(";").forEach(item => {
        if (!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    let needSetCookies = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookies = true
        userId =`${Date.now()}+${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]
    getPostData(req).then((postData) => {
        req.body = postData
        //处理blog路由
        const blogResult =handleBlogRouter(req,res);
        if (blogResult) {
            blogResult.then((blogData) => {
                if (needSetCookies) {
                    res.setHeader('Set-Cookie',`userid="${userId}";path="/";httpOnly;expires="${getCookieExpires()}";`)
                }
               res.end(JSON.stringify(blogData))
            })
            return
        }
        //处理user路由
        const userResult = handleUserRouter(req,res);
        if (userResult) {
            userResult.then((userData) => {
                if (needSetCookies) {
                    res.setHeader('Set-Cookie',`userid="${userId}";path="/";httpOnly;expires="${getCookieExpires()}";`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }
        //为命中骆,返回404
        res.writeHead(404,{"Content-type": "text/plain"})
        res.write("404 Not Found")
        res.end()
    })
}
module.exports = serverHandle
