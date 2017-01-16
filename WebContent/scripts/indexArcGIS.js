/**
 * ArcGIS地图引擎搭建
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
		// BASE_MAP.addBaseMap(id,opts);
		// BASE_MAP.addTDTMap(id,opts);
		BASE_MAP.addQQMap(id,opts);
	}
};
BASE_MAP.setMapOptions = function(opts){
	var obj = {
		center: [121.463992,31.147534],
		showLabels: true,
		logo: false,
		showAttribution: false,
		nav: false,
		sliderStyle: 'large',
		zoom: 10,
		maxZoom: 17,
		minZoom: 10
	};
	return BASE_MAP.commonMethods.setOptions(obj,opts);
};
BASE_MAP.addBaseMap = function(id,opts){
	opts = BASE_MAP.setMapOptions(opts);
	require(["esri/map","esri/layers/WebTiledLayer"], function(Map,WebTiledLayer) {
		var baseArcGISMap = new Map(id, opts);	
		var normalMap = new WebTiledLayer('http://10.221.247.7:8080/Tiles/${level}/${col}/${row}.png',{id: 'layer_normal'});
		var satelliteMap = new WebTiledLayer('http://10.221.247.7:8080/sh/satelliteBingMap/${level}/${col}/${row}.jpg',{id: 'layer_satellite'});			
		baseArcGISMap.addLayer(normalMap);
		baseArcGISMap.addLayer(satelliteMap);
		BASE_MAP.map = baseArcGISMap;
	});
};
BASE_MAP.addTDTMap = function(id,opts){
	opts = BASE_MAP.setMapOptions(opts);
	require(["esri/map","tdtlib/TDTLayer","tdtlib/TDTAnnoLayer"], function(Map,TDTLayer,TDTAnnoLayer) {
		var baseArcGISMap = new Map(id, opts);
		var basemap = new TDTLayer();
		baseArcGISMap.addLayer(basemap);
		var annolayer=  new TDTAnnoLayer();
		baseArcGISMap.addLayer(annolayer);
		BASE_MAP.map = baseArcGISMap;
	});
};
BASE_MAP.addQQMap = function(id,opts){
	opts = BASE_MAP.setMapOptions(opts); 
	require(["esri/map","qqlib/QQLayer"], function(Map,QQLayer) {
		var baseArcGISMap = new Map(id, opts);
		var basemap = new QQLayer();
		baseArcGISMap.addLayer(basemap);
		BASE_MAP.map = baseArcGISMap;
	});
};
BASE_MAP.commonMethods.setOptions = function(obj,opts){
	for(var name in opts){
		opts.hasOwnProperty(name) && (obj[name] = opts[name]);
	}
	return obj;
};