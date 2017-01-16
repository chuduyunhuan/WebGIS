<!DOCTYPE html>
<html lang="zh-CN">
<head>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<meta charset="UTF-8" http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>React示例</title>
<%@ include file="/common/React.jsp"%>
<%@ include file="/common/Bootstrap.jsp"%>
</head>
<body>
<div id="map" ></div>
<div id="tweet" ></div>
<div id="hello"></div>
<div id="grocery"></div>
<div id="date"></div>
<div id="control"></div>
<script type="text/babel" src="${ctx}/scripts/src/react.js"></script>
</body>
</html>