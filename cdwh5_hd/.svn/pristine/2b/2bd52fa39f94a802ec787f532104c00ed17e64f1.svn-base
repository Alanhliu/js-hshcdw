/**
 * 
 * @authors liuhao (liuhao257@163.com)
 * @date    2017-08-24 09:38:26
 * @version $Id$
 */

function isAndroid() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
	return isAndroid;
}

function isIOS() {
	var u = navigator.userAgent;
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	return isIOS;
}

//得到native端token
function native_getToken() {
	var token;
	if (isIOS()) {
		token = jsHandler.getToken();
	} else if (isAndroid()) {
		token = contact.getToken();
	}

	return token;
}

//显示登录界面
function native_showLoginScene(message) {

	if (isIOS()) {
		jsHandler.showLoginScene(message);
	} else if (isAndroid()) {
		contact.showLoginScene(message);
	}
}