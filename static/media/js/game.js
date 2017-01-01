var timerExecuted = false;
var editor = null;

$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/game');

    socket.on('command', function(data){
        var command = JSON.parse(data);
        GameInfo.command_buffer[command.handle].push(command);
    });

    socket.on('error', function(error_msg){
        $("#error").fadeIn("slow");
        $("#error_msg").html("<strong>" + error_msg + "</strong>");
        setTimeout(function(){
            $("#error").fadeOut("slow");
        }, 10000);
    });

    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        tabSize: 2,
        indentUnit: 2,
        mode: "javascript"
    });
    var original_code = "function main(){\n\n}";
    var play_btn = document.getElementById('execute_btn');
    play_btn.onclick = function() {
        var text = editor.getValue();
        socket.emit('execute', {game_id: game_id, nickname: nickname, handle: handle, code: text});
    }
    var clean_btn = document.getElementById('clean');
    clean_btn.onclick = function() {
        var button = this;
        bootbox.confirm("Estàs segur que vols netejar tot el que hi ha escrit a l'editor?", "Cancel·la", "Neteja", function(result){
            if(result){
                editor.setValue(original_code);
            }
        });
    };
});

