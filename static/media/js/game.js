var timerExecuted = false;
var editor = null;

$(document).ready(function() {

    // Support TLS-specific URLs, when appropriate.
    if (window.location.protocol == "https:") {
      var ws_scheme = "wss://";
    } else {
      var ws_scheme = "ws://"
    };

    var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
    var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

    inbox.onmessage = function(message) {
        var data = JSON.parse(message.data);
        if("error" in data) {
            $("#error").fadeIn("slow");
            $("#error_msg").html("<strong>" + data.error + "</strong>");
            setTimeout(function(){
                $("#error").fadeOut("slow");
            }, 10000);
        } else {
            GameInfo.command_buffer[data.handle].push(data);
        }
    };

    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        tabSize: 4,
        indentUnit: 4,
        mode: "javascript"
    });
    var original_code = "function main(){\n\n}";
    var play_btn = document.getElementById('execute_btn');
    play_btn.onclick = function() {
        try {
          var text = editor.getValue();
          outbox.send(JSON.stringify({ handle: handle, text: text }));
        }
        catch(e) {
          $("#error").fadeIn("slow");
          $("#error_msg").html("<strong>" + e + "</strong>");
            setTimeout(function(){
              $("#error").fadeOut("slow");
            }, 10000);
        }
    };
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

