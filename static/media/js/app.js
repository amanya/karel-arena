function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 4; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

$(document).ready(function() {
    var game_id = makeid();
    $("#game-id").attr('placeholder', game_id);
    var base_url = window.location.href;
    var base_url_to_show = base_url.replace(/^https?\:\/\//i, "");
    base_url = base_url.replace(/\/.*$/, "/");
    base_url_to_show = base_url_to_show.replace(/\/.*$/, "/");
    $("#game-url").text(base_url_to_show);
    $("#game-id").keyup(function(e){
        var text = $("#game-id").val();
        if(text.length == 4){
            $("#start-form input[type=submit]").prop('disabled', false);
        } else {
            $("#start-form input[type=submit]").prop('disabled', true);
        }
    });
    $("#start-form input[type=submit]").click(function(e){
        e.preventDefault();
        var game_id = $("#game-id").val();
        if(!game_id) {
            game_id = $("#game-id").attr('placeholder');
        }
        var url = base_url + game_id;
        window.location.replace(url);
    });
});
