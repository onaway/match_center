//获取顶部视频
$(function(){
    var $video = $('.match').find('.video');
    var getfirstUrl = "http://120.132.14.186:9002/index.php/Home/index/getfirst";
    $.ajax({
        type:"get",
        url:getfirstUrl,
        dataType:'json',
        success:function(data){
            $topVideo = $('<p><span>主播</span>'+data[0].desc+'</p>\
            <div class="playarea">\
                <video id="video" src="'+data[0].url+'" controls poster="http://120.132.14.186:9002'+data[0].img+'"></video>\
            </div>');
            $video.append($topVideo);

            //video插件
            if(navigator.userAgent.indexOf('UCBrowser') > -1) {
                console.log(1);
            }else{
                plyr.setup({
                    controls:["play-large","play", "current-time", "duration","progress","click","fullscreen"]
                });
            } 
        }
    })
})

//赛程数据的获取
$(function(){
    var $ul = $('.competition-list .c-l-nav');
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
                $ul.append($li);
            }
        }
    })
});

//资讯列表获取
$(function(){
    var $ul = $('.information .infor-list ul');
    var getconsultationUrl = 'http://120.132.14.186:9002/index.php/Home/index/getconsultation';
    var page = 0;

    //dropload
    
    $('.infor-list').dropload({
        scrollArea : window,
        loadDownFn : function(me){
            page++;
            // 拼接HTML
            var result = '';
            $.ajax({
                type: 'GET',
                url: getconsultationUrl+'?num='+page,
                dataType: 'json',
                success: function(data){
                    var dayArr = [],
                        hourArr = [];
                    for( var j=0; j<data.length; j++ ){
                        var reg = /-/;
                        var time = data[j].time;
                        var tempArr,dayArray,hourArray,day,hour;
                        if( reg.test(data[j].time) ){
                            tempArr = time.split(' ');
                            dayArray = tempArr[0].split('-');
                            day = dayArray[1] + '/' + dayArray[2];
                            dayArr.push(day);
                            hourArray = tempArr[1].split(':');
                            hour = hourArray[0] + ':' + hourArray[1];
                            hourArr.push(hour);
                        }else{
                            tempArr = time.split(' ');
                            dayArray = tempArr[0].split('/');
                            day = dayArray[0] + '/' + dayArray[1];
                            dayArr.push(day);
                            hourArr.push(tempArr[1]);
                        }
                    }
                    var length = data.length;
                    if( length > 0 ){
                        for( var i=0; i<length; i++ ){
                            if( data[i].hasOwnProperty('desc') ){
                                var str = "information.html?type=info&id="+data[i].id+"";
                                var emName1 = '',
                                    emName2 = '';
                            }else{
                                var str = "play.html?type=video&id="+data[i].id+"";
                                var emName1 = 'video-icon1',
                                    emName2 = 'video-icon2';
                            }
                            result += "<li>\
                                <a href='"+str+"'>\
                                    <div class='pic'>\
                                        <img src='http://120.132.14.186:9002"+data[i].img+"' width='100%' height='100%'>\
                                        <em class="+emName1+"></em>\
                                    </div>\
                                    <div class='dec'>\
                                        <p><em class="+emName2+"></em>"+data[i].title+"</p>\
                                        <div class='time'>\
                                            <span>"+dayArr[i]+"</span>\
                                            <span>"+hourArr[i]+"</span>\
                                            <span>"+data[i].look+"人看过</span>\
                                        </div>\
                                        <i class='hot'></i>\
                                    </div>\
                                </a>\
                            </li>";
                        }
                    }

                    // 如果没有数据
                    else{
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 为了测试，延迟1秒加载
                    setTimeout(function(){
                        // 插入数据到页面，放到最后面
                        $ul.append(result);
                        // 每次数据插入，必须重置
                        $('.hot').eq(0).show();
                        $('.hot').eq(1).show();
                        me.resetload();
                    },100);
                },
                error: function(xhr, type){
                    // alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },
        threshold : 60
    }) 
});

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

//用户变化屏幕方向时调用刷新页面
$(window).bind( 'orientationchange', function(e){
    // window.location.reload();
});


