import React, { Component } from 'react';
import { Button, Radio, Modal, Tabs, Table, Form, Select, Tree, Spin, Row, Col } from 'antd';
import echarts from 'echarts';
import XLSX from 'xlsx';
import './CoverageModal.less';
import { FOREST_API } from '_platform/api';
const TreeNode = Tree.TreeNode;
const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const FormItem = Form.Item;
const Option = Select.Option;
const EchartsColor = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0'];
export default class AreaDistanceMeasure extends Component {
    constructor (props) {
        super(props);
        this.state = {
            coverageType: 'tree', // 统计类型
            PipeType: 'line', // 管类型
            node: 'projectTree', // 数据展示类型
            SectionList: [], // 标段列表
            selectProject: '', // 选中的项目
            selectSection: '', // 选中的标段

            dataListDetails: [], // 详情信息
            dataListDetailsPoint: [], // 管点详细信息
            dataListDetailsLine: [], // 管线详细信息
            overallSectionLineList: [], // 所有标段管线数据
            overallSectionLineTotal: [], // 所有标段管线总长度

            overallDiameterList: [], // 管线管径列表
            overallMaterialList: [], // 管线材料列表
            overallPipeTypeList: [], // 管点类型列表
            
            overallSectionTreeTotal: 0, // 标段树木总量
            overallSectionTreeList: [], // 所有标段树木数据
            overallTreeTypeList: [], // 标段树种数据

            projectPointList: [], // 分项目数据管点
            sectionPointList: [], // 分标段数据管点
            pipeTypeList: [], // 分类型数据管点
            projectPointTotal: 0, // 分项目数据总量

            projectLineList: [], // 分项目数据管线
            filterSectionLineList: [], // 分标段数据管线
            sectionLineList: [], // 分标段管线列表
            projectLineTotal: 0, // 分项目总数管线

            projectTreeList: [], // 分项目数据苗木
            sectionTreeList: [], // 分标段数据苗木
            treeTypeList: [], // 分树苗木
            projectTreeTotal: 0, // 分项目总数苗木
            overallVisible: false, // 整体情况查看
            loading: false // 等待
        };
        this.editPolygon = ''; // 面积图层
        this.editPolyline = '';
        this.distanceMeasureMarkerList = {};
    }
    componentDidMount () {
        this.getTree();
    }
    getTree = async () => {
        const {
            treeData,
            polygonEncircleWKT,
            actions: { getLocationsTatByRegion }
        } = this.props;
        let projectTreeList = [], sectionTreeList = [], treeTypeList = [];
        let projectTreeTotal = 0;
        this.setState({
            loading: true
        });
        let projectRep = await getLocationsTatByRegion({}, {
            stattype: 'project',
            no: '',
            section: '',
            wkt: polygonEncircleWKT,
            stime: '',
            etime: ''
        });
        let sectionRep = await getLocationsTatByRegion({}, {
            stattype: 'section',
            no: '',
            section: '',
            wkt: polygonEncircleWKT,
            stime: '',
            etime: ''
        });
        let treetypeRep = await getLocationsTatByRegion({}, {
            stattype: 'treetype',
            no: '',
            section: '',
            wkt: polygonEncircleWKT,
            stime: '',
            etime: ''
        });
        projectRep.map(item => {
            let No = item.Label.split('-')[0];
            treeData.map(record => {
                if (record.No === No) {
                    projectTreeList.push({
                        Num: item.Num,
                        No: No,
                        Name: record.Name
                    });
                }
            });
            projectTreeTotal += item.Num;
        });
        sectionRep.map((item, index) => {
            let No = item.Label;
            treeData.map(record => {
                record.children.map(row => {
                    if (row.No === No) {
                        sectionTreeList.push({
                            key: index,
                            Num: item.Num,
                            SectionNo: No,
                            SectionName: row.Name,
                            ProjectName: record.Name,
                            ProjectNo: record.No
                        });
                    }
                });
            });
        });
        treetypeRep.map((item, index) => {
            treeTypeList.push({
                key: index,
                Num: item.Num,
                TreeTypeID: item.TreeType,
                TreeTypeName: item.TreeTypeObj.TreeTypeName
            });
        });
        projectTreeList.sort((record1, record2) => {
            return record2.Num - record1.Num;
        });
        console.log('苗木分项目数据', projectTreeList, projectTreeTotal);
        console.log('苗木分标段数据', sectionTreeList);
        console.log('苗木分树种数据', treeTypeList);
        this.setState({
            projectTreeList,
            sectionTreeList,
            treeTypeList,
            projectTreeTotal,
            loading: false
        }, () => {
            this.InitProjectTreeECharts();
        });
    }
    getPipePoint = async () => {
        const {
            treeData,
            polygonEncircleWKT,
            actions: { getPipenodeStatByRegion }
        } = this.props;
        this.setState({
            loading: true
        });
        let projectRep = await getPipenodeStatByRegion({}, {
            stattype: 'project',
            section: '',
            wkt: polygonEncircleWKT
        });
        let sectionRep = await getPipenodeStatByRegion({}, {
            stattype: 'section',
            section: '',
            wkt: polygonEncircleWKT
        });
        let pipetypeRep = await getPipenodeStatByRegion({}, {
            stattype: 'pipetype',
            section: '',
            wkt: polygonEncircleWKT
        });
        let projectPointTotal = 0;
        let projectPointList = [], sectionPointList = [], pipeTypeList = [];
        projectRep.map(item => {
            let No = item.Label.split('-')[0];
            treeData.map(record => {
                if (record.No === No) {
                    projectPointList.push({
                        Num: item.Num,
                        No: No,
                        Name: record.Name
                    });
                }
            });
            projectPointTotal += item.Num;
        });
        sectionRep.map((item, index) => {
            let No = item.Label;
            treeData.map(record => {
                record.children.map(row => {
                    if (row.No === No) {
                        sectionPointList.push({
                            key: index,
                            Num: item.Num,
                            SectionNo: No,
                            SectionName: row.Name,
                            ProjectName: record.Name,
                            ProjectNo: record.No
                        });
                    }
                });
            });
        });
        pipetypeRep.map((item, index) => {
            let No = item.Label;
            treeData.map(record => {
                record.children.map(row => {
                    if (row.No === No) {
                        pipeTypeList.push({
                            key: index,
                            Num: item.Num,
                            PipeTypeID: item.PipeTypeID,
                            PipeNodeTypeObj: item.PipeNodeTypeObj,
                            SectionNo: No,
                            SectionName: row.Name,
                            ProjectName: record.Name,
                            ProjectNo: record.No
                        });
                    }
                });
            });
        });
        console.log('项目数据', projectPointList, projectPointTotal);
        console.log('标段数据', sectionPointList);
        console.log('管点类型数据', pipeTypeList);
        this.setState({
            projectPointList,
            sectionPointList,
            pipeTypeList,
            projectPointTotal,
            loading: false
        }, () => {
            this.InitProjectPointECharts();
        });
    }
    getPipeline = async () => {
        const {
            treeData,
            polygonEncircleWKT,
            actions: { getPipeStatByRegion }
        } = this.props;
        this.setState({
            node: 'projectLine',
            loading: true
        });
        let projectRep = await getPipeStatByRegion({}, {
            stattype: 'project',
            section: '',
            wkt: polygonEncircleWKT
        });
        let sectionRep = await getPipeStatByRegion({}, {
            stattype: 'section',
            section: '',
            wkt: polygonEncircleWKT
        });
        let diameterRep = await getPipeStatByRegion({}, {
            stattype: 'dn',
            section: '',
            wkt: polygonEncircleWKT
        });
        let materialRep = await getPipeStatByRegion({}, {
            stattype: 'material',
            section: '',
            wkt: polygonEncircleWKT
        });
        let projectLineTotal = 0;
        let projectLineList = [], sectionLineList = [], diameterLineList = [], materialLineList = [];
        projectRep.map(item => {
            let No = item.Label.split('-')[0];
            treeData.map(record => {
                if (record.No === No) {
                    projectLineList.push({
                        Length: item.Length.toFixed(),
                        No: No,
                        Name: record.Name
                    });
                }
            });
            projectLineTotal += item.Length;
        });
        sectionRep.map((item, index) => {
            let No = item.Label;
            treeData.map(record => {
                record.children.map(row => {
                    if (row.No === No) {
                        sectionLineList.push({
                            key: index,
                            Length: item.Length.toFixed(),
                            SectionNo: No,
                            SectionName: row.Name,
                            ProjectName: record.Name,
                            ProjectNo: record.No
                        });
                    }
                });
            });
        });
        diameterRep.map((item, index) => {
            let No = item.Label;
            treeData.map(record => {
                record.children.map(row => {
                    if (row.No === No) {
                        diameterLineList.push({
                            key: index,
                            DN: item.DN,
                            Length: item.Length.toFixed(),
                            SectionNo: No,
                            SectionName: row.Name,
                            ProjectName: record.Name,
                            ProjectNo: record.No
                        });
                    }
                });
            });
        });
        materialRep.map((item, index) => {
            let No = item.Label;
            treeData.map(record => {
                record.children.map(row => {
                    if (row.No === No) {
                        materialLineList.push({
                            key: index,
                            DN: item.DN,
                            Material: item.Material,
                            Length: item.Length.toFixed(),
                            SectionNo: No,
                            SectionName: row.Name,
                            ProjectName: record.Name,
                            ProjectNo: record.No
                        });
                    }
                });
            });
        });
        console.log('项目数据', projectLineList, projectLineTotal);
        console.log('标段数据', sectionLineList);
        console.log('管径数据', diameterLineList);
        console.log('材质数据', materialLineList);
        this.setState({
            projectLineList,
            filterSectionLineList: sectionLineList,
            sectionLineList,
            diameterLineList,
            materialLineList,
            projectLineTotal: projectLineTotal.toFixed(),
            loading: false
        }, () => {
            this.InitProjectLineECharts();
        });
    }
    InitProjectPointECharts () {
        const { projectPointList, projectPointTotal } = this.state;
        let legendData = [];
        let seriesData = [];
        projectPointList.map(item => {
            legendData.push(item.Name);
            seriesData.push({
                name: item.Name,
                no: item.No,
                value: item.Num.toFixed()
            });
        });
        let projectPointTotalStr = Number(projectPointTotal.toFixed(2)).toLocaleString();
        console.log('管点', legendData, seriesData, projectPointTotalStr);
        let myChart = echarts.init(document.getElementById('projectPointECharts'));
        let option = {
            color: EchartsColor,
            title: {
                text: '管点总数量',
                subtext: `${projectPointTotalStr} 个`,
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '190',
                top: '140'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 400,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                        },
                        unum: {
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', proportion = '';
                    seriesData.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            proportion = ((item.value / projectPointTotalStr) * 100).toFixed(1);
                        }
                    });
                    return `{name|${name}} ｜ {proportion|${proportion}%} ${value}`;
                },
                data: legendData
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [200, 170],
                    radius: ['55%', '70%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    InitProjectLineECharts () {
        const { projectLineList, projectLineTotal } = this.state;
        let legendData = [];
        let seriesData = [];
        projectLineList.map(item => {
            legendData.push(item.Name);
            seriesData.push({
                name: item.Name,
                no: item.No,
                value: item.Length
            });
        });
        let projectLineTotalStr = Number(projectLineTotal).toLocaleString();
        console.log('管线项目', legendData, seriesData, projectLineTotalStr);
        let myChart = echarts.init(document.getElementById('projectLineECharts'));
        let option = {
            color: EchartsColor,
            title: {
                text: '管网总长度',
                subtext: `${projectLineTotalStr} 米`,
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '190',
                top: '140'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 400,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                        },
                        unum: {
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', proportion = '';
                    seriesData.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            proportion = ((item.value / projectLineTotal) * 100).toFixed(1);
                        }
                    });
                    return `{name|${name}} ｜ {proportion|${proportion}%} ${value}`;
                },
                data: legendData
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [200, 170],
                    radius: ['55%', '70%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    InitPipeTypeECharts () {
        const { pipeTypeList } = this.state;
        console.log('渲染数据', pipeTypeList);
        let xAxisData = ['双通', '三通', '四通', '变径', '弯头', '快速取水阀', '给水栓', '水井', '喷头', '阀门井', '泄水井', '检修井', '水井表'];
        let seriesData = [];
        xAxisData.map(item => {
            let Num = 0;
            pipeTypeList.map(record => {
                let LayerName = record.PipeNodeTypeObj.LayerName;
                if (LayerName === item) {
                    Num = record.Num;
                }
            });
            let finalValue = Num.toFixed();
            seriesData.push(finalValue);
        });
        console.log('渲染数据', xAxisData, seriesData);
        let myChart = echarts.init(document.getElementById('pipeTypeECharts'));
        let option = {
            title: {
                text: '管点数量统计：(个)',
                textStyle: {
                    fontSize: 24
                },
                left: '40%'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                padding: [2, 10]
            },
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}个',
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            series: [{
                data: seriesData,
                type: 'line',
                symbol: 'circle',
                symbolSize: 10,
                areaStyle: {}
            }]
        };
        myChart.setOption(option);
    }
    InitMaterialECharts () {
        const { materialLineList } = this.state;
        console.log('最终数据', materialLineList);
        let xAxisData = ['PVC', 'PVC-U', 'PCV-U63', 'PUC-U', 'PVC-UH', 'U-PVC'];
        let seriesData = [];
        xAxisData.map(item => {
            let Length = 0;
            materialLineList.map(record => {
                let Material = record.Material.toLocaleUpperCase();
                if (Material === item) {
                    Length = Length + Number(record.Length);
                }
            });
            let finalLength = Length;
            seriesData.push(finalLength);
        });
        console.log('渲染数据', seriesData);
        let myChart = echarts.init(document.getElementById('materialLineECharts'));
        let option = {
            title: {
                text: '管线长度统计：(m)',
                textStyle: {
                    fontSize: 24
                },
                left: '40%'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: {
                    textStyle: {
                        color: '#999'
                    }
                },
                axisTick: {
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}m',
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            series: [{
                data: seriesData,
                type: 'bar'
            }]
        };
        myChart.setOption(option);
    }
    InitDiameterECharts () {
        const { diameterLineList } = this.state;
        console.log(diameterLineList);
        let xAxisData = [63, 90, 120, 160];
        let seriesData = [];
        xAxisData.map(item => {
            let Length = 0;
            diameterLineList.map(record => {
                if (record.DN === item) {
                    Length = Length + Number(record.Length);
                }
            });
            let finalLength = Length;
            seriesData.push(finalLength);
        });
        console.log('渲染数据', seriesData);
        let myChart = echarts.init(document.getElementById('diameterLineECharts'));
        let option = {
            title: {
                text: '管线长度统计：(m)',
                textStyle: {
                    fontSize: 24
                },
                left: '40%'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value}m',
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            series: [{
                data: seriesData,
                type: 'bar'
            }]
        };
        myChart.setOption(option);
    }
    InitTreeTypeECharts () {
    //     let myChart = echarts.init(document.getElementById('treeTypeECharts'));
    //     let option = {
    //         title: {
    //             text: '总栽植量',
    //             subtext: '123,324 棵',
    //             textStyle: {
    //                 fontSize: 14,
    //                 color: '#999',
    //                 lineHeight: 20
    //             },
    //             subtextStyle: {
    //                 fontSize: 26,
    //                 color: '#333'
    //             },
    //             textAlign: 'center',
    //             left: '190',
    //             top: '140'
    //         },
    //         legend: {
    //             orient: 'vertical',
    //             top: 'center',
    //             left: 400,
    //             icon: 'pin',
    //             textStyle: {
    //                 rich: {
    //                     name: {
    //                         width: 120
    //                     },
    //                     unum: {
    //                         width: 40
    //                     }
    //                 }
    //             },
    //             formatter: (name) => {
    //                 let value = '', lilv = '';
    //                 datas.map((item) => {
    //                     if (name === item.name) {
    //                         value = item.value;
    //                         lilv = item.lilv;
    //                     }
    //                 });
    //                 return `{name|${name}} {unum|${lilv}%} ${value}`;
    //             },
    //             data: ['19年春季造林', '19年秋季造林', '19年秋季雄县造林', '19年秋季安新县造林', '19年秋季市场化造林']
    //         },
    //         series: [
    //             {
    //                 name: '项目统计',
    //                 type: 'pie',
    //                 center: [200, 170],
    //                 radius: ['55%', '70%'],
    //                 label: {
    //                     normal: {
    //                         show: false
    //                     }
    //                 },
    //                 labelLine: {
    //                     normal: {
    //                         show: false
    //                     }
    //                 },
    //                 data: datas
    //             }
    //         ]
    //     };
    //     myChart.setOption(option);
    }
    InitProjectTreeECharts () {
        const { projectTreeList, projectTreeTotal } = this.state;
        let myChart = echarts.init(document.getElementById('projectTreeECharts'));
        let projectTreeTotalStr = Number(projectTreeTotal).toLocaleString();
        let legendData = [];
        let seriesData = [];
        projectTreeList.map(item => {
            legendData.push(item.Name);
            seriesData.push({
                name: item.Name,
                no: item.No,
                value: item.Num
            });
        });
        let option = {
            color: EchartsColor,
            title: {
                text: '总栽植量',
                subtext: `${projectTreeTotalStr} 棵`,
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '190',
                top: '140'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 400,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                        },
                        unum: {
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', proportion = '';
                    seriesData.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            proportion = ((item.value / projectTreeTotal) * 100).toFixed(1);
                        }
                    });
                    console.log(`{name|${name}} ｜ {proportion|${proportion}%} ${value}`);
                    return `{name|${name}} ｜ {proportion|${proportion}%} ${value}`;
                },
                data: legendData
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [200, 170],
                    radius: ['55%', '70%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    InitOverallSectionTreeECharts () {
        const { overallSectionTreeList, overallSectionTreeTotal } = this.state;
        console.log('最终数据', overallSectionTreeList, overallSectionTreeTotal);
        let legendData = [];
        let seriesData = [];
        overallSectionTreeList.map(item => {
            legendData.push(item.SectionName);
            seriesData.push({
                name: item.SectionName,
                value: item.Num
            });
        });
        let projectTreeTotalStr = Number(overallSectionTreeTotal).toLocaleString();
        let myChart = echarts.init(document.getElementById('overallSectionTreeECharts'));
        let option = {
            color: EchartsColor,
            title: {
                text: '总栽植量',
                subtext: `${projectTreeTotalStr} 棵`,
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '150',
                top: '150'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 300,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                        },
                        unum: {
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', proportion = '';
                    seriesData.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            proportion = ((item.value / overallSectionTreeTotal) * 100).toFixed(1);
                        }
                    });
                    console.log(`{name|${name}} ｜ {proportion|${proportion}%} ${value}`);
                    return `{name|${name}} ｜ {proportion|${proportion}%} ${value}`;
                },
                data: legendData
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [160, 180],
                    radius: ['45%', '60%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    InitOverallSectionPointECharts () {
        const { OverallSectionPointList, OverallSectionPointTotal } = this.state;
        console.log('最终管点数据', OverallSectionPointList, OverallSectionPointTotal);
        let legendData = [];
        let seriesData = [];
        OverallSectionPointList.map(item => {
            legendData.push(item.SectionName);
            seriesData.push({
                name: item.SectionName,
                value: item.Num
            });
        });
        let sectionPointTotalStr = Number(OverallSectionPointTotal).toLocaleString();
        let myChart = echarts.init(document.getElementById('overallSectionPointECharts'));
        let option = {
            color: EchartsColor,
            title: {
                text: '管点总数量',
                subtext: `${sectionPointTotalStr} 个`,
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '150',
                top: '150'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 300,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                        },
                        unum: {
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', proportion = '';
                    seriesData.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            proportion = ((item.value / OverallSectionPointTotal) * 100).toFixed(1);
                        }
                    });
                    console.log(`{name|${name}} ｜ {proportion|${proportion}%} ${value}`);
                    return `{name|${name}} ｜ {proportion|${proportion}%} ${value}`;
                },
                data: legendData
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [160, 180],
                    radius: ['45%', '60%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    InitOverallSectionLineECharts () {
        const { overallSectionLineList, overallSectionLineTotal } = this.state;
        let legendData = [];
        let seriesData = [];
        overallSectionLineList.map(item => {
            legendData.push(item.SectionName);
            seriesData.push({
                name: item.SectionName,
                value: item.Length
            });
        });
        let sectionLineTotalStr = Number(overallSectionLineTotal).toLocaleString();
        let myChart = echarts.init(document.getElementById('overallSectionLineECharts'));
        let option = {
            color: EchartsColor,
            title: {
                text: '管线总长度',
                subtext: `${sectionLineTotalStr} 米`,
                textStyle: {
                    fontSize: 14,
                    color: '#999',
                    lineHeight: 20
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#333'
                },
                textAlign: 'center',
                left: '150',
                top: '150'
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: 300,
                icon: 'pin',
                textStyle: {
                    rich: {
                        name: {
                        },
                        unum: {
                        }
                    }
                },
                formatter: (name) => {
                    let value = '', proportion = '';
                    seriesData.map((item) => {
                        if (name === item.name) {
                            value = item.value;
                            proportion = ((item.value / overallSectionLineTotal) * 100).toFixed(1);
                        }
                    });
                    console.log(`{name|${name}} ｜ {proportion|${proportion}%} ${value}`);
                    return `{name|${name}} ｜ {proportion|${proportion}%} ${value}`;
                },
                data: legendData
            },
            series: [
                {
                    name: '项目统计',
                    type: 'pie',
                    center: [160, 180],
                    radius: ['45%', '60%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 2
                        }
                    },
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    InitOverallTreeTypeECharts () {
        const { overallTreeTypeList } = this.state;
        overallTreeTypeList.sort((record1, record2) => {
            return record2.Num - record1.Num;
        });
        let yAxisData = [];
        let seriesData = [];
        overallTreeTypeList.map((item, index) => {
            if (index < 10) {
                yAxisData.push(item.TreeTypeName);
                seriesData.push(item.Num);
            }
        });
        let myChart = echarts.init(document.getElementById('overallTreeTypeECharts'));
        let option = {
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: yAxisData
            },
            series: [
                {
                    type: 'bar',
                    data: seriesData
                }
            ]
        };
        myChart.setOption(option);
    }
    onSelectTree (type, value) {
        const {
            treeData,
            actions: { getLocationsTatByRegion, getPipeStatByRegion, getPipenodeStatByRegion }
        } = this.props;
        console.log('标段', type, value, treeData);
        let project = value[0];
        if (!project) {
            return;
        }
        if (type === 'sectionTree') {
            getLocationsTatByRegion({}, {
                stattype: 'section',
                no: '',
                section: project,
                wkt: '',
                stime: '',
                etime: ''
            }).then(rep => {
                console.log('结果', rep);
                let overallSectionTreeList = [];
                let overallSectionTreeTotal = 0;
                rep.map(item => {
                    let SectionName = '';
                    treeData.map(record => {
                        if (project === record.No) {
                            record.children.map(row => {
                                if (row.No === item.Label) {
                                    SectionName = row.Name;
                                }
                            });
                        }
                    });
                    overallSectionTreeList.push({
                        SectionName,
                        Section: item.Label,
                        Num: item.Num
                    });
                    overallSectionTreeTotal += item.Num;
                });
                this.setState({
                    overallSectionTreeList,
                    overallSectionTreeTotal
                }, () => {
                    this.InitOverallSectionTreeECharts();
                });
            });
        } else if (type === 'sectionLine') {
            getPipeStatByRegion({}, {
                stattype: 'section',
                section: project,
                wkt: ''
            }).then(rep => {
                let overallSectionLineList = [];
                let overallSectionLineTotal = 0;
                rep.map(item => {
                    let SectionName = '';
                    treeData.map(record => {
                        record.children.map(row => {
                            if (row.No === item.Label) {
                                SectionName = row.Name;
                            }
                        });
                    });
                    overallSectionLineList.push({
                        SectionName,
                        Section: item.Label,
                        Length: item.Length.toFixed()
                    });
                    overallSectionLineTotal += item.Length;
                });
                this.setState({
                    overallSectionLineList,
                    overallSectionLineTotal: overallSectionLineTotal.toFixed()
                }, () => {
                    this.InitOverallSectionLineECharts();
                });
            });
        } else if (type === 'sectionPoint') {
            getPipenodeStatByRegion({}, {
                stattype: 'section',
                section: project,
                wkt: ''
            }).then(rep => {
                let OverallSectionPointList = [];
                let OverallSectionPointTotal = 0;
                console.log('999', project, rep, treeData);
                rep.map(item => {
                    let SectionName = '';
                    treeData.map(record => {
                        if (project === record.No) {
                            record.children.map(row => {
                                if (row.No === item.Label) {
                                    SectionName = row.Name;
                                }
                            });
                        }
                    });
                    OverallSectionPointList.push({
                        SectionName,
                        Section: item.Label,
                        Num: item.Num
                    });
                    OverallSectionPointTotal += parseInt(item.Num);
                });
                this.setState({
                    OverallSectionPointList,
                    OverallSectionPointTotal: OverallSectionPointTotal
                }, () => {
                    this.InitOverallSectionPointECharts();
                });
            });
        } else {
            let SectionList = [];
            treeData.map(item => {
                if (item.No === value[0]) {
                    SectionList = item.children;
                }
            });
            console.log('标段', SectionList);
            this.setState({
                SectionList
            });
        }
    }
    onExport (type) {
        const { coverageType, PipeType, node, selectSection, sectionTreeList, treeTypeList, sectionLineList, overallDiameterList, overallMaterialList, sectionPointList, overallPipeTypeList } = this.state;
        console.log('导出', node, sectionTreeList, treeTypeList);
        const {
            polygonEncircleWKT,
            actions: { exportPipe, exportPipenode, exportTreeLocations } 
        } = this.props;
        if (type === 'details') {
            if (coverageType === 'tree') {
                exportTreeLocations({}, {
                    sxm: '',
                    no: '',
                    section: selectSection,
                    treetype: '',
                    bigtype: '',
                    crs: '',
                    stime: '',
                    etime: '',
                    bbox: polygonEncircleWKT,
                    page: '',
                    size: ''
                }).then(rep => {
                    window.open(FOREST_API + '/' + rep, '_blank');
                });
            } else {
                if (PipeType === 'line') {
                    exportPipe({}, {
                        section: selectSection,
                        thinclass: '',
                        pipetype: '',
                        bbox: polygonEncircleWKT,
                        inputer: ''
                    }).then(rep => {
                        window.open(FOREST_API + '/' + rep, '_blank');
                    });
                } else {
                    exportPipenode({}, {
                        section: selectSection,
                        thisclass: '',
                        pipenodetype: '',
                        bbox: polygonEncircleWKT,
                        inputer: ''
                    }).then(rep => {
                        window.open(FOREST_API + '/' + rep, '_blank');
                    });
                }
            }
        }
        if (type === 'sectionTree') {
            let tblData = [];
            sectionTreeList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '项目': item.ProjectName,
                    '标段': item.SectionName,
                    '苗木数量': item.Num
                });
            });
            let _headers = ['序号', '项目', '标段', '苗木数量'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `苗木分标段统计.xlsx`);
        } else if (type === 'treetype') {
            let tblData = [];
            treeTypeList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '树种': item.TreeTypeName,
                    '苗木数量': item.Num
                });
            });
            let _headers = ['序号', '树种', '苗木数量'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `苗木分树种统计.xlsx`);
        } else if (type === 'sectionLine') {
            let tblData = [];
            sectionLineList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '项目': item.ProjectName,
                    '标段': item.SectionName,
                    '米数': item.Length
                });
            });
            let _headers = ['序号', '项目', '标段', '米数'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `管线分标段统计.xlsx`);
        } else if (type === 'diameter') {
            let tblData = [];
            overallDiameterList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '管径': item.DN,
                    '米数': item.Length
                });
            });
            let _headers = ['序号', '管径', '米数'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `管线分口径统计.xlsx`);
        } else if (type === 'material') {
            let tblData = [];
            overallMaterialList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '材料': item.Material,
                    '米数': item.Length
                });
            });
            let _headers = ['序号', '材料', '米数'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `管线分材料统计.xlsx`);
        } else if (type === 'sectionPoint') {
            let tblData = [];
            sectionPointList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '项目': item.ProjectName,
                    '标段': item.SectionName,
                    '个数': item.Num
                });
            });
            let _headers = ['序号', '项目', '标段', '个数'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `管点分标段统计.xlsx`);
        } else if (type === 'pipeType') {
            let tblData = [];
            console.log('内容', overallPipeTypeList);
            overallPipeTypeList.map(item => {
                tblData.push({
                    '序号': item.key,
                    '类型': item.PipeTypeName,
                    '个数': item.Num
                });
            });
            let _headers = ['序号', '类型', '个数'];
            let headers = _headers.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let testttt = tblData.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
                .reduce((prev, next) => prev.concat(next))
                .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
            let output = Object.assign({}, headers, testttt);
            // 获取所有单元格的位置
            let outputPos = Object.keys(output);
            // 计算出范围
            let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
            // 构建 workbook 对象
            let wb = {
                SheetNames: ['mySheet'],
                Sheets: {
                    'mySheet': Object.assign({}, output, { '!ref': ref })
                }
            };
            XLSX.writeFile(wb, `管点分类型统计.xlsx`);
        }
    }
    onSeePortion () {
        const { node } = this.state;
        this.setState({
            overallVisible: false
        }, () => {
            if (node === 'pipeType') {
                this.InitPipeTypeECharts();
            } else if (node === 'diameter') {
                this.InitDiameterECharts();
            } else if (node === 'material') {
                this.InitMaterialECharts();
            }
        });
    }
    onSeeOverall () {
        this.setState({
            overallVisible: true
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleCoverageType (e) {
        let value = e.target.value;
        if (value === 'tree') {
            this.getTree();
            this.setState({
                coverageType: value,
                node: 'projectTree'
            });
        } else {
            this.getPipeline();
            this.setState({
                coverageType: value,
                PipeType: 'line',
                node: 'projectLine'
            });
        }
    }
    onChangePipeType (e) {
        let value = e.target.value;
        if (value === 'line') {
            this.getPipeline();
            this.setState({
                node: 'projectLine',
                PipeType: value
            });
        } else {
            this.getPipePoint();
            this.setState({
                node: 'projectPoint',
                PipeType: value
            });
        }
    }
    handleNodeChange (e) {
        let node = e.target.value || '';
        this.setState({
            node
        }, () => {
            if (node === 'projectTree') {
                this.InitProjectTreeECharts();
            } else if (node === 'projectLine') {
                this.InitProjectLineECharts();
            } else if (node === 'projectPoint') {
                this.InitProjectPointECharts();
            } else if (node === 'diameter') {
                this.InitDiameterECharts();
            } else if (node === 'material') {
                this.InitMaterialECharts();
            } else if (node === 'pipeType') {
                this.InitPipeTypeECharts();
            }
        });
    }
    changeTabs (key) {
        const {
            treeData,
            polygonEncircleWKT,
            actions: { getTreeLocations }
        } = this.props;
        const { coverageType } = this.state;
        console.log(key, coverageType);
        if (key === 'detailsInfo') {
            if (coverageType === 'tree') {
                this.setState({
                    loading: true
                });
                getTreeLocations({}, {
                    sxm: '',
                    no: '',
                    section: '',
                    treetype: '',
                    bigtype: '',
                    crs: '',
                    stime: '',
                    etime: '',
                    bbox: polygonEncircleWKT,
                    page: '',
                    size: ''
                }).then(rep => {
                    if (rep && rep.code === 200) {
                        let dataListDetails = [];
                        rep.content.map((item, index) => {
                            let ProjectName = '', SectionName = '';
                            treeData.map(record => {
                                record.children.map(row => {
                                    if (row.No === item.Section) {
                                        SectionName = row.Name;
                                        ProjectName = record.Name;
                                    }
                                });
                            });
                            let NoArr = item.No.split('-');
                            let NoStr = NoArr[2] + '号小班' + NoArr[3] + '号细班';
                            let locationStr = '未定位';
                            if (item.X && item.Y) {
                                locationStr = '已定位';
                            }
                            dataListDetails.push({
                                key: index,
                                ProjectName,
                                SectionName,
                                NoStr,
                                Section: item.Section,
                                SXM: item.SXM,
                                TreeType: item.TreeType,
                                TreeTypeName: item.TreeTypeObj && item.TreeTypeObj.TreeTypeName,
                                locationStr,
                                CreateTime: item.CreateTime,
                            });
                        });
                        console.log('dataListDetails', dataListDetails);
                        this.setState({
                            dataListDetails,
                            loading: false
                        });
                    }
                    console.log(rep);
                });
            }
        }
    }
    onChangeProjectLine (value) {
        const { treeData } = this.props;
        const { sectionLineList } = this.state;
        if (!value) {
            this.setState({
                SectionList: [],
                selectProject: '',
                selectSection: '',
                filterSectionLineList: sectionLineList
            });
        } else {
            let SectionList = [];
            treeData.map(item => {
                if (item.No === value) {
                    SectionList = item.children;
                }
            });
            this.setState({
                selectProject: value,
                SectionList
            });
        }
    }
    onChangeSection (value) {
        if (!value) {
            this.setState({
                selectSection: ''
            });
        } else {
            this.setState({
                selectSection: value
            });
        }
    }
    onChangeProject (value) {
        const { treeData } = this.props;
        if (!value) {
            this.setState({
                SectionList: [],
                selectProject: '',
                selectSection: ''
            });
        } else {
            let SectionList = [];
            treeData.map(item => {
                if (item.No === value) {
                    SectionList = item.children;
                }
            });
            this.setState({
                selectProject: value,
                SectionList
            });
        }
    }
    onChangeSectionLine (value) {
        const { sectionLineList } = this.state;
        let filterSectionLineList = [];
        if (!value) {
            this.setState({
                selectSection: ''
            });
        } else {
            sectionLineList.map(item => {
                if (item.SectionNo === value) {
                    filterSectionLineList.push(item);
                }
            });
            console.log('过滤后数据', filterSectionLineList);
            this.setState({
                selectSection: value,
                filterSectionLineList: filterSectionLineList
            });
        }
    }
    onSearch (type) {
        const { selectProject, selectSection, PipeType, coverageType } = this.state;
        const {
            polygonEncircleWKT,
            treeData,
            actions: { getPipenodequery, getPipequery, getTreeLocations, getLocationsTatByRegion, getPipeStatByRegion, getPipenodeStatByRegion }
        } = this.props;
        console.log(selectProject, selectSection);
        if (type === 'details') {
            if (coverageType === 'tree') {
                this.setState({
                    loading: true
                });
                getTreeLocations({}, {
                    sxm: '',
                    no: '',
                    section: selectSection,
                    treetype: '',
                    bigtype: '',
                    crs: '',
                    stime: '',
                    etime: '',
                    bbox: polygonEncircleWKT,
                    page: '',
                    size: ''
                }).then(rep => {
                    if (rep && rep.code === 200) {
                        let dataListDetails = [];
                        rep.content.map((item, index) => {
                            let ProjectName = '', SectionName = '';
                            treeData.map(record => {
                                record.children.map(row => {
                                    if (row.No === item.Section) {
                                        SectionName = row.Name;
                                        ProjectName = record.Name;
                                    }
                                });
                            });
                            let NoArr = item.No.split('-');
                            let NoStr = NoArr[2] + '号小班' + NoArr[3] + '号细班';
                            let locationStr = '未定位';
                            if (item.X && item.Y) {
                                locationStr = '已定位';
                            }
                            dataListDetails.push({
                                key: index,
                                ProjectName,
                                SectionName,
                                NoStr,
                                Section: item.Section,
                                SXM: item.SXM,
                                TreeType: item.TreeType,
                                TreeTypeName: item.TreeTypeObj && item.TreeTypeObj.TreeTypeName,
                                locationStr,
                                CreateTime: item.CreateTime,
                            })
                        });
                        console.log('dataListDetails', dataListDetails);
                        this.setState({
                            dataListDetails,
                            loading: false
                        })
                    }
                });
            } else {
                if (PipeType === 'line') {
                    this.setState({
                        loading: true
                    });
                    getPipequery({}, {
                        Materail: '',
                        DN: '',
                        Section: selectSection,
                        Bbox: polygonEncircleWKT,
                        Inputer: '',
                        ThinClass: ''
                    }).then(rep => {
                        if (rep) {
                            let dataListDetailsLine = [];
                            rep.map((item, index) => {
                                let ProjectName = '', SectionName = '';
                                treeData.map(record => {
                                    record.children.map(row => {
                                        if (row.No === item.Section) {
                                            SectionName = row.Name;
                                            ProjectName = record.Name;
                                        }
                                    });
                                });
                                dataListDetailsLine.push({
                                    key: index,
                                    ProjectName,
                                    SectionName,
                                    Section: item.Section,
                                    DN: item.DN,
                                    Material: item.Material,
                                    Altitude: item.Altitude,
                                    Depth: item.Depth,
                                    Length: item.Length,
                                })
                            });
                            this.setState({
                                dataListDetailsLine,
                                loading: false
                            });
                        }
                    });
                } else {
                    this.setState({
                        loading: true
                    });
                    getPipenodequery({}, {
                        PipeType: '',
                        Section: selectSection,
                        ThinClass: '',
                        Bbox: polygonEncircleWKT,
                        Inputer: ''
                    }).then(rep => {
                        if (rep) {
                            let dataListDetailsPoint = [];
                            rep.map((item, index) => {
                                let ProjectName = '', SectionName = '';
                                treeData.map(record => {
                                    record.children.map(row => {
                                        if (row.No === item.Section) {
                                            SectionName = row.Name;
                                            ProjectName = record.Name;
                                        }
                                    });
                                });
                                dataListDetailsPoint.push({
                                    key: index,
                                    ProjectName,
                                    SectionName,
                                    Section: item.Section,
                                    PipeTypeID: item.PipeTypeID,
                                    PipeType: item.PipeType,
                                    Depth: item.Depth,
                                    Depth: item.Depth,
                                    Length: item.Length,
                                })
                            });
                            this.setState({
                                dataListDetailsPoint,
                                loading: false
                            });
                        }
                    })
                }
            }
        } else if (type === 'pipeType') {
            getPipenodeStatByRegion({}, {
                stattype: 'pipetype',
                section: selectSection,
                wkt: ''
            }).then(rep => {
                console.log('123', rep);
                let overallPipeTypeList = [];
                rep.map((item, index) => {
                    let ProjectName = '';
                    let SectionName = '';
                    treeData.map(record => {
                        if (selectProject === record.No) {
                            record.children.map((row, col) => {
                                if (item.Label === row.No) {
                                    SectionName = row.Name;
                                }
                            });
                            ProjectName = record.Name;
                        }
                    });
                    overallPipeTypeList.push({
                        key: index,
                        Project: selectProject,
                        Section: selectSection,
                        ProjectName,
                        SectionName,
                        Num: item.Num,
                        PipeTypeID: item.PipeTypeID,
                        PipeTypeName: item.PipeNodeTypeObj.LayerName
                    });
                });
                this.setState({
                    overallPipeTypeList
                });
            });
        } else if (type === 'diameter') {
            getPipeStatByRegion({}, {
                stattype: 'dn',
                section: selectSection,
                wkt: ''
            }).then(rep => {
                let overallDiameterList = [];
                let newOverallDiameterList = [];
                let DNArr = [];
                rep.map((item, index) => {
                    let ProjectName = '';
                    let SectionName = '';
                    treeData.map(record => {
                        if (selectProject === record.No) {
                            record.children.map((row, col) => {
                                if (item.Label === row.No) {
                                    SectionName = row.Name;
                                }
                            });
                            ProjectName = record.Name;
                        }
                    });
                    if (!DNArr.includes(item.DN)) {
                        DNArr.push(item.DN);
                    }
                    overallDiameterList.push({
                        key: index,
                        Project: selectProject,
                        Section: selectSection,
                        ProjectName,
                        SectionName,
                        Length: item.Length,
                        DN: item.DN
                    });
                });
                DNArr.map((item, index) => {
                    let ProjectName = '', SectionName = '', Length = 0;
                    overallDiameterList.map(row => {
                        if (item === row.DN) {
                            ProjectName = row.ProjectName;
                            SectionName = row.SectionName;
                            Length += row.Length;
                        }
                    });
                    newOverallDiameterList.push({
                        key: index,
                        Project: selectProject,
                        Section: selectSection,
                        ProjectName,
                        SectionName,
                        Length: Length.toFixed(),
                        DN: item
                    });
                });
                this.setState({
                    overallDiameterList: newOverallDiameterList
                });
            });
        } else if (type === 'material') {
            getPipeStatByRegion({}, {
                stattype: 'material',
                section: selectSection,
                wkt: ''
            }).then(rep => {
                let overallMaterialList = [];
                let newOverallMaterialList = [];
                let MaterialArr = [];
                rep.map((item, index) => {
                    let ProjectName = '';
                    let SectionName = '';
                    treeData.map(record => {
                        if (selectProject === record.No) {
                            record.children.map((row, col) => {
                                if (item.Label === row.No) {
                                    SectionName = row.Name;
                                }
                            });
                            ProjectName = record.Name;
                        }
                    });
                    if (!MaterialArr.includes(item.Material)) {
                        MaterialArr.push(item.Material);
                    }
                    overallMaterialList.push({
                        key: index,
                        Project: selectProject,
                        Section: selectSection,
                        ProjectName,
                        SectionName,
                        Length: item.Length,
                        Material: item.Material
                    });
                });
                console.log('555', MaterialArr);
                MaterialArr.map((item, index) => {
                    let ProjectName = '', SectionName = '', Length = 0;
                    overallMaterialList.map(row => {
                        if (item === row.Material) {
                            ProjectName = row.ProjectName;
                            SectionName = row.SectionName;
                            Length += row.Length;
                        }
                    });
                    newOverallMaterialList.push({
                        key: index,
                        Project: selectProject,
                        Section: selectSection,
                        ProjectName,
                        SectionName,
                        Length: Length.toFixed(),
                        Material: item
                    });
                });
                this.setState({
                    overallMaterialList: newOverallMaterialList
                });
            });
        } else if (type === 'treeType') {
            getLocationsTatByRegion({}, {
                stattype: 'treetype',
                no: '',
                section: selectSection,
                wkt: '',
                stime: '',
                etime: ''
            }).then(rep => {
                let overallTreeTypeList = [];
                rep.map(item => {
                    overallTreeTypeList.push({
                        Num: item.Num,
                        TreeType: item.TreeType,
                        TreeTypeName: item.TreeTypeObj.TreeTypeName || ''
                    });
                });
                this.setState({
                    overallTreeTypeList
                }, () => {
                    this.InitOverallTreeTypeECharts();
                });
            });
        }
    }
    render () {
        const {
            overallDiameterList,
            overallMaterialList,
            overallPipeTypeList,
            dataListDetailsLine,
            dataListDetailsPoint,
            dataListDetails,
            SectionList,
            selectProject,
            selectSection,
            sectionTreeList,
            coverageType,
            PipeType,
            node,
            sectionPointList,
            treeTypeList,
            filterSectionLineList,
            overallVisible,
            loading
        } = this.state;
        const { treeData } = this.props;
        console.log('树列表', treeData);
        return (
            <Modal
                visible
                width='750px'
                title='图层解析'
                footer={null}
                className='coverage_modal'
                onCancel={this.handleCancel.bind(this)}
            >
                <Tabs defaultActiveKey='statistics' onChange={this.changeTabs.bind(this)} tabBarExtraContent={
                    <Radio.Group value={coverageType} onChange={this.handleCoverageType.bind(this)}>
                        <Radio.Button value='tree'>苗木</Radio.Button>
                        <Radio.Button value='pipe'>灌溉管网</Radio.Button>
                    </Radio.Group>
                }>
                    <TabPane tab='统计数据' key='statistics'>
                        {
                            coverageType === 'pipe' && <div>
                                <Radio.Group onChange={this.onChangePipeType.bind(this)} value={PipeType} style={{marginBottom: '10px'}}>
                                    <Radio value='line'>管线统计</Radio>
                                    <Radio value='point'>管点统计</Radio>
                                </Radio.Group>
                                <div style={{width: '100%'}}>
                                    {
                                        node === 'projectPoint' && (
                                            <Spin spinning={loading}>
                                                <div
                                                    id='projectPointECharts'
                                                    style={{ width: '650px', height: '350px' }}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'sectionPoint' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className='TreeSidebar'>
                                                        <Tree
                                                            showLine
                                                            onSelect={this.onSelectTree.bind(this, 'sectionPoint')}
                                                        >
                                                            {
                                                                treeData.map(item => {
                                                                    return (
                                                                        <TreeNode
                                                                            title={item.Name}
                                                                            key={item.No}
                                                                        >
                                                                            {item.Name}
                                                                        </TreeNode>
                                                                    );
                                                                })
                                                            }
                                                        </Tree>
                                                    </div>
                                                    <div
                                                        id='overallSectionPointECharts'
                                                        style={{ float: 'left', width: '510px', height: '350px' }}
                                                    />
                                                </div>
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' style={{float: 'right'}} onClick={this.onSeeOverall.bind(this)}>项目标段查看</a>
                                                </div>
                                                <Form {...formItemLayout} layout='inline'>
                                                    <Row>
                                                        <Col span={24}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onExport.bind(this, 'sectionPoint')}>导出</Button>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Table
                                                    bordered
                                                    columns={this.columnsSectionPoint}
                                                    rowKey='key'
                                                    dataSource={sectionPointList}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'pipeType' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <Form {...formItemLayout} layout='inline'>
                                                    <Row>
                                                        <Col span={8}>
                                                            <FormItem label='项目'>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectProject}
                                                                    onChange={this.onChangeProject.bind(this)}
                                                                >
                                                                    {
                                                                        treeData.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={8}>
                                                            <FormItem label='标段'>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectSection}
                                                                    onChange={this.onChangeSection.bind(this)}
                                                                >
                                                                    {
                                                                        SectionList.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={2} />
                                                        <Col span={3}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onSearch.bind(this, 'pipeType')}>查询</Button>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={3}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onExport.bind(this, 'pipeType')}>导出</Button>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Table
                                                    bordered
                                                    columns={this.columnsPipeType}
                                                    rowKey='key'
                                                    dataSource={overallPipeTypeList}
                                                />
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' style={{float: 'right'}} onClick={this.onSeeOverall.bind(this)}>项目标段查看</a>
                                                </div>
                                                <div
                                                    id='pipeTypeECharts'
                                                    style={{ width: '650px', height: '350px' }}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'projectLine' && (
                                            <Spin spinning={loading}>
                                                <div
                                                    id='projectLineECharts'
                                                    style={{ width: '650px', height: '350px' }}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'sectionLine' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className='TreeSidebar'>
                                                        <Tree
                                                            showLine
                                                            onSelect={this.onSelectTree.bind(this, 'sectionLine')}
                                                        >
                                                            {
                                                                treeData.map(item => {
                                                                    return (
                                                                        <TreeNode
                                                                            title={item.Name}
                                                                            key={item.No}
                                                                        >
                                                                            {item.Name}
                                                                        </TreeNode>
                                                                    );
                                                                })
                                                            }
                                                        </Tree>
                                                    </div>
                                                    <div
                                                        id='overallSectionLineECharts'
                                                        style={{ float: 'left', width: '510px', height: '350px' }}
                                                    />
                                                </div>
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' style={{float: 'right'}} onClick={this.onSeeOverall.bind(this)}>项目标段查看</a>
                                                </div>
                                                <Form style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <Row>
                                                        <Col span={8}>
                                                            <FormItem {...formItemLayout} label='项目' style={{width: '300px', float: 'left'}}>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectProject}
                                                                    onChange={this.onChangeProjectLine.bind(this)}
                                                                >
                                                                    {
                                                                        treeData.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={8}>
                                                            <FormItem {...formItemLayout} label='标段' style={{width: '300px', float: 'left'}}>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    onChange={this.onChangeSectionLine.bind(this)}
                                                                >
                                                                    {
                                                                        SectionList.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={5} />
                                                        <Col span={3}>
                                                            <Button type='primary' style={{float: 'right'}} onClick={this.onExport.bind(this, 'sectionLine')}>导出</Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Table
                                                    bordered
                                                    columns={this.columnsSectionLine}
                                                    rowKey='key'
                                                    dataSource={filterSectionLineList}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'diameter' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <Form {...formItemLayout} layout='inline'>
                                                    <Row>
                                                        <Col span={8}>
                                                            <FormItem {...formItemLayout} label='项目'>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectProject}
                                                                    onChange={this.onChangeProject.bind(this)}
                                                                >
                                                                    {
                                                                        treeData.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={8}>
                                                            <FormItem {...formItemLayout} label='标段'>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectSection}
                                                                    onChange={this.onChangeSection.bind(this)}
                                                                >
                                                                    {
                                                                        SectionList.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={2} />
                                                        <Col span={3}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onSearch.bind(this, 'diameter')}>查询</Button>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={3}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onExport.bind(this, 'diameter')}>导出</Button>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Table
                                                    bordered
                                                    columns={this.columnsDiameter}
                                                    rowKey='key'
                                                    dataSource={overallDiameterList}
                                                />
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' style={{float: 'right'}} onClick={this.onSeeOverall.bind(this)}>项目标段查看</a>
                                                </div>
                                                <div
                                                    id='diameterLineECharts'
                                                    style={{ width: '650px', height: '350px' }}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'material' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <Form {...formItemLayout} layout='inline'>
                                                    <Row>
                                                        <Col span={8}>
                                                            <FormItem {...formItemLayout} label='项目'>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectProject}
                                                                    onChange={this.onChangeProject.bind(this)}
                                                                >
                                                                    {
                                                                        treeData.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={8}>
                                                            <FormItem {...formItemLayout} label='项目'>
                                                                <Select
                                                                    style={{width: '180px'}}
                                                                    allowClear
                                                                    value={selectSection}
                                                                    onChange={this.onChangeSection.bind(this)}
                                                                >
                                                                    {
                                                                        SectionList.map(item => {
                                                                            return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                        })
                                                                    }
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={2} />
                                                        <Col span={3}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onSearch.bind(this, 'material')}>查询</Button>
                                                            </FormItem>
                                                        </Col>
                                                        <Col span={3}>
                                                            <FormItem>
                                                                <Button type='primary' onClick={this.onExport.bind(this, 'material')}>导出</Button>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Table
                                                    bordered
                                                    columns={this.columnsMaterial}
                                                    rowKey='key'
                                                    dataSource={overallMaterialList}
                                                />
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' style={{float: 'right'}} onClick={this.onSeeOverall.bind(this)}>项目标段查看</a>
                                                </div>
                                                <div
                                                    id='materialLineECharts'
                                                    style={{ width: '650px', height: '350px' }}
                                                />
                                            </Spin>
                                        )
                                    }
                                </div>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                    {
                                        PipeType === 'line' && <Radio.Group value={node} onChange={this.handleNodeChange.bind(this)}>
                                            <Radio.Button value='projectLine'>项目长度统计</Radio.Button>
                                            <Radio.Button value='sectionLine'>标段长度统计</Radio.Button>
                                            <Radio.Button value='diameter'>管径长度统计</Radio.Button>
                                            <Radio.Button value='material'>材质长度统计</Radio.Button>
                                        </Radio.Group>
                                    }
                                    {
                                        PipeType === 'point' && <Radio.Group value={node} onChange={this.handleNodeChange.bind(this)}>
                                            <Radio.Button value='projectPoint'>项目管点统计</Radio.Button>
                                            <Radio.Button value='sectionPoint'>标段管点统计</Radio.Button>
                                            <Radio.Button value='pipeType'>设备类型统计</Radio.Button>
                                        </Radio.Group>
                                    }
                                </div>
                            </div>
                        }
                        {
                            coverageType === 'tree' && <div>
                                <div style={{width: '100%'}}>
                                    {
                                        node === 'projectTree' && (
                                            <Spin spinning={loading}>
                                                <div
                                                    id='projectTreeECharts'
                                                    style={{ width: '650px', height: '350px' }}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'sectionTree' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className='TreeSidebar'>
                                                        <Tree
                                                            showLine
                                                            onSelect={this.onSelectTree.bind(this, 'sectionTree')}
                                                        >
                                                            {
                                                                treeData.map(item => {
                                                                    return (
                                                                        <TreeNode
                                                                            title={item.Name}
                                                                            key={item.No}
                                                                        >
                                                                            {item.Name}
                                                                        </TreeNode>
                                                                    );
                                                                })
                                                            }
                                                        </Tree>
                                                    </div>
                                                    <div
                                                        id='overallSectionTreeECharts'
                                                        style={{ float: 'left', width: '510px', height: '350px' }}
                                                    />
                                                </div>
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeeOverall.bind(this, 'sectionTree')}>项目标段查看</a>
                                                    <Button type='primary' style={{float: 'right'}} onClick={this.onExport.bind(this, 'sectionTree')}>导出</Button>
                                                </div>
                                                <Table
                                                    bordered
                                                    columns={this.columnsSection}
                                                    rowKey='key'
                                                    dataSource={sectionTreeList}
                                                />
                                            </Spin>
                                        )
                                    }
                                    {
                                        node === 'treetype' && (
                                            overallVisible ? <Spin spinning={loading}>
                                                <div style={{marginBottom: 10}}>
                                                    <a href='#' onClick={this.onSeePortion.bind(this)}>整体情况查看</a>
                                                </div>
                                                <div style={{overflow: 'hidden'}}>
                                                    <div className='TreeSidebar'>
                                                        <Tree
                                                            showLine
                                                            onSelect={this.onSelectTree.bind(this, 'treetype')}
                                                        >
                                                            {
                                                                treeData.map(item => {
                                                                    return (
                                                                        <TreeNode
                                                                            title={item.Name}
                                                                            key={item.No}
                                                                        >
                                                                            {item.Name}
                                                                        </TreeNode>
                                                                    );
                                                                })
                                                            }
                                                        </Tree>
                                                    </div>
                                                    <div style={{float: 'left'}}>
                                                        <Form {...formItemLayout} layout='inline'>
                                                            <Row>
                                                                <Col span={16}>
                                                                    <FormItem {...formItemLayout} label='标段'>
                                                                        <Select
                                                                            style={{width: '180px'}}
                                                                            allowClear
                                                                            value={selectSection}
                                                                            onChange={this.onChangeSection.bind(this)}
                                                                        >
                                                                            {
                                                                                SectionList.map(item => {
                                                                                    return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </FormItem>
                                                                </Col>
                                                                <Col span={5} />
                                                                <Col span={3}>
                                                                    <FormItem>
                                                                        <Button type='primary' onClick={this.onSearch.bind(this, 'treetype')}>查询</Button>
                                                                    </FormItem>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                        <div
                                                            id='overallTreeTypeECharts'
                                                            style={{ width: '510px', height: '350px' }}
                                                        />
                                                    </div>
                                                </div>
                                            </Spin> : <Spin spinning={loading}>
                                                <div style={{marginBottom: 10, overflow: 'hidden'}}>
                                                    <a href='#' onClick={this.onSeeOverall.bind(this, 'treeTypeTree')}>项目标段查看</a>
                                                    <Button type='primary' style={{float: 'right'}} onClick={this.onExport.bind(this, 'treetype')}>导出</Button>
                                                </div>
                                                <Table
                                                    bordered
                                                    columns={this.columnsTreeType}
                                                    rowKey='order'
                                                    dataSource={treeTypeList}
                                                />
                                            </Spin>
                                        )
                                    }
                                </div>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                    <Radio.Group value={node} onChange={this.handleNodeChange.bind(this)}>
                                        <Radio.Button value='projectTree'>涉及项目</Radio.Button>
                                        <Radio.Button value='sectionTree'>涉及标段</Radio.Button>
                                        <Radio.Button value='treetype'>涉及树种</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </div>
                        }
                    </TabPane>
                    <TabPane tab='详细信息' key='detailsInfo'>
                        {
                            coverageType !== 'tree' ? <div>
                                <Radio.Group onChange={this.onChangePipeType.bind(this)} value={PipeType} style={{marginBottom: '10px'}}>
                                    <Radio value='line'>管线统计</Radio>
                                    <Radio value='point'>管点统计</Radio>
                                </Radio.Group>
                            </div> : ''
                        }
                        <Form {...formItemLayout} layout='inline'>
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        label='项目'
                                    >
                                        <Select
                                            style={{width: 180}}
                                            value={selectProject}
                                            onChange={this.onChangeProject.bind(this)}
                                        >
                                            {
                                                treeData.map(item => {
                                                    return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label='标段'
                                    >
                                        <Select
                                            style={{width: 180}}
                                            value={selectSection}
                                            onChange={this.onChangeSection.bind(this)}
                                        >
                                            {
                                                SectionList.map(item => {
                                                    return <Option vlaue={item.No} key={item.No}>{item.Name}</Option>;
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={2} />
                                <Col span={3}>
                                    <Form.Item
                                    >
                                        <Button onClick={this.onSearch.bind(this, 'details')}>查询</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item
                                    >
                                        <Button onClick={this.onExport.bind(this, 'details')}>导出</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Spin spinning={loading}>
                            {
                                coverageType === 'tree' ? <Table
                                    bordered
                                    columns={this.columnsDetails}
                                    rowKey='key'
                                    dataSource={dataListDetails}
                                /> : ''
                            }
                            {
                                coverageType !== 'tree' && PipeType === 'line' ? <Table
                                    bordered
                                    columns={this.columnsDetailsLine}
                                    rowKey='key'
                                    dataSource={dataListDetailsLine}
                                /> : <Table
                                    bordered
                                    columns={this.columnsDetailsPoint}
                                    rowKey='key'
                                    dataSource={dataListDetailsPoint}
                                />
                            }
                        </Spin>
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
    columnsSectionPoint = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '管点个数统计（米）',
            dataIndex: 'Num'
        }
    ]
    columnsSectionLine = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '管线长度统计（米）',
            dataIndex: 'Length'
        }
    ]
    columnsSection = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '苗木数量',
            dataIndex: 'Num'
        }
    ]
    columnsDetailsPoint = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '类型',
            dataIndex: 'PipeType'
        },
        {
            title: '埋深',
            dataIndex: 'Depth'
        },
    ]
    columnsDetails = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '顺序码',
            dataIndex: 'SXM'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '位置',
            dataIndex: 'NoStr'
        },
        {
            title: '树种',
            dataIndex: 'TreeTypeName'
        },
        {
            title: '定位',
            dataIndex: 'locationStr'
        },
        {
            title: '定位时间',
            dataIndex: 'CreateTime'
        }
    ]
    columnsDetailsLine = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '管径',
            dataIndex: 'DN'
        },
        {
            title: '材质',
            dataIndex: 'Material'
        },
        {
            title: '埋深',
            dataIndex: 'Depth'
        },
        {
            title: '高程',
            dataIndex: 'Altitude'
        },
        {
            title: '长度',
            dataIndex: 'Length'
        },
    ]
    columnsTreeType = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '树种',
            dataIndex: 'TreeTypeName'
        },
        {
            title: '苗木数量',
            dataIndex: 'Num'
        }
    ]
    columnsPipeType = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '类型',
            dataIndex: 'PipeTypeName'
        },
        {
            title: '数量',
            dataIndex: 'Num'
        }
    ]
    columnsDiameter = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '管径',
            dataIndex: 'DN'
        },
        {
            title: '管线长度统计（米）',
            dataIndex: 'Length'
        }
    ]
    columnsMaterial = [
        {
            title: '序号',
            dataIndex: 'key'
        },
        {
            title: '项目',
            dataIndex: 'ProjectName'
        },
        {
            title: '标段',
            dataIndex: 'SectionName'
        },
        {
            title: '材料',
            dataIndex: 'Material'
        },
        {
            title: '管线长度统计（米）',
            dataIndex: 'Length'
        }
    ]
};
