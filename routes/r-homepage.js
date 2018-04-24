var express = require('express');
var router = express.Router();

//文件操作模块
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("渲染主页");
    var firstMenus = [];
    var userName_ = req.session.userName;
    if(req.session.userResources) {
        console.log("服务器数据模式 获取边侧栏");
        firstMenus = req.session.userResources;
    }else{ //本地数据模式，在本地模拟服务器数据
        console.log("本地数据模式 获取边侧栏");
        firstMenus = JSON.parse(fs.readFileSync(global.LOCALTESTPATH + "/sidebar.json"));
    }
    debugger
    res.render('homepage', { "firstMenus": firstMenus, "userName":userName_ });
});

module.exports = router;
