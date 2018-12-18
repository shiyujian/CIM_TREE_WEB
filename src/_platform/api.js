/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-06-21 09:03:44
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-12-18 11:26:53
 */
/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-03-12 20:06:03
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-06-21 09:03:39
 */
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
import 'whatwg-fetch';
require('es6-promise').polyfill();

window.config = window.config || {};
let DOMAIN, SDOMAIN, USER, PASSWORD, TREE_CODE, STATIC_FILE_IP;

DOMAIN = window.config.DOMAIN;
SDOMAIN = window.config.SDOMAIN;
USER = window.config.STATIC_FILE_USER;
PASSWORD = window.config.STATIC_FILE_PASSWORD;
STATIC_FILE_IP = window.config.STATIC_FILE_IP;

/** *********************公共资源服务**************************/
export { DOMAIN, USER, PASSWORD, TREE_CODE };
export const CODE_PROJECT = '前海BIM';
export const base = `${DOMAIN}`;
export const EXCHANGE_API = `${DOMAIN}:${window.config.DOC_EXCHANGE_PORT}`;
export const SOURCE_API = `${STATIC_FILE_IP}:${
    window.config.STATIC_PREVIEW_PORT
}`;
export const USER_API = `${base}/accounts/api`;
export const SUSER_API = `${SDOMAIN}`;
export const SERVICE_API = `${base}/service/construction/api`;
export const FILE_API = `${base}/service/fileserver`;
export const WORKFLOW_API = `${base}/service/workflow/api`;
export const MAIN_API = `${base}/main/api`;
export const PDF_FILE_API = `${STATIC_FILE_IP}:${
    window.config.STATIC_PREVIEW_PORT
}`;
export const DOWNLOAD_FILE = `${SDOMAIN}:${window.config.STATIC_DOWNLOAD_PORT}`;
export const CUS_TILEMAP = window.config.cus_tilemap;
export const CODE_API = window.config.DOC_EXCHANGE_URL;
export const UPLOAD_API = `${base}/service/fileserver/api/user/files/`;
export const NODE_FILE_EXCHANGE_API = window.config.NODE_FILE_STATIC_URL;
// 高德地图逆坐标查询
export const LBSAMAP_API = window.config.LBSAMAP;
export const LBSAMAP_KEY = '8325164e247e15eea68b59e89200988b';
// 腾讯移动分析
export const TENCENTANALYSIS_API = window.config.TENCENTANALYSIS;
// FDBServer API
export const FDBSERVICE_API = `${window.config.FDBServer_API}`;
export const SAFETY_MONITOR = `${base}/service/appserver`;

// 质量监控地图
export const WMSTILELAYERURL = window.config.WMSTileLayerUrl;
export const TILEURLS = {
    1: window.config.IMG_W,
    2: window.config.VEC_W
};
export const DefaultZoomLevel = 14;
// 文件预览的接口
export const previewWord_API = window.config.previewWord_API;
export const SAFETY_MONITOR_DOWN = window.config.Leader_Class_URL;
// 静态资源文件服务==========STATIC_FILE_IP
export const STATIC_UPLOAD_API = `${STATIC_FILE_IP}:${
    window.config.STATIC_UPLOAD_PORT
}`;
export const STATIC_DOWNLOAD_API = `${STATIC_FILE_IP}:${
    window.config.STATIC_DOWNLOAD_PORT
}`;
export const modelServerAddress = `${STATIC_FILE_IP}:${
    window.config.STATIC_PREVIEW_PORT
}/api/user/meta-files/?category=1`;
export const excelServerAddress = `${STATIC_FILE_IP}:${
    window.config.STATIC_PREVIEW_PORT
}/api/user/meta-files/?category=2`;
export const wordServerAddress = `${STATIC_FILE_IP}:${
    window.config.STATIC_PREVIEW_PORT
}/api/user/meta-files/?category=3`;
export const DGNAddress = `${STATIC_FILE_IP}:${
    window.config.STATIC_UPLOAD_PORT
}/api/user/meta-files/?category=4`;
export const modelDownloadAddress = `${STATIC_FILE_IP}:${
    window.config.STATIC_DOWNLOAD_PORT
}/media/documents/meta/`;

/** *********************单模块资源服务**************************/
// 登录管理
export const QRCODE_API = `${base}/service/appserver`;
// 综合展示
// 资料管理
// 设计管理
// 质量管理
// export const SubItem_WordTemplate = STATIC_UPLOAD_API + '/media/documents/meta/'+encodeURI('分项工程质量验收记录模板.docx')

// 智慧森林
export const FOREST_API = `${window.config.SDOMAIN}`;
export const SEEDLING_API = `${window.config.SDOMAIN}:808`;
export const FOREST_IMG = `${window.config.ALIIMG}`;
// 苗圃定位模板
export const nurseryLocation_template =
    STATIC_DOWNLOAD_API +
    '/media/documents/2017/11/' +
    encodeURI('nurseryLocation.xlsx');

export const SubItem_WordTemplate =
    `${window.config.NODE_FILE_STATIC_URL}` +
    '/media/documents/meta/' +
    encodeURI('分项工程质量验收记录模板.docx');
export const Fenbu_WordTemplate =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('分部子分部工程质量验收记录_ibqFgFg.docx');
export const Danwei_WordTemplate =
    STATIC_DOWNLOAD_API +
    '/media/documents/2017/10/%E5%8D%95%E4%BD%8D%E5%AD%90%E5%8D%95%E4%BD%8D%E5%B7%A5%E7%A8%8B%E8%B4%A8%E9%87%8F%E9%AA%8C%E6%94%B6%E8%AE%B0%E5%BD%952.docx';
// 检验批
export const JYPMOD_API =
    STATIC_DOWNLOAD_API + '/media/documents/meta/' + 'jianyanpi.xlsx';
// 进度管理DGN模型名称
export const SCHEDULE_DGN_NAME = '10号冷战-地下室-编码-0925';
export const SCHEDULE_DGN_DOWNLOAD_URL =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('10号冷战-地下室-编码-0925_0.00.zip');
export const SCHEDULE_TOTAL_PLAN_URL =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('scheduleTemplate.xlsx');
// 安全管理
export const SMUrl_template0 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('测斜项目监测点批量添加模板.xlsx');
export const SMUrl_template1 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('测斜项目监测数据填报模板.xlsx');
export const SMUrl_template2 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('监测项目批量添加模板.xlsx');
export const SMUrl_template3 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('一般监测项目监测点批量添加模板.xlsx');
export const SMUrl_template4 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('一般项目监测数据填报模板.xlsx');
export const SMUrl_template11 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('scheduler.xlsx');
export const SMUrl_template12 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('RiskEvaluation.xlsx');
export const SMUrl_template13 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('Unbearable.xlsx');
export const SMUrl_template14 =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('RiskFactor.xlsx');

// 造价管理
export const ESTIMATET =
    STATIC_DOWNLOAD_API + '/media/documents/meta/zjt-05_.xlsx';
export const CONSTRACTT =
    STATIC_DOWNLOAD_API + '/media/documents/meta/zjt-03_.xlsx';
export const WORKT =
    STATIC_DOWNLOAD_API + '/media/documents/meta/template.xlsx';
// 造价管理模块api
export const UPLOADFILE_API =
    STATIC_FILE_IP + window.config.STATIC_UPLOAD_PORT + '/api/user/files/';
// 视频监控
// 三维全景
// 720云预览API
export const VIDEO_PLUGIN_URL = window.config.Video_PLUGIN_URL;
export const Panorama_Root = window.config.PANORAMAGRAM_LOC_CODE;
export const Video360_API = window.config.Video360_API;
export const Video360_API2 = window.config.Video360_API2;
export const DashboardVideo360API = window.config.dashboardVideo360API;
// 数据资源
// 数据资源
export const DATASOURCENAME = 'dataresource';
export const DATASOURCECODE = 'dataresource_total_dir';
// 数据目录
export const DATASOURCEDIRNAME = 'dataresourceDir';
export const DATASOURCEDIRCODE = 'dataresource_dir';
// 数据目录-类型
export const DATASOURCEDIRTYPENAME = 'dataresourceDirType';
export const DATASOURCEDIRTYPECODE = 'dataresource_dir_type';
// 数据目录-项目
export const DATASOURCEDIRITEMNAME = 'dataresourceDirItem';
export const DATASOURCEDIRITEMCODE = 'dataresource_dir_item';

// 数据报送模板下载
export const DataReportTemplate_ConstructionUnits =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('参建单位数据填报模版.xlsx');
export const DataReportTemplate_PersonInformation =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('人员信息数据填报模版.xlsx');
export const DataReportTemplate_Organization =
    STATIC_DOWNLOAD_API +
    '/media/documents/meta/' +
    encodeURI('组织机构数据填报模版.xlsx');

/** *********************临时资源服务**************************/

/** *********************静态常量**************************/
export const WORKFLOW_CODE = {
    总进度计划报批流程: 'TEMPLATE_001',
    表单管理流程: 'TEMPLATE_002',
    每日进度填报流程: 'TEMPLATE_003',
    机械设备报批流程: 'TEMPLATE_004',
    工程材料报批流程: 'TEMPLATE_005',
    苗木资料报批流程: 'TEMPLATE_006',
    每日进度计划填报流程: 'TEMPLATE_007',
    检验批验收审批流程: 'TEMPLATE_008',
    安全体系报批流程: 'TEMPLATE_009',
    普通审查流程: 'TEMPLATE_010',
    审查核定流程: 'TEMPLATE_011',
    总监审查流程: 'TEMPLATE_012',
    每周进度填报流程: 'TEMPLATE_013'
};
// 为表单管理的每个文件夹绑定流程信息
export const FORM_WORKFLOW = [
    {
        value: '普通审查流程',
        code: 'TEMPLATE_010'
    },
    {
        value: '审查核定流程',
        code: 'TEMPLATE_011'
    },
    {
        value: '总监审查流程',
        code: 'TEMPLATE_012'
    }
];
// 当前执行的项目
export const DEFAULT_PROJECT = 'P018';
// admin登录林总接口所用的账号
export const FOREST_LOGIN_DATA = {
    phone: 'zhaozz1010',
    pwd: '130718'
};
// 获取单位工程
export const PROJECT_UNITS = [
    {
        code: 'P009',
        value: '九号地块',
        units: [
            {
                code: 'P009-01-01',
                value: '一标段'
            },
            {
                code: 'P009-01-02',
                value: '二标段'
            },
            {
                code: 'P009-01-03',
                value: '三标段'
            },
            {
                code: 'P009-01-04',
                value: '四标段'
            },
            {
                code: 'P009-01-05',
                value: '五标段'
            },
            {
                code: 'P009-99-99',
                value: '市民中心造林'
            }
        ]
    },
    {
        code: 'P010',
        value: '苗景兼用林',
        units: [
            {
                code: 'P010-01-01',
                value: '一标段'
            },
            {
                code: 'P010-01-02',
                value: '二标段'
            },
            {
                code: 'P010-01-03',
                value: '三标段'
            },
            {
                code: 'P010-01-04',
                value: '四标段'
            },
            {
                code: 'P010-02-05',
                value: '五标段'
            },
            {
                code: 'P010-03-06',
                value: '六标段'
            }
        ]
    },
    {
        code: 'P999',
        value: '市民中心景观',
        units: [
            {
                code: 'P999-01-01',
                value: '市民中心景观'
            }
        ]
    },
    {
        code: 'P998',
        value: '截洪渠景观一期工程',
        units: [
            {
                code: 'P998-01-01',
                value: '一标段'
            }
        ]
    }
];

// 各个项目的中心坐标
export const PROJECTPOSITIONCENTER = [
    {
        name: '九号地块',
        center: [38.99042701799772, 116.0396146774292],
        zoom: 14
    },
    {
        name: '苗景兼用林项目',
        center: [39.02511978201801, 116.25842285575345],
        zoom: 13
    },
    {
        name: '市民中心景观项目',
        center: [39.04825544272171, 115.90770578315642],
        zoom: 16
    },
    {
        name: '2018秋季造林',
        center: [38.784605024411576, 115.73293304652907],
        zoom: 13
    }
];

// echarts图表的颜色
export const ECHARTSCOLOR = [
    'black',
    'orange',
    'yellow',
    'blue',
    'green',
    'purple'
];

export const TREETYPENO = [
    {
        id: '1',
        name: '常绿乔木'
    },
    {
        id: '2',
        name: '落叶乔木'
    },
    {
        id: '3',
        name: '亚乔木'
    },
    {
        id: '4',
        name: '灌木'
    },
    {
        id: '5',
        name: '草本'
    }
];

export const CULTIVATIONMODE = [
    {
        id: 0,
        name: '地苗'
    },
    {
        id: 1,
        name: '断根苗'
    },
    {
        id: 2,
        name: '假植苗'
    },
    {
        id: 3,
        name: '袋苗'
    },
    {
        id: 4,
        name: '盆苗'
    },
    {
        id: 5,
        name: '山苗'
    }
];

export const SCHEDULRPROJECT = [
    {
        id: 1,
        name: '管理人员投入',
        units: '人',
        type: '人员投入',
        typeFirst: true,
        typeList: 3
    },
    {
        id: 2,
        name: '大数据录入人员投入',
        units: '人',
        type: '人员投入',
        typeFirst: false
    },
    {
        id: 3,
        name: '劳务用工投入',
        units: '人',
        type: '人员投入',
        typeFirst: false
    },
    {
        id: 4,
        name: '打坑机投入',
        units: '台',
        type: '机械投入',
        typeFirst: true,
        typeList: 4
    },
    {
        id: 5,
        name: '吊机投入',
        units: '台',
        type: '机械投入',
        typeFirst: false
    },
    {
        id: 6,
        name: '开沟机投入',
        units: '台',
        type: '机械投入',
        typeFirst: false
    },
    {
        id: 7,
        name: '其他机械投入',
        units: '台',
        type: '机械投入',
        typeFirst: false
    },
    {
        id: 8,
        name: '便道施工',
        units: 'm',
        type: '其他',
        typeFirst: true,
        typeList: 6
    },
    {
        id: 9,
        name: '开挖排水沟槽',
        units: 'm',
        type: '其他',
        typeFirst: false
    },
    {
        id: 10,
        name: '安装排水管道',
        units: 'm',
        type: '其他',
        typeFirst: false
    },
    {
        id: 11,
        name: '回填排水',
        units: 'm',
        type: '其他',
        typeFirst: false
    },
    {
        id: 12,
        name: '绿地平整',
        units: '亩',
        type: '其他',
        typeFirst: false
    },
    {
        id: 13,
        name: '种植穴工程',
        units: '个',
        type: '其他',
        typeFirst: false
    }
];

export const MODULES = [
    {
        id: 'HOME',
        name: '首页'
    },
    {
        id: 'DASHBOARD',
        name: '综合展示',
        children: [
            {
                id: 'DASHBOARD.ONSITE',
                name: '二维展示'
            }
        ]
    },
    {
        id: 'OVERALL',
        name: '综合管理',
        children: [
            {
                id: 'OVERALL.NEWS',
                name: '新闻通知'
            },
            {
                id: 'OVERALL.DISPATCH',
                name: '现场收发文'
            },
            {
                id: 'OVERALL.MATERAIL',
                name: '物资管理'
            },
            {
                id: 'OVERALL.FORM',
                name: '表单管理'
            }
        ]
    },
    {
        id: 'DATUM',
        name: '资料管理',
        children: [
            {
                id: 'DATUM.STANDARD',
                name: '制度标准'
            },
            {
                id: 'DATUM.ENGINEERING',
                name: '工程文档'
            },
            {
                id: 'DATUM.REDIOS',
                name: '工程影像'
            },
            {
                id: 'DATUM.VIDEO',
                name: '视频资料'
            }
        ]
    },
    {
        id: 'QUALITY',
        name: '质量管理',
        children: [
            {
                id: 'QUALITY.APPRAISING',
                name: '质量评优'
            },
            {
                id: 'QUALITY.DEFECT',
                name: '质量缺陷'
            },
            {
                id: 'QUALITY.QUALITYANALYZE',
                name: '种植质量分析'
            },
            {
                id: 'QUALITY.FAITHANALYZE',
                name: '诚信供应商分析'
            }
        ]
    },
    {
        id: 'SCHEDULE',
        name: '进度管理',
        children: [
            {
                id: 'SCHEDULE.STAGEREPORT',
                name: '进度填报'
            },
            {
                id: 'SCHEDULE.PROGRESS',
                name: '项目进度'
            },
            {
                id: 'SCHEDULE.SCHEDULEDISPLAY',
                name: '进度展示'
            },
            {
                id: 'SCHEDULE.ENTERANALYZE',
                name: '苗木进场分析'
            },
            {
                id: 'SCHEDULE.SCHEDULEANALYZE',
                name: '种植进度分析'
            }
        ]
    },
    {
        id: 'SAFETY',
        name: '安环管理',
        children: [
            {
                id: 'SAFETY.TREND',
                name: '安全动态'
            },
            {
                id: 'SAFETY.SYSTEM',
                name: '安全体系'
            },
            {
                id: 'SAFETY.HIDDENDANGER',
                name: '安全隐患'
            },
            {
                id: 'SAFETY.DANGEROUSSOURCEMANAGEMENT.NONE',
                name: '安全文明施工',
                children: [
                    {
                        id: 'SAFETY.RISKEVALUATION',
                        name: '危险源风险评价'
                    },
                    {
                        id: 'SAFETY.UNBEARABLE',
                        name: '环境保护'
                    },
                    {
                        id: 'SAFETY.RISKFACTOR',
                        name: '文明施工'
                    }
                ]
            },
            {
                id: 'SAFETY.EDUCATIONREGISTER',
                name: '安全教育'
            },
            {
                id: 'SAFETY.SAFETYTREND',
                name: '安全动态管理'
            }
        ]
    },
    {
        id: 'FOREST',
        name: '森林大数据',
        children: [
            {
                id: 'FOREST.NURSOVERALLINFO',
                name: '苗木综合信息'
            },
            {
                id: 'FOREST.STATIS.NONE',
                name: '统计图表',
                children: [
                    {
                        id: 'FOREST.DATASTATIS',
                        name: '数据统计'
                    },
                    {
                        id: 'FOREST.USERANALYSIS',
                        name: '用户行为统计'
                    }
                ]
            },
            {
                id: 'FOREST.BUILDING.NONE',
                name: '建设期信息',
                children: [
                    {
                        id: 'FOREST.NURSMEASUREINFO',
                        name: '苗圃测量信息'
                    },
                    {
                        id: 'FOREST.CARPACKAGE',
                        name: '车辆打包信息'
                    },
                    {
                        id: 'FOREST.LOCMEASUREINFO',
                        name: '现场测量信息'
                    },
                    {
                        id: 'FOREST.SUPERVISORINFO',
                        name: '监理抽查信息'
                    },
                    {
                        id: 'FOREST.OWNERINFO',
                        name: '业主抽查信息'
                    }
                ]
            },
            {
                id: 'FOREST.MANAGEMENT.NONE',
                name: '养管护信息',
                children: [
                    {
                        id: 'FOREST.CURINGINFO',
                        name: '养护信息'
                    },
                    {
                        id: 'FOREST.TREEADOPTINFO',
                        name: '苗木状态信息'
                    }
                ]
            },
            {
                id: 'FOREST.IMPORT.NONE',
                name: '数据信息维护',
                children: [
                    {
                        id: 'FOREST.SEEDLINGSCHANGE',
                        name: '苗木信息修改'
                    },
                    {
                        id: 'FOREST.DATAIMPORT',
                        name: '定位数据导入'
                    },
                    {
                        id: 'FOREST.DATAEXPORT',
                        name: '定位数据导出'
                    }
                ]
            }
        ]
    },
    {
        id: 'CURING',
        name: '养护管理',
        children: [
            {
                id: 'CURING.TASKCREATE',
                name: '任务下发'
            },
            {
                id: 'CURING.TASKREPORT',
                name: '任务上报'
            },
            {
                id: 'CURING.TASKSTATIS',
                name: '任务统计'
            },
            {
                id: 'CURING.TASKTEAM',
                name: '养护班组'
            }
        ]
    },
    {
        id: 'MARKET',
        name: '苗木市场',
        children: [
            {
                id: 'MARKET.SUPERMARKET.NONE',
                name: '苗木超市',
                children: [
                    {
                        id: 'MARKET.SEEDLINGSUPPLY',
                        name: '苗木供应'
                    },
                    {
                        id: 'MARKET.SEEDLINGPURCHASE',
                        name: '苗木求购'
                    }
                ]
            },
            {
                id: 'MARKET.SUPPLYRELEASE',
                name: '供应发布'
            },
            {
                id: 'MARKET.DEMANDRELEASE',
                name: '需求发布'
            },
            {
                id: 'MARKET.OFFERMANAGE',
                name: '报价管理'
            }
        ]
    },
    {
        id: 'CHECKWORK',
        name: '考勤管理',
        children: [
            {
                id: 'CHECKWORK.ATTENDANCECOUNT',
                name: '考勤统计'
            },
            {
                id: 'CHECKWORK.SETUP',
                name: '考勤设置',
                children: [
                    {
                        id: 'CHECKWORK.ELECTRONICFENCE',
                        name: '电子围栏'
                    },
                    {
                        id: 'CHECKWORK.ATTENDANCEGROUP',
                        name: '考勤群体'
                    }
                ]
            }

        ]
    },
    {
        id: 'SELFCARE',
        name: '个人中心',
        children: [
            {
                id: 'SELFCARE.TASK',
                name: '个人任务'
            },
            {
                id: 'SELFCARE.QUERY',
                name: '个人考勤'
            },
            {
                id: 'SELFCARE.LEAVE',
                name: '个人请假'
            }
        ]
    },
    {
        id: 'SYSTEM',
        name: '系统设置',
        children: [
            {
                id: 'SYSTEM.ROLE',
                name: '角色设置'
            },
            {
                id: 'SYSTEM.PERMISSION',
                name: '权限设置'
            },
            {
                id: 'SYSTEM.PERSON',
                name: '用户管理'
            },
            {
                id: 'SYSTEM.WORKFLOW',
                name: '流程设置'
            },
            {
                id: 'SYSTEM.ORG',
                name: '组织机构'
            },
            {
                id: 'SYSTEM.BLACKLIST',
                name: '黑名单'
            }
        ]
    },
    {
        id: 'PROJECT',
        name: '项目管理',
        children: [
            {
                id: 'PROJECT.DATAMANAGE.NONE',
                name: '资料管理',
                children: [
                    {
                        id: 'PROJECT.STANDARD',
                        name: '制度标准'
                    },
                    {
                        id: 'PROJECT.ENGINEERINGIMAGE',
                        name: '工程影像'
                    },
                    {
                        id: 'PROJECT.PRODOC',
                        name: '工程文档'
                    }
                ]
            },
            {
                id: 'PROJECT.OVERALLMANAGE.NONE',
                name: '综合管理',
                children: [
                    {
                        id: 'PROJECT.FORM',
                        name: '表单管理'
                    }
                ]
            },
            {
                id: 'PROJECT.SAFETYMANAGE.NONE',
                name: '安环管理',
                children: [
                    {
                        id: 'PROJECT.SAFETYSYSTEM',
                        name: '安全体系'
                    },
                    {
                        id: 'PROJECT.DANGER',
                        name: '危险源'
                    },
                    {
                        id: 'PROJECT.UNBEARABLE',
                        name: '环境保护'
                    },
                    {
                        id: 'PROJECT.HIDDENDANGER',
                        name: '安全隐患'
                    },
                    {
                        id: 'PROJECT.RISKFACTOR',
                        name: '文明施工'
                    },
                    {
                        id: 'PROJECT.RISKEVALUATION',
                        name: '危险源风险评价'
                    }
                ]
            },
            {
                id: 'PROJECT.MASSMANAGE.NONE',
                name: '质量管理',
                children: [
                    {
                        id: 'PROJECT.DEFECTS',
                        name: '质量缺陷'
                    }
                ]
            },
            {
                id: 'PROJECT.NURSERY.NONE',
                name: '苗木管理',
                children: [
                    // {
                    //     id: 'PROJECT.NURSERYTYPE',
                    //     name: '类型管理'
                    // },
                    {
                        id: 'PROJECT.TREEMANAGE',
                        name: '树种管理'
                    },
                    {
                        id: 'PROJECT.NURSERYMANAGEMENT',
                        name: '苗圃管理'
                    },
                    {
                        id: 'PROJECT.SUPPLIERMANAGEMENT',
                        name: '供应商管理'
                    },
                    {
                        id: 'PROJECT.RELEVANCEMANAGEMENT',
                        name: '绑定管理'
                    }
                ]
            },
            {
                id: 'PROJECT.PROJECTIMAGE',
                name: '工程影像'
            }
        ]
    }
];
// const APPLABEL = 'accounts';

// const CONTENTTYPE = 'appmeta';

export const DOMAIN_CODES = {
    dir: '文档222',
    workPackage: '施工包111'
};
// 获取新闻发布单位
export const DEPARTMENT = [
    {
        code: 'ORG_01_19',
        name: '雄安新区造林指挥部'
    },
    {
        code: 'ORG_03_32',
        name: '河北远大工程咨询有限公司'
    },
    {
        code: 'ORG_P010_01_02_02',
        name: '北京政泰隆工程管理有限公司'
    },
    {
        code: 'ORG_P010_01_02_03',
        name: '北京中城建建设监理有限公司'
    },
    {
        code: 'ORG_P010_01_02_04',
        name: '浙江江南工程管理股份有限公司'
    },
    {
        code: 'ORG_P010_02_02_01',
        name: '北京中林华联建设工程监理有限公司'
    },
    {
        code: 'ORG_P010_03_02_01',
        name: '天津市源天工程咨询有限公司'
    }
];
