/*
 Created on 3/15/2018  
 Author: zhangliang
 Description:  rt-logout.js
*/

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.destroy();
    console.log("已经登出，重定向到登陆界面");
    res.redirect('login');
});

module.exports = router;
