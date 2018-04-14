var express = require('express');
var router = express.Router();
var rp = require('request-promise');

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
    var tmpUserName = req.body.userName;
    if(global.LOCALTESTDATA){
        req.session.IS_LOGIN = true;
        console.log('已经设置IS_LOGIN为:'+req.session.IS_LOGIN);
        res.redirect("/homepage");
    }else {
        rp({
            method: 'post',
            uri: global.BACKSERVICE + '/user/_login',
            body: req.body,
            json: true
        }).then(function (data) {
            if(data.code_==0){
                console.log('登录成功，重定向到主页homepage');
                req.session.IS_LOGIN = true;
                console.log('已经设置IS_LOGIN为:'+req.session.IS_LOGIN);
                req.session.userName = tmpUserName;
                //debugger
                res.redirect("/homepage");
            }else {
                console.log('后台验证失败');
                res.statusCode = '401';
                debugger
                res.send(data);
            }
        });
    }
});

//register请求
router.post('/register',function (req, res) {
    rp({
        method: 'post',
        uri: global.BACKSERVICE + '/user/_save',
        body: req.body,
        json: true
    }).then(function (data) {
        res.send(data);
    });
});

router.get('/xueji',function (req, res) {
    var data_ = {
        "token": req.session.XUEJI_TOKEN
    }
    res.send(data_);
})

module.exports = router;
