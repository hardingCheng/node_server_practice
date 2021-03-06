const { login } = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const { set } = require('../db/redis')
const getCookieExpires= () =>{
    const d = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    return d.toGMTString()
}
const handleUserRouter = (req, res) => {
    const method = req.method
    if (method === 'POST' && req.path === '/api/user/login') {
        const {username, password} =req.body
        const result = login(username, password)
        return result.then((data) => {
            if (data.username) {
                req.session.username = data.username
                req.session.realname = data.realname
                set(req.sessionId,req.session)
                return new SuccessModel("登录成功")
            } else {
                return new ErrorModel("登录失败")
            }
        })
    }
}
module.exports = {
    handleUserRouter,
    getCookieExpires
}
