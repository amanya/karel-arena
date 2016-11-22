$.fn.pressEnter = function(fn) {
  return this.each(function() {
    $(this).bind('enterPress', fn);
    $(this).keyup(function(e){
      if(e.keyCode == 13) {
        $(this).trigger("enterPress");
      }
    })
  });
};

function search_center_by_zipcode() {
  var el = $("#student_zipcode");
  var zipcode = el.val();
  if (zipcode.length != 5) {
    $("#center-found").hide();
    $("#center-not-found").hide();
    return;
  }
  var info = el.data("zipcodes-info");
  if (!info) return;
  var center_id = info.center_ids_by_zipcode[zipcode];

  if (zipcode) {
    if (center_id) {
      var center_info = info.center_info_by_center_ids[center_id];
      $("#center-found").show();
      $("#center-not-found").hide();
      $("#wizard-next").show();
      var link = $("<a>").attr("href", center_info.public_url).text(center_info.name);
      $("#center-info").html(link);
    } else {
      $("#center-not-found").show();
      $("#center-found").hide();
      $("#wizard-next").show();
    }
  }
}

function form_init_ajax(init) {
  $("form.new_student, form.edit_student").bind("ajax:success", function(event, data, status, xhr) {
    if (status == "success") {
      $("#enroll-container").html(data);
      init();
    }
  });

  $("form#trial_opinion").bind("ajax:success", function(event, data, status, xhr) {
    if (status == "success") {
      $("#trial_opinion").slideUp();
      $("#trial_opinion_given").slideDown();
      $("#trial_opinion_done").slideDown();
    }
  });
}

function init_previous_button() {
  $("button.previous").on("click", function() {
    var el = $(this);
    var form = el.parents("form");
    form.attr("action", form.data("previous-url"));
    return true;
  });
}

function enroll_init() {
  $("#student_zipcode").on("input", search_center_by_zipcode);
  init_previous_button();
  if ($.fn.datepicker)
    $(".datepicker").datepicker({format: "dd/mm/yyyy"});
  form_init_ajax(enroll_init);
}


$(enroll_init);
