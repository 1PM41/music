/**
 * Created by Administrator on 2017/6/29.
 */


$(function() {
    var list = $("ul li");
    var screenHeight = $(window).height();
    var ulHeight = $("ul").outerHeight();
    $("ul").css({'top':(screenHeight-ulHeight)/4});

    //抖动
    for (i=0;i< list.length;i++) {
        shake(i);
    }
    function shake(i) {
        setTimeout(function () {
            $("ul li").eq(i).addClass('text-shake');
        },i*500);
    }


    //出现动画
    list.each(function() {
        var idx = $(this).index('ul li');
        $(this).animate({marginLeft:120-idx*50+'px',marginBottom: '50px'},'slow').find('a').css("color","#ffffff");
    });


    //鼠标指向时动画
    list.on('mouseover',function () {
        $(this).addClass('text-shake').stop().animate({paddingLeft:'60px'},'slow');
    });
    list.on('mouseout',function () {
        $(this).stop().animate({paddingLeft:"0px"},"slow");
    });
});

