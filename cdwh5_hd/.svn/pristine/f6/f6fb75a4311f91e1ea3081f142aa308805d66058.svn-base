/**
 * 
 * @authors liuhao (liuhao257@163.com) 
 * @date    2017-03-07 10:00:04
 * @version $Id$
 */

window.onload = function() {
    //返回
    $('.back').click(function() {
        window.history.back(-1); 
    });
    
    //指示器
    var opts = {color: '#9B9B9B'};
    var spinner = new Spinner(opts).spin();
    document.getElementsByTagName("body")[0].appendChild(spinner.el);
    if (localStorage.native_lon != undefined &&
        localStorage.native_lat != undefined) {
        queryNearByStations(localStorage.native_lon,localStorage.native_lat);
    } else {
        //填入自己在腾讯地图开放平台申请的KEY
        var geolocation = new qq.maps.Geolocation("ARDBZ-KFD2U-BFDVI-2LAQ2-2Z3J3-7AFRM", "车等我");
        var options = {timeout: 5000};

        geolocation.getLocation(sucCallback, errCallback,options); 

        //成功的回调
        function sucCallback(position)
        {
            var mapInfo=JSON.stringify(position, null, 4);
            var jsonMapInfo=eval('(' + mapInfo + ')');
            success(jsonMapInfo.lng,jsonMapInfo.lat);
        }
        //失败的回调
        function errCallback()
        {
            alert("定位失败!");
            spinner.stop();
        }
        //业务逻辑    
        function success(longitude,latitude)
        {
            queryNearByStations(longitude,latitude);
        }   
    }

    //查询附近站点
    function queryNearByStations(longitude,latitude) {
        jQuery.ajax({
            //调用远程API
            // url: 'http://221.180.145.86/bus/station/nearby?_en=1&mc=123.464413,41.716465&range=1000',
            //调用本地json
            // url: './resource/stations.json',
            //调用PHP
            // url: './php/demo_http_request.php',
            //调用PHP文件中的方法
            //url: './php/getNearbyStationList.php?longitude='+longitude+'&latitude='+latitude,
            //调用跨域API
            url: 'http://221.180.145.214/busp/station/nearby?_en=1&mc='+longitude+','+latitude+'&range=1000',

            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
            complete: function(xhr, textStatus) {
                spinner.stop();
            },
            success: function(data, textStatus, xhr) {
                createStationList(data,textStatus,xhr);
            },
            error: function(xhr, textStatus, errorThrown) {
                alert('error:'+errorThrown);
                spinner.stop();
            }
        });
    }

    //站点UI
    function createStationList(data,textStatus,xhr) {

        var response = eval(data);

        var pageSize = response.pageSize;
        var total = response.total;
        var pageNum = response.pageNum;

    	var stations = response.rows;
    	for (var i = 0; i < stations.length; i++) {
    		 var station = stations[i];
    		 var name = station.name;
    		 var lineNames = station.lineNames;
    		 var distance = station.distance;
    		 $('#station_list').append("<li><div class=\"station_list_item_left_container\"><p class=\"station\">"+name+"</p><p class=\"bus\">"+lineNames+"</p></div><p class=\"distance\">"+distance+"米</p><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
    	}

        $('li').click(function() {
            //得到li对应的index,用index找到数组里对应的station
            var station = stations[$(this).index()];
            var name = station.name;
            var sid = station.uid;

            sessionStorage.name = name;

            window.location.href='QueryBus.html?sid='+sid+'&name='+name;
        });
    }
}