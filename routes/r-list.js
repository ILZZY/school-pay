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

var route_lists = function (app) {

    //绑定路由处理
    app.use('/', r_index);
    app.use('/login', r_login);
    app.use('/homepage', r_homePage);
    app.use('/logout', r_logout);

    app.use('/demo',r_demo);
    app.use("/systemanage", r_systemmanage);
}
module.exports = route_lists;