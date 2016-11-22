$(function(){
    $('.wizard-steps').slimScrollHorizontal({
    height: '100%',
    width: '100%',
    alwaysVisible: false,
    start: 'left',
    position: 'bottom',
    wheelStep: 10
    }).css({ paddingBottom: '10px' });
});

String.prototype.interpolate = function(o) {
  return this.replace(/%{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

function formatLink(s){
	var index = s.indexOf("href");
	var result = ""; var comes = 0;
	for (var i = index; i <= s.length; i++){
		if (s[i] == '"' || s[i] == "'"){
			if (comes == 0){
				comes = 1;
			}else{
				break
			}
		}else{
			if (comes == 1){
				result += s[i];
			}
		}
	}
	return result;
}

$(document).ready(function() {
  $('[data-rel=popover]').popover({trigger: 'hover'});
  $('[data-rel="clickover"]').clickover();
});


(function($){
  $(document).ready(function() {

    // Mark notifications as read
    $('.modal-dialog').on("click", ".accept-notification", function(event){
      var read_notification = $(event.target);
      if(read_notification.data('notification-id')){
        $.post('/notifications/mark_as_read/'+ read_notification.data('notification-id'))
      }
    })

    // Show notifications on click on the top right list
    $('.top-notification').click(function(event) {
      var notification = $(event.target).closest('.top-notification');
      var id = notification.data('notification-id');
      $("#modal_notification_" + id).modal("show")
    });

    $(window).resize(resizeLastWindowModal);

    $('#skip_btn').click(skip_project)
  })
})($)

function process_project_result(data) {
    if (typeof data == "string"){
        data = $.parseJSON(data);
    }

    $('#btn-return').remove();
    $("#save_btn").removeClass('active');
    clean_any_added_row($('#points-and-such-table'))

    if (data["result"] == "ok") {
      var html_result = "<tr><td width='50%' align='center' valign='middle'><h4 class='good-job'><i class='icon-ok'></i> " + data["missatge"] +
              "</h4></td>" + (data["npc"] ? "<td><img src='" + data["npc"] + "' style='max-height: 200px; max-width: 500px;'</td>" : "") + "</tr>";

      var points_color = parseInt(data["points"]) >= 0 ? 'green' : 'red'
      $('#powerups-table').find('tr[data-pc-attr=points] .pc-attribute-value').text(data["points"]).css('color', points_color)
      $('#powerups-table').find('tr[data-pc-attr=base_points] .pc-attribute-value').text(data["base_points"])
      $('#powerups-table').find('tr[data-pc-attr=streak_points] .pc-attribute-value').text(data["streak_points"])
      $('#powerups-table').find('tr[data-pc-attr=streak_days] .pc-attribute-value').text(data["streak"])

      var weekly_streak
      if (data['days_weekly_streak'] > 0) {
        weekly_streak = t('no_word') + "  " + t('project.weekly_streak_remaining', {num: data["days_weekly_streak"]})
      } else {
        weekly_streak = '<span style="font-weight:bold">' + t('yes_word') + '<span>';
      }
      $('#powerups-table').find('tr[data-pc-attr=weekly_streak] .pc-attribute-value').html(weekly_streak);

      if(data['level']) {
        $('#points-and-such-table').append('<tr><td style="font-weight: bold">'+t('project.new_level')+'</td><td><span class="old-level">'+(parseInt(data['level'])-1) + '</span> &#8594; <span class="new-level">'+data['level']+'</span></td></tr>')
      }

      if (data["achs"]) {
        $.each(data["achs"], function(key, value) {
          $('#points-and-such-table').append('<tr><td colspan=2>'+value+'</td></tr>')
        })
      }

      if (data["powerups"]) {
        var odd = false;
        var first = true;
        $.each(data['powerups'], function(key, value) {
          if (value && value !== 0) {
            var int_value = parseInt(value)
            var css_class = int_value > 0 ? 'pc-attribute-value-positive' : 'pc-attribute-value-negative'
            var signed_value = int_value > 0 ? '+' + int_value : int_value
            var bgcolor = odd ? '#f9f9f9' : '';
            var border_left = first ? '' : '1px solid #ddd';
            $('#powerups-table').find('[data-pc-attr='+key+']').show().css('background-color', bgcolor).css('border-left', border_left)
                    .find('.pc-attribute-value').text(signed_value).addClass(css_class);
            odd = !odd;
            first = false;
          }
        });
        $('#powerups-table-attributes').show()
      }

      $('#powerups-table').show()

      $('#table-result').html(html_result);

      $('#btn-repeat').remove();
      if (!$('#btn-next-link').length) {
        var html_next = "<a href='" + formatLink(data["link"]) + "' class='btn has-spinner' id='btn-next-link'><span class='spinner'><i class='icon-spin icon-refresh'></i></span>" + t('project.next') + "</a>";
        $('#myModal .modal-footer').html($('#myModal .modal-footer').html() + html_next);
      }
      $("#valoration").show()

    } else if (data["result"] == "error") {
        alert(data["missatge"]);

    } else {
        $('#btn-next-link').remove();
        var html_result = "<tr><td><h4>" + data["missatge"] + (data["error_msg"] !== '' ? "\n<pre>" + data["error_msg"] + "</pre>" : "") +  "</h4></td></tr>"
        $('#table-result').html(html_result);
        if (!$('#btn-repeat').length) {
          var html_repeat = "<button type='button' class='btn btn-default' id='btn-repeat' onclick='window.location.reload();'>" + t('project.try_again') + "</button>";
          $('#myModal .modal-footer').html($('#myModal .modal-footer').html() + html_repeat);
        }
        $("#valoration").hide()
    }

    fit_modal_body($('#myModal'));
    $('#myModal').modal('show');
}

function clean_any_added_row(table) {
  table.find('tr:not([data-pc-attr])').remove()
}

function default_process_project_error_handler(){
    $('#btn-next-link').remove();
    $('#btn-return').remove();
    var html_result = "<tr><td><h4>" + t("project.send_error") + "</h4></td></tr>"
    $('#table-result').html(html_result);
    if (!$('#btn-repeat').length){
        var html_repeat = "<button id='btn-return' type='button' class='btn btn-default' data-dismiss='modal'>" + t("project.back") + "</button>";
        $('#myModal .modal-footer').html($('#myModal .modal-footer').html() + html_repeat);
    }
    $("#valoration").hide();
    $('#myModal').modal('show');
    $("#save_btn").removeClass('active');
}

fit_modal_body = function (modal) {
    var body, bodypaddings, header, headerheight, height, modalheight;
    header = $(".modal-header", modal);
    body = $(".modal-body", modal);
    modalheight = parseInt(modal.css("height"));
    headerheight = parseInt(header.css("height")) + parseInt(header.css("padding-top")) + parseInt(header.css("padding-bottom"));
    bodypaddings = parseInt(body.css("padding-top")) + parseInt(body.css("padding-bottom"));
    height = modalheight - headerheight - bodypaddings - 5;
    return body.css("max-height", "" + height + "px");
};

resizeLastWindowModal = function () {
    return fit_modal_body($(".modal"));
};

function skip_project(event) {
    event.preventDefault();
    bootbox.confirm(t('project.sure_skip'), t('cancel'), t('send'), function(result) {
        if (result) {
            $.post('/projects/skip/'+ card_id, process_project_result).fail(default_process_project_error_handler)
        }
    })

}