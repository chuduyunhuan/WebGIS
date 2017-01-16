/**
 * OpenLayers3地图引擎搭建
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-09-22 15:25:49
 * @version $Id$
 */
//命名空间
var BASE_MAP = {
	map: {},
	view: {},
	layers: {},
	commonMethods: {},
	init: function(id,opts){
		BASE_MAP.addBaseMap(id,opts);
	}
};
BASE_MAP.addBaseMap = function(id,opts){
	var view = BASE_MAP.setView(opts);
	var layers = BASE_MAP.setBaseLayers();
	var controls = BASE_MAP.setControls();
	var map = new ol.Map({
		view: view,
		controls: controls,
		layers: layers,
		target: id
	});
	BASE_MAP.map = map;
	BASE_MAP.view = view;
};
BASE_MAP.setView = function(opts){
	opts = $.extend({
		projection: 'EPSG:4326',
		center: [121.518992,31.147534],
		maxZoom: 18,
		minZoom: 4,
		zoom: 9
	},opts);
	return new ol.View(opts);
};
BASE_MAP.setBaseLayers = function(){
	var baseLayer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
	return [baseLayer];
};
BASE_MAP.setControls = function(){
	var controls = new ol.control.defaults({attribution: false});
	return controls.extend([
		// new ol.control.FullScreen(),
		new ol.control.MousePosition(),
		// new ol.control.OverviewMap(),
		new ol.control.ScaleLine()
		// new ol.control.ZoomSlider()
		// new ol.control.ZoomToExtent()
	]);
};