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

let DOMAIN, DOMAIN2, USER, PASSWORD, TREE_CODE, STATIC_FILE_IP,NODE_FILE_STATIC_API;

DOMAIN = window.config.DOMAIN;
USER = window.config.STATIC_FILE_USER;
PASSWORD = window.config.STATIC_FILE_PASSWORD;
DOMAIN2 = window.config.DOMAIN2;
STATIC_FILE_IP = window.config.STATIC_FILE_IP;
NODE_FILE_STATIC_API = window.config.NODE_FILE_STATIC_API;

/***********************公共资源服务**************************/
export { DOMAIN, USER, PASSWORD, TREE_CODE };
export const CODE_PROJECT = '前海BIM';
export const base = `${DOMAIN}:${window.config.API_PORT}`;
export const EXCHANGE_API = `${DOMAIN}:${window.config.DOC_EXCHANGE_PORT}`;
export const SOURCE_API = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}`;
export const USER_API = `${base}/accounts/api`;
export const SERVICE_API = `${base}/service/construction/api`;
export const FILE_API = `${base}/service/fileserver`;
export const WORKFLOW_API = `${base}/service/workflow/api`;
export const PDF_FILE_API = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}`;
export const DOWNLOAD_FILE = `${STATIC_FILE_IP}:${window.config.STATIC_DOWNLOAD_PORT}`;
export const CUS_TILEMAP = window.config.cus_tilemap;
export const CODE_API = window.config.CODE_API;
export const NODE_FILE_EXCHANGE_API = `${NODE_FILE_STATIC_API}:${window.config.NODE_FILE_EXCHANGE_PORT}`;
export const UPLOAD_API = `${base}/service/fileserver/api/user/files/`;

//FDBServer API
export const FDBSERVICE_API = `${window.config.FDBServer_API}`;
export const SAFETY_MONITOR = `${base}/service/appserver`;

//质量监控地图
export const WMSTILELAYERURL = window.config.WMSTileLayerUrl;
export const TILEURLS = {
	1: window.config.IMG_W,
	2: window.config.VEC_W
}
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
export const FOREST_API = `${window.config.FORESTDOMAIN}:${window.config.FORESTPORT}`;
//苗圃定位模板
export const nurseryLocation_template = STATIC_DOWNLOAD_API + '/media/documents/meta/' + encodeURI('nurseryLocation.xlsx');





export const SubItem_WordTemplate = `${window.config.NODE_FILE_STATIC_API}` + '/media/documents/meta/' + encodeURI('分项工程质量验收记录模板.docx')
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
export const UPLOADFILE_API = DOMAIN + window.config.STATIC_UPLOAD_PORT + '/api/user/files/';
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

/***********************临时资源服务**************************/

/***********************静态常量**************************/
export const WORKFLOW_CODE = {
	'DESIGN_BLUEPRINT': 'TEMPLATE_001',
	'现场安全隐患排查工作流程': 'TEMPLATE_002',
	'分部验收流程': 'TEMPLATE_003',
	'周报填写流程': 'TEMPLATE_004',
	'进度填报流程': 'TEMPLATE_005',
	'进度节点填报流程': 'TEMPLATE_006',
	'检验批验收流程': 'TEMPLATE_007',
	'分项验收流程': 'TEMPLATE_008',
	'施工包划分填报流程': 'TEMPLATE_012',
	'总进度计划报批流程': 'TEMPLATE_028',
	'申请推迟总进度计划填报流程': 'TEMPLATE_029',
	'进度管控审批流程': 'TEMPLATE_031',
	'安全隐患上报流程': 'TEMPLATE_011',
	'设计计划填报流程': 'TEMPLATE_013',
	'设计计划变更流程': 'TEMPLATE_014',
	'设计成果上报流程': 'TEMPLATE_015',
	'设计成果一般变更流程': 'TEMPLATE_016',
	'设计成果重大变更流程': 'TEMPLATE_019',
	'数据报送流程': 'TEMPLATE_032'
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
export const MODULES2 = [
	{
		id: 'HOME',
		name: '首页',
	},
	{
		id: 'DISPLAY',
		name: '综合展示',
		children: [{
			id: 'DISPLAY.2DGIS',
			name: '现场信息',
		}, {
			id: 'DISPLAY.3DGIS',
			name: '规划信息',
		}, {
			id: 'DISPLAY.DGNMODULE',
			name: '项目信息',
		}]
	}, {
		id: 'MANAGE',
		name: '综合管理',
		children: [{
			id: 'MANAGE.CHECKIN',
			name: '人员考勤'
		}, {
			id: 'MANAGE.NEWS',
			name: '新闻公告'
		}, {
			id: 'MANAGE.SENDRECIEVE',
			name: '现场收发文'
		}, {
			id: 'MANAGE.APPROVAL',
			name: '工程批文'
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
		}]
	}, {
		id: 'DESIGN',
		name: '设计管理',
		children: [{
			id: 'DESIGN.STATISTICS',
			name: '统计分析',
		}, {
			id: 'DESIGN.PLAN1',
			name: '交付计划',
		}, {
			id: 'DESIGN.PLAN2',
			name: '发起计划',
		}, {
			id: 'DESIGN.PLAN3',
			name: '填报计划'
		}, {
			id: 'DESIGN.PLAN4',
			name: '计划审查'
		}, {
			id: 'DESIGN.PLAN5',
			name: '变更计划'
		}, {
			id: 'DESIGN.PLAN6',
			name: '变更审查'
		}, {
			id: 'DESIGN.REPORTRESULT',
			name: '设计上报'
		}, {
			id: 'DESIGN.APPROVALRESULT',
			name: '设计审查'
		}, {
			id: 'DESIGN.CREATEMODIFY',
			name: '发起变更',
		}, {
			id: 'DESIGN.MODIFY',
			name: '设计变更'
		}, {
			id: 'DESIGN.MODIFYAPPROVAL',
			name: '变更审查'
		}, {
			id: 'DESIGN.REMIND',
			name: '进度提醒',
		},
		//设计交底
		{ id: 'DESIGN.EXPLAINQUERY', name: '交底查询' },
		{ id: 'DESIGN.EXPLAINSUBMIT', name: '交底填报' },
		{ id: 'DESIGN.EXPLAINHANDLE', name: '交底处理' },
		]
	}, {
		id: 'QUALITY',
		name: '质量管理',
		children: [{
			id: 'QUALITY.TONGJI',
			name: '统计分析',
		}, {
			id: 'QUALITY.QUERY',
			name: '验收查询',
		}, {
			id: 'QUALITY.HUAFEN',
			name: '检验批划分',
		}, {
			id: 'QUALITY.TIANBAO',
			name: '检验批填报',
		}, {
			id: 'QUALITY.SUBITEM',
			name: '分项验收',
		}, {
			id: 'QUALITY.FENBU',
			name: '分部验收',
		}, {
			id: 'QUALITY.DANWEI',
			name: '单位工程验收',
		}, {
			id: 'QUALITY.MONITORING',
			name: '质量监控',
		}, {
			id: 'QUALITY.DEFECT',
			name: '质量缺陷',
		}]
	}, {
		id: 'SAFETY',
		name: '安全管理',
		children: [{
			id: 'SAFETY.SCHEME',
			name: '安全策划书',
		}, {
			id: 'SAFETY.ORGANIZATIONALSTRUCTURE',
			name: '组织架构',
		}, {
			id: 'SAFETY.MANAGEMENTINSTITUTION',
			name: '安全管理制度',
		}, {
			id: 'SAFETY.EMERGENCYPLAN',
			name: '应急预案',
		}, {
			id: 'SAFETY.SAFETYGOAL',
			name: '安全目标',
		}, {
			id: 'SAFETY.RESPONSIBILITYSYSTEM',
			name: '安全责任制',
		}, {
			id: 'SAFETY.RISKEVALUATION',
			name: '风险评价',
		}, {
			id: 'SAFETY.UNBEARABLE',
			name: '不可承受风险',
		}, {
			id: 'SAFETY.RISKFACTOR',
			name: '确定重大危险因素',
		}, {
			id: 'SAFETY.DYNAMICREPORT',
			name: '重大危险源动态报表',
		}, {
			id: 'SAFETY.DISCIPLINE',
			name: '安全规程',
		}, {
			id: 'SAFETY.SOLUTION',
			name: '专项方案',
		}, {
			id: 'SAFETY.POSITION',
			name: '按部位查询',
		}, {
			id: 'SAFETY.PROJECT',
			name: '按项目查询',
		}, {
			id: 'SAFETY.WARNING',
			name: '预警信息',
		}, {
			id: 'SAFETY.DATAINPUT',
			name: '测值导入',
		}, {
			id: 'SAFETY.THRESHOLD',
			name: '阈值导入',
		}, {
			id: 'SAFETY.QUALIFICATIONVERIFICATION',
			name: '安全资质验证',
		}, {
			id: 'SAFETY.EDUCATIONREGISTER',
			name: '安全教育登记',
		}, {
			id: 'SAFETY.ACTIONSRECORD',
			name: '安全活动记录',
		}, {
			id: 'SAFETY.TECHNICALDISCLOSURE',
			name: '安全技术交底',
		}, {
			id: 'SAFETY.FACILITIESACCEPTANCE',
			name: '设备设施验收',
		}, {
			id: 'SAFETY.SAFETYCHECK',
			name: '安全检查',
		}, {
			id: 'SAFETY.REGISTER',
			name: '事故登记',
		}, {
			id: 'SAFETY.REPORT',
			name: '事故报告',
		}, {
			id: 'SAFETY.TREATMENT',
			name: '事故处理',
		}, {
			id: 'SAFETY.INVESTIGATION',
			name: '事故调查',
		}]
	}, {
		id: 'SCHEDULE',
		name: '进度管理',
		children: [{
			id: 'SCHEDULE.STATISTICS',
			name: '统计分析',
		}, {
			id: 'SCHEDULE.TOTALPLAN',
			name: '总计进度',
		}, {
			id: 'SCHEDULE.STARTPLAN',
			name: '发起计划',
		}, {
			id: 'SCHEDULE.TOTALREPORT',
			name: '进度填报',
		}, {
			id: 'SCHEDULE.TOTALAPPROVAL',
			name: '进度审批',
		}, {
			id: 'SCHEDULE.REPORTSETTING',
			name: '管控日程',
		}, {
			id: 'SCHEDULE.STAGEREPORT',
			name: '进度填报',
		}, {
			id: 'SCHEDULE.STAGEAPPROVAL',
			name: '进度审批',
		}, {
			id: 'SCHEDULE.DGNSCHEDULE',
			name: '进度模拟',
		}, {
			id: 'SCHEDULE.REPORTMONITOR',
			name: '流程报警',
		}, {
			id: 'SCHEDULE.NOTICEMONITOR',
			name: '进度报警',
		}, {
			id: 'SCHEDULE.HISTORY',
			name: '进度历史',
		}]
	}, {
		id: 'COST',
		name: '造价管理',
		children: [{
			id: 'COST.COSTESTIMATE',
			name: '造价估算',
		}, {
			id: 'COST.COSTSCHEDULE',
			name: '造价进度',
		}, {
			id: 'COST.COSTCOMPARISON',
			name: '造价对比',
		}, {
			id: 'COST.INFOSHOW',
			name: '工程量信息展示',
		}, {
			id: 'COST.DATAMAINTENANCE',
			name: '工程量数据维护',
		}, {
			id: 'COST.WORKESTIMATE',
			name: '重要工程量预估',
		}]
	}, {
		id: 'VIDEO',
		name: '视频监控',
		children: [{
			name: '视频监控',
			id: 'VIDEO.VIDEO',
		}, {
			name: '摄像头管理',
			id: 'VIDEO.CAMERAMANAGE',
		}, {
			name: '全景图',
			id: 'VIDEO.PANORAMA',
		}]
	}, {
		id: 'SELFCARE',
		name: '个人中心',
		children: [{
			id: 'SELFCARE.TASK',
			name: '个人任务'
		},{
			id: 'SELFCARE.QUERY',
			name: '个人考勤'
		}]
	}];
export const MODULES = [
	{
		id: 'HOME',
		name: '首页',
	},
	{
		id: 'DISPLAY',
		name: '综合展示',
		children: [{
			id: 'DISPLAY.2DGIS',
			name: '现场信息',
		}, {
			id: 'DISPLAY.3DGIS',
			name: '规划信息',
		}, {
			id: 'DISPLAY.DGNMODULE',
			name: '项目信息',
		}]
	}, {
		id: 'MANAGE',
		name: '综合管理',
		children: [{
			id: 'MANAGE.CHECKIN',
			name: '人员考勤'
		}, {
			id: 'MANAGE.NEWS',
			name: '新闻公告'
		}, {
			id: 'MANAGE.SENDRECIEVE',
			name: '现场收发文'
		}, {
			id: 'MANAGE.APPROVAL',
			name: '工程批文'
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
		}]
	}, {
		id: 'DESIGN',
		name: '设计管理',
		children: [{
			id: 'DESIGN.STATISTICS',
			name: '统计分析',
		}, {
			id: 'DESIGN.PLAN1',
			name: '交付计划',
		}, {
			id: 'DESIGN.PLAN2',
			name: '发起计划',
		}, {
			id: 'DESIGN.PLAN3',
			name: '填报计划'
		}, {
			id: 'DESIGN.PLAN4',
			name: '计划审查'
		}, {
			id: 'DESIGN.PLAN5',
			name: '变更计划'
		}, {
			id: 'DESIGN.PLAN6',
			name: '变更审查'
		}, {
			id: 'DESIGN.REPORTRESULT',
			name: '设计上报'
		}, {
			id: 'DESIGN.APPROVALRESULT',
			name: '设计审查'
		}, {
			id: 'DESIGN.CREATEMODIFY',
			name: '发起变更',
		}, {
			id: 'DESIGN.MODIFY',
			name: '设计变更'
		}, {
			id: 'DESIGN.MODIFYAPPROVAL',
			name: '变更审查'
		}, {
			id: 'DESIGN.REMIND',
			name: '进度提醒',
		},
		//设计交底
		{ id: 'DESIGN.EXPLAINQUERY', name: '交底查询' },
		{ id: 'DESIGN.EXPLAINSUBMIT', name: '交底填报' },
		{ id: 'DESIGN.EXPLAINHANDLE', name: '交底处理' },
		]
	}, {
		id: 'QUALITY',
		name: '质量管理',
		children: [{
			id: 'QUALITY.TONGJI',
			name: '统计分析',
		}, {
			id: 'QUALITY.QUERY',
			name: '验收查询',
		}, {
			id: 'QUALITY.HUAFEN',
			name: '检验批划分',
		}, {
			id: 'QUALITY.TIANBAO',
			name: '检验批填报',
		}, {
			id: 'QUALITY.SUBITEM',
			name: '分项验收',
		}, {
			id: 'QUALITY.FENBU',
			name: '分部验收',
		}, {
			id: 'QUALITY.DANWEI',
			name: '单位工程验收',
		}, {
			id: 'QUALITY.MONITORING',
			name: '质量监控',
		}, {
			id: 'QUALITY.DEFECT',
			name: '质量缺陷',
		}]
	}, 
	{
		id: 'SAFETY',
		name: '安全管理',
		children: [
			{
				id: 'SAFETY.SAFETYPLAN',
				name: '安全策划',
				children: [
					{
						id: 'SAFETY.SCHEME',
						name: '安全策划书',
					}, {
						id: 'SAFETY.ORGANIZATIONALSTRUCTURE',
						name: '组织架构',
					}, {
						id: 'SAFETY.MANAGEMENTINSTITUTION',
						name: '安全管理制度',
					}, {
						id: 'SAFETY.EMERGENCYPLAN',
						name: '应急预案',
					}, {
						id: 'SAFETY.SAFETYGOAL',
						name: '安全目标',
					}, {
						id: 'SAFETY.RESPONSIBILITYSYSTEM',
						name: '安全责任制',
					}
				]
			},
			{
				id: 'SAFETY.DANGEROUSSOURCEMANAGEMENT',
				name: '危险源管理',
				children: [
					{
						id: 'SAFETY.RISKEVALUATION',
						name: '风险评价',
					}, {
						id: 'SAFETY.UNBEARABLE',
						name: '不可承受风险',
					}, {
						id: 'SAFETY.RISKFACTOR',
						name: '重大危险因素',
					}, {
						id: 'SAFETY.DYNAMICREPORT',
						name: '动态报表'
					}
				]
			},
			{
				id:'SAFETY.ZXFAJCS',
				name: '专项方案及措施',
				children: [
					{
						id: 'SAFETY.DISCIPLINE',
						name: '安全规程',
					}, {
						id: 'SAFETY.SOLUTION',
						name: '专项方案',
					}
				]
			},
			{
				name: '安全监测',
				id:'SAFETY.MONITORAQJC',
				children: [
					{
						id: 'SAFETY.PLAN',
						name: '监测方案',
					}, {
						id: 'SAFETY.QUERY',
						name: '监测数据查询',
					}, {
						id: 'SAFETY.QUERY',
						name: '监测数据查询',
					},{
						id: 'SAFETY.PROJECT',
						name: '监测项目',
					},{
						id: 'SAFETY.STATIONS',
						name: '监测点',
					},
					{
						id: 'SAFETY.MONITORING',
						name: '监测数据',
					}
				]
			}, 
			{
				id: 'SAFETY.MANAGEMENTANDCONTROL',
				name: '安全管控',
				children: [
					{
						id: 'SAFETY.SAFETYCHECK',
						name: '安全检查',
					}, {
						id: 'SAFETY.QUALIFICATIONVERIFICATION',
						name: '安全资质验证',
					}, {
						id: 'SAFETY.EDUCATIONREGISTER',
						name: '安全教育登记',
					}, {
						id: 'SAFETY.ACTIONSRECORD',
						name: '安全活动记录',
					}, {
						id: 'SAFETY.TECHNICALDISCLOSURE',
						name: '安全技术交底',
					}, {
						id: 'SAFETY.FACILITIESACCEPTANCE',
						name: '设备设施验收',
					}, {
						id: 'SAFETY.HIDDENDANGER',
						name: '安全隐患',
					}
				]
			},
			{
				name: '事故管理',
				id:'SAFETY.ACCIDENT',
				children: [
					{
						id: 'SAFETY.REGISTER',
						name: '事故登记',
					}, {
						id: 'SAFETY.REPORT',
						name: '事故报告',
					}, {
						id: 'SAFETY.TREATMENT',
						name: '事故处理',
					}, {
						id: 'SAFETY.INVESTIGATION',
						name: '事故调查',
					}
				]
			}
		]
	},
	{
		id: 'SCHEDULE',
		name: '进度管理',
		children: [{
			id: 'SCHEDULE.STATISTICS',
			name: '统计分析',
		}, {
			id: 'SCHEDULE.TOTALPLAN',
			name: '总计进度',
		}, {
			id: 'SCHEDULE.STARTPLAN',
			name: '发起计划',
		}, {
			id: 'SCHEDULE.TOTALREPORT',
			name: '进度填报',
		}, {
			id: 'SCHEDULE.TOTALAPPROVAL',
			name: '进度审批',
		}, {
			id: 'SCHEDULE.REPORTSETTING',
			name: '管控日程',
		}, {
			id: 'SCHEDULE.STAGEREPORT',
			name: '进度填报',
		}, {
			id: 'SCHEDULE.STAGEAPPROVAL',
			name: '进度审批',
		}, {
			id: 'SCHEDULE.DGNSCHEDULE',
			name: '进度模拟',
		}, {
			id: 'SCHEDULE.REPORTMONITOR',
			name: '流程报警',
		}, {
			id: 'SCHEDULE.NOTICEMONITOR',
			name: '进度报警',
		}, {
			id: 'SCHEDULE.HISTORY',
			name: '进度历史',
		}]
	}, {
		id: 'COST',
		name: '造价管理',
		children: [{
			id: 'COST.COSTESTIMATE',
			name: '造价估算',
		}, {
			id: 'COST.COSTSCHEDULE',
			name: '造价进度',
		}, {
			id: 'COST.COSTCOMPARISON',
			name: '造价对比',
		}, {
			id: 'COST.INFOSHOW',
			name: '工程量信息展示',
		}, {
			id: 'COST.DATAMAINTENANCE',
			name: '工程量数据维护',
		}, {
			id: 'COST.WORKESTIMATE',
			name: '重要工程量预估',
		}]
	}, {
		id: 'FOREST',
		name: '智慧森林',
		children: [{
			id: 'FOREST.INFO',
			name: '植被信息',
		}]
	}, {
		id: 'VIDEO',
		name: '视频监控',
		children: [{
			name: '视频监控',
			id: 'VIDEO.VIDEO',
		}, {
			name: '摄像头管理',
			id: 'VIDEO.CAMERAMANAGE',
		}, {
			name: '全景图',
			id: 'VIDEO.PANORAMA',
		}]
	}, {
		id: 'CONTRACTCARE',
		name: '合同管理',
		children: [{
			id: 'CONTRACTCARE.CLIENT',
			name: '客户管理'
		}, {
			id: 'CONTRACTCARE.ITEMINFO',
			name: '项目信息列表'
		}, {
			id: 'CONTRACTCARE.MAINCONTRACT',
			name: '总包合同信息维护'
		}, {
			id: 'CONTRACTCARE.SUBCONTRACT',
			name: '分包合同信息维护'
		}, {
			id: 'CONTRACTCARE.CONTRACTCOLLECT',
			name: '合同收款'
		}, {
			id: 'CONTRACTCARE.CONTRACTPAYMENT',
			name: '合同付款'
		}, {
			id: 'CONTRACTCARE.MAININVOICE',
			name: '总包合同发票'
		}, {
			id: 'CONTRACTCARE.SUBINVOICE',
			name: '分包合同发票'
		}, {
			id: 'CONTRACTCARE.PRETAXINFO',
			name: '预缴税信息维护'
		}, {
			id: 'CONTRACTCARE.DEPOSIT',
			name: '合同保函保证金'
		}, {
			id: 'CONTRACTCARE.CONTRACTCHANGE',
			name: '合同变更'
		}, {
			id: 'CONTRACTCARE.CONTRACTFINAL',
			name: '合同结算'
		}, {
			id: 'CONTRACTCARE.ACCEPTANCEBILL',
			name: '承兑汇票'
		},]
	}, {
		id: 'DRAWINGCARE',
		name: '图档管理',
		children: [{
			id: 'DRAWINGCARE.RECORDMANAGE',
			name: '工程文档案卷管理'
		}, {
			id: 'DRAWINGCARE.FILEMANAGE',
			name: '工程文档文件管理'
		}, {
			id: 'DRAWINGCARE.DRAWINGLIST',
			name: '图纸编目'
		}, {
			id: 'DRAWINGCARE.RECORDLIST',
			name: '档案编目'
		}, {
			id: 'DRAWINGCARE.TECHBOOKLIST',
			name: '科技图书编目'
		}, {
			id: 'DRAWINGCARE.TOPOGRAPHICMAPLIST',
			name: '地形图编目'
		}, {
			id: 'DRAWINGCARE.STANDARDSPECIFICATIONLIST',
			name: '标准规范编目'
		}, {
			id: 'DRAWINGCARE.OPENRECORDLIST',
			name: '公开档案编目'
		}, {
			id: 'DRAWINGCARE.AUDIOVISUALRECORDLIST',
			name: '声像档案编目'
		},]
	},

	{
		id: 'SELFCARE',
		name: '个人中心',
		children: [{
			id: 'SELFCARE.TASK',
			name: '个人任务'
		}, {
			id: 'SELFCARE.QUERY',
			name: '个人考勤'
		}]
	}, {
		id: 'SYSTEM',
		name: '系统设置',
		children: [
			{
				id: 'SYSTEM.FIELD',
				name: '编码字段'
			}, {
				id: 'SYSTEM.CODETYPE',
				name: '编码类型'
			}, {
				id: 'SYSTEM.CONVENTION',
				name: '工程约定'
			}, {
				id: 'SYSTEM.ROLE',
				name: '角色管理'
			}, {
				id: 'SYSTEM.PERMISSION',
				name: '权限设置'
			}, {
				id: 'SYSTEM.MAJOR',
				name: '专业设置'
			}, {
				id: 'SYSTEM.PROJECT',
				name: '项目设置'
			}, {
				id: 'SYSTEM.TEMPLATE',
				name: '模板设置'
			}, {
				id: 'SYSTEM.ICON',
				name: '图标设置'
			}, {
				id: 'SYSTEM.WORKFLOW',
				name: '流程设置'
			}, {
				id: 'SYSTEM.DOCUMENT',
				name: '文档设置'
			}, {
				id: 'SYSTEM.TAG',
				name: '工程量项'
			}, {
				id: 'SYSTEM.PRICE',
				name: '造价清单'
			}, {
				id: 'SYSTEM.DEVICE',
				name: '设备设置'
			}, {
				id: 'SYSTEM.ITEM',
				name: '分项工程量'
			}
		]
	}, {
		id: 'SETUP',
		name: '系统管理',
		children: [{
			id: 'SETUP.AREA',
			name: '区域地块',
		}, {
			id: 'SETUP.PROJECT',
			name: '项目管理',
		}, {
			id: 'SETUP.UNIT',
			name: '单位工程',
		}, {
			id: 'SETUP.SECTION',
			name: '分部分项',
		}, {
			id: 'SETUP.SITE',
			name: '工程部位',
		}, {
			id: 'SETUP.ORG',
			name: '组织机构',
		}, {
			id: 'SETUP.PERSON',
			name: '人员管理',
		}, {
			id: 'SETUP.STANDARD',
			name: '制度标准',
		}, {
			id: 'SETUP.ENGINEERING',
			name: '工程目录',
		}, {
			id: 'SETUP.KEYWORD',
			name: '工程字段',
		}, {
			id: 'SETUP.TEMPLATE',
			name: '模板配置'
		}, {
			id: 'SETUP.DICTIONARIES',
			name: '工程文档字典'
		}, {
			id: 'SYSTEM.HAZARD',
			name: '危险源',
		}, {
			id: 'SYSTEM.RISK',
			name: '安全隐患'
		}, {
			id: 'SYSTEM.QUALITY',
			name: '质量缺陷'
		}, {
			id: 'SYSTEM.ACCIDENT',
			name: '安全事故',
		}
		]
	}];

const APPLABEL = 'accounts';

const CONTENTTYPE = 'appmeta';

export const DOMAIN_CODES = {
	dir: '文档222',
	workPackage: '施工包111'
};