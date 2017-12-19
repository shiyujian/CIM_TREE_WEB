/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
/**
【数字化研发部】配置文件添加和修改暂行规范,不宜删除以下说明
1.config.js和api.js注意区别,config.js主要是IP和端口,api.js主要是服务的组织;
2.根据重要级别进行模块化组织，参考以下格式和顺序进行配置:
	//公共资源服务,同级别IP和端口需同时出现,例如:基础服务,静态文件存储服务,流程管理服务等;
	//单模块资源服务,只是针对单个模块使用的服务,例如:巡检模块,安全监测模块等;
	//临时资源服务
	//静态常量
3.IP、端口和服务地址必须做出说明
4.在src/_platform/API.js和src下所有源码当中,不能出现IP和端口固定的情况;
*/

/********【生产环境配置】,如有新增配置，请保持dev\master\producation\stage同步**********/

window.config = {
	
	/***********************公共资源服务**************************/
	//基础服务域名
	'DOMAIN': 'http://192.168.3.33',
	'DOMAIN2':'http://192.168.3.33',
	//基础服务端口
	'API_PORT': '6530',

	'DNG_PORT': '6511', // DNG 端口
	'USER': 'bimqh',

	//静态文件存储服务IP
	'STATIC_FILE_IP':'http://192.168.3.33',
	//静态文件存储服务预览端口
	'STATIC_PREVIEW_PORT':'6510',
	//静态文件存储服务上传端口
	'STATIC_UPLOAD_PORT':'6511',
	//静态文件存储服务下载端口
	'STATIC_DOWNLOAD_PORT':'6512',
	//静态文件存储服务访问用户和密码
	'STATIC_FILE_USER':'bimxan',
	'STATIC_FILE_PASSWORD':'ecidibim',
	
	//现场收发文接口的端口
	'DOC_EXCHANGE_PORT': '6545',
	//现场收发文接口验证用的用户名和密码
	'DOC_EXCHANGE_USER_PASSWORD': 'bimqh:bimqh',
	'CODE_API': 'http://192.168.3.33:6556',
	//node服务,验评表单转化Word
	'NODE_FILE_EXCHANGE_PORT': '6546',
	//'NODE_FILE_EXCHANGE_PORT': '6525',
	'NODE_FILE_STATIC_API': 'http://10.215.160.45:6511',
	
	//word在线预览地址
	'previewWord_API': 'http://192.168.3.94:9000/view/url?url=',
	//下载文档--未转发过的地址
	'Leader_Class_URL': 'http://10.215.160.38:6593',

	//FDBServer 上传FDB文件服务
	'FDBServer_API': 'http://192.168.3.94:8045/api',
	//WJH插件的下载地址
	'WJH_CITY_MARKER':'http://192.168.3.94:8000/download/CityMaker_IE_Plugin_vConnect.exe',
	//三维展示里面的cep模型数据
	'WJH_CEP':"http://192.168.3.94:8000/download/Package_xa0906/xa0906.cep",
	
	//地图瓦片地址
	'cus_tilemap':'http://192.168.3.33:8000',//自己的地图瓦片地址
	//天地图的WMSTileLayerUrl
	'WMSTileLayerUrl':'http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}',
	'IMG_W':'http://192.168.3.33:8000/layers/tianditusat/{z}/{x}/{y}.png',
	'VEC_W':'http://192.168.3.33:8000/layers/tianditu/{z}/{x}/{y}.png',

	/***********************单模块资源服务**************************/
	//智慧森林
	//智慧森林域名
	//'FORESTDOMAIN':"http://120.24.215.190",//阿里云
	'FORESTDOMAIN':"http://bim1.ecidi.com",//院内
	// 'FORESTDOMAIN':"http://192.168.3.33",
	//智慧森林端口
	//'FORESTPORT':"227",//阿里云
	'FORESTPORT':"6540",//院内
	//苗圃定位模板
	'nurseryLocation':"http://bimcd.ecidi.com:6540/media/documents/2017/11/nurseryLocation.xlsx",

	/***********************临时资源服务**************************/

	//720云
	'PANORAMAGRAM_LOC_CODE': 'PANORAMA_ROOT',//全景图位置树根节点编码值
	'Video360_API' : 'http://192.168.3.33:6512/media/documents/2017/09/test.mp4',
	'Video360_API2': 'http://192.168.3.33:6512/media/documents/2017/09/test.mp4',

	/******************Leaflet Map ****************/
	
	'initLeaflet': {
		center: [38.92, 115.98],   //雄安
		zoomControl: false,
		zoom: 14,
		maxZoom: 17,
		minZoom: 14,
		maxBounds: [[39.10,115.70], [38.75,116.25]]
	},

	//个人考勤的上下班时间，如果当前的部门未配置的话拿此上下班时间，用[--]分开，此处必须配置

	'IN_OFF_DUTY':'08:30:00--18:00:00',
	//现场收发文的短信模板NAME和CODE
	'DISPATCH_MSG':{
		'NAME':'BIM系统',
		'CODE':'SMS_100920102'
	},

	//综合管理系统登录操作
	'ZHLoginServletCMD':'http://xaweb.simulate.com:8080/eccms/servlet/LoginServlet.cmd',

	//综合展示360全景部署
	'dashboardVideo360API':'http://192.168.3.94/QJ/容城'
};