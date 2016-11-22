jwerty.key('alt+T', function () {
        if ($('ul#kmenu li.active').attr("id") === $('ul#kmenu li').last().attr("id")){
        var tab_frist = $('ul#kmenu li').first().attr('id').substring(0,$('ul#kmenu li').first().attr('id').lastIndexOf("_"));
        var tab_last = $('ul#kmenu li').last().attr('id').substring(0,$('ul#kmenu li').last().attr('id').lastIndexOf("_"));
        $('ul#kmenu li').first().addClass('active');
        $('ul#kmenu li').last().removeClass('active');
        $('#'+tab_frist+'').first().addClass('active');
        $('#'+tab_last+'').last().removeClass('active');
        }
        else{
        var tab_next = $('ul#kmenu li.active').next().attr('id').substring(0,$('ul#kmenu li.active').next().attr('id').lastIndexOf("_"));
        var tab_act = $('ul#kmenu li.active').attr('id').substring(0,$('ul#kmenu li.active').attr('id').lastIndexOf("_"));
        $('ul#kmenu li.active').next().addClass('active');
        $('#'+tab_next+'').addClass('active');
        $('ul#kmenu li.active').prev().removeClass('active');
        $('#'+tab_act+'').removeClass('active');
        }

});
jwerty.key('alt+shift+T', function () {
        if ($('ul#kmenu li.active').attr("id") === $('ul#kmenu li').first().attr("id")){
              var tab_last = $('ul#kmenu li').first().attr('id').substring(0,$('ul#kmenu li').first().attr('id').lastIndexOf("_"));
               var tab_first = $('ul#kmenu li').last().attr('id').substring(0,$('ul#kmenu li').last().attr('id').lastIndexOf("_"));
               $('ul#kmenu li').last().addClass('active');
               $('ul#kmenu li').first().removeClass('active');
               $('#'+tab_first+'').first().addClass('active');
               $('#'+tab_last+'').last().removeClass('active');
        }
        else{
              var tab_prev = $('ul#kmenu li.active').prev().attr('id').substring(0,$('ul#kmenu li.active').prev().attr('id').lastIndexOf("_"));
              $('ul#kmenu li.active').prev().addClass('active');
              $('#'+tab_prev+'').addClass('active');
              var tab_next = $('ul#kmenu li.active').next().attr('id').substring(0,$('ul#kmenu li.active').next().attr('id').lastIndexOf("_"));
              $('ul#kmenu li.active').next().removeClass('active');
              $('#'+tab_next+'').removeClass('active');
              }
});