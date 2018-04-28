//赛程和赛事奖励的切换
$(function(){
    var $top = $('.top-nav'),
        $topLi = $top.find('ul li'),
        $match = $('.match'),
        $main = $match.find('.main'),
        $schedule = $match.find('.schedule'),
        $reward = $match.find('.reward');

    $topLi.eq(0).addClass('on');
    $main.eq(0).show();
    $topLi.on('touchstart',function(){
        var index = $(this).index();
        $topLi.eq(index).addClass('on').siblings().removeClass('on');
        $main.eq(index).show().siblings().hide();
    })
});

//预选赛，决赛的切换
$(function(){
    /*   swiper 选项卡函数 参数说明
    *       obj  必选，导航列表
    *       swiperObj: 必选，HTML元素或者string类型，Swiper容器的css选择器
    *       className: 必选，当前样式的类名
    *       effect：可选，切换效果，默认为"slide"，可设置为"fade，cube，coverflow，flip"。
    * */
    function tabs(obj,swiperObj,className) {
        var tabSwiper = new Swiper(swiperObj, {
            effect : 'slide',
            speed : 500, 
            // autoHeight: true, 
            onSlideChangeStart : function() {
                $(obj+"."+className).removeClass(className);            //有当前类名的删除类名,给下一个添加当前类名
                $(obj).eq(tabSwiper.activeIndex).addClass(className);   //activeIndex是过渡后的slide索引
            },
        });

        $(".swiper-wrapper").css("height","100%");
        // 模拟点击事件，如果是移入事件，将mousedown 改为 mouseenter
        $(obj).on('touchstart mousedown', function(e) {
            e.preventDefault();                    
            $(obj+"."+className).removeClass(className);
            $(this).addClass(className);            //点击当前导航 改变当前样式
            tabSwiper.slideTo($(this).index());     //滑动到对应的滑块
        });
        $(obj).click(function(e) {
            e.preventDefault();                     //清除默认点击事件
        });
    }

    // /*swiper选项卡切换*/
    
    //swiperTab 是你导航的className,active是你当前状态的className
    $('.tab > p').eq(0).addClass('active');
    tabs('.tab > p','.swiper-container','active');
});

//赛程数据的获取
$(function(){
    var $preliminariyUl = $('.preliminaries .competition-list .c-l-nav');
    var $finalyUl = $('.finals .competition-list .c-l-nav');
    var getmatchUrl = "http://120.132.14.186:9002/index.php/Home/index/getmatch";
    $.ajax({
        type:"get",
        url:getmatchUrl,
        dataType:'json',
        success:function(data){
            // 数据处理，获取月日，时分的数组集合
            var beforeGameDayArr = [],          //比赛开始之 前 月日的数组集合
                afterGameDayArr = [],           //比赛开始之 后 月日的数组集合
                beforeGameHourArr = [],         //比赛开始之 前 时分的数组集合
                afterGameHourArr = [],          //比赛开始之 后 时分的数组集合
                beforeArr = [],                 //比赛开始时间的数组集合
                afterArr = [];                  //比赛结束时间的数组集合
            $.each(data,function(i,value){
                var time = value.time,
                    temp = time.split(' '),
                    tempArr1 = temp[0].split('/'),
                    tempArr2 = temp[3].split('/'),
                    day1 = tempArr1[0] + "/" + tempArr1[1],
                    day2 = tempArr2[0] + "/" + tempArr2[1];
                beforeGameDayArr.push(day1);
                afterGameDayArr.push(day2);
                beforeGameHourArr.push(temp[1]);
                afterGameHourArr.push(temp[4]);

                var matchTime = time.split('-');
                beforeArr.push(matchTime[0]);
                afterArr.push(matchTime[1]);
            });

            //获取当前时间
            var currentdate;
            function getCurrentTime() {
                var date = new Date();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                currentdate =  month + "/" + strDate + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
            } 
            getCurrentTime();

            var currentTime = new Date(currentdate);
            var length = data.length;
            for( var i=0; i<length; i++ ){
                var gameStartTime = new Date(beforeArr[i]),
                    gameEndTime = new Date(afterArr[i]),
                    str1 = '';
                if( currentTime < gameStartTime ){
                    str1 = '即将开始';
                }else if(currentTime > gameEndTime){
                    str1 = '已结束';
                }
                
                var $li = $('<li>\
                    <div class="c-left">\
                        <span>'+beforeGameDayArr[i]+'</span>\
                        <h2>'+beforeGameHourArr[i]+'</h2>\
                    </div>\
                    <div class="c-right">\
                        <ul class="c-r-nav">\
                            <li>'+data[i].team1+'</li>\
                            <li> <span>'+data[i].score1+'</span> : <span>'+data[i].score2+'</span> </li>\
                            <li>'+data[i].team2+'</li>\
                            <li><span>'+str1+'</span></li>\
                        </ul>\
                    </div>\
                </li>');
                if( data[i].flag === '预选赛' ){
                    $preliminariyUl.append($li);
                }else if( data[i].flag === '决赛' ){
                    $finalyUl.append($li);
                }
            }
        }
    })
});

//积分排行榜
$(function(){
    var $score = $('.score'),
        $rankingList = $score.find('.ranking-list'),
        $ul = $rankingList.find('ul'),
        getranklistUrl = 'http://120.132.14.186:9002/index.php/Home/index/getranklist';
    var arr = ['first','second','third'];
    $.ajax({
        type:'get',
        url:getranklistUrl,
        dataType:'json',
        crossDomain: true == !(document.all),
        success:function(data){
            if( data ){
                data.forEach(function(value,i){
                    $ul.append('<li>\
                        <span>'+data[i].id+'</span>\
                        <span><em class="'+arr[i]+'">'+data[i].username+'</em></span>\
                        <span>'+data[i].server+'</span>\
                        <span>'+data[i].score+'</span>\
                        <img src="img/head/'+data[i].hero+'" alt="武将">\
                    </li>');
                })
            }
        }
    });
})

//返回顶部
$(function(){
    var $toTop = $(".to-top");
    $(window).on('touchmove',function(e){
        var top = $(document).scrollTop();
        if( top>20 ){
            $toTop.fadeIn();
        }else{
            $toTop.fadeOut();
        }
    });
    $toTop.on('touchend',function () {
        $("body,html").animate({
            scrollTop : 0
        },300);
        $(this).delay(300).fadeOut();
    });
});