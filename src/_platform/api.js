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
window.config = window.config || {};
let DOMAIN,SDOMAIN,USER, PASSWORD, TREE_CODE, STATIC_FILE_IP;

DOMAIN = window.config.DOMAIN;
SDOMAIN = window.config.SDOMAIN;
USER = window.config.STATIC_FILE_USER;
PASSWORD = window.config.STATIC_FILE_PASSWORD;
STATIC_FILE_IP = window.config.STATIC_FILE_IP;


/***********************公共资源服务**************************/
export { DOMAIN, USER, PASSWORD, TREE_CODE };
export const CODE_PROJECT = '前海BIM';
export const base = `${DOMAIN}`;
export const EXCHANGE_API = `${DOMAIN}:${window.config.DOC_EXCHANGE_PORT}`;
export const SOURCE_API = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}`;
export const USER_API = `${base}/accounts/api`;
export const SUSER_API = `${SDOMAIN}`;
export const SERVICE_API = `${base}/service/construction/api`;
export const FILE_API = `${base}/service/fileserver`;
export const WORKFLOW_API = `${base}/service/workflow/api`;
export const PDF_FILE_API = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}`;
export const DOWNLOAD_FILE = `${SDOMAIN}:${window.config.STATIC_DOWNLOAD_PORT}`;
export const CUS_TILEMAP = window.config.cus_tilemap;
export const CODE_API = window.config.DOC_EXCHANGE_URL;
export const UPLOAD_API = `${base}/service/fileserver/api/user/files/`;
export const NODE_FILE_EXCHANGE_API = window.config.NODE_FILE_STATIC_URL;
//FDBServer API
export const FDBSERVICE_API = `${window.config.FDBServer_API}`;
export const SAFETY_MONITOR = `${base}/service/appserver`;

//质量监控地图
export const WMSTILELAYERURL = window.config.WMSTileLayerUrl;
export const TILEURLS = {
	1: window.config.IMG_W,
	2: window.config.VEC_W
};
export const DefaultZoomLevel = 14;
//文件预览的接口
export const previewWord_API = window.config.previewWord_API;
export const SAFETY_MONITOR_DOWN = window.config.Leader_Class_URL;
//静态资源文件服务==========STATIC_FILE_IP
export const STATIC_UPLOAD_API = `${STATIC_FILE_IP}:${window.config.STATIC_UPLOAD_PORT}`;
export const STATIC_DOWNLOAD_API = `${STATIC_FILE_IP}:${window.config.STATIC_DOWNLOAD_PORT}`;
export const modelServerAddress = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}/api/user/meta-files/?category=1`;
export const excelServerAddress = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}/api/user/meta-files/?category=2`;
export const wordServerAddress = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}/api/user/meta-files/?category=3`;
export const DGNAddress = `${STATIC_FILE_IP}:${window.config.STATIC_UPLOAD_PORT}/api/user/meta-files/?category=4`;
export const modelDownloadAddress = `${STATIC_FILE_IP}:${window.config.STATIC_DOWNLOAD_PORT}/media/documents/meta/`;

/***********************单模块资源服务**************************/
//登录管理
export const QRCODE_API = `${base}/service/appserver`;
//综合展示
//资料管理
//设计管理
//质量管理
// export const SubItem_WordTemplate = STATIC_UPLOAD_API + '/media/documents/meta/'+encodeURI('分项工程质量验收记录模板.docx')

//智慧森林
export const FOREST_API = `${window.config.SDOMAIN}`;
//export const FOREST_API = `${window.config.SDOMAIN}:${window.config.FORESTPORT}`;
export const FOREST_SYSTEM = `${FOREST_API}/system`;
//苗圃定位模板
export const nurseryLocation_template = STATIC_DOWNLOAD_API + '/media/documents/2017/11/' + encodeURI('nurseryLocation.xlsx');

export const SubItem_WordTemplate = `${window.config.NODE_FILE_STATIC_URL}` + '/media/documents/meta/' + encodeURI('分项工程质量验收记录模板.docx')
export const Fenbu_WordTemplate = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('分部子分部工程质量验收记录_ibqFgFg.docx')
export const Danwei_WordTemplate = STATIC_DOWNLOAD_API + "/media/documents/2017/10/%E5%8D%95%E4%BD%8D%E5%AD%90%E5%8D%95%E4%BD%8D%E5%B7%A5%E7%A8%8B%E8%B4%A8%E9%87%8F%E9%AA%8C%E6%94%B6%E8%AE%B0%E5%BD%952.docx";
//检验批
export const JYPMOD_API = STATIC_DOWNLOAD_API + '/media/documents/meta/' + 'jianyanpi.xlsx';
//进度管理DGN模型名称
export const SCHEDULE_DGN_NAME = '10号冷战-地下室-编码-0925';
export const SCHEDULE_DGN_DOWNLOAD_URL = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('10号冷战-地下室-编码-0925_0.00.zip');
export const SCHEDULE_TOTAL_PLAN_URL = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('scheduleTemplate.xlsx');
//安全管理
export const SMUrl_template0 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('测斜项目监测点批量添加模板.xlsx');
export const SMUrl_template1 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('测斜项目监测数据填报模板.xlsx');
export const SMUrl_template2 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('监测项目批量添加模板.xlsx');
export const SMUrl_template3 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('一般监测项目监测点批量添加模板.xlsx');
export const SMUrl_template4 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('一般项目监测数据填报模板.xlsx');
export const SMUrl_template11 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('scheduler.xlsx');
export const SMUrl_template12 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('RiskEvaluation.xlsx');
export const SMUrl_template13 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('Unbearable.xlsx');
export const SMUrl_template14 = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('RiskFactor.xlsx');

//造价管理
export const ESTIMATET = STATIC_DOWNLOAD_API + '/media/documents/meta/zjt-05_.xlsx';
export const CONSTRACTT = STATIC_DOWNLOAD_API + '/media/documents/meta/zjt-03_.xlsx';
export const WORKT = STATIC_DOWNLOAD_API + '/media/documents/meta/template.xlsx';
//造价管理模块api
export const UPLOADFILE_API = STATIC_FILE_IP + window.config.STATIC_UPLOAD_PORT + '/api/user/files/';
//视频监控
//三维全景
//720云预览API
export const VIDEO_PLUGIN_URL = window.config.Video_PLUGIN_URL;
export const Panorama_Root = window.config.PANORAMAGRAM_LOC_CODE;
export const Video360_API = window.config.Video360_API;
export const Video360_API2 = window.config.Video360_API2;
export const DashboardVideo360API = window.config.dashboardVideo360API;
//数据资源
//数据资源
export const DATASOURCENAME = 'dataresource'
export const DATASOURCECODE = "dataresource_total_dir"
//数据目录
export const DATASOURCEDIRNAME = 'dataresourceDir'
export const DATASOURCEDIRCODE = "dataresource_dir"
//数据目录-类型
export const DATASOURCEDIRTYPENAME = 'dataresourceDirType'
export const DATASOURCEDIRTYPECODE = "dataresource_dir_type"
//数据目录-项目
export const DATASOURCEDIRITEMNAME = 'dataresourceDirItem'
export const DATASOURCEDIRITEMCODE = "dataresource_dir_item"

//数据报送模板下载
export const DataReportTemplate_SafetyFile = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('安全文档数据填报模版.xlsx');
export const DataReportTemplate_SafetyHiddenDanger = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('安全隐患数据填报模版.xlsx');
export const DataReportTemplate_SafetySpecial = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('安全专项数据填报模版.xlsx');
export const DataReportTemplate_ConstructionUnits = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('参建单位数据填报模版.xlsx');
export const DataReportTemplate_UnitProject = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('单位工程数据填报模版.xlsx');
export const DataReportTemplate_SubdivisionUnitProjectAcceptance = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('分部分项单位项目验收信息表.xlsx');
export const DataReportTemplate_ProjectVolumeSettlement = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('工程量结算数据填报模版.xlsx');
export const DataReportTemplate_ValuationList = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('计价清单数据填报模版.xlsx');
export const DataReportTemplate_SettlementPlan = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('结算计划数据填报模版.xlsx');
export const DataReportTemplate_SettlementProgress = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('结算进度数据填报模版.xlsx');
export const DataReportTemplate_ModelType = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('模型类型附件数据填报模版.xlsx');
export const DataReportTemplate_ModalInformation = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('模型信息数据填报模版.xlsx');
export const DataReportTemplate_PersonInformation = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('人员信息数据填报模版.xlsx');
export const DataReportTemplate_DesignProgress = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('设计进度数据填报模版.xlsx');
export const DataReportTemplate_DesignInformation = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('设计信息数据填报模版.xlsx');
export const DataReportTemplate_ConstructionProgress = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('施工进度数据填报模版.xlsx');
export const DataReportTemplate_VideoMonitor = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('视频监控数据填报模版.xlsx');
export const DataReportTemplate_ProjectInformation = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('项目信息数据填报模版.xlsx');
export const DataReportTemplate_ImageInformation = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('影像信息数据填报模版.xlsx');
export const DataReportTemplate_Organization = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('组织机构数据填报模版.xlsx');
export const DataReportTemplate_QualityProblem = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('质量问题信息表模版.xlsx');

/***********************临时资源服务**************************/

/***********************静态常量**************************/
export const WORKFLOW_CODE = {
	'总进度计划报批流程': 'TEMPLATE_001',
	'表单管理流程': 'TEMPLATE_002',
	'每日进度填报流程': 'TEMPLATE_003',
	'机械设备报批流程': 'TEMPLATE_004',
	'工程材料报批流程': 'TEMPLATE_005',
	'苗木资料报批流程': 'TEMPLATE_006',
	'每日进度计划填报流程': 'TEMPLATE_007',
	'检验批验收审批流程': 'TEMPLATE_008',
	// '现场安全隐患排查工作流程': 'TEMPLATE_002',
	// '分部验收流程': 'TEMPLATE_003',
	// '周报填写流程': 'TEMPLATE_004',
	// '进度填报流程': 'TEMPLATE_005',
	// '进度节点填报流程': 'TEMPLATE_006',
	// '检验批验收流程': 'TEMPLATE_007',
	// '分项验收流程': 'TEMPLATE_008',
	// '施工包划分填报流程': 'TEMPLATE_012',
	// '总进度计划报批': 'TEMPLATE_028',
	// '申请推迟总进度计划填报流程': 'TEMPLATE_029',
	// '进度管控审批流程': 'TEMPLATE_031',
	// '安全隐患上报流程': 'TEMPLATE_011',
	// '设计计划填报流程': 'TEMPLATE_013',
	// '设计计划变更流程': 'TEMPLATE_014',
	// '设计成果上报流程': 'TEMPLATE_015',
	// '设计成果一般变更流程': 'TEMPLATE_016',
	// '设计成果重大变更流程': 'TEMPLATE_019',
	// '数据报送流程': 'TEMPLATE_033'
};

export const WORKFLOW_MAPS = {
	DESIGN_BLUEPRINT: {
		name: '图纸填报',
		desc: '图纸填报',
		code: 'TEMPLATE_001',
	},
	DESIGN_NOTICE: {
		name: '修改通知报审',
		desc: '修改通知报审',
		code: 'TEMPLATE_001',
	},
	QUALITY_ITEM: {
		name: '分项验收流程',
		desc: '分项验收流程',
		code: 'TEMPLATE_024'
	},
	OVERALL_PACKAGE: {
		name: '施工包划分填报流程',
		desc: '施工包划分填报流程',
		code: 'TEMPLATE_012'
	}
};

//获取单位工程
export const UNITS = [
	{value:'一标段'},
	{value:'二标段'},
	{value:'三标段'},
	{value:'四标段'},
	{value:'五标段'},
]

//获取单位工程
export const PROJECT_UNITS = [
	{
		code:'P009',
		value:'9号地块',
		units:[
			{
				code:'P009-01-01',
				value:'一标段'
			},{
				code:'P009-01-02',
				value:'二标段'
			},{
				code:'P009-01-03',
				value:'三标段'
			},{
				code:'P009-01-04',
				value:'四标段'
			},{
				code:'P009-01-05',
				value:'五标段'
			},
		]
	},{
		code:'P010',
		value:'十万亩苗景兼用林',
		units:[
			{
				code:'P010-01-01',
				value:'一标段'
			},{
				code:'P010-01-02',
				value:'二标段'
			},{
				code:'P010-01-03',
				value:'三标段'
			},{
				code:'P010-01-04',
				value:'四标段'
			},{
				code:'P010-02-05',
				value:'五标段'
			},{
				code:'P010-03-06',
				value:'六标段'
			}
		]
	}
]

//获取单位工程
export const FORESTTYPE = [
	{	
		id:1,
		name:'常绿乔木',
		children:[
			{
				id:1001,
				name:'油松'
			},
			{
				id:1002,
				name:'白皮松'
			},
			{
				id:1003,
				name:'华山松'
			},
			{
				id:1004,
				name:'桧柏'
			},
			{
				id:1005,
				name:'侧柏'
			}
		]
	},
	{	
		id:2,
		name:'落叶乔木',
		children:[
			{
				id:2001,
				name:'白蜡'
			},
			{
				id:2002,
				name:'白榆'
			},
			{
				id:2003,
				name:'杜梨'
			},
			{
				id:2004,
				name:'垂柳'
			},
			{
				id:2005,
				name:'杜仲'
			},
			{
				id:2006,
				name:'刺槐'
			},
			{
				id:2007,
				name:'七叶树'
			},
			{
				id:2008,
				name:'枫杨'
			},
			{
				id:2009,
				name:'国槐'
			},
			{
				id:2010,
				name:'苦楝'
			},
			{
				id:2011,
				name:'旱柳'
			},
			{
				id:2012,
				name:'核桃'
			},
			{
				id:2013,
				name:'金叶复叶槭'
			},
			{
				id:2014,
				name:'红花洋槐'
			},
			{
				id:2015,
				name:'金叶白蜡'
			},
			{
				id:2016,
				name:'金叶榆'
			},
			{
				id:2017,
				name:'栾树'
			},
			{
				id:2018,
				name:'柿树'
			},
			{
				id:2019,
				name:'银杏'
			},
			{
				id:2020,
				name:'玉兰'
			},
			{
				id:2021,
				name:'元宝枫'
			},
			{
				id:2022,
				name:'楸树'
			},
			{
				id:2023,
				name:'糠椴'
			},
			{
				id:2024,
				name:'五角枫'
			},
			{
				id:20125,
				name:'丝棉木'
			}
		]
	},
	{	
		id:3,
		name:'亚乔木',
		children:[
			{
				id:3001,
				name:'大山樱'
			},
			{
				id:3002,
				name:'北美海棠'
			},
			{
				id:3003,
				name:'碧桃'
			},
			{
				id:3004,
				name:'撒金碧桃'
			},
			{
				id:3005,
				name:'木瓜海棠'
			},
			{
				id:3006,
				name:'垂丝海棠'
			},
			{
				id:3007,
				name:'黄栌'
			},
			{
				id:3008,
				name:'密枝红叶李'
			},
			{
				id:3009,
				name:'日本晚樱'
			},
			{
				id:3010,
				name:'日本早樱'
			},
			{
				id:3011,
				name:'文冠果'
			},
			{
				id:3013,
				name:'山桃'
			},
			{
				id:3014,
				name:'山杏'
			},
			{
				id:3015,
				name:'贴梗海棠'
			},
			{
				id:3016,
				name:'西府海棠'
			},
			{
				id:3018,
				name:'樱花'
			},
			{
				id:3020,
				name:'紫叶碧桃'
			},
			{
				id:3021,
				name:'紫叶矮樱'
			},
			{
				id:3023,
				name:'紫叶李'
			}
		]
	},
	{	
		id:4,
		name:'灌木',
		children:[
			{
				id:4002,
				name:'丁香'
			},
			{
				id:4003,
				name:'锦带'
			},
			{
				id:4004,
				name:'黄刺玫'
			},
			{
				id:4005,
				name:'棣棠'
			},
			{
				id:4006,
				name:'暴马丁香'
			},
			{
				id:4007,
				name:'柽柳'
			},
			{
				id:4008,
				name:'连翘'
			},
			{
				id:4009,
				name:'迎春'
			},
			{
				id:4010,
				name:'沙地柏'
			},
			{
				id:4011,
				name:'榆叶梅'
			}
		]
	},{
		id:5,
		name:'草本',
		children:[
			{
				id:5001,
				name:'草花组合'
			},
			{
				id:5002,
				name:'粉黛乱子草'
			},
			{
				id:5003,
				name:'狼尾草'
			},
			{
				id:5014,
				name:'千屈菜'
			}
		]
	},{
		id:6,
		name:'乔木',
		children:[

		]
	},{
		id:7,
		name:'乔灌',
		children:[

		]
	}
	
]

export const MODULES = [
	{
		id: 'HOME',
		name: '首页',
	}, {
		id: 'DASHBOARD',
		name: '综合展示',
		children: [{
			id: 'DASHBOARD.ONSITE',
			name: '二维展示',
		}, {
			id: 'DASHBOARD.PLAN',
			name: '巡检路线',
		}, {
			id: 'DASHBOARD.DANGER',
			name: '安全隐患',
		}, {
			id: 'DASHBOARD.PROJECT',
			name: '工程影像',
		}]
	}, {
		id: 'OVERALL',
		name: '综合管理',
		children: [{
			id: 'OVERALL.NEWS',
			name: '新闻通知'
		}, {
			id: 'OVERALL.DISPATCH',
			name: '现场收发文'
		}, {
			id: 'OVERALL.MATERAIL',
			name: '物资管理'
		}, {
			id: 'OVERALL.FORM',
			name: '表单管理'
		}, {
			id: 'OVERALL.CHECKIN',
			name: '考勤管理'
		}]
	}, {
		id: 'DATUM',
		name: '资料管理',
		children: [{
			id: 'DATUM.STANDARD',
			name: '制度规范'
		}, {
			id: 'DATUM.ENGINEERING',
			name: '工程文档'
		}, {
			id: 'DATUM.REDIOS',
			name: '工程影像'
		}]
	}, {
		id: 'QUALITY',
		name: '质量管理',
		children: [{
			id: 'QUALITY.TONGJI',
			name: '质量分析',
		}, {
			id: 'QUALITY.SCORE',
			name: '质量评分',
			children: [{
				id: 'QUALITY.SCORE.SEARCH',
				name: '质量管理检查记录',
			}]
		}, {
			id: 'QUALITY.APPRAISING',
			name: '质量评优',
		}, {
			id:'QUALITY.YANSHOU',
			name: '质量验收',
			children: [{
				id: 'QUALITY.CHECK',
				name: '检验批验收',
			},{
				id: 'QUALITY.TIANBAO',
				name: '进场材料填报',
			}, {
				id: 'QUALITY.QUERY',
				name: '验收查询',
			}, {
				id: 'QUALITY.HUAFEN',
				name: '检验批划分',
			}, {
				id: 'QUALITY.SUBITEM',
				name: '分项验收',
			}, {
				id: 'QUALITY.FENBU',
				name: '分部验收',
			}, {
				id: 'QUALITY.DANWEI',
				name: '单位工程验收',
			}]
		}, {
			id: 'QUALITY.DEFECT',
			name: '质量缺陷',
		}, {
			id: 'QUALITY.QUALITYANALYZE',
			name: '种植质量分析',
		}, {
			id: 'QUALITY.FAITHANALYZE',
			name: '诚信供应商分析',
		}]
	},{
		id: 'SCHEDULE',
		name: '进度管理',
		children: [{
			id: 'SCHEDULE.STAGEREPORT',
			name: '进度填报',
		}, {
			id: 'SCHEDULE.PROPROGRESS',
			name: '项目进度',
		}, {
			id: 'SCHEDULE.ENTERANALYZE',
			name: '苗木进场分析',
		}, {
			id: 'SCHEDULE.SCHEDULEANALYZE',
			name: '种植进度分析',
		}, {
			id: 'SCHEDULE.SHOW',
			name: '种植进度展示',
		}]
	}, {
		id: 'SAFETY',
		name: '安环管理',
		children: [
			{
				id: 'SAFETY.TREND',
				name: '安全动态',
			}, {
				id: 'SAFETY.SYSTEM',
				name: '安全体系',
			}, {
				id: 'SAFETY.HIDDENDANGER',
				name: '安全隐患',
			},
			{
				id: 'SAFETY.DANGEROUSSOURCEMANAGEMENT',
				name: '安全文明施工',
				children: [
					{
						id: 'SAFETY.RISKEVALUATION',
						name: '危险源风险评价',
					}, {
						id: 'SAFETY.UNBEARABLE',
						name: '环境保护',
					}, {
						id: 'SAFETY.RISKFACTOR',
						name: '文明施工',
					}
				]
			},
			{
				id: 'SAFETY.EDUCATIONREGISTER',
				name: '安全教育',
			},
			{
				id: 'SAFETY.SAFETYTREND',
				name: '安全动态管理',
			}
		]
	}, {
		id: 'FOREST',
		name: '森林大数据',
		children: [{
			id: 'FOREST.INFO',
			name: '苗木大数据',
			children: [{
				id: 'FOREST.NURSOVERALLINFO',
				name: '苗木综合信息',
			}, {
				id: 'FOREST.NURSMEASUREINFO',
				name: '苗圃测量信息',
			}, {
				id: 'FOREST.LOCMEASUREINFO',
				name: '现场测量信息',
			}, {
				id: 'FOREST.SUPERVISORINFO',
				name: '监理验收信息',
			}, {
				id: 'FOREST.OWNERINFO',
				name: '业主抽查信息',
			}, {
				id: 'FOREST.CONTRASTINFO',
				name: '苗木对比信息',
			}, {
				id: 'FOREST.FAITHINFO',
				name: '供应商诚信信息',
			}]
		}, {
			id: 'FOREST.FOREST.IMPORT',
			name: '数据导入',
			children: [{
				id: 'FOREST.DATAIMPORT',
				name: '定位数据导入',
			}]
		}]
	}
	// , {
	// 	id: 'RECEIVE',
	// 	name: '收发货管理',
	// 	children: [{
	// 		id: 'RECEIVE.RECEIVEMANAGEMENT',
	// 		name: '收货管理',
	// 	}, {
	// 		id: 'RECEIVE.DISTRIBUTIONMANAGEMENT',
	// 		name: '发放管理',
	// 	}, {
	// 		id: 'RECEIVE.INVENTORYMANAGEMENT',
	// 		name: '库存管理',
	// 	}]
	// }
	, {
		id: 'SELFCARE',
		name: '个人中心',
		children: [{
			id: 'SELFCARE.TASK',
			name: '个人任务',
		}, {
			id: 'SELFCARE.QUERY',
			name: '个人考勤',
		}, {
			id: 'SELFCARE.LEAVE',
			name: '个人请假',
		}, {
			id: 'SELFCARE.ACCOUNT',
			name: '账号管理',
		}]
	}, {
		id: 'SYSTEM',
		name: '系统设置',
		children: [
			{
				id: 'SYSTEM.ROLE',
				name: '角色设置'
			}, {
				id: 'SYSTEM.PERMISSION',
				name: '权限设置'
			}, {
				id: 'SYSTEM.PERSON',
				name: '用户管理'
			}, {
				id: 'SYSTEM.WORKFLOW',
				name: '流程设置'
			}, {
				id: 'SYSTEM.ORG',
				name: '组织机构'
			}, {
				id: 'SYSTEM.ORGDATA',
				name: '组织机构填报'
			}, {
				id: 'SYSTEM.PERSONSDATA',
				name: '人员信息填报'
			}
		]
	}, {
		id: 'PROJECT',
		name: '项目管理',
		children: [
			{	
				id:'PROJECT.LANDAREA',
				name: '地块区域',
				children: [{
					id: 'PROJECT.PLOTMAGE',
					name: '地块管理',
				}, {
					id: 'PROJECT.AREAMANAGE',
					name: '区域管理',
				}, {
					id: 'PROJECT.SECTIONMANAGE',
					name: '标段管理',
				}, {
					id: 'PROJECT.SMALLCLASS',
					name: '小班管理',
				}, {
					id: 'PROJECT.THINCLASS',
					name: '细班管理',
				}]
			}, {
				id:'PROJECT.PROMANAGE',
				name: '工程管理',
				children: [{
					id: 'PROJECT.PLOTSET',
					name: '地块设置',
				}, {
					id: 'PROJECT.AREASET',
					name: '区域设置',
				}, {
					id: 'PROJECT.UNITPRO',
					name: '单位工程',
				}, {
					id: 'PROJECT.SUBUNITPRO',
					name: '子单位工程',
				}, {
					id: 'PROJECT.SUBPRO',
					name: '分部工程',
				}, {
					id: 'PROJECT.ITEMPRO',
					name: '分项工程',
				}]
			}, {
				id:'PROJECT.ORG',
				name: '组织机构',
				children: [{
					id: 'PROJECT.ORGTYPE',
					name: '类型管理',
				}, {
					id: 'PROJECT.UNITMANAGE',
					name: '单位管理',
				}, {
					id: 'PROJECT.BRANCHMANAGE',
					name: '部门管理',
				}]
			}, {
				id:'PROJECT.DATAMANAGE',
				name: '资料管理',
				children: [{
					id: 'PROJECT.STANDARD',
					name: '制度标准',
				}, {
					id: 'PROJECT.ENGINEERINGIMAGE',
					name: '工程影像',
				}, {
					id: 'PROJECT.PRODOC',
					name: '工程文档',
				}, {
					id: 'PROJECT.KEYWORD',
					name: '工程字段',
				}, {
					id: 'PROJECT.TEMPLATE',
					name: '模板配置',
				}, {
					id: 'PROJECT.DICTIONARIES',
					name: '工程文档字典',
				}]
			}, {
				id:'PROJECT.OVERALLMANAGE',
				name: '综合管理',
				children: [{
					id: 'PROJECT.MATERIAL',
					name: '物资管理',
				}, {
					id: 'PROJECT.FORM',
					name: '表单管理',
				}]
			}, {
				id:'PROJECT.SAFETYMANAGE',
				name: '安环管理',
				children: [{
					id: 'PROJECT.SAFETYSYSTEM',
					name: '安全体系',
				}, {
					id: 'PROJECT.DANGER',
					name: '危险源',
				}, {
					id: 'PROJECT.HIDDENDANGER',
					name: '安全隐患',
				},{
					id: 'PROJECT.UNBEARABLE',
					name: '环境保护',
				},{
					id: 'PROJECT.RISKFACTOR',
					name: '文明施工',
				},{  
					id: 'PROJECT.RISKEVALUATION',
					name: '危险源风险评价',
				},{
					id: 'PROJECT.EDUCATIONREGISTER',
					name: '安全教育',
				}]
			}, {
				id:'PROJECT.MASSMANAGE',
				name: '质量管理',
				children: [{
					id: 'PROJECT.DEFECTS',
					name: '质量缺陷',
				}]
			}, {
				id:'PROJECT.NURSERY',
				name: '苗木管理',
				children: [{
					id: 'PROJECT.NURSERYTYPE',
					name: '类型管理',
				}, {
					id: 'PROJECT.TREEMANAGE',
					name: '树种管理',
				}, {
					id: 'PROJECT.NURSERYMANAGEMENT',
					name: '苗圃管理',
				}]
			}
		]
	}];


//MODULES和MODULES2在前海的设置有区别分别是admin用户和其他用户的模块权限
export const MODULES2 = [
	{
		id: 'HOME',
		name: '首页',
	}, {
		id: 'DASHBOARD',
		name: '综合展示',
		children: [{
			id: 'DASHBOARD.ONSITE',
			name: '二维展示',
		}, {
			id: 'DASHBOARD.PLAN',
			name: '巡检路线',
		}, {
			id: 'DASHBOARD.DANGER',
			name: '安全隐患',
		}, {
			id: 'DASHBOARD.PROJECT',
			name: '工程影像',
		}]
	}, {
		id: 'OVERALL',
		name: '综合管理',
		children: [{
			id: 'OVERALL.NEWS',
			name: '新闻通知'
		}, {
			id: 'OVERALL.DISPATCH',
			name: '现场收发文'
		}, {
			id: 'OVERALL.MATERAIL',
			name: '物资管理'
		}, {
			id: 'OVERALL.FORM',
			name: '表单管理'
		}, {
			id: 'OVERALL.CHECKIN',
			name: '考勤管理'
		}]
	}, {
		id: 'DATUM',
		name: '资料管理',
		children: [{
			id: 'DATUM.STANDARD',
			name: '制度规范',
		}, {
			id: 'DATUM.ENGINEERING',
			name: '工程文档'
		}, {
			id: 'DATUM.REDIOS',
			name: '工程影像'
		}]
	}, {
		id: 'QUALITY',
		name: '质量管理',
		children: [{
			id: 'QUALITY.TONGJI',
			name: '质量分析',
		}, {
			id: 'QUALITY.SCORE',
			name: '质量评分',
			children: [{
				id: 'QUALITY.SCORE.SEARCH',
				name: '质量管理检查记录',
			}]
		}, {
			id: 'QUALITY.APPRAISING',
			name: '质量评优',
		}, {
			id:'QUALITY.YANSHOU',
			name: '质量验收',
			children: [{
				id: 'QUALITY.TIANBAO',
				name: '进场材料填报',
			}, {
				id: 'QUALITY.QUERY',
				name: '验收查询',
			}, {
				id: 'QUALITY.HUAFEN',
				name: '检验批划分',
			}, {
				id: 'QUALITY.SUBITEM',
				name: '分项验收',
			}, {
				id: 'QUALITY.FENBU',
				name: '分部验收',
			}, {
				id: 'QUALITY.DANWEI',
				name: '单位工程验收',
			}]
		}, {
			id: 'QUALITY.DEFECT',
			name: '质量缺陷',
		}]
	},{
		id: 'SCHEDULE',
		name: '进度管理',
		children: [{
			id: 'SCHEDULE.STAGEREPORT',
			name: '进度填报',
		}, {
			id: 'SCHEDULE.PROPROGRESS',
			name: '项目进度',
		}, {
			id: 'SCHEDULE.ENTERANALYZE',
			name: '苗木进场分析',
		}, {
			id: 'SCHEDULE.SCHEDULEANALYZE',
			name: '种植进度分析',
		}, {
			id: 'SCHEDULE.SHOW',
			name: '种植进度展示',
		}]
	}, {
		id: 'SAFETY',
		name: '安环管理',
		children: [
			{
				id: 'SAFETY',
				name: '安全动态',
			}, {
				id: 'SAFETY.SYSTEM',
				name: '安全体系',
			}, {
				id: 'SAFETY.HIDDENDANGER',
				name: '安全隐患',
			},
			{
				id: 'SAFETY.DANGEROUSSOURCEMANAGEMENT',
				name: '安全文明施工',
				children: [
					{
						id: 'SAFETY.RISKEVALUATION',
						name: '危险源风险评价',
					}, {
						id: 'SAFETY.UNBEARABLE',
						name: '环境保护',
					}, {
						id: 'SAFETY.RISKFACTOR',
						name: '文明施工',
					}
				]
			},
			{
				id: 'SAFETY.EDUCATIONREGISTER',
				name: '安全教育',
			},
			{
				id: 'SAFETY.SAFETYTREND',
				name: '安全动态管理',
			}
		]
	}, {
		id: 'FOREST',
		name: '森林大数据',
		children: [{
			id: 'FOREST.INFO',
			name: '苗木大数据',
			children: [{
				id: 'FOREST.NURSOVERALLINFO',
				name: '苗木综合信息',
			}, {
				id: 'FOREST.NURSMEASUREINFO',
				name: '苗圃测量信息',
			}, {
				id: 'FOREST.LOCMEASUREINFO',
				name: '现场测量信息',
			}, {
				id: 'FOREST.SUPERVISORINFO',
				name: '监理验收信息',
			}, {
				id: 'FOREST.OWNERINFO',
				name: '业主抽查信息',
			}, {
				id: 'FOREST.CONTRASTINFO',
				name: '苗木对比信息',
			}, {
				id: 'FOREST.FAITHINFO',
				name: '供应商诚信信息',
			}]
		}, {
			id: 'FOREST.FOREST.IMPORT',
			name: '数据导入',
			children: [{
				id: 'FOREST.DATAIMPORT',
				name: '定位数据导入',
			}]
		}]
	}, {
		id: 'RECEIVE',
		name: '收发货管理',
		children: [{
			id: 'RECEIVE.RECEIVEMANAGEMENT',
			name: '收货管理',
		}, {
			id: 'RECEIVE.DISTRIBUTIONMANAGEMENT',
			name: '发放管理',
		}, {
			id: 'RECEIVE.INVENTORYMANAGEMENT',
			name: '库存管理',
		}]
	}, {
		id: 'SELFCARE',
		name: '个人中心',
		children: [{
			id: 'SELFCARE.TASK',
			name: '个人任务',
		}, {
			id: 'SELFCARE.QUERY',
			name: '个人考勤',
		}, {
			id: 'SELFCARE.LEAVE',
			name: '个人请假',
		}, {
			id: 'SELFCARE.ACCOUNT',
			name: '账号管理',
		}]
	}, {
		id: 'SYSTEM',
		name: '系统设置',
		children: [
			{
				id: 'SYSTEM.ROLE',
				name: '角色设置'
			}, {
				id: 'SYSTEM.PERMISSION',
				name: '权限设置'
			}, {
				id: 'SYSTEM.PERSON',
				name: '用户管理'
			}, {
				id: 'SYSTEM.WORKFLOW',
				name: '流程设置'
			}, {
				id: 'SYSTEM.ORG',
				name: '组织机构'
			}
		]
	}, {
		id: 'PROJECT',
		name: '项目管理',
		children: [
			{	
				id:'PROJECT.LANDAREA',
				name: '地块区域',
				children: [{
					id: 'PROJECT.PLOTMAGE',
					name: '地块管理',
				}, {
					id: 'PROJECT.AREAMANAGE',
					name: '区域管理',
				}, {
					id: 'PROJECT.SECTIONMANAGE',
					name: '标段管理',
				}, {
					id: 'PROJECT.SMALLCLASS',
					name: '小班管理',
				}, {
					id: 'PROJECT.THINCLASS',
					name: '细班管理',
				}]
			}, {
				id:'PROJECT.PROMANAGE',
				name: '工程管理',
				children: [{
					id: 'PROJECT.PLOTSET',
					name: '地块设置',
				}, {
					id: 'PROJECT.AREASET',
					name: '区域设置',
				}, {
					id: 'PROJECT.UNITPRO',
					name: '单位工程',
				}, {
					id: 'PROJECT.SUBUNITPRO',
					name: '子单位工程',
				}, {
					id: 'PROJECT.SUBPRO',
					name: '分部工程',
				}, {
					id: 'PROJECT.ITEMPRO',
					name: '分项工程',
				}]
			}, {
				id:'PROJECT.ORG',
				name: '组织机构',
				children: [{
					id: 'PROJECT.ORGTYPE',
					name: '类型管理',
				}, {
					id: 'PROJECT.UNITMANAGE',
					name: '单位管理',
				}, {
					id: 'PROJECT.BRANCHMANAGE',
					name: '部门管理',
				}]
			}, {
				id:'PROJECT.DATAMANAGE',
				name: '资料管理',
				children: [{
					id: 'PROJECT.STANDARD',
					name: '制度标准',
				}, {
					id: 'PROJECT.ENGINEERINGIMAGE',
					name: '工程影像',
				}, {
					id: 'PROJECT.PRODOC',
					name: '工程文档',
				}, {
					id: 'PROJECT.KEYWORD',
					name: '工程字段',
				}, {
					id: 'PROJECT.TEMPLATE',
					name: '模板配置',
				}, {
					id: 'PROJECT.DICTIONARIES',
					name: '工程文档字典',
				}]
			}, {
				id:'PROJECT.OVERALLMANAGE',
				name: '综合管理',
				children: [{
					id: 'PROJECT.MATERIAL',
					name: '物资管理',
				},
				{
					id: 'PROJECT.FORM',
					name: '表单管理',
				}]
			}, {
				id:'PROJECT.SAFETYMANAGE',
				name: '安环管理',
				children: [{
					id: 'PROJECT.SAFETYSYSTEM',
					name: '安全体系目录',
				}, {
					id: 'PROJECT.DANGER',
					name: '危险源',
				}, {
					id: 'PROJECT.HAZARD',
					name: '安全隐患',
				}]
			}, {
				id:'PROJECT.MASSMANAGE',
				name: '质量管理',
				children: [{
					id: 'PROJECT.DEFECTS',
					name: '质量缺陷',
				}, {
					id: 'PROJECT.NURSERYTYPE',
					name: '类型管理',
				}, {
					id: 'PROJECT.TREEMANAGE',
					name: '树种管理',
				}]
			}, {
				id:'PROJECT.NURSERY',
				name: '苗木管理',
				children: [{
					id: 'PROJECT.NURSERYTYPE',
					name: '类型管理',
				}, {
					id: 'PROJECT.TREEMANAGE',
					name: '树种管理',
				}]
			}
		]
	}];

const APPLABEL = 'accounts';

const CONTENTTYPE = 'appmeta';

export const DOMAIN_CODES = {
	dir: '文档222',
	workPackage: '施工包111'
};
//获取新闻发布单位
export const DEPARTMENT = [
	{
		code:'ORG_01_19',
		name:'雄安新区造林指挥部'
	},{
		code:'ORG_03_32',
		name:'河北远大工程咨询有限公司'
	},{
		code:'ORG_P010_01_02_02',
		name:'北京政泰隆工程管理有限公司'
	},{
		code:'ORG_P010_01_02_03',
		name:'北京中城建建设监理有限公司'
	},{
		code:'ORG_P010_01_02_04',
		name:'浙江江南工程管理股份有限公司'
	},{
		code:'ORG_P010_02_02_01',
		name:'北京中林华联建设工程监理有限公司'
	},{
		code:'ORG_P010_03_02_01',
		name:'天津市源天工程咨询有限公司'
	}
]
