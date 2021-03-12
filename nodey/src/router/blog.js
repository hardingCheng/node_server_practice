const {getList, getDetail, addBlogContent,updateBlogContent,deleteBlogContent} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {get} = require('../db/redis')
// 统一的登录验证函数
const loginCheck = (req) => {
    get(req.cookies.sessionId).then((data) => {
        if (!data) {
            return Promise.resolve(
                new ErrorModel('尚未登录')
            )
        }
    })
}
const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id
    if (method === 'GET' && req.path === '/api/blog/list') {
        let {author, keyword} = req.query
        if (req.query.isadmin) {
            // 管理员界面
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult
            }
            // 强制查询自己的博客
            author = req.session.username
        }
        const result = getList(author, keyword)
        return result.then((listData) => {
            return new SuccessModel(listData)
        })
    }
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id);
        return result.then((data) => {
            return new SuccessModel(data)
        })
    }
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        req.body.author = req.session.username
        const blogData = req.body
        const result = addBlogContent(blogData)
        return result.then((data) => {
            return new SuccessModel(data)
        })
    }
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        const result = updateBlogContent(id,req.body)
        return result.then((data) => {
            if (data) {
                return new SuccessModel("更新成功")
            } else {
                return new ErrorModel("更新失败")
            }
        })

    }
    if (method === 'POST' && req.path === '/api/blog/delete') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        const author = req.session.username
        const result = deleteBlogContent(id,author)
        return result.then((data) => {
            if (data) {
                return new SuccessModel("删除成功")
            } else {
                return new ErrorModel("删除失败")
            }
        })
    }
}
module.exports = handleBlogRouter

