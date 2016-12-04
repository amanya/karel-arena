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
            GameInfo.command_buffer[data.handle].push(data.command);
        }
    };

    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: "javascript"
    });
    //var original_code = editor.getValue();
    var original_code = "function main(){\n\n}";
    var play_btn = document.getElementById('execute_btn');
    play_btn.onclick = function() {
        try {
          var handle = $("#handle")[0].value;
          var text = editor.getValue();
          outbox.send(JSON.stringify({ handle: handle, text: text }));
          //ig.game.play(editor.getValue());
        }
        catch(e) {
          $("#error").fadeIn("slow");
          $("#error_msg").html("<strong>" + e.message + "</strong>");
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

	var codetosave = "";

	if ($("#start_btn").attr("visible") == "no"){
		timerExecuted = true;
	}


	$("#start_btn").click(function(){
		  //Posem com a activa la pestanya de treball
		  $('#enunciat_tab').removeClass('active');
        $('#treball_tab').addClass('active');
        $('#enunciat').removeClass('active');
        $('#treball').addClass('active');

        //Posem visibles la botonera de l'editor
        $("#button-pack").removeAttr("style");
        $("#start_btn").attr("style", "display:none");
        $("#hint_btn").attr("style", "display:true");
        editor.setOption("readOnly", false) ;

        GameInfo.maxTimeTimer = new ig.Timer(max_time);


        //Emmagatzema al projecte la data i hora d'inici del projecte
		  var form = $('#start_project')[0];
	     var fd = new FormData(form);
   	  var xhr = new XMLHttpRequest();
   	  xhr.open(form.method, form.action, true);
   	  xhr.send(fd);
		});

	if(!($("#button-pack").attr("style"))){
		if ($("#start_btn").attr("visible") == "yes"){
			$("#button-pack").attr("style", "display:none");
			editor.setOption("readOnly", "nocursor");
		}
	}

    $('#download-btn').click(function() {
        document.location.href = canvas.toDataURL()
    });

    var hints_buyed = $('#count_hints').html();
    var hints_of_card = $('#total_hints').html();


    if (hints_buyed == hints_of_card) {
       $("#hint_btn").prop("disabled", "true");

    }

    $('#hint_btn').click(function() {
        $("#hint_text").attr("style", "display:true");

        hints_buyed = $('#count_hints').html();
        var form1 = $('#buy_hint')[0];
        var fd1 = new FormData(form1);
        fd1.append("bought_hints", hints_buyed);
        fd1.append("confirm", 1);
        var xhr1 = new XMLHttpRequest();
        xhr1.open(form1.method, form1.action, true);
        xhr1.send(fd1);

        xhr1.onreadystatechange = function() {
            if (xhr1.readyState == 4 && xhr1.status == 200) {


                if (typeof xhr1.response == "string") {
                    resultat = $.parseJSON(xhr1.response);
                }
                if (resultat["result"] == 'ok') {

                    bootbox.confirm("Aquesta ajuda val  " + resultat["hint_points"] + " PUNTS.  estas segur que la vols comprar? ", function(result) {
                        if (result) {


                            hints_buyed = $('#count_hints').html();
                            var form2 = $('#buy_hint')[0];
                            var fd2 = new FormData(form2);
                            fd2.append("bought_hints", hints_buyed);
                            fd2.append("confirm", 0);
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open(form2.method, form2.action, true);
                            xhr2.send(fd2);

                            xhr2.onreadystatechange = function() {
                                if (xhr2.readyState == 4 && xhr2.status == 200) {

                                    if (typeof xhr2.response == "string") {
                                        resultat = $.parseJSON(xhr2.response);
                                    }
                                    if (resultat["result"] == 'ok') {

                                        if ($("#hint_list").length == true) {

                                            $("#hint_list").append("<li type='circle'> <p style='font-style: oblique; color:blue' >" + (resultat["hint_desc"].replace(/\n/g, "<br>")) + "</p></li>");
                                        }
                                        else {
                                            pos_list_hint.innerHTML = "<ul id='hint_list'><li type='circle'> <p style='font-style: oblique; color:blue'> " + (resultat["hint_desc"].replace(/\n/g, "<br>")) + " </p> </li></ul>";
                                        }

                                        var count_up = parseInt(($("#count_hints").html())) + 1;
                                        $("#count_hints").html(count_up);

                                        if (count_up == hints_of_card) {
                                            $("#hint_btn").prop("disabled", "true");

                                        }
                                    }
                                    else {
                                        bootbox.alert(resultat["missatge"]);
                                    }
                                }
                            }
                        }
                        else {
                            console.log("User declined dialog");
                        }

                    });
                }
                else {

                }
            }
        }
    });

});
$("#error").click(function(event){
    if (event.target.id !== "remove"){
        $('#expl_error').attr("style", "display:true");
         var msg = $('#error_msg').text();
          switch (true) {
               case /missing/.test(msg):
                  $("#expl_text").html(" Explicació: Aquest missatge indica que en el nostre codi hi falta un parèntesi o claudàtor.");
                  break;
                case /good/.test(msg):
                   var name = msg.substring(8, msg.indexOf(","));
                  $("#expl_text").html(" Explicació: Aquest missatge indica que el nom que has triat per la teva funció "+name+" no és adequat. Posa'n un altre!");
                  break;
                case /end/.test(msg):
                   var name = msg.substring(8, msg.indexOf(","));
                  $("#expl_text").html(" Explicació: Aquest missatge indica que a la funció "+name+" que has escrit li falta la paraula END.");
                break;
                case /sorry/.test(msg):
                  $("#expl_text").html(" Explicació: Aquest missatge indica que tens una funció on t'has deixat l'END i, tot seguit, has definit una nova funció.");
                break;
                case /arguments/.test(msg):
                  var matches = msg.match(/\b\d+\b/g);
                  var name = msg.substring(15, msg.indexOf(","));
                  $("#expl_text").html(" Explicació: Aquest missatge indica que no s'ha pogut fer la funció "+name+", perquè es necessitava passar "+ matches[0] +" arguments a la funció, i només n'has passat "+ matches[1]+".");
                break;
                case /understand/.test(msg):
                  var name = msg.substring((msg.lastIndexOf(":")+1),msg.lenght);
                  $("#expl_text").html(" Explicació: Aquest missatge indica que no s'enten la instrucció "+name+". Revisa que no t'hagis equivocat escribint la instrucció!");
                break;
                case /expecting/.test(msg):
                  var matches = msg.match(/\b\d+\b/g);
                  var name = msg.substring(msg.lastIndexOf(":"),msg.lastIndexOf(",") );
                  $("#expl_text").html(" Explicació: Aquest missatge indica que en el nostre codi hi falta un/a "+name+" a la línea "+matches[0]+".");
                  break;
                case /operator/.test(msg):
                  var name = msg.substring(27, msg.lenght);
                  $("#expl_text").html(" Explicació: Aquest missatge indica que hem escrit la instrucció "+name+" malament.");
                  break;
                case /statement/.test(msg):
                  $("#expl_text").html(" Explicació: Aquest missatge indica que hem escrit un repeat on ens hem deixat el nombre de vegdes a repetir.");
                break;
                default:
                  $("#expl_text").html(" Explicació: Error genèric");
              }
    }
});
function expl_close(){
        $('#expl_error').attr("style", "display:none");
   }

