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
 * @Last Modified time: 2020-03-21 13:05:37
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
let DOMAIN, SDOMAIN;

DOMAIN = window.config.DOMAIN;
SDOMAIN = window.config.SDOMAIN;

/** *********************公共资源服务**************************/
export { DOMAIN };
export const CODE_PROJECT = '森林大数据';
export const base = `${DOMAIN}`;
export const WORKFLOW_API = `${DOMAIN}/service/workflow/api`;
// 定位数据导入模块
export const NURSERYLOCATION_DOWLOAD = `${window.config.nurseryLocation}`;
// 考勤打卡
export const IN_OFF_DUTY_API = `${window.config.IN_OFF_DUTY}`;
// GIS服务
export const FOREST_GIS_API = window.config.DASHBOARD_ONSITE;
export const XACOMPANYINITLEAFLET_API = window.config.XACompanyInitLeaflet;
export const INITLEAFLET_API = window.config.initLeaflet;
export const TREEPIPE_API = `${DOMAIN}:810`;
export const WMSTILELAYERURL = window.config.WMSTileLayerUrl;
export const TILEURLS = {
    1: window.config.IMG_W,
    2: window.config.VEC_W
};
// 静态资源文件服务
export const STATIC_PREVIEW_API = `${DOMAIN}`;
// 阿里云图片
export const FOREST_IMG = `${window.config.ALIIMG}`;
// 森林服务
export const FOREST_API = `${DOMAIN}`;
// 系统
export const SYSTEM_API = `${DOMAIN}/system`;
// 园林
export const GARDEN_API = `${DOMAIN}/garden`;
// 新闻通知
export const NEWS_API = `${DOMAIN}/cms`;
// 文档管理
export const DOC_API = `${DOMAIN}/doc`;
// 苗木服务
export const TREE_API = `${DOMAIN}/tree`;
//
export const TREES_API = `${DOMAIN}/trees`;
// 养护服务
export const CURING_API = `${DOMAIN}/curing`;
// 路线服务
export const ROUTE_API = `${DOMAIN}/route`;
// 结缘服务
export const ADOPT_API = `${DOMAIN}/adopt`;
// 流程服务
export const FLOW_API = `${DOMAIN}/flow`;
// DB服务
export const DB_API = `${DOMAIN}/db`;
// 二维码分发
export const QRCODE_API = `${DOMAIN}/qrcode`;
// 会议服务
export const MEETING_API = `${SDOMAIN}/meeting`;
// 文件导出服务
export const DOCEXPORT_API = `${DOMAIN}/DocExport.ashx`;
// 验证码服务
export const VALIDATE_API = `${DOMAIN}/ValidateHandler.ashx`;
// 文件上传
export const OSSUPLOAD_API = `${DOMAIN}/OSSUploadHandler.ashx`;
export const UPLOAD_API = `${DOMAIN}/UploadHandler.ashx`;
export const SHAPEUPLOAD_API = `${DOMAIN}/ShapeUploadHandler.ashx`;

// 高德地图逆坐标查询
export const LBSAMAP_API = window.config.LBSAMAP;
export const LBSAMAP_KEY = '8325164e247e15eea68b59e89200988b';
// 腾讯移动分析
export const TENCENTANALYSIS_API = `${DOMAIN}`;

/** *********************园林服务接口**************************/
// 苗木服务
export const TREE_API_GARDEN = `${SDOMAIN}/tree`;
// 养护服务
export const CURING_API_GARDEN = `${SDOMAIN}/curing`;
// 系统
export const SYSTEM_API_GARDEN = `${SDOMAIN}/system`;

/** *********************静态常量**************************/
export const ORGTYPE = [
    '业主单位',
    '施工单位',
    '监理单位',
    '设计单位',
    '造价单位',
    '养护单位'
];
// 当前执行的项目
export const DEFAULT_PROJECT = 'P193';
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
        Name: '2018年秋季造林',
        center: [38.784605024411576, 115.73293304652907],
        Zoom: 13
    },
    {
        Name: '2019年春季造林',
        center: [39.068756148044486, 115.92073061387055],
        Zoom: 12
    },
    {
        Name: '2019年秋季造林',
        center: [38.967432975769, 116.212756633759],
        Zoom: 12
    },
    {
        Name: '2019年雄县秋季造林',
        center: [39.1029167175293, 116.223292350769],
        Zoom: 12
    },
    {
        Name: '2019年秋季雄安市场化造林',
        center: [39.0806865692139, 116.174374222755],
        Zoom: 12
    },
    {
        Name: '唐河入淀口湿地生态保护项目',
        center: [38.814879655838, 115.85329502821],
        Zoom: 17
    },
    {
        Name: '截洪渠景观一期工程',
        center: [39.04217004776, 115.882244110107],
        Zoom: 14
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
        units: '米',
        type: '其他',
        typeFirst: true,
        typeList: 6
    },
    {
        id: 9,
        name: '开挖排水沟槽',
        units: '米',
        type: '其他',
        typeFirst: false
    },
    {
        id: 10,
        name: '安装排水管道',
        units: '米',
        type: '其他',
        typeFirst: false
    },
    {
        id: 11,
        name: '回填排水',
        units: '米',
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
export const WFStatusList = [
    {
        value: '',
        label: '全部'
    },
    // {
    //     value: 0,
    //     label: '草稿中'
    // },
    {
        value: 1,
        label: '运行中'
    },
    {
        value: 2,
        label: '已完成'
    },
    // {
    //     value: 3,
    //     label: '挂起'
    // },
    {
        value: 4,
        label: '退回'
    }
    // {
    //     value: 5,
    //     label: '转发'
    // }
];
// 执行状态
export const ExecuteStateList = [
    {
        value: 0,
        label: '待执行'
    }, {
        value: 1,
        label: '已执行'
    }, {
        value: 2,
        label: '退回'
    }, {
        value: 3,
        label: '挂起'
    }, {
        value: 4,
        label: '转发'
    }
];
// 节点类型
export const NodeType = [
    {
        value: 0,
        label: '结束'
    }, {
        value: 1,
        label: '开始'
    }, {
        value: 2,
        label: '普通'
    }, {
        value: 3,
        label: '选择'
    }, {
        value: 4,
        label: '分流'
    }, {
        value: 5,
        label: '合流'
    }
];
// 项目管理  树种管理 苗圃测量
export const NURSERYPARAM = [
    '土球直径', '土球厚度', '高度', '冠幅', '胸径', '地径', '分枝数量', '分枝点', '条长', '地径超过0.5厘米分支数量', '地径超过1cm分枝数量', '地径超过3厘米分支数量'
];
// 项目管理  树种管理 现场测量
export const TREEPARAM = [
    '地径', '高度', '冠幅', '胸径', '密度', '面积', '分枝数量', '分枝点', '条长', '地径超过0.5厘米分支数量', '地径超过1cm分枝数量', '地径超过3厘米分支数量'
];

// 灌溉竣工图可导出标段
export const TREEPIPEEXPORTSECTIONS = [
    {
        section: 'P193-01-02',
        name: '中铁一局大千生态联合体'
    }
];
// 灌溉竣工图可导出个人
export const TREEPIPEEXPORTPERSONS = [
    {
        username: 'lw2019',
        name: '柳旺'
    }
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
                id: 'OVERALL.MEETINGMANAGE',
                name: '会议管理'
            },
            {
                id: 'OVERALL.FORM.NONE',
                name: '表单管理',
                children: [
                    {
                        id: 'OVERALL.DESIGNCHANGE',
                        name: '设计变更'
                    },
                    {
                        id: 'OVERALL.VISAMANAGEMENT',
                        name: '签证管理'
                    },
                    {
                        id: 'OVERALL.NEGOTIATIONMANAGEMENT',
                        name: '洽商管理'
                    }
                ]
            },
            {
                id: 'OVERALL.DATUM.NONE',
                name: '资料文档',
                children: [
                    {
                        id: 'OVERALL.STANDARD',
                        name: '制度标准'
                    }, {
                        id: 'OVERALL.ENGINEERING',
                        name: '工程文档'
                    }, {
                        id: 'OVERALL.REDIOS',
                        name: '会议记录'
                    }, {
                        id: 'OVERALL.INTERIM',
                        name: '过程资料'
                    }
                ]
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
            }
            // {
            //     id: 'SCHEDULE.ENTERANALYZE',
            //     name: '苗木进场分析'
            // },
            // {
            //     id: 'SCHEDULE.SCHEDULEANALYZE',
            //     name: '种植进度分析'
            // }
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
                    }
                    // {
                    //     id: 'FOREST.DATASTATIS',
                    //     name: '数据统计'
                    // },
                    // {
                    //     id: 'FOREST.USERANALYSIS',
                    //     name: '用户行为统计'
                    // }
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
                    },
                    {
                        id: 'FOREST.TRANSPLANTINFO',
                        name: '移植信息'
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
                        name: '苗木死亡调查'
                    },
                    {
                        id: 'FOREST.DIETREES',
                        name: '苗木死亡信息'
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
            },
            {
                id: 'FOREST.DEGITALACCEPT',
                name: '数字化验收'
            },
            {
                id: 'FOREST.AGAINACCEPT',
                name: '重新验收'
            },
            {
                id: 'FOREST.COMPLETIONPLAN',
                name: '灌溉竣工图导出'
            }
        ]
    },
    {
        id: 'CONSERVATION',
        name: '养护管理',
        children: [
            {
                id: 'CONSERVATION.TASKCREATE',
                name: '任务下发'
            },
            {
                id: 'CONSERVATION.TASKREPORT',
                name: '任务上报'
            },
            {
                id: 'CONSERVATION.TASKSTATIS',
                name: '任务统计'
            },
            {
                id: 'CONSERVATION.TASKTEAM',
                name: '养护班组'
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
                id: 'CHECKWORK.SETUP.NONE',
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
            }
            // {
            //     id: 'SELFCARE.QUERY',
            //     name: '个人考勤'
            // },
            // {
            //     id: 'SELFCARE.LEAVE',
            //     name: '个人请假'
            // }
        ]
    },
    {
        id: 'SETUP',
        name: '系统设置',
        children: [
            {
                id: 'SETUP.PERSON',
                name: '用户管理'
            },
            {
                id: 'SETUP.ORG',
                name: '组织机构'
            },
            {
                id: 'SETUP.ROLE',
                name: '角色设置'
            },
            {
                id: 'SETUP.PERMISSION',
                name: '权限设置'
            },
            {
                id: 'SETUP.WORKFLOW',
                name: '流程设置'
            },
            {
                id: 'SETUP.FLOWNODE',
                name: '流程节点'
            },
            {
                id: 'SETUP.BLACKLIST.NONE',
                name: '黑名单',
                children: [
                    {
                        id: 'SETUP.PERSONBLACKLIST',
                        name: '人员黑名单'
                    }
                ]
            }
        ]
    },
    {
        id: 'PROJECT',
        name: '项目管理',
        children: [
            {
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
                name: '人机物料',
                id: 'PROJECT.MANMACHINE.NONE',
                children: [
                    {
                        id: 'PROJECT.MANENTRANCEANDDEPARTURE',
                        name: '人员进离场'
                    },
                    {
                        id: 'PROJECT.MACHINEENTRANCEANDDEPARTURE',
                        name: '机械进离场'
                    },
                    {
                        id: 'PROJECT.MANMACHINEGROUP',
                        name: '班组维护'
                    },
                    {
                        id: 'PROJECT.MACHINEQRCODEPRINT',
                        name: '机械二维码'
                    }
                    // {
                    //     id: 'PROJECT.FACERECOGNITIONLIST',
                    //     name: '人脸识别列表'
                    // },
                    // {
                    //     id: 'PROJECT.FACERECOGNITIONRECORD',
                    //     name: '人脸识别记录'
                    // }
                ]
            },
            {
                id: 'PROJECT.PLOTMANAGE.NONE',
                name: '数据管理',
                children: [
                    {
                        id: 'PROJECT.THINCLASSTORAGE',
                        name: '细班导入'
                    },
                    {
                        id: 'PROJECT.THINCLASSPARCELMANAGE',
                        name: '细班分块管理'
                    },
                    {
                        id: 'PROJECT.THINCLASSTREETYPEMANAGE',
                        name: '细班树种管理'
                    },
                    {
                        id: 'PROJECT.PARCELSTORAGE',
                        name: '地块导入'
                    },
                    {
                        id: 'PROJECT.PARCELMANAGE',
                        name: '地块管理'
                    },
                    {
                        id: 'PROJECT.QRCODEDISTRIBUTE',
                        name: '二维码派发信息'
                    },
                    {
                        id: 'PROJECT.CONSTRUCTIONPACKAGE',
                        name: '施工包管理'
                    }
                ]
            }
            // {
            //     id: 'PROJECT.PROJECTIMAGE',
            //     name: '工程影像'
            // }
        ]
    }
];
