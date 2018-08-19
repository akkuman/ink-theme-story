//时间戳转时间
$('time').each(function() {
    var T = new Date(parseInt($(this).attr('datetime'))*1000);
    //timetextlist=[Sun, Mar, 01, 2015]
    var timetextlist = T.toDateString().split(' ');
    var timetext = timetextlist[1] + ' ' + timetextlist[2] + ', ' + timetextlist[3];
    $(this).html(timetext);
});

