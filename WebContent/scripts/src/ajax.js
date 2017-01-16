/**
 * ES6练习
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-12-09 09:56:51
 * @version $Id$
 */
 "use strict";
 const AJAX = {
 	hotSpots: ['迪士尼','世卫大会','MWC'],
 	dataCol: [],
 	init: () => {
 		AJAX.hotSpots.map(val => {
 			const url = 'http://10.221.247.7:8080/services/ws/fast_query/area/re/re_cellByHotname?hotspot=' + encodeURIComponent(val);
 			const jqDeferred = AJAX.ajaxCall({url: url});
 			jqDeferred.then(response => {
 				AJAX.dataCol.push(response);
 			}).then(() => {
 				console.log(AJAX.dataCol);
 			});
 		});
 	},
	ajaxCall: async function(obj) {
		const url = obj.url;
		const type = obj.type || 'get';
		const data = obj.data;
		const dataType = obj.dataType || 'json';
		const result = await $.ajax({
			url: url,
			type: type,
			// contentType: 'application/json',
			dataType: dataType,
			data: data
		});
		return result;
	}
 };
 AJAX.init();

 class myAjax {
 	constructor(arr) {
 		this.init(arr);
 	}

 	init(arr) {
 		arr.map(val => {
 			console.log(val);
 		});
 	}
 }
 const ajax = new myAjax(AJAX.hotSpots);
