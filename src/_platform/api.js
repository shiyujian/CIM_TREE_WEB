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
 * @Last Modified time: 2019-07-29 15:47:16
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
let DOMAIN, STATIC_FILE_IP;

DOMAIN = window.config.DOMAIN;
STATIC_FILE_IP = window.config.STATIC_FILE_IP;

/** *********************公共资源服务**************************/
export { DOMAIN };
export const CODE_PROJECT = '森林大数据';
export const base = `${DOMAIN}`;
export const SOURCE_API = `${STATIC_FILE_IP}:${window.config.STATIC_PREVIEW_PORT}`;
export const SERVICE_API = `${base}/service/construction/api`;
export const FILE_API = `${base}/service/fileserver`;
export const WORKFLOW_API = `${base}/service/workflow/api`;
export const UPLOAD_API = `${base}/service/fileserver/api/user/files/`;
// 文件预览的接口
export const previewWord_API = window.config.previewWord_API;
// 静态资源文件服务==========STATIC_FILE_IP
export const STATIC_DOWNLOAD_API = `${STATIC_FILE_IP}:${
    window.config.STATIC_DOWNLOAD_PORT
}`;
export const STATIC_PREVIEW_API = `${STATIC_FILE_IP}:${
    window.config.STATIC_PREVIEW_PORT
}`;

export const MAIN_API = `${base}/cms`;
// 高德地图逆坐标查询
export const LBSAMAP_API = window.config.LBSAMAP;
export const LBSAMAP_KEY = '8325164e247e15eea68b59e89200988b';
// 腾讯移动分析
export const TENCENTANALYSIS_API = window.config.TENCENTANALYSIS;
// 质量监控地图
export const WMSTILELAYERURL = window.config.WMSTileLayerUrl;
export const TILEURLS = {
    1: window.config.IMG_W,
    2: window.config.VEC_W
};

export const NURSERYLOCATION_DOWLOAD = `${window.config.nurseryLocation}`;
// 智慧森林
export const FOREST_API = `${DOMAIN}`;
export const SYSTEM_API = `${DOMAIN}/system`;
export const SEEDLING_API = `${window.config.SEEDLING}`;
export const FOREST_IMG = `${window.config.ALIIMG}`;
export const FOREST_GIS_API = window.config.DASHBOARD_ONSITE;
export const INITLEAFLET_API = window.config.initLeaflet;
export const TREEPIPE_API = `${window.config.PIPE}`;

// 考勤打卡
export const IN_OFF_DUTY_API = `${window.config.IN_OFF_DUTY}`;

/** *********************静态常量**************************/
export const WORKFLOW_CODE = {
    总进度计划报批流程: 'TEMPLATE_001',
    每日进度填报流程: 'TEMPLATE_003',
    每周进度填报流程: 'TEMPLATE_013'
    // 每日进度计划填报流程: 'TEMPLATE_007',
    // 表单管理流程: 'TEMPLATE_002',
    // 机械设备报批流程: 'TEMPLATE_004',
    // 工程材料报批流程: 'TEMPLATE_005',
    // 苗木资料报批流程: 'TEMPLATE_006',
    // 检验批验收审批流程: 'TEMPLATE_008',
    // 安全体系报批流程: 'TEMPLATE_009',
    // 普通审查流程: 'TEMPLATE_010',
    // 审查核定流程: 'TEMPLATE_011',
    // 总监审查流程: 'TEMPLATE_012'
};

export const ORGTYPE = [
    '业主单位', '施工单位', '监理单位', '养护单位'
];
// 当前执行的项目
export const DEFAULT_PROJECT = 'P191';
// 业主审核进度管理列表人员
export const OWNERCHECKLIST = [
    '张亮', '陈津陵', '池铭炎', '李红宇', '张大伟', '郝晓飞', '黄雪晨', '李航'
];

// 综合展示 各个项目的中心坐标
export const PROJECTPOSITIONCENTER = [
    {
        Name: '九号地块',
        center: [38.99042701799772, 116.0396146774292],
        Zoom: 14
    },
    {
        Name: '苗景兼用林项目',
        center: [39.02511978201801, 116.25842285575345],
        Zoom: 13
    },
    {
        Name: '市民中心景观项目',
        center: [39.04825544272171, 115.90770578315642],
        Zoom: 16
    },
    {
        Name: '2018秋季造林',
        center: [38.784605024411576, 115.73293304652907],
        Zoom: 13
    },
    {
        Name: '2019春季造林',
        center: [39.068756148044486, 115.92073061387055],
        Zoom: 12
    }
];
// 树种大类
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
        name: '地被'
    }
];
// 苗木市场  需求发布
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
// 进度管理 进度填报和进度展示
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
// 流程状态
export const WFStatusList = [{
    value: 0,
    label: '草稿中'
}, {
    value: 1,
    label: '运行中'
}, {
    value: 2,
    label: '已完成'
}, {
    value: 3,
    label: '挂起'
}, {
    value: 4,
    label: '退回'
}, {
    value: 5,
    label: '转发'
}];
// 流程信息
export const TOTAL_NAME = '总进度计划报批流程';
export const TOTAL_ID = 'c361b0af-a7ec-4181-acd0-39512ffd96b8';
export const TOTAL_ONENODE_NAME = '施工填报';
export const TOTAL_ONENODE_ID = '86299a5b-c073-456d-8707-cfc314691415';
export const TOTAL_TWONODE_NAME = '监理审核';
export const TOTAL_TWONODE_ID = '7d36a1a9-b5bd-4dde-82bc-8196e120824f';
export const TOTAL_THREENODE_NAME = '结束';
export const TOTAL_THREENODE_ID = 'c9e202a8-dce9-4603-9cf9-cf2c70d4181b';

export const WEEK_NAME = '每周进度填报流程';
export const WEEK_ID = 'b0eedc49-fe00-4754-a4fe-885e9177e663';

export const ACYUAL_NAME = '每日进度填报流程';
export const ACYUAL_ID = '098dd731-d6fa-4076-8651-082470498a37';
export const ACYUAL_ONENODE_NAME = '施工填报';
export const ACYUAL_ONENODE_ID = '273f55b4-1163-4616-b7f9-db404ef0787e';
export const ACYUAL_TWONODE_NAME = '监理审核';
export const ACYUAL_TWONODE_ID = '3c6bed0c-6dcd-4c62-95b1-67d28900833a';
export const ACYUAL_THREENODE_NAME = '业主查看';
export const ACYUAL_THREENODE_ID = 'a81c5d75-60e6-4528-9c0a-3a0c9b2003cc';
export const ACYUAL_FOURNODE_NAME = '结束';
export const ACYUAL_FOURNODE_ID = '5abc1404-2728-4f5d-b816-e96e2568f1bb';
// 项目管理  树种管理 苗圃测量
export const NURSERYPARAM = [
    '土球直径', '土球厚度', '高度', '冠幅', '胸径', '地径', '分枝数量', '地径超过1cm分枝数量'
];
// 项目管理  树种管理 现场测量
export const TREEPARAM = [
    '地径', '高度', '胸径', '密度', '面积', '分枝数量', '地径超过1cm分枝数量'
];

export const MODULES = [
    {
        id: 'HOME',
        name: '首页'
    },
    {
        id: 'DASHBOARD',
        name: '综合展示'
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
        id: 'SCHEDULE',
        name: '进度管理',
        children: [
            {
                id: 'SCHEDULE.STAGEREPORT',
                name: '进度填报'
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
                        id: 'FOREST.USERANALYSI',
                        name: '用户分析'
                    },
                    {
                        id: 'FOREST.NURSERYSOURSEANALYSI',
                        name: '苗木来源地分析'
                    },
                    {
                        id: 'FOREST.ENTERSTRENGTHANALYSI',
                        name: '进场强度分析'
                    },
                    {
                        id: 'FOREST.PLANTSTRENGTHANALYSI',
                        name: '栽植强度分析'
                    },
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
    // {
    //     id: 'MARKET',
    //     name: '苗木市场',
    //     children: [
    //         {
    //             id: 'MARKET.SUPERMARKET.NONE',
    //             name: '苗木超市',
    //             children: [
    //                 {
    //                     id: 'MARKET.SEEDLINGSUPPLY',
    //                     name: '苗木供应'
    //                 },
    //                 {
    //                     id: 'MARKET.SEEDLINGPURCHASE',
    //                     name: '苗木求购'
    //                 }
    //             ]
    //         },
    //         {
    //             id: 'MARKET.SUPPLYRELEASE',
    //             name: '供应发布'
    //         },
    //         {
    //             id: 'MARKET.DEMANDRELEASE',
    //             name: '需求发布'
    //         },
    //         {
    //             id: 'MARKET.OFFERMANAGE',
    //             name: '报价管理'
    //         }
    //     ]
    // },
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
                id: 'PROJECT.PLOTMANAGE.NONE',
                name: '数据管理',
                children: [
                    {
                        id: 'PROJECT.THINCLASSTORAGE',
                        name: '细班导入'
                    }, {
                        id: 'PROJECT.THINCLASSPARCELMANAGE',
                        name: '细班分块管理'
                    }, {
                        id: 'PROJECT.THINCLASSTREETYPEMANAGE',
                        name: '细班树种管理'
                    }, {
                        id: 'PROJECT.PARCELSTORAGE',
                        name: '地块导入'
                    }, {
                        id: 'PROJECT.PARCELMANAGE',
                        name: '地块管理'
                    }
                ]
            }, {
                id: 'PROJECT.NURSERY.NONE',
                name: '苗木管理',
                children: [
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
