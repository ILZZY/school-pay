/*
 Created on 3/15/2018  
 Author: zhang liang
 Description: r-demo.js
*/
var express = require("express");
var router = express.Router();
var fs = require('fs');

router.get('/template',function (req,res,next) {
    res.render('./demo/template');
})
router.post('/getdts',function (req,res,next) {
    var dataObj = JSON.parse(fs.readFileSync(global.LOCALTESTPATH + "/templatedts.json"));
    res.send(dataObj);
})

module.exports = router;