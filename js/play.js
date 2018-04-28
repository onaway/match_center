$(function () {
    var $wrapper = $(".wrapper");
    var getvideoUrl = 'http://120.132.14.186:9002/index.php/Home/index/getvideo';

    function getRequest() {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var id= getRequest().id;
    var type = getRequest().type;
    var num = 0;

    //mescroll
    var meScroll = new MeScroll("mescroll", {           //第一个参数"mescroll"对应上面布局结构div的id
        down:{
            use: false,                  //是否启用下拉刷新
            auto: false                  //是否在初始化完毕之后自动执行下拉回调callback; 默认true
        },
        
        up: {
            auto: true,                        //是否初始化上拉加载，默认true
            callback: getListData,            //上拉加载回调,简写callback:function(page){upCallback(page);}
            isBounce: false,                //此处禁止ios回弹,解析
            noMoreSize: 1,          //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            offset: 100,            //离底部的距离
            empty: {
                warpId:null,                 //父布局的id; 如果此项有值,将不使用clearEmptyId的值;
                icon: "",                    //图标,默认null
                tip: "暂无数据",              //提示
                btntext: "去逛逛 >",          //按钮,默认""
                btnClick: function(){}        //点击按钮的回调,默认null
            },
            page: {
                num: 0,             //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                size: 12,            //每页数据条数
                time: null          //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
            },
            clearEmptyId: "data-list",           //相当于同时设置了clearId和empty.warpId; 简化写法,默认null;
            hardwareClass: "mescroll-hardware",     //硬件加速样式,动画更流畅
            htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip"> 加载中..</p>', //上拉加载中的布局
            htmlNodata: '<p class="upwarp-nodata" style="display:none;">没有更多的视频了</p>',    //无数据的布局
        }
    });   

    function getListData(page){

        getListDataFromNet(page.num,page.size, function(curPageData){
            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            var totalSize = curPageData[12];
            
            // var totalPage = Math.ceil(curPageData[5]/5);
            meScroll.endByPage(curPageData.length-1, totalSize); //必传参数(当前页的数据个数, 总数据量)
            
            //设置列表数据
            setListData(curPageData);
        },function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            meScroll.endErr();
        })  
    }

    /*设置列表数据*/
    function setListData(data){
        var result = '';
        var $list = $("#data-list");
        
        var dayArr = [],
            hourArr = [];
        for( var k=0; k< data.length-1; k++ ){
            var time = data[k].time;
                tempArr = time.split(' '),
                dayArray = tempArr[0].split('-'),
                day = dayArray[1] + '/' + dayArray[2];
            dayArr.push(day);
            
            var hourArray = tempArr[1].split(':'),
                hour = hourArray[0] + ':' + hourArray[1];
            hourArr.push(hour);
        }

        var length = data.length-1;
        if( length > 0){
            var str_t = '',
                src_t = '',
                des_t = '',
                day_t = '',
                hour_t = '',
                look_t = '';

            var str_b = '',
                src_b = '',
                des_b = '',
                day_b = '',
                hour_b = '',
                look_b = '';
            for( var i=0; i<length; i++ ){
                if( i==0 ){
                    str_t = '上拉加载视频';
                    src_t = '';
                    des_t = '';
                    day_t = '';
                    hour_t = '';
                    look_t = '';
                }else{
                    str_t = '';
                    src_t = 'http://120.132.14.186:9002'+data[i-1].img+'';
                    des_t = data[i-1].desc;
                    day_t = dayArr[i-1];
                    hour_t = hourArr[i-1];
                    look_t = data[i-1].look+'人看过';
                }

                if( i == length -1 ){
                    // str_b = '上拉加载视频';
                    src_b = '';
                    des_b = '';
                    day_b = '';
                    hour_b = '';
                    look_b = '';
                }else{
                    str_b = '';
                    src_b = 'http://120.132.14.186:9002'+data[i+1].img+'';
                    des_b = data[i+1].desc;
                    day_b = dayArr[i+1];
                    hour_b = hourArr[i+1];
                    look_b = data[i+1].look+'人看过';
                }
                if( length < 12 ){
                    if( i == length -1 ){
                        str_b = '没有更多视频了';
                    }
                }else if( length == 12 ){
                    if( i == length -1 ){
                        str_b = '上拉加载视频';
                    }
                }

                result += '<div class="swiper-slide">\
                    <div class="top-box">\
                        <div class="top"><img src="'+src_t+'" alt="" width="100%" height="100%"><span>'+str_t+'</span></div>\
                        <div class="dec">\
                            <p>'+des_t+'</p>\
                            <div class="time"><span>'+day_t+'</span><span>'+hour_t+'</span><span><em>'+look_t+'</em></span></div>\
                        </div>\
                    </div>\
                    <div class="middle-box">\
                        <div class="player">\
                            <video poster="http://120.132.14.186:9002'+data[i].img+'" controls>\
                                <source src="'+data[i].url+'" type="video/mp4">\
                            </video>\
                        </div>\
                        <div class="dec">\
                            <p>'+data[i].desc+'</p>\
                            <div class="time"><span>'+dayArr[i]+'</span><span>'+hourArr[i]+'</span><span><em>'+data[i].look+'</em>人看过</span></div>\
                        </div>\
                    </div>\
                    <div class="bottom-box">\
                        <div class="bottom"><img src="'+src_b+'" alt="" width="100%" height="100%"><span>'+str_b+'</span></div>\
                        <div class="dec">\
                            <p>'+des_b+'</p>\
                            <div class="time"><span>'+day_b+'</span><span>'+hour_b+'</span><span><em>'+look_b+'</em></span></div>\
                        </div>\
                    </div>\
                </div>';
            }
            $list.append(result);
            init();
        }
    }

    function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        //延时一秒,模拟联网
        setTimeout(function () {
            $.ajax({
                type: 'POST',
                url:getvideoUrl,
                dataType: 'json',
                data:{type:type,id:id,num:pageNum},
                success: function(data){
                    
                    //回调
                    successCallback(data);
                },
                error: errorCallback
            });
        },300)
    }

    
})

function init() {
    if(navigator.userAgent.indexOf('UCBrowser') > -1) {
        console.log('uc浏览器');
    }else{
        plyr.setup({
            controls:["play-large","play", "current-time", "duration","progress","click","fullscreen"]
        });
    }

    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
    });

    var videos = document.getElementsByTagName('video');
    // var $playIcon = $('.play-icon');

    var pHeight = $(window).height();
    var range = pHeight / 2;
    var currentPlay = null;//正在放的

    //按钮点击播放    
    /*for (var k = 0, leng = videos.length; k < leng; k++) {
        $playIcon.eq(k).click(function(){
            
            $(this).hide();
            $(this).siblings().trigger('play');

            $(this).parent().parent().parent().siblings().children('.middle-box').children('.video').children('video').trigger('pause');
            $(this).parent().parent().parent().siblings().children('.middle-box').children('.video').children('.play-icon').show();
        })
    }*/

    setInterval(function () {
        changeCurrentVideo(videos);
    }, 500);
    
    function changeCurrentVideo(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var curretVideo = arr[i];
            var cvTop = curretVideo.getBoundingClientRect().top;
            $(window).resize(function(){
                cvTop = curretVideo.getBoundingClientRect().top;
            })
            if (cvTop < range && cvTop > -50) {
                if (curretVideo === currentPlay) {
                    // console.log('同一个');
                } else {
                    // 关掉上次的
                    $(currentPlay).trigger('pause');

                    //播放curretVideo
                    $(curretVideo).trigger('play');
                    //存历史
                    currentPlay = curretVideo;
                }
                break;
            }
        }
    }
}

