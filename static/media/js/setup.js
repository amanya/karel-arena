$(document).ready(function() {
    var nickname = null;
    $("#nickname-form input[type=submit]").click(function(e){
        e.preventDefault();
        nickname = $("#nickname").val();
        if(nickname) {
            $("#handle-form input[name=nickname]").val(nickname);
            $("#greeter").text(nickname);
            $("#choose-nickname").addClass("hidden");
            $("#choose-karel").removeClass("hidden");
        }
    });
    $("#handle-form input[type=submit]").click(function(e){
        var handle = $("input[name=handle_radio]:checked").attr("id")
        $("#handle-form input[name=handle]").val(handle);
    });
    $("input[name=handle_radio]").change(function(e){
        var handle = $("input[name=handle_radio]:checked").attr("id")
        outbox.send(JSON.stringify({game_id: game_id, nickname: nickname, handle: handle}));
    });

    // Support TLS-specific URLs, when appropriate.
    if (window.location.protocol == "https:") {
      var ws_scheme = "wss://";
    } else {
      var ws_scheme = "ws://"
    };

    var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/setup-receive");
    var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/setup-submit");

    inbox.onmessage = function(message) {
        var data = JSON.parse(message.data);
        if("error" in data) {
            $("#error").fadeIn("slow");
            $("#error_msg").html("<strong>" + data.error + "</strong>");
            setTimeout(function(){
                $("#error").fadeOut("slow");
            }, 10000);
        } else {
            setup_karel_pickers(data);
        }
    };

    var karel_assignations = {};

    var setup_karel_pickers = function(data) {
        if(data.game_id != game_id) {
            return;
        }
        if(data.nickname == nickname) {
            return;
        }
        if(data.nickname in karel_assignations) {
            $("#" + karel_assignations[data.nickname]).parent().removeClass("disabled");
        }
        karel_assignations[data.nickname] = data.handle;
        $("#" + karel_assignations[data.nickname]).parent().addClass("disabled");
    }

});