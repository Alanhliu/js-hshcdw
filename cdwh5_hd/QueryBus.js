/**
 * 
 * @authors liuhao (liuhao257@163.com)
 * @date    2017-03-07 15:35:27
 * @version $Id$
 */

window.onload = function() {
    var cityid = window.localStorage.getItem('zhcx_cid');

	// 'QueryBus.html?sid='+sid;
 	var param = parseURL();
 	var sid = param["sid"];
 	
 	//解决地址栏乱码
	var name = decodeURI(param["name"]);
	var stationName = name;

	//返回
	$('.back').click(function() {
        window.history.back(-1); 
    });

 	$('.title').html(name);

 	//同步收藏列表
	syncFavorateList({
		cityid: cityid,
		complete: function() {
			fetchBusList();
		},
		success: function(data) {
			//用户不登录也能看到线路，所以success = 0,1,2都要fetchBusList(),
			fetchBusList();

			if (data.success == 1) {	

			} else if (data.success == 2) {

			} else {

			}
		},
		error: function(errorThrown) {
			alert("error:"+errorThrown);
		}
	});

	function fetchBusList() {
		jQuery.ajax({
			url: 'http://221.180.145.214/busp/station/pass?_en=1&sid='+sid+'&pageNum=1',
			type: 'GET',
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			complete: function(xhr, textStatus) {
				// spinner.stop();
			},
			success: function(data, textStatus, xhr) {
				// spinner.stop();
				createBusList(data,textStatus,xhr);
			},
			error: function(xhr, textStatus, errorThrown) {
				// spinner.stop();
				alert('error:'+errorThrown);
			}
		});
	}

	function createBusList(data, textStatus, xhr) {
		var passes = eval(data).rows;
		if(passes == undefined)
			return;
		//passes 中有些是没有bus.cost的，所以先把有bus.cost的过滤出来，
		//排序后，再把没有bus.cost的数组追加到其后。 
		var passesWithCost = $.grep(passes,function(item,i){
    		return item.bus != undefined;
        });
		passesWithCost = passesWithCost.sort(function(item1, item2){
			return item1.bus.cost - item2.bus.cost;  
    	});  
    	var passesNoCost =  $.grep(passes,function(item,i){
    		return item.bus == undefined;
        });

        // passes = passesWithCost.concat(passesNoCost);
        passes = $.merge(passesWithCost,passesNoCost);

		for (var i = 0; i < passes.length; i++) {
			var pass = passes[i];
			var name = pass.name;
			var lid = pass.rid;

			var cost;
			var distance;

			if (pass.bus != undefined) {
				num = pass.bus.num;//多少站
				distance = pass.bus.distance;//多少米
				cost = pass.bus.cost;//多少分
				if (isFavorate(lid)) {
					$('#bus_list').append("<li class=\"bus_li\"><p class=\"bus\">"+name+"</p><span><img class=\"star\" src=\"./images/star_full.png\"></span><div class=\"bus_list_item_bottom_container\"><p class=\"bottom_text station\">"+num+"站</p><p class=\"bottom_text distance\">"+distance+"米</p><p class=\"bottom_text minute\"><a>"+cost+"</a>分</p></div><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
				} else {
					$('#bus_list').append("<li class=\"bus_li\"><p class=\"bus\">"+name+"</p><span><img class=\"star\" src=\"./images/star_empty.png\"></span><div class=\"bus_list_item_bottom_container\"><p class=\"bottom_text station\">"+num+"站</p><p class=\"bottom_text distance\">"+distance+"米</p><p class=\"bottom_text minute\"><a>"+cost+"</a>分</p></div><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
				}
			} 

			if (pass.busDetail != undefined) {
				num = pass.busDetail.numStr;
				distance = pass.busDetail.distanceStr;
				cost = pass.busDetail.costStr;
				if (isFavorate(lid)) {
					$('#bus_list').append("<li class=\"bus_li\"><p class=\"bus\">"+name+"</p><span><img class=\"star\" src=\"./images/star_full.png\"></span><div class=\"bus_list_item_bottom_container\"><p class=\"bottom_text station\">"+num+"</p><p class=\"bottom_text distance\"></p></div><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
				} else {
					$('#bus_list').append("<li class=\"bus_li\"><p class=\"bus\">"+name+"</p><span><img class=\"star\" src=\"./images/star_empty.png\"></span><div class=\"bus_list_item_bottom_container\"><p class=\"bottom_text station\">"+num+"</p><p class=\"bottom_text distance\"></p></div><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
				}
			}

			if (pass.bus == undefined && pass.busDetail == undefined) {
				if (isFavorate(lid)) {
					$('#bus_list').append("<li class=\"bus_li\"><p class=\"bus\">"+name+"</p><span><img class=\"star\" src=\"./images/star_full.png\"></span><div class=\"bus_list_item_bottom_container\"><p class=\"bottom_text station\">未知状态</p><p class=\"bottom_text distance\"></p><p class=\"bottom_text minute\"></p></div><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
				} else {
					$('#bus_list').append("<li class=\"bus_li\"><p class=\"bus\">"+name+"</p><span><img class=\"star\" src=\"./images/star_empty.png\"></span><div class=\"bus_list_item_bottom_container\"><p class=\"bottom_text station\">未知状态</p><p class=\"bottom_text distance\"></p><p class=\"bottom_text minute\"></p></div><div class=\"clearfloat\"/><div class=\"separator\"/></li>");
				}
			}
		}

		$('li').click(function() {
			var pass = passes[$(this).index()];
			// sid对应返回的uid(站点id)
			// var sid = pass.uid;

			var filterarray = $.grep(passes,function(item,i){
            		// return item.rid != pass.rid && item.name.indexOf(pass.shortName) >= 0;
            		return item.rid != pass.rid && item.shortName == pass.shortName;
        		});

			var lid = '';
			var reverse = '';

			if (filterarray.length > 0) {

				var reversePass = filterarray[0];
				lid = reversePass.rid;//lid对应返回的rid(线路id)
				reverse = 'no';
			} else {
				lid = pass.rid;
				reverse = 'yes';
			}

			var sid = '';
			try
			{
				sid = $.md5(stationName);
			}
			catch(e)
			{
				alert(e);
			}
			
			var shortName = pass.shortName;
			var name = pass.name;

			//百度搜索108路时搜不到，108能搜到
			if (shortName == "108路") {
				shortName = "108";
			}

			sessionStorage.shortName = shortName;
			sessionStorage.name = name;

        	window.location.href='xiaoche/?lid='+lid+'&sid='+sid+'&reverse='+reverse;
    	});

		//收藏
    	$('.star').click(function(event) {
    		event.stopPropagation(); 

    		var thisStar = $(this);

    		var li = $(this).parents(".bus_li")[0];
    		var pass = passes[$(li).index()];
    		// alert($(li).index());
    		var lid = pass.rid;
    		var lname = pass.name;
    		var sid = '';
			try
			{
				sid = $.md5(stationName);
			}
			catch(e)
			{
				alert(e);
			}

			var sname = stationName;
			var line_short_name = pass.shortName;
			if (line_short_name == "108路") {
				line_short_name = "108";
			}

    		favorate({
				cityid: cityid,
				lid: lid,
				sid: sid,
				lname: lname,
				sname: sname,
				line_short_name: line_short_name,
				success: function(bt) {
					if (bt == "1") {	
						$(thisStar).attr('src','./images/star_empty.png');
					} else {
						$(thisStar).attr('src','./images/star_full.png');
					}
				},
				error: function(errorThrown) {
					alert("error:"+errorThrown);
				}
			})
    	});
	}
}