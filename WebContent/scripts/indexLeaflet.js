/**
 * leaflet-baidu地图引擎搭建
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-09-22 15:25:49
 * @version $Id$
 */
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