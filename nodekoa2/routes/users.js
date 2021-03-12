const router = require('koa-router')()
const {SuccessModel, ErrorModel} = require('../model/resModel')
const { login } = require('../controller/user')
router.prefix('/api/user')

router.post('/login', async(ctx, next) => {
  const{username, password} =ctx.request.body
  const data = await login(username, password)
  if (data.username) {
    ctx.session.username = data.username
    ctx.session.realname = data.realname
    ctx.body = new SuccessModel("登录成功")
    return
  } else {
    ctx.body = new ErrorModel("登录失败")
  }
});
module.exports = router
