'use strict';

var amqp = require('amqp');

var exchange_name = 'on.events';
var routing_key_name = 'node.alert.*';
var queue_name = exchange_name + '-' + routing_key + '-test.consumer';
var url = "amqp://localhost";
var options = {
    url: url
};
var clientOptions = {
    reconnect: true,
    reconnectBackoffStrategy: 'linear',
    reconnectExponentialLimit: 120000,
    reconnectBackoffTime: 1000
};

var args = process.argv.slice(2);

var exchange = args[0] || exchange_name;
var routing_key = args[1] || routing_key_name;

console.log('monitoring exchange: ' + exchange + ' routing key: ' + routing_key);

var connection = amqp.createConnection(options, clientOptions);

// add this for better debuging
connection.on('error', function(e) {
    console.log("Error from amqp: ", e);
});

// Wait for connection to become established.
connection.on('ready', function () {
    // Use the default 'amq.topic' exchange
    connection.queue(queue_name, function (q) {
        // Catch all messages
        q.bind(exchange, routing_key);

        // Receive messages
        q.subscribe(function (message) {
            // Print messages to stdout
            console.log(message);
            console.log('message data: ', String(message.data));
        });
    });
});