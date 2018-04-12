// 定义的全局变量
// 定义测试数据的根目录
global.LOCALTESTPATH = "./localtest";
global.LOCALTESTDATA = false;

global.LOCALHOST = "http://localhost:3000";
global.BACKSERVICE = "http://localhost:8080/school-pay-java";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*引入第三方模块*/
//session模块
var session = require('express-session');

//路由分流处理文件
var r_list = require('./routes/r-list');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session配置
app.use(session({
    name: "NODE_SESSION_ID",
    secret: 'SCHOOL_PAY', // 用来对session id相关的cookie进行签名
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 10 * 60 * 60 * 1000 // 有效期，单位是毫秒
    }
}));

/*中间件,判断用户是否登录*/
//1.判断是否登录
app.use(function (req, res, next) {
    console.log("已进入登录判断中间件：url为-->" + req.url + "\tIS_LOGIN-->" + req.session.IS_LOGIN);
    //1.1未登录-->重定向到登陆页面
    if (req.url.substr(0,6) != '/login') {
        if (req.session.IS_LOGIN === undefined || req.session.IS_LOGIN === null) {
            console.log('这是非登陆注册页面请求且还未登录，重定向到登录页面')
            res.redirect('/login');//如果没登录就重定向（跳转）至登录页面。

        } else {
            console.log('这是非登陆注册页面请求但已经登录了，继续路由')
            next();
        }
        return;
    }
    //1.2否则继续路由
    console.log('这是登陆注册页面请求，继续路由')
    next();
});


//路由分流处理
r_list(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    /*// set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');*/
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') { //ajax请求
        res.json({
            "code_": 1,
            "msg_": res.locals.message,
            "detail_": "",
            "ignore_": false,
            "level_": 5,
            "path_": "",
            "now_": "",
            "attributes_": {},
            data: []
        })
    } else { //普通的url请求
        err.status = err.status || 500
        res.status(err.status);
        res.render('common/error');
    }
});

module.exports = app;
