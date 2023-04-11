var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const moment = require("moment");
var localSocket;
server.lastPlayderID = 0;
var players = [];

app.use('/', express.static(__dirname + '/build'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

app.get('/teste', function (req, res) {
    res.sendFile(__dirname + '/teste.html');
});

server.listen(process.env.PORT || 8000, function () {
    console.log('Listening on ' + server.address().port);
});
io.on('connection', function (socket) {
    localSocket = socket;
    //Salva a interação para derrubar o usuário que não interage
    socket.prependAny((eventName, ...args) => {
        //console.log(players)
        if (eventName == 'newplayer' || eventName == 'disconnect') { return false; }
        players.forEach(function (player, index) {
            if (player.id === socket.id) {
                player.last_interaction = moment();
            }
        }); // use arr as thisF
    });

    socket.on('newplayer', (msg) => {
        let p = {
            id: socket.id.toString(),
            code: server.lastPlayderID++,
            x: msg.x,
            y: msg.y,
            last_interaction: moment()
        };
        socket.emit('allplayers', players);
        players.push(p);
        socket.broadcast.emit('newplayer', p);
        socket.on('move', function (data) {
            let p = players.filter(function (obj) {
                return obj.id === socket.id;
            });
            let player = p[0];
            if(player){
                player.x = data.x;
                player.y = data.y;
                player.animation = data.animation;
                socket.broadcast.emit('move', player);
            }
        });

        socket.on('disconnect', function () {
            let p = players.filter(function (obj) {
                return obj.id === socket.id;
            });
            players = players.filter(function (obj) {
                return obj.id !== socket.id;
            });
            socket.broadcast.emit('user_disconnect', p[0]);
        });
    });


    socket.on('message', function (msg) {
        let p = players.filter(function (obj) {
            return obj.id === socket.id;
        });
        if(p){
            io.emit('message', {text: msg, user: p[0]});
        }
    });

});
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
