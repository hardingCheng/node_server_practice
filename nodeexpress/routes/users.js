var express = require('express');
var router = express.Router();
const {SuccessModel, ErrorModel} = require('../model/resModel')
const { login } = require('../controller/user')
//const { set } = require('../db/redis')
const getCookieExpires= () =>{
  const d = new Date()
  d.setTime(d.getTime() + (24*60*60*1000))
  return d.toGMTString()
}

/* GET users listing. */
router.post('/login', function(req, res, next) {
  const {username, password} =req.body
  const result = login(username, password)
  return result.then((data) => {
    if (data.username) {
      req.session.username = data.username
      req.session.realname = data.realname
      res.json(new SuccessModel("登录成功"))
      return
    } else {
      res.json(new ErrorModel("登录失败"))
    }
  })
});
module.exports = router;
