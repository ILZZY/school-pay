var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET other pages*/
router.get('/GETAPAGE',function (req,res,next) {
    var str_path = req.query.path;
    //替换成下划线
    var str_withC = str_path.replace(/\//g,'_');
    //拼接自定以sesion参数标识头"ssnparam_"
    var str_ssnparam = 'ssnparam_'+str_withC;
    //从session中取出参数
    console.log("req.session:"+JSON.stringify(req.session));
    var str_tmp_dataParam = req.session[str_ssnparam];
    //debugger
    console.log("渲染模板为："+str_path+" 携带的参数："+ str_tmp_dataParam);
    res.render(str_path,{str_dataParam:str_tmp_dataParam});
})

module.exports = router;
