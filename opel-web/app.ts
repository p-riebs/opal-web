import debug = require('debug');
import express = require('express');
import path = require('path');
import net = require('net');

import routes from './routes/index';
import users from './routes/user';

import { client } from './client';
import { _ }  from 'lodash'

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

// Keep a pool of sockets ready for everyone
// Avoid dead sockets by responding to the 'end' event
let clients: client[] = new Array<client>();

export function getClients() {
    return clients;
}

let appServer: net.Server = net.createServer(function (clientSocket: net.Socket) {

    let clientObj : client = new client(clientSocket);
    // Add the new client connection to the array of
    // sockets
    clients.push(clientObj);

    // Use splice to get rid of the socket that is ending.
    // The 'end' event means tcp client has disconnected.
    clientSocket.on('end', function () {
        let index = -1;

        _.each(clients, function (clientData: client, idx: number) {
            if (clientData.isEqual(clientObj)) {
                index = idx;
                return;
            }
        });

        clients.splice(index, 1);


        console.log(`A client has disconnected. ${JSON.stringify(clientSocket.address())}`);
    });
});

appServer.listen(4510, '127.0.0.1');

appServer.on('connection', function (clientSocket: net.Socket) {
    console.log(`A client has connected. ${JSON.stringify(clientSocket.address())}`);
});

console.log("appServer started");