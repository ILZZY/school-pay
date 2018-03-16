var express = require('express');
var router = express.Router();

//get请求登陆页面
router.get('/', function (req, res, next) {
    console.log("主页请求时的IS_LOGIN:"+req.session.IS_LOGIN);
    if (req.session.IS_LOGIN) {/*如果存在用户名，直接进入主页*/
        res.redirect('/homepage');
    } else {/*否则进入登录页面*/
        console.log("渲染登陆页面");
        res.render('login');
    }
});

//post登录请求
router.post('/', function (req, res) {
    console.log('登录成功，重定向到主页homepage');
    req.session.IS_LOGIN = true;
    console.log('已经设置IS_LOGIN为:'+req.session.IS_LOGIN);
    res.redirect("/homepage");
});

module.exports = router;
