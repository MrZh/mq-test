var mq = require("../lib/mq");

module.exports.getUserName = function (msg) {
    mq.replyMsg("getUserName", msg);
}

module.exports.getUserAge = function (msg) {
    mq.replyMsg("getUserAge", msg);

}