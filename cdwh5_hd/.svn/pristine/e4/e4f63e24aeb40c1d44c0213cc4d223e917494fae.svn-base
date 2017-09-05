/**
 * 
 * @authors liuhao (liuhao257@163.com)
 * @date    2017-03-29 14:02:30
 * @version $Id$
 */

window.onload = function() {
	//返回
	$('.back').click(function() {
        window.history.back(-1); 
    });
	//百度公交bus查询
	var buslineSearch = new BMap.BusLineSearch('沈阳',{
		onGetBusListComplete: function(result) { 
			if(result != undefined) { 
				createLineList(result);
			} 
		}
	});

	//百度公交station查询
	var localSearch = new BMap.LocalSearch('沈阳', {     
        onSearchComplete: function(result) {
        	if (result != undefined) {
        		//为了解决百度api返回结果，属性名变化的问题
        		var stations = null;
				for (var p in result){
					if (Array.isArray(result[p]) &&
						result[p].length > 0 &&
						p != "sugessions") {
						stations = result[p];
					} 
				}
        		var filterarray = $.grep(stations,function(item,i){
        			//type == 1从返回结果看，应该代表公交站点。
            		return item.type == 1;
        		});
        		if (filterarray !=null && filterarray.length > 0) {
        			createStationList(filterarray);
        		}
        	}
        }
    });

	//判断对象是否为数组
	function isArray(o) {
    	return Object.prototype.toString.call(o) === '[object Array]';
	}

	//判断对象是否为字符串
	function isString(o) {
		return Object.prototype.toString.call(o) === "[object String]";
	}

	//线路UI
	function createLineList(result) {

		var lines = null;

		//为了解决百度api返回结果，属性名变化的问题
		for ( var p in result ){
			if ( Array.isArray(result[p]) ) {
				lines = result[p]
			} 
		} 

		if (lines.length > 0) {
			$('#line_result').append("<div class=\"line_station_header\"><p>线路</p></div><ul id=\"line_list\" class=\"line_station_list\"></ul>");
		}

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var name = line.name;
			
			$('#line_list').append("<li><span><img class=\"icon\" src=\"./images/bus.png\"><span class=\"text\">"+name+"</span></li>");
		}

		$('#line_list li').click(function() {

            var line = lines[$(this).index()];

			var name = line.name;

			var lid = null;
			var shortName = null;

			//为了解决百度api返回结果，属性名变化的问题
			for ( var p in line ){
				if (name.indexOf(line[p]) >= 0 && 
					name != line[p] &&
					isString(line[p])) {

					shortName = line[p];
				} 
				if (name.indexOf(line[p]) < 0 && 
					isString(line[p])) {

					lid = line[p];
				}
			} 

			//得到当前路线的终止站点
			var stationName = name.substring(name.indexOf("-")+1,name.indexOf(")"));

			var sid = '';
			try
			{
				sid = $.md5(stationName);
			}
			catch(e)
			{
				alert(e);
			}
			
			sessionStorage.name = name;
			sessionStorage.shortName = shortName;

        	window.location.href = 'BusOnMap.html?lid='+lid+'&sid='+sid;
        });
	}

	//站点UI
	function createStationList(result) {
		var stations = result;

		$('#station_result').append("<div class=\"line_station_header\"><p>站点</p></div><ul id=\"station_list\" class=\"line_station_list\"></ul>");
		for (var i = 0; i < stations.length; i++) {
			var station = stations[i];

			var name = station.title;
			var linesName = station.address;
			
			$('#station_list').append("<li><span><img class=\"icon\" src=\"./images/zp.png\"><span class=\"text\">"+name+"</span></li>");
		}

		$('#station_list li').click(function() {
            var station = stations[$(this).index()];

            var name = station.title;

            //uid不是sid，uid是什么？
			//var sid = station.uid;

			var sid = '';
			try
			{
				sid = $.md5(name);
			}
			catch(e)
			{
				alert(e);
			}

			window.location.href='QueryBus.html?sid='+sid+'&name='+name;
        });
	}

	//按关键字搜索
	function searchByKeword() {
		$('.line_station_result').html("");
		var keyword = $.trim($('#search_input').val());
		if (keyword.length > 0) {
			
			if (!isNaN(keyword) || keyword.indexOf("浑南新区一线") >= 0) {//数字
				buslineSearch.getBusList(keyword);
			} else {//非数字
				localSearch.search(keyword);
			}
			$('#blank_holder img').remove();
		} else {
			$('.line_station_result').html("");
			$('#blank_holder').html("<img src=\"./images/kyss.png\"/>");
		}
	}

	//解决搜索时输入频率过快重复调用api问题
	$('#search_input').bind('input propertychange', $.debounce(500, searchByKeword)); 
}