$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/game');

    socket.on('command', function(data){
        var command = JSON.parse(data);
        GameInfo.command_buffer[command.handle].push(command);
    });

    socket.emit('execute', {game_id: game_id, nickname: nickname, handle: handle, code: ""});
});

