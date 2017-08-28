var amqp = require('amqplib/callback_api');
const uuid = require('uuid/v1');
var HashMap = require('hashmap');
var map = new HashMap();

var channel = null;


module.exports.connect = function (localtion) {
    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, ch) {
            channel = ch;
            ch.consume("rpc-rc", function (msg) {
                var cb = map.get(msg.properties.correlationId);
                console.log("result:" + msg);
                if (cb) {
                    cb(msg.content.toString());
                    ch.ack(msg);
                    map.delete(msg.properties.correlationId);
                } else {
                    ch.nack(msg);
                }
            }, {noAck: false});
        });
    });
}

module.exports.sendMsg = function (queue, content, cb) {
    var id = uuid();
    map.set(id, cb);
    channel.sendToQueue(queue, new Buffer(content), {correlationId: id, replyTo: "rpc-rc"})
}
