var amqp = require('amqp');

var exchange_name = 'on.events';
var routing_key = 'node.alert.*';
var queue_name = exchange_name + '-' + routing_key + '-test.consumer';
var options = {
    url: "amqp://localhost"
};
var clientOptions = {
    reconnect: true,
    reconnectBackoffStrategy: 'linear',
    reconnectExponentialLimit: 120000,
    reconnectBackoffTime: 1000
};

var connection = amqp.createConnection(options, clientOptions);

// add this for better debuging
connection.on('error', function(e) {
    console.log("Error from amqp: ", e);
});

// Wait for connection to become established.
connection.on('ready', function () {
    // Use the default 'amq.topic' exchange
    connection.queue(exchange_name, queue_name, function (q) {
        // Catch all messages
        q.bind(routing_key);

        // Receive messages
        q.subscribe(function (message) {
            // Print messages to stdout
            console.log(message);
            console.log(String(message.data));
        });
    });
});