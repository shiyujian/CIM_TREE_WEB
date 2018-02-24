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
	'DOMAIN': 'http://192.168.192.10:7530',

	//静态文件存储服务IP
	'STATIC_FILE_IP':'http://192.168.192.10',
	//静态文件存储服务预览端口
	'STATIC_PREVIEW_PORT':'7510',
	//静态文件存储服务上传端口
	'STATIC_UPLOAD_PORT':'7511',
	//静态文件存储服务下载端口
	'STATIC_DOWNLOAD_PORT':'7512',
	//静态文件存储服务访问用户和密码
	'STATIC_FILE_USER':'qianhai',
	'STATIC_FILE_PASSWORD':'qianhai',

	//现场收发文接口的端口
	'DOC_EXCHANGE_URL': 'http://10.215.160.41:6556',
	//现场收发文接口验证用的用户名和密码
	'DOC_EXCHANGE_USER_PASSWORD': 'bimqh:bimqh',

	//开发环境配置,部署时记得修改
	//node服务,验评表单转化Word,pdf转word
	'NODE_FILE_STATIC_URL': 'http://10.215.160.38:6546',
	
	//word在线预览地址
	'previewWord_API': 'http://192.168.192.11:80/view/url?url=',
	//下载文档--未转发过的地址
	'Leader_Class_URL': 'http://10.215.160.38:6593',
	
	//WJH插件的下载地址
	'WJH_CITY_MARKER':'http://192.168.192.10:7512/media/documents/meta/CityMaker_IE_Plugin_vConnect8.0.171106.exe',
	//三维展示里面的cep模型数据
	'WJH_CEP':'http://192.168.192.12:80/qianhai/qhtdbx.cep', 

	//地图瓦片地址
	'cus_tilemap':'http://192.168.192.10:8100',
	//天地图的WMSTileLayerUrl
	'WMSTileLayerUrl':'http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}',
	'IMG_W':'http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
	'VEC_W':'http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}',
	/***********************单模块资源服务**************************/
	//智慧森林
	//智慧森林域名
	'FORESTDOMAIN':"http://120.79.72.17",//阿里云
	// 'FORESTDOMAIN':"http://10.215.160.45",//院内
	// 'FORESTDOMAIN':"http://192.168.3.33",
	//智慧森林端口
	'FORESTPORT':"227",//阿里云
	// 'FORESTPORT':"6540",//院内
	//苗圃定位模板
	'nurseryLocation':"http://10.215.160.38:6540/media/documents/2017/11/nurseryLocation.xlsx",

	//720云
	//'Video360_API' : 'http://720yun.com/t/59e24jfOcya',
    'PANORAMAGRAM_LOC_CODE': 'PANORAMA_ROOT',//全景图位置树根节点编码值
	'Video360_API': 'http://720yun.com/t/16fjzOmksu8?from=singlemessage&isappinstalled=0&pano_id=6700576',
	'Video360_API2': 'http://720yun.com/t/16fjzOmksu8?from=singlemessage&isappinstalled=0&pano_id=6700576',
	/***********************临时资源服务**************************/


	/******************Leaflet Map ****************/
	'initLeaflet': {
		center: [22.516818, 113.868495],   //前海
		zoomControl: false,
		zoom: 14,
		maxZoom: 18,
		minZoom: 13,
		maxBounds: [[22.564885, 113.827781], [22.468466, 113.931283]]
	},

	//个人考勤的上下班时间，如果当前的部门未配置的话拿此上下班时间，用[--]分开，此处必须配置
	'IN_OFF_DUTY':'08:30:00--18:00:00',
	//现场收发文的短信模板NAME和CODE
	'DISPATCH_MSG':{
		'NAME':'BIM系统',
		'CODE':'SMS_100920102'
    }
};
