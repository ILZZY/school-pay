/*
 Created on 4/16/2018  
 Author: zhangliang
 Description:     
*/
var express = require("express");
var router = express.Router();

router.get('/payhelp',function (req,res,next) {
    res.render('./pay/payhelp');
})
router.get('/return_url',function (req,res,next) {
    var tmp = JSON.stringify(req.query);
    req.session.ssnparam_pay_alipay = tmp;
    console.log("req session参数：ssnparam_pay_alipay = "+tmp);
    res.redirect('/login');
});
router.get('/redirect_uri',function (req,res,next) {
    var tmp = JSON.stringify(req.query);
    if(tmp){
        req.session.ssnparam_pay_alioauth = tmp;
        console.log("req session参数：ssnparam_pay_alioauth = "+tmp);
        res.redirect('/login');
    }else{
        res.send("获取oauthcode失败");
    }

});
router.get('/alioauthcode',function (req,res,next) {
    res.send(req.session.ssnparam_pay_alioauth);
});


router.post('/getdts',function (req,res,next) {
    var dataObj = JSON.parse(fs.readFileSync(global.LOCALTESTPATH + "/templatedts.json"));
    res.send(dataObj);
})

module.exports = router;
