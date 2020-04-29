import React, { Component } from 'react';
import { Icon } from 'react-fa';

export const OverallMenu = [
    {
        key: 'news',
        id: 'OVERALL.NEWS',
        path: '/overall/news',
        name: '新闻通知'
        // icon: <Icon name='calendar-check-o' />
    },
    {
        key: 'dispatch',
        id: 'OVERALL.DISPATCH',
        path: '/overall/dispatch',
        name: '现场收发文'
        // icon: <Icon name='newspaper-o' />
    },
    {
        key: 'MeetingManage',
        id: 'OVERALL.MEETINGMANAGE',
        path: '/overall/MeetingManage',
        name: '会议管理'
        // icon: <Icon name='newspaper-o' />
    },
    {
        key: 'form',
        id: 'OVERALL.FORM',
        name: '表单管理',
        children: [
            {
                key: 'DesignChange',
                id: 'OVERALL.DESIGNCHANGE',
                path: '/overall/designchange',
                name: '设计变更'
            }, {
                key: 'VisaManagement',
                id: 'OVERALL.VISAMANAGEMENT',
                path: '/overall/visamanagement',
                name: '签证管理'
            }, {
                key: 'NegotiationManagement',
                id: 'OVERALL.NEGOTIATIONMANAGEMENT',
                path: '/overall/negotiationmanagement',
                name: '洽商管理'
            }
        ]
    },
    {
        key: 'datum',
        id: 'OVERALL.DATUM',
        name: '资料文档',
        children: [
            {
                key: 'standard',
                id: 'OVERALL.STANDARD',
                path: '/overall/standard',
                name: '制度标准'
            }, {
                key: 'engineering',
                id: 'OVERALL.ENGINEERING',
                path: '/overall/engineering',
                name: '工程文档'
            }, {
                key: 'redios',
                id: 'OVERALL.REDIOS',
                path: '/overall/redios',
                name: '会议记录'
            }, {
                key: 'interim',
                id: 'OVERALL.INTERIM',
                path: '/overall/interim',
                name: '过程资料'
            }
        ]
    }
];
export const ScheduleMenu = [
    {
        key: 'stagereport',
        id: 'SCHEDULE.STAGEREPORT',
        name: '进度填报',
        path: '/schedule/stagereport',
        icon: <Icon name='suitcase' />
    },
    {
        key: 'nodemanage',
        id: 'SCHEDULE.NODEMANAGE',
        name: '节点管理',
        path: '/schedule/nodemanage',
        icon: <Icon name='suitcase' />
    },
    {
        key: 'scheduledisplay',
        id: 'SCHEDULE.SCHEDULEDISPLAY',
        name: '进度展示',
        path: '/schedule/scheduledisplay',
        icon: <Icon name='warning' />
    }
];
export const ForestMenu = [
    {
        key: 'Nursoverallinfo',
        id: 'FOREST.NURSOVERALLINFO',
        path: '/forest/nursoverallinfo',
        name: '苗木综合信息'
    },
    {
        key: 'statis',
        id: 'FOREST.STATIS',
        name: '统计图表',
        children: [
            {
                key: 'UserAnalysis',
                id: 'FOREST.USERANALYSI',
                path: '/forest/useranalysi',
                name: '用户分析'
            },
            {
                key: 'NurserySourseAnalysi',
                id: 'FOREST.NURSERYSOURSEANALYSI',
                path: '/forest/nurserysourseanalysi',
                name: '苗木来源地分析'
            },
            {
                key: 'EnterStrengthAnalysi',
                id: 'FOREST.ENTERSTRENGTHANALYSI',
                path: '/forest/enterstrengthanalysi',
                name: '进场强度分析'
            },
            {
                key: 'PlantStrengthAnalysi',
                id: 'FOREST.PLANTSTRENGTHANALYSI',
                path: '/forest/plantstrengthanalysi',
                name: '栽植强度分析'
            }
        ]
    },
    {
        key: 'building',
        id: 'FOREST.BUILDING',
        name: '建设期信息',
        children: [
            {
                key: 'Nursmeasureinfo',
                id: 'FOREST.NURSMEASUREINFO',
                path: '/forest/nursmeasureinfo',
                name: '苗圃测量信息'
            },
            {
                key: 'CarPackage',
                id: 'FOREST.CARPACKAGE',
                path: '/forest/carpackage',
                name: '车辆打包信息'
            },
            {
                key: 'Locmeasureinfo',
                id: 'FOREST.LOCMEASUREINFO',
                path: '/forest/locmeasureinfo',
                name: '现场测量信息'
            },
            {
                key: 'Supervisorinfo',
                id: 'FOREST.SUPERVISORINFO',
                path: '/forest/supervisorinfo',
                name: '栽植抽查信息'
            }
            // {
            //     key: 'Checkerinfo',
            //     id: 'FOREST.OWNERINFO',
            //     path: '/forest/checkerinfo',
            //     name: '业主抽查信息'
            // }
        ]
    },
    {
        key: 'management',
        id: 'FOREST.MANAGEMENT',
        name: '养管护信息',
        children: [
            {
                key: 'CuringInfo',
                id: 'FOREST.CURINGINFO',
                path: '/forest/curinginfo',
                name: '养护信息'
            },
            {
                key: 'TreeAdoptInfo',
                id: 'FOREST.TREEADOPTINFO',
                path: '/forest/treeadoptinfo',
                name: '苗木死亡调查'
            },
            {
                key: 'DieTrees',
                id: 'FOREST.DIETREES',
                path: '/forest/dietrees',
                name: '苗木死亡信息'
            },
            {
                key: 'TransplantInfo',
                id: 'FOREST.TRANSPLANTINFO',
                path: '/forest/transplantinfo',
                name: '移植信息'
            },
            {
                key: 'VolunteerTree',
                id: 'FOREST.VOLUNTEERTREE',
                path: '/forest/volunteertree',
                name: '义务植树信息'
            }
        ]
    },
    {
        key: 'import',
        id: 'FOREST.IMPORT',
        name: '数据信息维护',
        children: [
            {
                key: 'SeedlingsChange',
                id: 'FOREST.SEEDLINGSCHANGE',
                path: '/forest/seedlingschange',
                name: '苗木信息修改'
            },
            {
                key: 'TreeDataClear',
                id: 'FOREST.TREEDATACLEAR',
                path: '/forest/treedataclear',
                name: '苗木信息删除'
            },
            {
                key: 'Dataimport',
                id: 'FOREST.DATAIMPORT',
                path: '/forest/dataimport',
                name: '定位数据导入'
            },
            {
                key: 'DataExport',
                id: 'FOREST.DATAEXPORT',
                path: '/forest/dataexport',
                name: '定位数据导出'
            }
        ]
    },
    {
        key: 'DegitalAccept',
        id: 'FOREST.DEGITALACCEPT',
        path: '/forest/degitalaccept',
        name: '数字化验收'
    },
    {
        key: 'AgainAccept',
        id: 'FOREST.AGAINACCEPT',
        path: '/forest/againaccept',
        name: '重新验收'
    },
    {
        key: 'CompletionPlan',
        id: 'FOREST.COMPLETIONPLAN',
        path: '/forest/completionplan',
        name: '灌溉竣工图导出'
    },
    {
        key: 'FactsSurvey',
        id: 'FOREST.FACTSSURVEY',
        path: '/forest/factssurvey',
        name: '现状调查图导出'
    }
];
export const ConservationMenu = [
    {
        key: 'TASKCREATE',
        id: 'CONSERVATION.TASKCREATE',
        path: '/conservation/taskcreate',
        name: '任务下发',
        icon: <Icon name='line-chart' />
    },
    {
        key: 'TASKREPORT',
        id: 'CONSERVATION.TASKREPORT',
        path: '/conservation/taskreport',
        name: '任务上报',
        icon: <Icon name='file-text-o' />
    },
    {
        key: 'TASKSTATIS',
        id: 'CONSERVATION.TASKSTATIS',
        path: '/conservation/taskstatis',
        name: '任务统计',
        icon: <Icon name='file-text' />
    },
    {
        key: 'TASKTEAM',
        id: 'CONSERVATION.TASKTEAM',
        path: '/conservation/taskteam',
        name: '养护班组',
        icon: <Icon name='users' />
    }
];
export const CheckWorkMenu = [
    {
        key: 'attendancecount',
        id: 'CHECKWORK.ATTENDANCECOUNT',
        path: '/checkwork/attendancecount',
        name: '考勤统计'
    },
    {
        key: 'checkworksetup',
        id: 'CHECKWORK.SETUP',
        name: '考勤设置',
        children: [
            {
                key: 'electronicfence',
                id: 'CHECKWORK.ELECTRONICFENCE',
                path: '/checkwork/electronicfence',
                name: '电子围栏'
            },
            {
                key: 'attendancegroup',
                id: 'CHECKWORK.ATTENDANCEGROUP',
                path: '/checkwork/attendancegroup',
                name: '考勤群体'
            }
        ]
    }
];
export const SlefCareMenu = [
    {
        key: 'tasks',
        id: 'SELFCARE.TASK',
        name: '个人任务',
        path: '/selfcare/task',
        icon: <Icon name='tasks' />
    }
];
export const SetupMenu = [
    {
        key: 'Person',
        id: 'SETUP.PERSON',
        name: '用户管理',
        path: '/setup/person',
        icon: <Icon name='users' />
    },
    {
        key: 'Org',
        id: 'SETUP.ORG',
        name: '组织机构',
        path: '/setup/org',
        icon: <Icon name='street-view' />
    },
    {
        key: 'Role',
        id: 'SETUP.ROLE',
        name: '角色设置',
        path: '/setup/role',
        exact: true,
        icon: <Icon name='users' />
    },
    {
        key: 'Permission',
        id: 'SETUP.PERMISSION',
        name: '权限设置',
        path: '/setup/permission',
        icon: <Icon name='key' />
    },
    {
        key: 'Workflow',
        id: 'SETUP.WORKFLOW',
        name: '流程设置',
        path: '/setup/workflow',
        icon: <Icon name='object-group' />
    },
    {
        key: 'FlowNode',
        id: 'SETUP.FLOWNODE',
        name: '流程节点',
        path: '/setup/flownode',
        icon: <Icon name='object-group' />
    },
    {
        key: 'Blacklist',
        name: '黑名单',
        id: 'SETUP.BLACKLIST',
        icon: <Icon name='list-ul' />,
        children: [
            {
                key: 'PersonBlacklist',
                id: 'SETUP.PERSONBLACKLIST',
                name: '人员黑名单',
                path: '/setup/personblacklist',
                icon: <Icon name='street-view' />
            }
            // {
            //     key: 'NurseryBlacklist',
            //     id: 'SETUP.NURSERYBLACKLIST',
            //     name: '苗圃黑名单',
            //     path: '/setup/nurseryblacklist',
            //     icon: <Icon name='leaf' />
            // },
            // {
            //     key: 'SupplierBlacklist',
            //     id: 'SETUP.SUPPLIERBLACKLIST',
            //     name: '供应商黑名单',
            //     path: '/setup/supplierblacklist',
            //     icon: <Icon name='shopping-cart' />
            // }
        ]
    }
];
export const ProjectMenu = [
    {
        key: 'nursery',
        name: '苗木管理',
        id: 'PROJECT.NURSERY',
        children: [

            {
                key: 'NurseryManagement',
                id: 'PROJECT.NURSERYMANAGEMENT',
                name: '苗圃管理',
                path: '/project/nurseryManagement'
            },
            {
                key: 'SupplierManagement',
                id: 'PROJECT.SUPPLIERMANAGEMENT',
                name: '供应商管理',
                path: '/project/supplierManagement'
            },
            {
                key: 'RelevanceManagement',
                id: 'PROJECT.RELEVANCEMANAGEMENT',
                name: '绑定管理',
                path: '/project/relevanceManagement'
            },
            {
                key: 'TreeManage',
                id: 'PROJECT.TREEMANAGE',
                name: '树种管理',
                path: '/project/treeManage'
            }
        ]
    },
    {
        key: 'ManMachine ',
        name: '人机物料',
        id: 'PROJECT.MANMACHINE.NONE',
        children: [
            {
                key: 'ManEntranceAndDeparture',
                id: 'PROJECT.MANENTRANCEANDDEPARTURE',
                name: '人员进离场',
                path: '/project/manentranceanddeparture'
            },
            {
                key: 'ManMachineGroup',
                id: 'PROJECT.MANMACHINEGROUP',
                name: '班组维护',
                path: '/project/manmachinegroup'
            },
            {
                key: 'MachineEntranceAndDeparture',
                id: 'PROJECT.MACHINEENTRANCEANDDEPARTURE',
                name: '机械进离场',
                path: '/project/machineentranceanddeparture'
            },
            {
                key: 'MachineQRCodePrint',
                id: 'PROJECT.MACHINEQRCODEPRINT',
                name: '机械二维码',
                path: '/project/machineqrcodeprint'
            },
            {
                key: 'FaceRecognitionList',
                id: 'PROJECT.FACERECOGNITIONLIST',
                name: '人脸识别列表',
                path: '/project/facerecognitionlist'
            },
            {
                key: 'FaceRecognitionRecord',
                id: 'PROJECT.FACERECOGNITIONRECORD',
                name: '人脸识别记录',
                path: '/project/facerecognitionrecord'
            }
        ]
    },
    {
        key: 'plotManage',
        name: '数据管理',
        id: 'PROJECT.PLOTMANAGE',
        children: [
            {
                key: 'ThinClassStorage',
                id: 'PROJECT.THINCLASSTORAGE',
                name: '细班导入',
                path: '/project/thinClassStorage'
            },
            {
                key: 'ThinClassParcelManage',
                id: 'PROJECT.THINCLASSPARCELMANAGE',
                name: '细班分块管理',
                path: '/project/thinClassParcelManage'
            },
            {
                key: 'ThinClassTreeTypeManage',
                id: 'PROJECT.THINCLASSTREETYPEMANAGE',
                name: '细班树种管理',
                path: '/project/thinClassTreeTypeManage'
            },
            {
                key: 'ParcelStorage',
                id: 'PROJECT.PARCELSTORAGE',
                name: '地块导入',
                path: '/project/parcelStorage'
            },
            {
                key: 'ParcelManage',
                id: 'PROJECT.PARCELMANAGE',
                name: '地块管理',
                path: '/project/parcelManage'
            },
            {
                key: 'QRCodeDistribute',
                id: 'PROJECT.QRCODEDISTRIBUTE',
                name: '二维码派发信息',
                path: '/project/qrcodedistribute'
            },
            {
                key: 'ConstructionPackage',
                id: 'PROJECT.CONSTRUCTIONPACKAGE',
                name: '施工包管理',
                path: '/project/constructionpackage'
            }
        ]
    }
    // {
    //     key: 'projectImage',
    //     name: '工程影像',
    //     id: 'PROJECT.PROJECTIMAGE',
    //     path: '/project/projectimage',
    // }
];
