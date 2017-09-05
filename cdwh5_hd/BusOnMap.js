/**
 * 
 * @authors liuhao (liuhao257@163.com)
 * @date    2017-04-13 10:46:14
 * @version $Id$
 */

window.onload = function() {
    var cityid = window.localStorage.getItem('zhcx_cid');
	
	//获取界面传参
	var param = parseURL();
 	var sid = param["sid"];
 	var lid = param["lid"];
 	var lname = sessionStorage.name;
 	var lon = null;
 	var lat = null;
 	var nearestStation = null;
 	var count = 0;

	//返回
	$('.back').click(function() {
        window.history.back(-1); 
    });

	//切换三辆小车
	$('.right').click(function() {
        window.location.href='xiaoche/?lid='+lid+'&sid='+sid;
    });

	//标题
    $('.title').html(lname);

    //收藏状态
    if (isFavorate(lid)) {
    	$('.star').attr('src','./images/star_full.png');
	} else {
		$('.star').attr('src','./images/star_empty.png');
	}

	//同步收藏列表
	syncFavorateList({
		cityid: cityid,
		complete: function() {

		},
		success: function(data) {

			if (data.success == 1) {	

			} else if (data.success == 2) {

			} else {

			}
		},
		error: function(errorThrown) {
			alert("error:"+errorThrown);
		}
	});

	//收藏 bt -> 1取消收藏, 0收藏
    $('.star').click(function() {
    	favorate({
			cityid: cityid,
			lid: lid,
			sid: sid,
			lname: lname,
			sname: '',
			line_short_name: sessionStorage.shortName,
			success: function(bt) {
				if (bt == "1") {	
					$('.star').attr('src','./images/star_empty.png');
				} else {
					$('.star').attr('src','./images/star_full.png');
				}
			},
			error: function(errorThrown) {
				alert("error:"+errorThrown);
			}
		})
    });

	var height = $(window).height() - 44;
	$("#l-map").css({
		'width':'100%',
		'height': height+'px',
	});

	//百度地图
	var map = new BMap.Map("l-map");           
    map.centerAndZoom("沈阳",15);

    //公交线路搜索
    var busline = new BMap.BusLineSearch(map,{
		renderOptions:{map:map},
			onGetBusListComplete: function(result){
			   if(result) {

			       	var fstLine = result.getBusListItem(0);
			        busline.getBusLine(fstLine);

			        busPositionSearchRunLoop();
			   }
			},
			onGetBusLineComplete: function(result){
				if (result) {
					calculateDistance(result);
				}
			},
			onPolylinesSet:function(result) {
				if (localStorage.native_lon != undefined &&
					localStorage.native_lat != undefined) {
					setTimeout(function(){
						showUserPosition();
					},1000);
					showNearestStation();
				}
			},
			onMarkersSet:function(result) {
				
			}
	});

    //计算出和用户位置最近的站点
    function calculateDistance(result) {
    	var distance = null;
    	var needStation = null;

    	for (var i = 0; i < result.getNumBusStations(); i++) {
    		var station = result.getBusStation(i);
    		var name = station.name;
    		var position = station.position;

    		var tempDistance = 
    		Math.sqrt((this.lat-position.lat)*(this.lat-position.lat)+
    		 (this.lon-position.lng)*(this.lon-position.lng));

    		if (distance == null) {
    			distance = tempDistance;
    			needStation = station;
    		} else {
    			if (tempDistance < distance) {
    				distance = tempDistance;
    				needStation = station;
    			} 
    		}
    	}
    	this.nearestStation = needStation;
    }

	//执行线路搜索并绘制到地图上
	(function lineSearch() {
		var busName = sessionStorage.shortName;
		busline.getBusList(busName);
	})();

	function busPositionSearchRunLoop() {

		setInterval(function(){

			busPositionSearch();

		},5000);
	}

	function busPositionSearch() {
		jQuery.ajax({
				url: 'http://221.180.145.214/busp/station/query',
				type: 'POST',
				dataType: 'jsonp',
				jsonp: 'jsoncallback',
				data: {
				lid: lid,
				sid: sid,
				num: 3,
				id:'557d2acde4b0dbac9710d8ed'
			},
			complete: function(xhr, textStatus) {
				//called when complete
			},
			success: function(data, textStatus, xhr) {
				if (data.status != 300) {
					drawOnMap(data,textStatus,xhr);
					count++;
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				//called when there is an error
			}

			});
	}


	var markers = new Array();
	function drawOnMap(data, textStatus, xhr) {
		var response = eval(data).lines[0];
		var list = response.list;

		for (var i = 0; i<list.length; i++) {
			var longitude = list[i].lonlat[0];//经度
			var latitude = list[i].lonlat[1];//纬度

			if (count == 0) {
				var p = new BMap.Point(longitude,latitude);
				var icon = new BMap.Icon("./images/bus_"+i+"@2x.png", new BMap.Size(47, 40), { 

				}); 
				marker = new BMap.Marker(p, {icon: icon}); 

				markers.push(marker);
				map.addOverlay(marker); 
			} else {
				var marker = markers[i];
				var p = new BMap.Point(longitude,latitude);
				marker.setPosition(p);
			}
		}
	}

	//调试专用
	// commitLonLat(123.476055,41.725089);
	commitLonLat(localStorage.native_lon,localStorage.native_lat);
    function commitLonLat(lon,lat) {
    	this.lon = lon;
    	this.lat = lat;
    }

    //显示最近站点位置
    var nearestStationMarker = null;
    var nearestStationLabel = null;
    function showNearestStation() {
    	map.removeOverlay(nearestStationMarker);
    	map.removeOverlay(nearestStationLabel);

    	var p = new BMap.Point(this.nearestStation.position.lng,this.nearestStation.position.lat);
		var nearestStationMarker = new BMap.Marker(p);
		map.addOverlay(nearestStationMarker);

		var opts = {
			position : p,    
			offset   : new BMap.Size(10, -25)    
		}
		var nearestStationLabel = new BMap.Label(this.nearestStation.name, opts);
		nearestStationLabel.setStyle({
			 color : "red",
			 fontSize : "12px",
			 height : "20px",
			 lineHeight : "20px",
			 fontFamily:"微软雅黑"
		});
		map.addOverlay(nearestStationLabel);   
    }

    //显示用户位置
	var userPostionMarker = null;
	function showUserPosition() {
		map.removeOverlay(userPostionMarker);

		var p = new BMap.Point(this.lon,this.lat);
		var icon = new BMap.Icon("./images/user_position.png", new BMap.Size(25, 31), {}); 
		var userPostionMarker = new BMap.Marker(p, {icon: icon});
		map.addOverlay(userPostionMarker);

		//将用户位置设置为中心点
		// map.setCenter(p);
		map.centerAndZoom(p,16);
	}
}