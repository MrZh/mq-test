var express = require('express');
var router = express.Router();
var mq = require("../lib/mq");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/userName', function (req, res, next) {
    mq.sendMsg("rpc-send", "/userName", function (msg) {
        res.json(msg);
    })
});

router.get('/userAge', function (req, res, next) {
    mq.sendMsg("rpc-send", "/userAge", function (msg) {
        res.json(msg);
    })
});

module.exports = router;
