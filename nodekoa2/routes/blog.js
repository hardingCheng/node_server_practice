const router = require('koa-router')()
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {getList, getDetail, addBlogContent,updateBlogContent,deleteBlogContent} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
router.prefix('/api/blog')

router.get('/list',async(ctx,next) => {
    let {author, keyword} = ctx.query
    if (ctx.query.isadmin) {
        // 管理员界面
        if (ctx.session.username == null) {
            // 未登录
            ctx.body = new ErrorModel('未登录')
            return
        }
        // 强制查询自己的博客
        author = ctx.session.username
    }
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})
router.get('/detail',async(ctx, next) => {
    const data = await getDetail(ctx.query.id);
    ctx.body = new SuccessModel(data)
})
router.post('/new', loginCheck,async(ctx, next) => {
    ctx.request.body.author = ctx.session.username
    const blogData = ctx.request.body
    const data = await addBlogContent(blogData)
    ctx.body = new SuccessModel(data)
})
router.post('/update',loginCheck,async(ctx, next) => {
    const data = await updateBlogContent(ctx.query.id,ctx.body)
    if (data) {
        ctx.body = new SuccessModel("更新成功")
    } else {
        ctx.body = new ErrorModel("更新失败")
    }
})
router.post('/delete',loginCheck,async(ctx, next) => {
    const author = ctx.session.username
    const data = await deleteBlogContent(ctx.query.id,author)
    if (data) {
        ctx.body = new SuccessModel("删除成功")
    } else {
        ctx.body = new ErrorModel("删除失败")
    }
})
module.exports = router
