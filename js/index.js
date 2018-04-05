$.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",
    function(){
        var data=remote_ip_info;
        var city=data.city;
        getWeather(city);

    })
    function getWeather(city) {
    $.ajax({
        url: "http://api.jisuapi.com/weather/query?appkey=d4053563ad102cfa&city="+city,
        dataType: "jsonp",
        success: function (r) {
            $(".now_city_name").html(city);
            $(".now_temp span").html(r.result.temp);
            $(".now_weather span").html(r.result.weather);
            $(".now_now_wind_dire").html(r.result.winddirect);
            $(".now_wind_level").html(r.result.windpower);
            $(".now_air h2").html(r.result.aqi.quality);
            // $(".notice").html(r.index.detail);
            let data1 = r.result.daily;
            let data2 = r.result.hourly;
            let data3 = r.result.index;
            let weeks = "";
            let hours = "";
            let futures = "";
            $.each(data1, function (index, val) {
                if (index === 0) {
                    futures += `
                    <div class="future_box today">
                        <div class="future_top">
                            <span class="future_date">今天</span>
                            <p><span class="today_hightemp">${val.day.temphigh}</span>/<span class="today_lowtemp">${val.night.templow}</span>°C</p>
                        </div>
                        <div class="future_top">
                            <span class="today_weather">${val.day.weather}</span>
                            <div class="today_img">
                                <img src="weathercn02/${val.day.img}.png" alt="">
                            </div>
                        </div>
                    </div>`;

                }
                else if(index===1){
                    futures += `
                    <div class="future_box today">
                        <div class="future_top">
                            <span class="future_date">明天</span>
                            <p><span class="tomorrow_hightemp">${val.day.temphigh}</span>/<span class="today_lowtemp">${val.night.templow}</span>°C</p>
                        </div>
                        <div class="future_top">
                            <span class="tomorrow_weather">${val.day.weather}</span>
                            <div class="tomorrow_img">
                                <img src="weathercn02/${val.day.img}.png" alt="">
                            </div>
                        </div>
                    </div>`;
                }
                weeks+=`<li>
                <h1 class="week_date">${val.date.toString().slice(5)}</h1>
                <h2 class="week_weather">${val.day.weather}</h2>
                <div class="week_img">
                    <img src="weathercn02/${val.day.img}.png" alt="">
                </div>
                <h3 class="week_hightemp">${val.day.temphigh}℃</h3>
                <h3 class="week_lowtemp">${val.night.templow}℃</h3>
                <h3 class="week_wind_dire">${val.day.winddirect}</h3>
                <h3 class="week_wind_level">${val.day.windpower}</h3>
                 </li>`;

            });
            $("#week").html(weeks);
            $("#future").html(futures);
            $.each(data2,function(index,val){
                hours+=`<li>
                    <h1 class="hours_time">${val.time}</h1>
                    <div class="hours_img">
                        <img src="weathercn02/${val.img}.png" alt=""> 
                    </div>
                        <h2 class="hours_temp"><span>${val.temp}</span>°</h2>
                    </li>`;
                });
            $("#hours").html(hours);
            $.each(data3,function(index,val){
                if(index===1){
                    $(".notice").html(val.detail);
                }
            });
        }

        })


}

$(".address_icon").click(function(){
    $("#citys").show();
    var data=[]; //存放所有数据
    var province=[]; //存放所有省的数据
    var city=[]; //存放某个省的所有市
    $.ajax({
        url:"http://api.jisuapi.com/weather/city?appkey=d4053563ad102cfa",
        dataType:"jsonp",
        success:function(r){
            data=r.result;
            province=$.grep(data,function(val,index){
                if(val.parentid==="0"){
                    return true;
                }
            });
            let str="";
            $.each(province,function(index,val){
                str+=`<div class="province" id="${val.cityid}">${val.city}</div>`
            });
            $("#citys").html(str);
        }
    });
    $("#citys").on("click",".province",function () {
        var id=$(this).attr("id");
        city=$.grep(data,function(val,index){
            if(val.parentid===id){
                return true;
            }
        });
        let str="";
        $.each(city,function(index,val){
            str+=`<div class="city">${val.city}</div>`
        });
        $("#citys").html(str);
    });
    $("#citys").on("click",".city",function(){
        $("#citys").hide();
        getWeather($(this).html())
    })
})

