var express = require('express');
var router = express.Router();
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {getList, getDetail, addBlogContent,updateBlogContent,deleteBlogContent} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
router.get('/list',(req,res,next) => {
    let {author, keyword} = req.query
    if (req.query.isadmin) {
        // 管理员界面
        if (req.session.username == null) {
            // 未登录
            res.json(new ErrorModel('未登录'))
            return
        }
        // 强制查询自己的博客
        author = req.session.username
    }
    const result = getList(author, keyword)
    return result.then((listData) => {
        res.json(new SuccessModel(listData))
    })
})
router.get('/detail',(req, res, next) => {
    const result = getDetail(req.query.id);
    return result.then((data) => {
        res.json(new SuccessModel(data))
    })
})
router.post('/new',loginCheck,(req,res, next) => {
    req.body.author = req.session.username
    const blogData = req.body
    const result = addBlogContent(blogData)
    return result.then((data) => {
        res.json(new SuccessModel(data))
    })
})
router.post('/update',loginCheck,(req,res, next) => {
    const result = updateBlogContent(req.query.id,req.body)
    return result.then((data) => {
        if (data) {
            res.json(new SuccessModel("更新成功"))
        } else {
            res.json(new ErrorModel("更新失败"))
        }
    })
})
router.post('/delete',loginCheck,(req,res, next) => {
    const author = req.session.username
    const result = deleteBlogContent(req.query.id,author)
    return result.then((data) => {
        if (data) {
            res.json(new SuccessModel("删除成功"))
        } else {
            res.json(new ErrorModel("删除失败"))
        }
    })
})
module.exports = router;
