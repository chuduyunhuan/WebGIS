<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<c:set var="ctx" value='<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7))+"/WebGIS" %>' />
<c:set var="static_home" value='<%=request.getRequestURL().substring(0,request.getRequestURL().indexOf("/", 7))+"/WebGIS/static" %>' />
<fmt:setLocale value="zh_CN" /> 
<script type="text/javascript" src="${ctx}/static/jquery/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
	var BASE_HOST = window.location.hostname,
		BASE_PORT = window.location.port;
	var BASE_STATIC = '${static_home}';
	var SERVER_URL = 'http://' + BASE_HOST + ':' + BASE_PORT;
	BASE_HOST == 'localhost' && (SERVER_URL = 'http://localhost:3000/proxy-server');
</script>
