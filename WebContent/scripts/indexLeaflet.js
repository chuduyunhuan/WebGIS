/**
 * leaflet-baidu地图引擎搭建
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-09-22 15:25:49
 * @version $Id$
 */
 //对象数组根据某个字段分组
 Array.prototype.groupByField = function(field) {
 	var map = {},
 	dest = [];
 	for (var i = 0; i < this.length; i++) {
 		var ai = this[i];
 		if (!map[ai[field]]) {
 			dest.push({
 				id: ai[field],
 				data: [ai]
 			});
 			map[ai[field]] = ai;
 		} else {
 			for (var j = 0; j < dest.length; j++) {
 				var dj = dest[j];
 				if (dj[field] == ai[field]) {
 					dj.data.push(ai);
 					break;
 				}
 			}
 		}
 	}
 	return dest;
 };
 //判断两个对象是否相等
 Object.prototype.equals = function(x) {
 	var p;
 	for (p in this) {
 		if (typeof(x[p]) == 'undefined') {
 			return false;
 		}
 	}
 	for (p in this) {
 		if (this[p]) {
 			switch (typeof(this[p])) {
 			case 'object':
 				if (!this[p].equals(x[p])) {
 					return false;
 				}
 				break;
 			case 'function':
 				if (typeof(x[p]) == 'undefined' || (p != 'equals' && this[p].toString() != x[p].toString())) return false;
 				break;
 			default:
 				if (this[p] != x[p]) {
 					return false;
 				}
 			}
 		} else {
 			if (x[p]) return false;
 		}
 	}
 	for (p in x) {
 		if (typeof(this[p]) == 'undefined') {
 			return false;
 		}
 	}
 	return true;
 };
 //格式化数字千分位显示，并保存指定位数的小数
 function fmoney(s, n) {
 	n = n ? n : 2;
 	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
 	var l = s.split(".")[0].split("").reverse(),
 		r = s.split(".")[1];
 	t = "";
 	for (i = 0; i < l.length; i++) {
 		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
 	}
 	return t.split("").reverse().join("") + "." + r;
 }
 /*
 * 快速排序，按某个属性，或按“获取排序依据的函数”，来排序.
 * @method sortByField
 * @static
 * @param {array} arr 待处理数组
 * @param {string|function} prop 排序依据属性，获取
 * @param {boolean} desc 降序
 * @return {array} 返回排序后的新数组
 */
 var sortByField = function(arr, prop, desc) {
 		var props = [],
 			ret = [],
 			i = 0,
 			len = arr.length;
 		if (typeof prop == 'string') {
 			for (; i < len; i++) {
 				var oI = arr[i];
 				(props[i] = new String(oI && oI[prop] || ''))._obj = oI;
 			}
 		} else if (typeof prop == 'function') {
 			for (; i < len; i++) {
 				var oI = arr[i];
 				(props[i] = new String(oI && prop(oI) || ''))._obj = oI;
 			}
 		} else {
 			throw '参数类型错误';
 		}
 		props.sort();
 		for (i = 0; i < len; i++) {
 			ret[i] = props[i]._obj;
 		}
 		if (desc) ret.reverse();
 		return ret;
 };
//命名空间
var BASE_MAP = {
	map: {},
	layers: {},
	commonMethods: {},
	init: function(id,opts){
		BASE_MAP.addBaseMap(id,opts);
	}
};
BASE_MAP.setMapOptions = function(opts){
	var obj = {
		minZoom: 10,
		maxZoom: 18,
		zoom: 11,
		center: [31.147534,121.518992],
		crs: L.CRS.BEPSG3857,
		attributionControl: false
	};
	return BASE_MAP.commonMethods.setOptions(obj,opts);
};
BASE_MAP.addBaseMap = function(id,opts){
	opts = BASE_MAP.setMapOptions(opts);
	BASE_MAP.map = L.map(id,opts);
	BASE_MAP.addBaseLayers();
	BASE_MAP.addLayerControl();
};
BASE_MAP.addBaseLayers = function(){
	var normalLayer = L.tileLayer.baiduLayer('Normal.Map');
	var satelliteLayer = L.tileLayer.baiduLayer('Satellite.Map');
	BASE_MAP.layers.normalLayer = normalLayer;
	BASE_MAP.layers.satelliteLayer = satelliteLayer;
	BASE_MAP.map.addLayer(normalLayer);
};
BASE_MAP.addLayerControl = function(){
	BASE_MAP.layers.layersControl && (BASE_MAP.layers.layersControl = null, BASE_MAP.map.removeControl(BASE_MAP.layers.layersControl));
	var baseLayers = {
		"地图": BASE_MAP.layers.normalLayer,
		"卫星": BASE_MAP.layers.satelliteLayer
	};
	var layersControl = L.control.layers(baseLayers,[]);
	BASE_MAP.layers.layersControl = layersControl;
	layersControl.addTo(BASE_MAP.map);
};
BASE_MAP.initDoms = function(){
	BASE_MAP.getAllTypes();
	//文本框回车事件
	BASE_MAP.commonMethods.customEvent('search','keydown',BASE_MAP.commonMethods.enterPress);
	//文本框失去焦点事件
	BASE_MAP.commonMethods.customEvent('search','blur',BASE_MAP.commonMethods.textBlur);
};
BASE_MAP.getAllTypes = function(){
	var url = 'http://localhost:3000/civicism/types';
	var callback = function(data){
		if(!data.length) return;
		var htmlStr = '';
		data.map(function(valObj){
			htmlStr += '<option>' + valObj.TYPE + '</option>';
		});
		$('#type').html(htmlStr);
		$('#type').on('change',function(){
			var type = $('option:selected').text();
			BASE_MAP.getServerData(type);
		});
	};
	var obj = {
		url: url,
		callback: callback
	};
	BASE_MAP.commonMethods.ajaxQuery(obj);
};
BASE_MAP.getServerData = function(type){
	var url = 'http://localhost:3000/civicism/address?type=' + encodeURIComponent(type);
	var callback = function(data){
		BASE_MAP.commonMethods.mapData(data,type);
	};
	var obj = {
		url: url,
		callback: callback
	};
	BASE_MAP.commonMethods.ajaxQuery(obj);
};
BASE_MAP.commonMethods.setOptions = function(obj,opts){
	for(var name in opts){
		opts.hasOwnProperty(name) && (obj[name] = opts[name]);
	}
	return obj;
};
BASE_MAP.commonMethods.ajaxQuery = function(obj){
	var url = obj.url,
		type = obj.type || 'get',
		data = obj.data,
		callback = obj.callback;
	$.ajax({
		url: url,
		type: type,
		contentType: 'application/json',
		data: data
	})
		.done(callback);
};
BASE_MAP.commonMethods.mapData = function(data,type){
	if(!data.length || data.length < 1) return;
	BASE_MAP.commonMethods.showLoading();
	BASE_MAP.layers.clearLayer('civicismLayer');
	var civicismLayer = L.featureGroup();
	type = type || '市政设施';
	data.map(function(obj,index){
		var addr = obj.address;
		var name = obj.name;
		var bd_url = 'http://localhost:3000/proxy-server/baidu/geolocation?city=' + encodeURIComponent('上海市') + '&address=' + encodeURIComponent(addr);
		var bd_callback = function(bd_data){
			if(!bd_data.result || !bd_data.result.location) return;
			var icon = BASE_MAP.layers.setIcon(BASE_MAP.imgCol[obj.type],35,35);
			var content = BASE_MAP.commonMethods.createHtml(name,addr);
			var point = bd_data.result.location;
			var parse_obj = {
				layer: civicismLayer,
				point: point,
				icon: icon,
				name: name,
				content: content
			};
			BASE_MAP.layers.setMarker(parse_obj);
			if(index === data.length - 1) {
				BASE_MAP.layers.civicismLayer = civicismLayer;
				BASE_MAP.map.addLayer(civicismLayer);
				BASE_MAP.layers.addToLayerControl(civicismLayer,type);
				BASE_MAP.commonMethods.hideLoading();
			}
		};
		var bd_obj = {
			url: bd_url,
			callback: bd_callback
		};
		BASE_MAP.commonMethods.ajaxQuery(bd_obj);
	});
};
BASE_MAP.commonMethods.searchByName = function(name){
	var url = 'http://localhost:3000/civicism/address/search?name=' + encodeURIComponent(name);
	var callback = function(data){
		BASE_MAP.commonMethods.mapData(data);
	};
	var obj = {
		url: url,
		callback: callback
	};
	BASE_MAP.commonMethods.ajaxQuery(obj);
};
BASE_MAP.commonMethods.customEvent = function(id,evtType,fn){
	$('#'+id)[evtType](fn);
};
BASE_MAP.commonMethods.enterPress = function(e){
	var curKey = e.which;
	if(curKey !== 13) return;
	var name = $(this).val();
	if (!name) return;
	BASE_MAP.commonMethods.searchByName(name);
};
BASE_MAP.commonMethods.textBlur = function(e){
	$(e.target).val('请输入目标名称');
};
BASE_MAP.commonMethods.removeDomById = function(id){
	var checkCustomDiv = document.getElementById(id);
	checkCustomDiv != null && (checkCustomDiv.parentNode.removeChild(checkCustomDiv));
};
BASE_MAP.commonMethods.checkPassWord = function(str) {
	var Reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{6,16}$/;
	var result = Reg.test(str);
	if(!result) {
		return false;
	}else {
		return true;
	}
};
BASE_MAP.commonMethods.createPassWordComponent = function(obj) {
	var fullName = obj.fullName || '张三丰',
		oldP = obj.oldP || '123',
		newP = obj.newP || '!@#';
	var winLogExist = checkDomById('createWinLogWX');
	if (winLogExist) {
		$('#createWinLogWX').show();
		return;
	}
	//构造父容器
	var $div = $('<div id="createWinLogWX"></div>');
	var winHeight = $(document).height(),
	winWidth = $(document).width();
	$div.css({
		position: 'absolute',
		left: winWidth / 4 + 100,
		top: winHeight / 4 - 10,
		width: 460,
		height: 300,
		color: 'white',
		border: '1px solid b4b4b4',
		'font-family': 'Microsoft Yahei',
		'background-color': '#fff',
		'border-radius': '5px',
		'z-index': 999
	});
	//标题栏
	var htmlStr = '<div style="background-color: #00a0e9; height: 30px; border-radius: 5px 5px 0 0;">' + '<span class="fa fa-volume-up" style="padding: 5px 5px; font-size: 18px; margin-left: 10px;"><span style="font-family: microsoft yahei;">  您好，' + fullName + '！</span></span> ' + '<i id="flowWinCloseWX" class="fa fa-times" aria-hidden="true" style="position: absolute; right: 10px; top: 8px; cursor: pointer; color: white;"></i>' + '</div>';
	htmlStr += '<span style="display: inline-block; color: red; font-family: Microsoft Yahei; font-size: 14px; margin: 10px 10px;">您的密码已过有效期（' + time + '），请先设置新密码！</span>';
	//原密码
	htmlStr += '<div style="margin: 20px 40px; color: #333; font-family: microsoft yahei; font-size: 18px;">' + '<label>原密码:<span style="color: red;">*</span></label>' + '<input name="oldPsdWX" id="oldPsdWX" style="margin-left: 10px; border-radius: 2px; height: 30px; width: 65%; border: 1px solid gray;" type="password" placeholder="请输入原密码" />' +
	//      '<table style="display: inline;"><tr><td title="原密码错误"><i class="fa fa-exclamation" aria-hidden="true" id="oriPCommit" style="display: in-line; visibility: hidden; color: red; margin: 0 10px;"></i></td></tr></table>' + 
	'<table style="display: inline;"><tr style="display: inline-block; margin-top: 2px;"><td title="原密码错误"><b id="oriPCommit" style="display: in-line; visibility: hidden; color: red; margin: 0 10px;">！</b></td></tr></table>' +
	//      '<b id="oriPCommit" style="display: in-line; visibility: hidden; color: red; font-size: 16px;"> ！</b>' + 
	'</div>';
	//新密码
	htmlStr += '<div style="margin: 0px 40px; color: #333; font-family: microsoft yahei; font-size: 18px;">' + '<label>新密码:<span style="color: red;">*</span></label>' + '<input name="newPsdWX" id="newPsdWX" style="margin-left: 10px; border-radius: 2px; height: 30px; width: 65%; border: 1px solid gray;" type="password" placeholder="6-16个字符，需包含字母，数字和特殊字符" />' +
	//      '<table style="display: inline;"><tr><td title="新密码格式不符合要求"><i class="fa fa-exclamation" aria-hidden="true" id="newPCommit" style="display: in-line; visibility: hidden; color: red; margin: 0 10px;"></i></td></tr></table>' + 
	'<table style="display: inline;"><tr style="display: inline-block; margin-top: 2px;"><td title="新密码格式不符合要求"><b id="newPCommit" style="display: in-line; visibility: hidden; color: red; margin: 0 10px;">！</b></td></tr></table>' +
	//      '<b id="newPCommit" style="display: in-line; visibility: hidden; color: red; font-size: 16px;"> ！</b>' + 
	'</div>';
	//确认密码
	htmlStr += '<div style="margin: 20px 20px; color: #333; font-family: microsoft yahei; font-size: 18px;">' + '<label>确认密码:<span style="color: red;">*</span></label>' + '<input name="newPsdConfirmWX" id="newPsdConfirmWX" style="margin-left: 10px; border-radius: 2px; height: 30px; width: 59%; border: 1px solid gray;" type="password" placeholder="再次输入新密码" />' +
	//      '<table style="display: inline;"><tr><td title="两次输入密码不一致"><i class="fa fa-exclamation" aria-hidden="true" id="twicePCommit" style="display: in-line; visibility: hidden; color: red; margin: 0 10px;"></i></td></tr></table>' +
	'<table style="display: inline;"><tr style="display: inline-block; margin-top: 2px;"><td title="两次输入密码不一致"><b aria-hidden="true" id="twicePCommit" style="display: in-line; visibility: hidden; color: red; margin: 0 10px;">！</b></td></tr></table>' +
	//      '<b id="twicePCommit" style="display: in-line; visibility: hidden; color: red; font-size: 16px;"> ！</b>' + 
	'</div>';
	//保存取消
	htmlStr += '<div style="margin-left: auto; margin-right: auto; width: 34%; font-family: Microsoft Yahei; font-size: 18px; ">' + 
		'<input type="button" id="savecreateWinLogWX" class="login_btn1 btn_style" style="font-family: Microsoft Yahei; background-color: #00a0e9; width: 50px; height: 30px; line-height: 30px; padding: 0; background: none; background-color: #00a0e9;" value="保存"/>' + 
		'<input type="button" id="cancelcreateWinLogWX" class="login_btn2 btn_style" style="font-family: Microsoft Yahei; margin-left: 30px; width: 50px; height: 30px; line-height: 30px; padding: 0;" value="取消"/>' + 
	'</div>';
	
	$div.html(htmlStr);
	$div.appendTo('body');
	//注册事件
	$('#cancelcreateWinLogWX, #flowWinCloseWX').on('click', function() {
		$('#oldPsdWX').val('');
		$('#newPsdWX').val('');
		$('#newPsdConfirmWX').val('');
		$('#oriPCommit')[0].style.visibility = 'hidden';
		$('#newPCommit')[0].style.visibility = 'hidden';
		$('#twicePCommit')[0].style.visibility = 'hidden';
		$('#createWinLogWX').hide();
	});
	$('#savecreateWinLogWX').on('click', function() {
		saveEvent();
	});
	$('input[type=password]').keydown('click', function(e) {
		if (e.which !== 13) {
			return;
		}
		saveEvent();
	});
	function saveEvent() {
		var oriP = $('#oldPsdWX').val();
		var newP = $('#newPsdWX').val();
		var confirmP = $('#newPsdConfirmWX').val();
		if (hex_sha1(oriP) != oriPass) {
			//			alert('您输入的原始密码有误!');
			$('#oriPCommit')[0].style.visibility = 'visible';
			return;
		} else {
			$('#oriPCommit')[0].style.visibility = 'hidden';
		}
		if (hex_sha1(oriP) == hex_sha1(newP)) {
			//			alert('您输入的新密码和原始密码相同,请重新输入!');
			$('#newPCommit')[0].style.visibility = 'visible';
			$('#newPCommit').parent().attr('title', '新密码和原密码相同');
			return;
		} else {
			$('#newPCommit')[0].style.visibility = 'hidden';
		}
		if (hex_sha1(confirmP) != hex_sha1(newP)) {
			//			alert('您两次输入的新密码不同,请确认输入!');
			$('#twicePCommit')[0].style.visibility = 'visible';
			return;
		} else {
			$('#twicePCommit')[0].style.visibility = 'hidden';
		}
		//		console.log(execPassWord(newP));
		if (!execPassWord(newP)) {
			//			alert('您输入的新密码不合要求，请重新输入!');
			$('#newPCommit')[0].style.visibility = 'visible';
			$('#newPCommit').parent().attr('title', '密码不符合格式要求');
			return;
		} else {
			$('#newPCommit')[0].style.visibility = 'hidden';
		}
		console.log('save done, you can commit to your database here!');
	}
};
BASE_MAP.commonMethods.checkDomById = function(id){
	var checkCustomDiv = document.getElementById(id);
	if(!checkCustomDiv){
		return false;
	}else{
		return true;
	}
};
BASE_MAP.commonMethods.createFrame = function(url) {
	var k = document.body.offsetHeight;
	var h = k - 65;
	var s = '<iframe id="mainframe" name="mainframe" src=' + url +' width="100%" height="' + h + '"  frameborder="0" scrolling="auto" ></iframe>';
	return s;
};
BASE_MAP.commonMethods.createHtml = function(name,val){
	var htmlStr = '';
	htmlStr += '<span>' 
		+ name + ': &nbsp;&nbsp;' 
		+ '<b>' + val + '</b>'
		+ '<span>';
	return htmlStr;
};
BASE_MAP.commonMethods.showLoading = function(){
	var loadingExist = BASE_MAP.commonMethods.checkDomById('customLoading');
	if(loadingExist){
		$('#customLoading').show();
		return;
	}
	var $div = $('<div id="customLoading"></div>');
	var winHeight = $(document).height(),
		winWidth = $(document).width();
	$div.css({
		position: 'absolute', left: winWidth/2, top: winHeight/2, 'z-index': 999
	});
	$div.html('<img src="' + BASE_MAP.imgCol['loading'] + '" />');
	$div.appendTo('body');
};
BASE_MAP.commonMethods.hideLoading = function(){
	$('#customLoading').hide();
};
//计算指定日期是当年的第几周
BASE_MAP.commonMethods.getWeekNumber = function(obj) {
	//默认参数
	var time = new Date();
	var y = obj.year || time.getFullYear(),
		m = obj.month || time.getMonth() + 1,
		d = obj.day || time.getDate();
	//指定日期
	var now = new Date(y, m - 1, d),
		year = now.getFullYear(),
		month = now.getMonth(),
		days = now.getDate();
	//那一天是那一年中的第多少天
	for (var i = 0; i < month; i++) {
		days += getMonthDays(year, i);
	}
	//那一年第一天是星期几
	var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
	var week = null;

	if (yearFirstDay == 1) {
		week = Math.ceil(days / yearFirstDay);
	} else {
		days -= (7 - yearFirstDay + 1);
		week = Math.ceil(days / 7) + 1;
	}
	return week;
	function getMonthDays(year, month) {
		return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
	}
	function isLeapYear(year) {
		return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	}
};
BASE_MAP.commonMethods.getWeekNumber2 = function(y, m, d) {
	var time, week, checkDate = new Date(y, m-1, d);
	checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
	time = checkDate.getTime();
	checkDate.setMonth(0);
	checkDate.setDate(1);
	week = Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	return week;
};
//获取当前时间的日期
BASE_MAP.commonMethods.getTodayDate = function() {
	var now = new Date();
	var year = now.getFullYear(),
		month = now.getMonth() + 1,
		day = now.getDate();
	return {
		year: year,
		month: month,
		day: day
	};
};
//时间格式化,x为Date类型,y为输出形式,如:'yyyy-MM-dd hh:mm:ss'
BASE_MAP.commonMethods.timeFormat = function(x, y) {
	var z = {M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
	y = y.replace(/(M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-2)});
	return y.replace(/(y+)/g,function(v) {return x.getFullYear().toString().slice(-v.length)});
}
BASE_MAP.layers.setIcon = function(iconUrl,width,height){
	width = width || 35;
	height = height || 35;
	var icon = L.icon({
		iconUrl: iconUrl,
		iconSize: [width,height]
	});
	return icon;
};
//输入年和周获取该周在该年的日期范围
BASE_MAP.commonMethods.getDateRange = function(_year,_week) {
	var beginDate;
	var endDate;
	if (_year == null || _year == '' || _week == null || _week == '') {
		return "";
	}
	beginDate = getXDate(_year, _week, 1);
	endDate = getXDate(_year, (_week - 0 + 1), 7);
	return getNowFormatDate(beginDate) + " 至 " + getNowFormatDate(endDate);

	function getNowFormatDate(theDate) {
		var day = theDate;
		var Year = 0;
		var Month = 0;
		var Day = 0;
		var CurrentDate = "";
		// 初始化时间   
		Year = day.getFullYear(); // ie火狐下都可以   
		Month = day.getMonth() + 1;
		Day = day.getDate();
		CurrentDate += Year + "-";
		if (Month >= 10) {
			CurrentDate += Month + "-";
		} else {
			CurrentDate += "0" + Month + "-";
		}
		if (Day >= 10) {
			CurrentDate += Day;
		} else {
			CurrentDate += "0" + Day;
		}
		return CurrentDate;
	}

	//这个方法将取得某年(year)第几周(weeks)的星期几(weekDay)的日期   
	function getXDate(year, weeks, weekDay) {
		// 用指定的年构造一个日期对象，并将日期设置成这个年的1月1日   
		// 因为计算机中的月份是从0开始的,所以有如下的构造方法   
		var date = new Date(year, "0", "1");
		// 取得这个日期对象 date 的长整形时间 time   
		var time = date.getTime();
		// 将这个长整形时间加上第N周的时间偏移   
		// 因为第一周就是当前周,所以有:weeks-1,以此类推   
		// 7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)   
		time += (weeks - 1) * 7 * 24 * 3600000;
		// 为日期对象 date 重新设置成时间 time   
		date.setTime(time);
		return getNextDate(date, weekDay);
	}
	// 这个方法将取得 某日期(nowDate) 所在周的星期几(weekDay)的日期   
	function getNextDate(nowDate, weekDay) {
		// 0是星期日,1是星期一,...   
		weekDay %= 7;
		var day = nowDate.getDay();
		var time = nowDate.getTime();
		var sub = weekDay - day;
		if (sub <= 0) {
			sub += 7;
		}
		time += sub * 24 * 3600000;
		nowDate.setTime(time);
		return nowDate;
	}
};
BASE_MAP.layers.setPopup = function(layer,content,opts){
	var obj = {maxWidth: 1000, maxHeight: 800};
	opts = BASE_MAP.commonMethods.setOptions(obj,opts);
	var popup = new L.popup(opts)
		.setContent(content);
	layer.bindPopup(popup);
};
BASE_MAP.layers.setMarker = function(obj){
	var layer = obj.layer || BASE_MAP.layers.civicismLayer,
		point = obj.point,
		name = obj.name || 'A Marker',
		markerIcon = obj.icon,
		content = obj.content || 'A Marker';
	var marker = L.marker(point, {
		title: name, icon: markerIcon, keepInView: true
	});
	BASE_MAP.layers.setPopup(marker,content);
	marker.addTo(layer);
};
BASE_MAP.layers.heatMapRenderer = function(arr){
	var cfg = {
		// radius should be small ONLY if scaleRadius is true (or small radius is intended)
		"radius": 0.1,
		"maxOpacity": 1,
		// scales the radius based on map zoom
		"scaleRadius": true,
		// if set to false the heatmap uses the global maximum for colorization
		// if activated: uses the data maximum within the current map boundaries
		//   (there will always be a red spot with useLocalExtremas true)
		"useLocalExtrema": true,
		// which field name in your data represents the latitude - default "lat"
		latField: 'lat',
		// which field name in your data represents the longitude - default "lng"
		lngField: 'lng',
		// which field name in your data represents the data value - default "value"
		valueField: 'value'
	};
	var testData = {data: arr};
	var heatMapLayer = new HeatmapOverlay(cfg);
	BASE_MAP.map.addLayer(heatMapLayer);
	heatMapLayer.setData(testData);
	BASE_MAP.layers.heatMapLayer = heatMapLayer;
	//添加到图层控制器
	BASE_MAP.layers.addToLayerControl(heatMapLayer,'热力渲染');
};
BASE_MAP.layers.addToLayerControl = function(layer,name){
	BASE_MAP.layers.layersControl.addOverlay(layer,name);
};
BASE_MAP.layers.clearLayer = function(layerName){
	BASE_MAP.layers[layerName] && (BASE_MAP.map.removeLayer(BASE_MAP.layers[layerName]),BASE_MAP.layers.layersControl.removeLayer(BASE_MAP.layers[layerName]));
};