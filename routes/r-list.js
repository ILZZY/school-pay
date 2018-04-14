/*
 Created on 3/15/2018  
 Author: zhangliang
 Description: r-list.js
*/
//引入路由文件
var r_index = require('../routes/r-index');
var r_login = require('../routes/r-login');
var r_homePage = require('../routes/r-homepage');
var r_logout = require('../routes/r-logout');

var r_demo = require('../routes/demo/r-demo');
var r_systemmanage = require("../routes/systemmanage/r-systemmanage");

var proxy = require('express-http-proxy');

var route_lists = function (app) {
    /**
     * 默认代理转发
     */
    app.use('/api/', proxy(global.BACKSERVICE, {
        proxyReqPathResolver: function (req) {
            console.log("后台请求路径:" + global.BACKSERVICE + req._parsedUrl.path);
            return global.BACKSERVICE + req._parsedUrl.path;
        },
        filter: function(req, res) {
            return true;
        }
    }));

    /**
     * 学籍查询代理转发
     */
    app.use('/api_xueji/', proxy(global.XUEJIURL, {
        proxyReqPathResolver: function (req) {
            console.log("学籍请求路径:" + global.XUEJIURL + req._parsedUrl.path);
            debugger
            return global.XUEJIURL + req._parsedUrl.path;
        },
        filter: function(req, res) {
            return true;
        }
    }));

    //绑定路由处理
    app.use('/', r_index);
    app.use('/login', r_login);
    app.use('/homepage', r_homePage);
    app.use('/logout', r_logout);

    app.use('/demo',r_demo);
    app.use("/systemanage", r_systemmanage);
}
module.exports = route_lists;