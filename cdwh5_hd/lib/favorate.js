/**
 * 
 * @authors liuhao (liuhao257@163.com)
 * @date    2017-08-25 14:21:20
 * @version $Id$
 */

/**
 *	add below files when use favorate.js
 *	toastr.css 
 *  toastr.min.js
 *  native-tool.js
 */

// var token = "pXNRNofm0EM2j632wnWTjuEAXOETZH7+GU8yL4FHupS64aZUqg24lky7ZqjFJoubAU+GV4QfskvqUpvwEcVjY67bnUCNSWsy8i3p+4xb2rw5iwcJmtGYG1Ntl42oZPbGMehlV9n+hrVObVNTJ6DjB2O/4pwV3zWUNwW/hip/ViPYEc0p6+kAH6YsRkQ39DnN";

function isFavorate(lid) {

	var token = native_getToken();

	var favorate = false;
	if (localStorage.favorateList == undefined ||
		token == undefined) {
		return favorate;
	}

	var favorateList = JSON.parse(localStorage.favorateList);

	for (var i = 0; i < favorateList.length; i++) {
		var item = favorateList[i];
		if (item.line_id == lid) {
  			favorate = true;
  			break;
  		}
	}

	return favorate;
}

function isExistFavorateList() {
	var favorateList = localStorage.favorateList;
	if (favorateList) {
		return true;
	} else {
		return false;
	}
}

function setFavorateListToLocalStorage(favorateList) {
	localStorage.favorateList = JSON.stringify(favorateList);
}

function buildFavorateItem (lid,sid,line_name,station_name,line_short_name) {
	return {line_id:lid,station_id:sid,line_name:line_name,station_name:station_name,line_short_name:line_short_name};
}

function addToFavorateList(item) {
	var favorateList = JSON.parse(localStorage.favorateList);
	favorateList.push(item);
	localStorage.favorateList = JSON.stringify(favorateList);
}

function removeFromFavorateList(lid) {
	var favorateList = JSON.parse(localStorage.favorateList);
	for (var i = 0; i < favorateList.length; i++) {
		var item = favorateList[i];
		if (item.line_id == lid) {
			favorateList.splice(i,1);
			break;
		}
	}
	localStorage.favorateList = JSON.stringify(favorateList);
}

//收藏 bt -> 1取消收藏, 0收藏
//次方法不对外暴露
function doFavorate(option) {

	var token = native_getToken();
	option = option || {};
	option.cityid = option.cityid || '0240';
	option.lid = option.lid || '';
	option.sid = option.sid || '';
	option.lname = option.lname || '';
	option.sname = option.sname || '';
	option.line_short_name = option.line_short_name || '';
	//参数bt用于判断是收藏 还是 取消收藏
	option.success = option.success || function () {};
	option.error = option.error || function () {};

	var bt;
	if (isFavorate(option.lid)) {
		//已经收藏了，再点击取消收藏
		bt = "1";
	} else {
		//还未收藏，点击收藏
		bt = "0";
	}

	toastr.options = {  
        closeButton: false,  
        debug: false,  
        positionClass: 'toast-center-center', 
        showDuration: "300",  
        hideDuration: "1000",  
        timeOut: "2000",  
        extendedTimeOut: "1000",  
        showEasing: "swing",  
        hideEasing: "linear",  
        showMethod: "fadeIn",  
	    hideMethod: "fadeOut"  
		};

	jQuery.ajax({
	  url: 'http://221.180.150.174/zhcx/add_to_fav',
	  type: 'POST',
	  dataType: 'jsonp',
	  jsonp: 'jsoncallback',
	  data: {
	  			token: token,
	  			bt: bt,
	  			cityid: option.cityid,
	  			lid: option.lid,
	  			sid: option.sid,
	  			lname: option.lname,
	  			sname: option.sname,
	  			line_short_name: option.line_short_name
			},
	  complete: function(xhr, textStatus) {

	  },
	  success: function(data, textStatus, xhr) {

	  	if (data.success == "1") {
	  		//收藏成功回调
	  		option.success(bt);

	  		if (bt == "1") {
	  			removeFromFavorateList(option.lid);
	  			toastr.success("取消收藏");
	  		} else {
	  			addToFavorateList(buildFavorateItem(option.lid,option.sid,option.lname,option.sname,option.line_short_name));
	  			toastr.success("收藏成功");
	  		}
	  	} else if (data.success == "2") {
	  		//token失效
	  		native_showLoginScene(data.msg);
	  	} else {
	  		toastr.success(data.msg);
	  	}
	  },
	  error: function(xhr, textStatus, errorThrown) {
	  	//收藏失败回调
	  	option.error(errorThrown);
	  	
  		if (bt == "1") {
  			toastr.error("取消收藏失败");
  		} else {
  			toastr.error("收藏失败");
  		}
	  }
	});
}

//收藏 用于外部调用,参数见doFavorate
function favorate(option) {

	var token = native_getToken();

	if (token) {
		if (isExistFavorateList()) {//本地存在favorateList

			doFavorate(option);

		} else {//本地不存在favorateList

			syncFavorateList({
				cityid: option.cityid,

				success: function(data) {

					if (data.success == 1) {
						//开始收藏	
						doFavorate(option);
					} else if (data.success == 2) {
						//token失效，去登录
						native_showLoginScene(data.msg);
					} else {
						//其他错误
						toastr.success(data.msg);
					}
				},
				error: function(errorThrown) {
					alert("error:"+errorThrown);
				}
			});
		}
		
	} else {
		native_showLoginScene('请先登录');
	}
}

//带收藏的界面先调用下
function syncFavorateList(option) {

	var token = native_getToken();

	option = option || {};
	option.cityid = option.cityid || '0240';
	option.success = option.success || function () {};
	option.error = option.error || function () {};
	option.complete = option.complete || function (){};
	if (token == '' || token == null) {
		option.complete();
		return;
	}

	jQuery.ajax({
	  url: 'http://221.180.150.174/zhcx/fav_list',
	  type: 'POST',
	  dataType: 'jsonp',
	  jsonp: 'jsoncallback',
	  data: {
	  			token: token,
	  			cityid: option.cityid,
			},
	  complete: function(xhr, textStatus) {

	  },
	  success: function(data, textStatus, xhr) {

	  	if (data.success == "1") {
	  		//保存到本地收藏列表
	  		setFavorateListToLocalStorage(data.fav_list);
	  	} else if (data.success == "2") {
	  		//token失效
	  	} else {
	  		//其他错误
	  	}

	  	//这句得放在最下面
	  	option.success(data);

	  },
	  error: function(xhr, textStatus, errorThrown) {
	  	option.error(errorThrown);
	  }
	});
}