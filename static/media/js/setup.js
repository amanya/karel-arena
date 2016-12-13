$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/setup');
    var nickname = null;
    $("#nickname-form input[type=submit]").click(function(e){
        e.preventDefault();
        nickname = $("#nickname").val();
        if(nickname) {
            socket.emit('choose_nickname', {game_id: game_id, nickname: nickname});
            $("#handle-form input[name=nickname]").val(nickname);
            $("#greeter").text(nickname);
            $("#choose-nickname").addClass("hidden");
            $("#choose-karel").removeClass("hidden");
        }
    });
    $("#handle-form input[type=submit]").click(function(e){
        var handle = $("input[name=handle_radio]:checked").attr("id");
        $("#handle-form input[name=handle]").val(handle);
    });
    $("input[name=handle_radio]").change(function(e){
        var handle = $("input[name=handle_radio]:checked").attr("id");
        socket.emit('pick_karel', {game_id: game_id, nickname: nickname, handle: handle});
    });

    socket.on('pick_karel', function(nickname, handle){
        setup_karel_pickers(nickname, handle);
    });

    socket.on('error', function(error_msg){
        $("#error").fadeIn("slow");
        $("#error_msg").html("<strong>" + error_msg + "</strong>");
        setTimeout(function(){
            $("#error").fadeOut("slow");
        }, 10000);
    });

    var karel_assignations = {};

    var setup_karel_pickers = function(the_nickname, handle) {
        if(the_nickname == nickname) {
            return;
        }
        if(the_nickname in karel_assignations) {
            $("#" + karel_assignations[the_nickname]).parent().removeClass("disabled");
        }
        karel_assignations[the_nickname] = handle;
        $("#" + karel_assignations[the_nickname]).parent().addClass("disabled");
    }

});