<!DOCTYPE html>
<html lang="zh-CN">
<head>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<meta charset="UTF-8" http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OpenLayers3地图首页</title>
<%@ include file="/common/OpenLayers3.jsp"%>
<link rel="stylesheet" href="${static_home}/styles/css/indexOpenLayers3.css">
</head>
<body>
<div id="map" class="map"></div>
<script type="text/javascript" src="${ctx}/scripts/indexOpenLayers3.js"></script>
<script type="text/javascript">
	$(document).ready(function(){
		BASE_MAP.init('map',{zoom: 13});
	});
</script>
</body>
</html>