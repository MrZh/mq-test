var amqp = require('amqplib/callback_api');

var HashMap = require('hashmap');
var channel = null;
var map = new HashMap();
var getUserName = require("../lib/http-lib").getUserName;
var getUserAge = require("../lib/http-lib").getUserAge;


module.exports.connect = function (localtion) {
    amqp.connect(localtion, function (err, conn) {
        conn.createChannel(function (err, ch) {
            ch.prefetch(1);
            channel = ch;
            var q = 'rpc-send';
            init();
            ch.consume(q, function reply(msg) {

                var cb = map.get(msg.content.toString());
                cb(msg);
            });
        });
    });
}


module.exports.replyMsg = function (content, msg) {
    channel.sendToQueue(msg.properties.replyTo, new Buffer(content), {correlationId: msg.properties.correlationId});
    channel.ack(msg);
}

function init() {
    map.set("/userName", getUserName);
    map.set("/userAge", getUserAge)
}