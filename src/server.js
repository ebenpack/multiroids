var http = require('http');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end();
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!' });

    socket.on('message', function(data){
        console.log(data);
        io.emit('message', data);
    });
});

app.listen(8082);