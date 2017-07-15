/**
 * Created by Administrator on 2017/6/17.
 */

$(function(){


    $('nav').mouseover(function () {
            $(this).removeClass('m-nav-bg');
            $('#bs-example-navbar-collapse-1 ul').removeClass('hidden');
        }
    );
    $('nav').mouseout(function () {
            $(this).addClass('m-nav-bg');
            $('#bs-example-navbar-collapse-1 ul').addClass('hidden');
        }
    );

    var $registerBox = $('#registerBox');
    var $loginBox = $('#loginBox');

    $('#sign').on('click',function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name="username"]').val(),
                password:$registerBox.find('[name="password"]').val(),
                repassword:$registerBox.find('[name="repassword"]').val(),
            },
            dataType:'json',
            success:function (result) {
                console.log(result);
                $('#signMsg').html(result.message);
                if (!result.code){
                    setTimeout(function () {
                        window.location.reload();
                    },2000);
                }
            }
        });

    });

    $('#loginBtn').on('click',function () {
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name="username"]').val(),
                password:$loginBox.find('[name="password"]').val()

            },
            dataType:'json',
            success:function (result) {
                console.log(result);
                $('#loginMsg').removeClass('hidden').html(result.message);
                if (!result.code){
                    window.location.reload();
                }
            }
        });

    });

    //退出
    $('#logout').on('click',function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload();
                }

            }
        })

    });
    //歌曲列表鼠标移动特效
    var thumbnails = $('#list .thumbnail');
    thumbnails.on('mouseover',function () {
        idx = ($(this).index('#list .thumbnail'));
        thumbnails .eq(idx).addClass('list-shadow');

        thumbnails .not(thumbnails .eq(idx)).removeClass('list-shadow');
    });
    thumbnails .on('mouseout',function () {
        thumbnails .removeClass('list-shadow');
    });

    //歌词伸缩
    var moreBtn = $('#more');
    var lyrics = $('#lyrics');
    var data = 0 ;
    moreBtn.on('click',function () {
        if (data == 0 ){
            lyrics.css({"height":"300px","overflow":"auto"});
            moreBtn.html('CLICK <span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>');
            data = 1;
        }
        else {

            lyrics.css({"height":"110px","overflow":"hidden"});
            moreBtn.html('CLICK <span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>');
            data = 0;
        }
    });

    //点赞
    var likeBtn = $('#list .label');
    likeBtn.on('click', function () {
        idx=$(this).index('#list .label');

        likeVal = likeBtn.eq(idx).next().val();

        contentVal = likeBtn.eq(idx).prev().val();

        $.ajax({
            url: '/like',
            data: {
                like: likeVal,
                contentid: contentVal
            },
            success: function (likes) {
                likeBtn.eq(idx).html('<span class="glyphicon glyphicon-thumbs-up padded-5"></span>'+likes);
            }
        })
    });

    //排行榜
    var rankList = $('#ranking li');
    rankList.on('mouseover', function () {
        idx = $(this).index('#ranking li');
        $(this).addClass('rankList-bg');
        setTimeout(function () {
            rankList.eq(idx).children().removeClass('hidden');
            rankList.not(rankList.eq(idx)).addClass('hidden');
            rankList.eq(idx).next().removeClass('hidden');
            rankList.eq(idx).prev().removeClass('hidden');
            rankList.eq(idx).find('.glyphicon').removeClass('glyphicon-chevron-right');
            rankList.eq(idx).find('.glyphicon').addClass('glyphicon-chevron-down');
        },1200);
    });
    rankList.on('mouseout', function () {
        $(this).removeClass('rankList-bg');
        setTimeout(function () {
            rankList.children('div').addClass('hidden');
            rankList.removeClass('hidden');
            rankList.find('.glyphicon').addClass('glyphicon-chevron-right');
            rankList.find('.glyphicon').removeClass('glyphicon-chevron-down');
        },1200);
    });

    //分类列表特效
    var cateList = $('#cateList');
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    };
    var cateUrlParam = getUrlParam('category');
    cateList.find('li input').each(function () {
        if ($(this).val() == ''){
            cateList.find('li').eq(0).addClass('cate-bg');
        }else if($(this).val() == cateUrlParam){
            cateList.find('li').eq(0).removeClass('cate-bg');
            $(this).parent().addClass('cate-bg');
        }else {
            $(this).parent().removeClass('cate-bg');
        }
    });



    //排序
    var selectList = $('#selectList option');
    selectList.on('click',function () {
        window.location.href="/main?sort=likes";
        idx = $(this).index('#selectList option');
        selectList.eq(idx).attr('selected','selected');
        selectList.not(selectList.eq(idx)).removeAttr('selected');

    });


});
