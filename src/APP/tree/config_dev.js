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

/********【开发环境配置】,如有新增配置，请保持dev\master\producation\stage同步**********/

window.config = {
	/***********************公共资源服务**************************/
	//基础服务域名
	'DOMAIN': 'http://47.104.160.65:6530',

	//静态文件存储服务IP
	'STATIC_FILE_IP':'http://47.104.160.65',
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
	'DOC_EXCHANGE_URL': 'http://47.104.160.65:6545',
	//现场收发文接口验证用的用户名和密码
	'DOC_EXCHANGE_USER_PASSWORD': 'bimtest:bimtest',

	//node服务,验评表单转化Word,pdf转word
	'NODE_FILE_STATIC_URL': 'http://47.104.160.65:6546',
	
	//word在线预览地址
	'previewWord_API': 'http://10.215.160.40:6500/view/url?url=',

	//领导带班服务,安全监测动态加载模板
	'Leader_Class_URL': 'http://10.215.160.38:6592',

	//FDBServer 上传FDB文件服务
	'FDBServer_API': 'http://10.215.160.37:8045/api',
	//WJH插件的下载地址
	'WJH_CITY_MARKER':'http://10.215.160.38:6542/media/documents/meta/CityMaker_IE_Plugin_vConnect8.0.171106.exe',
	//三维展示里面的cep模型数据
	'WJH_CEP':'http://10.215.160.37:8006/qhtdbx20171212/qhtdbx.cep', 

	//地图瓦片地址
	'cus_tilemap':'http://10.215.160.39:6580',
	'WMSTileLayerUrl':'http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}',
	'IMG_W':'http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
	'VEC_W':'http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}',
	'IMG_1':'http://47.104.159.127:200/1?T=img_1&X={x}&Y={y}&L={z}',
	'IMG_2':'http://47.104.159.127:200/2?T=img_2&X={x}&Y={y}&L={z}',
	'IMG_3':'http://47.104.159.127:200/3?T=img_3&X={x}&Y={y}&L={z}',
	'IMG_4':'http://47.104.159.127:200/4?T=img_4&X={x}&Y={y}&L={z}',
	'IMG_5':'http://47.104.159.127:200/5?T=img_5&X={x}&Y={y}&L={z}',

	//视频监控插件下载配置
	'Video_PLUGIN_URL':'http://47.104.160.65:6512/media/documents/meta/WebComponentsKithas_rem_cfg.exe',

	/***********************单模块资源服务**************************/
	//智慧森林
	//智慧森林域名
	'FORESTDOMAIN':"http://120.24.210.86",//阿里云
	// 'FORESTDOMAIN':"http://10.215.160.45",//院内
	// 'FORESTDOMAIN':"http://192.168.3.33",
	//智慧森林端口
	'FORESTPORT':"227",//阿里云
	// 'FORESTPORT':"6540",//院内
	//苗圃定位模板
	'nurseryLocation':"http://47.104.160.65:6510/media/documents/2017/11/nurseryLocation.xlsx",

	//720云
	'PANORAMAGRAM_LOC_CODE': 'PANORAMA_ROOT',//全景图位置树根节点编码值
	'Video360_API': 'http://720yun.com/t/16fjzOmksu8?from=singlemessage&isappinstalled=0&pano_id=6700576',
	'Video360_API2': 'http://720yun.com/t/16fjzOmksu8?from=singlemessage&isappinstalled=0&pano_id=6700576',

	/***********************临时资yu源服务**************************/
	'initLeaflet': {
		center: [22.516818, 113.868495],   //前海
		zoomControl: false,
		zoom: 14,
		maxZoom: 18,
		minZoom: 13,
		maxBounds: [[22.564885, 113.827781], [22.468466, 113.931283]]
	},
	'fullExtent': {
		minlat: 22.468466,
		maxlat: 22.564885,
		minlng: 113.827781,
		maxlng: 113.931283
	},
	//个人考勤的上下班时间，如果当前的部门未配置的话拿此上下班时间，用[--]分开，此处必须配置
	'IN_OFF_DUTY':'08:30:00--18:00:00',
	//现场收发文的短信模板NAME和CODE
	'DISPATCH_MSG':{
		'NAME':'BIM系统',
		'CODE':'SMS_100920102'
	}
};