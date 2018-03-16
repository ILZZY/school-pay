var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET other pages*/
router.get('/GETAPAGE',function (req,res,next) {

    console.log(req.query);
    res.render(req.query.path);
})

module.exports = router;
