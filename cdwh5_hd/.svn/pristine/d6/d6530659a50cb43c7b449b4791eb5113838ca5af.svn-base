/**
 * 
 * @authors liuhao
 * @date    2017-03-22 09:15:17
 * @version $Id$
 */

// 解析url,将参数已字典key,value的形式返回
// example
// 'QueryBus.html?sid='+sid;
// var param = parseURL();
// alert(param["sid"]);
function parseURL(){
	var url = location.href;
	var index = url.indexOf('?');
	
	if(index == -1) return;
	var querystr = url.substr(index + 1);

	//用'&'分割字符串，如果字符串中没有'&',则返回的数组中只有一个这个字符串
	//即返回的数组length = 1, array[0] = 这个字符串
	var keyValueArray = querystr.split('&');

	//用于返回参数的key,value字典
	var params = new Object();
	for (var i in keyValueArray){
		//keyValue[0]是key，keyValue[1]是value
	    var keyValue = keyValueArray[i].split('=');
	    //将keyValue以key,value的形式赋给params
	    params[keyValue[0]]=keyValue[1];
	}
	return params;
}

//判断对象是否为数组
function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

//判断对象是否为字符串
function isString(o) {
	return Object.prototype.toString.call(o) === "[object String]";
}