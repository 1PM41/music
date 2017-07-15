/**
 * Created by Administrator on 2017/6/29.
 */


$(function() {
    var a = $('#article-nav a');
    var nav = $('#article-nav h4');
    var content = $('#article-content h1');
    var contentData = content.data('title');
    nav.each(function() {
        var navData = $(this).data('title');
        if (navData == contentData) {
            $(this).append('<span class="glyphicon glyphicon-play float-right text-shake"></span>');
        }
    });
    a.on('mouseover',function () {
        idx = $(this).index('#article-nav a');
        a.eq(idx).find('h1').addClass('text-shake');
        a.eq(idx).find('h4').addClass('text-shake');
    });
    a.on('mouseout',function () {
        $(this).children().removeClass('text-shake');
    })
});
