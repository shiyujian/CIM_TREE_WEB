/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-04-26 10:45:34
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-08-31 16:18:42
 */
import React, { Component } from 'react';
import {
    Button,
    Modal,
    Form,
    Row,
    // DatePicker,
    Radio,
    Spin
} from 'antd';
import './OnSite.less';
import RiskTree from './RiskTree';
import TrackTree from './TrackTree';
import TreeTypeTree from './TreeTypeTree';
import RiskDetail from './RiskDetail';
import PkCodeTree from './PkCodeTree';
import TreeMessModal from './TreeMessModal';
import CuringTaskTree from './CuringTaskTree';
import SurvivalRateTree from './SurvivalRateTree';
import {
    genPopUpContent,
    computeSignedArea,
    getIconType,
    fillAreaColor,
    getTaskThinClassName,
    getThinClassName,
    getSectionName,
    getAreaData
} from '../auth';
import {
    getSeedlingMess,
    getTreeMessFun
} from './TreeInfo';
import MenuSwitch from '../MenuSwitch';
import {TREETYPENO} from '_platform/api';
import hundredImg from '../SurvivalRateImg/90~100.png';
import ninetyImg from '../SurvivalRateImg/80~90.png';
import eightyImg from '../SurvivalRateImg/70~80.png';
import seventyImg from '../SurvivalRateImg/60~70.png';
import sixtyImg from '../SurvivalRateImg/50~60.png';
import fiftyImg from '../SurvivalRateImg/40~50.png';
import foutyImg from '../SurvivalRateImg/0~40.png';
const RadioGroup = Radio.Group;
// const { RangePicker } = DatePicker;

window.config = window.config || {};
class OnSite extends Component {
    // export default class OnSite extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mapLayerBtnType: true, // 切换卫星图和地图
            leafletCenter: [38.92, 115.98], // 雄安
            // 树木详情弹窗数据
            seeVisible: false,
            seedlingMess: '', // 树木信息
            treeMess: '', // 苗木信息
            flowMess: '', // 流程信息
            markers: null, // 点击节点图标
            // 区域地块
            areaEventKey: '', // 区域地块选中节点的key
            areaEventTitle: '', // 区域地块选中节点的name
            // 地图圈选
            areaRadioValue: '全部细班',
            coordinates: [],
            // createBtnVisible: false,
            polygonData: '', // 圈选地图图层
            areaMeasure: 0, // 圈选区域面积
            areaMeasureVisible: false,
            // 安全隐患
            riskMess: {}, // 隐患详情
            isShowRisk: false, // 是否显示隐患详情弹窗
            // 图层数据List
            treeMarkerLayer: '',
            areaLayerList: {}, // 区域地块图层list
            realThinClassLayerList: {}, // 实际细班种植图层

            trackLayerList: {}, // 轨迹图层List
            trackMarkerLayerList: {}, // 轨迹图标图层List

            riskMarkerLayerList: {}, // // 安全隐患图标图层List

            curingTaskPlanLayerList: {},
            curingTaskRealLayerList: {},
            curingTaskMarkerLayerList: {},
            curingTaskMessList: {}, // 养护任务信息List

            survivalRateMarkerLayerList: {},
            // 成活率选项
            survivalRateRateData: '',
            survivalRateSectionData: '',
            // 成活率范围的点击状态，展示是否选中的图片
            survivalRateHundred: false,
            survivalRateNinety: false,
            survivalRateEighty: false,
            survivalRateSeventy: false,
            survivalRateSixty: false,
            survivalRateFifty: false,
            survivalRateFourty: false,
            // 树加载loading
            areaTreeLoading: true,
            trackTreeLoading: true,
            riskTreeLoading: true,
            treetypeTreeLoading: true,
            curingTaskTreeLoading: true,
            survivalRateTreeLoading: true
        };
        this.tileLayer = null; // 最底部基础图层
        this.tileTreeLayerBasic = null; // 树木区域图层
        this.tileTreeTypeLayerFilter = null; // 树种筛选图层
        this.tileTreeSurvivalRateLayerBasic = null; // 成活率全部图层
        this.tileSurvivalRateLayerFilter = null; // 成活率范围和标段筛选图层
        this.map = null;
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 260,
            maxWidth: 500
        };
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    // 左侧菜单栏
    options = [
        {
            label: '区域地块',
            value: 'geojsonFeature_area',
            IconName: 'square'
        },
        {
            label: '巡检路线',
            value: 'geojsonFeature_track',
            IconName: 'universal-access'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_risk',
            IconName: 'warning'
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype',
            IconName: 'square'
        },
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask',
            IconName: 'curingTask'
        },
        {
            label: '成活率',
            value: 'geojsonFeature_survivalRate'
        },
        {
            label: '工程影像',
            value: 'geojsonFeature_projectPic'
        }
    ];
    // 右侧成活率范围
    survivalRateOptions = [
        {
            id: 'survivalRateHundred',
            label: '90~100',
            img: hundredImg
        },
        {
            id: 'survivalRateNinety',
            label: '80~90',
            img: ninetyImg
        },
        {
            id: 'survivalRateEighty',
            label: '70~80',
            img: eightyImg
        },
        {
            id: 'survivalRateSeventy',
            label: '60~70',
            img: seventyImg
        },
        {
            id: 'survivalRateSixty',
            label: '50~60',
            img: sixtyImg
        },
        {
            id: 'survivalRateFifty',
            label: '40~50',
            img: fiftyImg
        },
        {
            id: 'survivalRateFourty',
            label: '0~40',
            img: foutyImg
        }
    ]
    // 初始化地图，获取目录树数据
    async componentDidMount () {
        const {
            trackTree,
            riskTree,
            treetypesTree,
            curingTaskTree,
            survivalRateTree,
            platform: {
                tree = {}
            }
        } = this.props;
        await this.initMap();
        if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0) {
            this.setState({
                areaTreeLoading: false
            });
        } else {
            await this.loadAreaData();
        }
        if (trackTree && trackTree instanceof Array && trackTree.length > 0) {
            this.setState({
                trackTreeLoading: false
            });
        } else {
            await this.getTrackData();
        }
        if (riskTree && riskTree instanceof Array && riskTree.length > 0) {
            this.setState({
                riskTreeLoading: false
            });
        } else {
            await this.getRisk();
        }
        if (treetypesTree && treetypesTree instanceof Array && treetypesTree.length > 0) {
            this.setState({
                treetypeTreeLoading: false
            });
        } else {
            await this.getTreeType();
        }
        if (curingTaskTree && curingTaskTree instanceof Array && curingTaskTree.length > 0) {
            this.setState({
                curingTaskTreeLoading: false
            });
        } else {
            await this.getCuringTasks();
        }
        if (survivalRateTree && survivalRateTree instanceof Array && survivalRateTree.length > 0) {
            this.setState({
                survivalRateTreeLoading: false
            });
        } else {
            await this.loadAreaData();
        }
    }
    // 切换全部细班时，将其余图层去除，加载最初始图层
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            areaRadioValue = '全部细班'
        } = this.state;
        const {
            dashboardCompomentMenu,
            dashboardAreaTreeLayer,
            dashboardFocus,
            platform: {
                tabs = {}
            },
            actions: {
                switchDashboardFocus
            }
        } = this.props;
        // 返回初始位置和放大级数
        if (dashboardFocus && dashboardFocus === 'mapFoucs' && dashboardFocus !== prevProps.dashboardFocus) {
            await this.map.panTo(window.config.initLeaflet.center);
            await this.map.setZoom(window.config.initLeaflet.zoom);
            await switchDashboardFocus('');
        }
        if (dashboardCompomentMenu && dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            await this.removeAllLayer();
            if (dashboardCompomentMenu !== 'geojsonFeature_survivalRate') {
                await this.getTileLayerTreeBasic();
            } else {
                // 选择成活率菜单
                await this.removeTileTreeLayerBasic();
                await this.getTileTreeSurvivalRateBasic();
            }
        }
        // 去除树图层
        if (dashboardAreaTreeLayer && dashboardAreaTreeLayer === 'removeTileTreeLayerBasic' && prevProps.dashboardAreaTreeLayer !== dashboardAreaTreeLayer) {
            this.removeTileTreeLayerBasic();
        }
        if (areaRadioValue === '全部细班' && areaRadioValue !== prevState.areaRadioValue && dashboardCompomentMenu === 'geojsonFeature_area') {
            this.getTileLayerTreeBasic();
        }
        // 加载树图层
        // 需要考虑选择实际定位时，需要获取筛选图层
        // 需要考虑选择成活率时，需要获取成活率图层
        // 需要考虑取消选择某个菜单时，不能回复原状，完成展示效果
        if (
            dashboardAreaTreeLayer && dashboardAreaTreeLayer === 'tileTreeLayerBasic' &&
            prevProps.dashboardAreaTreeLayer !== dashboardAreaTreeLayer &&
            !(areaRadioValue === '实际定位' && dashboardCompomentMenu === 'geojsonFeature_area') &&
            dashboardCompomentMenu !== 'geojsonFeature_survivalRate' &&
            dashboardCompomentMenu !== 'geojsonFeature_treetype' &&
            dashboardCompomentMenu !== ''
        ) {
            this.getTileLayerTreeBasic();
        }
        // 切换全屏
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        // 进入全屏
        if (fullScreenState && fullScreenState === 'fullScreen' && fullScreenState !== prevProps.fullScreenState) {
            this.startFullScreen();
        }
        // 退出全屏
        if (fullScreenState && fullScreenState === 'unFullScreen' && fullScreenState !== prevProps.fullScreenState) {
            this.exitFullScreen();
        }
    }
    // 进入全屏
    startFullScreen () {
        let docElm = document.documentElement;
        // W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        // FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        // Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        // IE11
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    }
    // 退出全屏
    exitFullScreen () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    /* 初始化地图 */
    initMap () {
        let me = this;
        this.map = L.map('mapid', window.config.initLeaflet);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 巡检路线的代码   地图上边的地点的名称
        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);

        this.getTileLayerTreeBasic();
        // 隐患详情点击事件
        document
            .querySelector('.leaflet-popup-pane')
            .addEventListener('click', async function (e) {
                let target = e.target;
                // 绑定隐患详情点击事件
                if (target.getAttribute('class') === 'btnViewRisk') {
                    let idRisk = target.getAttribute('data-id');
                    let risk = null;
                    me.props.riskTree.forEach(v => {
                        if (!risk) {
                            risk = v.children.find(v1 => v1.key === idRisk);
                        }
                    });
                    if (risk) {
                        // 获取隐患处理措施
                        const { getRiskContactSheet } = me.props.actions;
                        let contact = await getRiskContactSheet({ ID: idRisk });
                        if (contact && contact.ID) {
                            me.setState({
                                riskMess: contact,
                                isShowRisk: true
                            });
                        }
                    }
                }
            });

        this.map.on('click', function (e) {
            const {
                areaRadioValue,
                coordinates
                // createBtnVisible
            } = me.state;
            const {
                dashboardCompomentMenu,
                dashboardAreaMeasure
            } = me.props;
            // if (areaRadioValue === '实际定位') {
            if (dashboardAreaMeasure === 'areaMeasure') {
                coordinates.push([e.latlng.lat, e.latlng.lng]);
                // if (coordinates.length > 0 && !createBtnVisible) {
                //     me.setState({
                //         createBtnVisible: true
                //     });
                // }
                if (me.state.polygonData) {
                    me.map.removeLayer(me.state.polygonData);
                }
                let polygonData = L.polygon(coordinates, {
                    color: 'white',
                    fillColor: '#93B9F2',
                    fillOpacity: 0.2
                }).addTo(me.map);
                me.setState({
                    coordinates,
                    polygonData: polygonData
                });
            } else if (dashboardCompomentMenu === 'geojsonFeature_area') {
                // getThinClass(e.latlng.lng,e.latlng.lat);
                me.getTreeInfo(e.latlng.lng, e.latlng.lat, me);
            } else if (dashboardCompomentMenu === 'geojsonFeature_survivalRate') {
                me.getSurvivalRateInfo(e.latlng.lng, e.latlng.lat, me);
            }
        });
    }
    // 获取地块树数据
    loadAreaData = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getThinClassTree,
                getSurvivalRateTree,
                getTotalThinClass
            }
        } = this.props;
        try {
            let data = await getAreaData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let survivalRateTree = data.survivalRateTree || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 标段树
            await getSurvivalRateTree(survivalRateTree);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                areaTreeLoading: false
            });
        } catch (e) {
            console.log('获取地块树数据', e);
        }
    }
    /* 查询巡检路线 */
    getTrackData = async () => {
        const {
            actions: {
                getInspectRouter,
                getTrackTree
            }
        } = this.props;
        try {
            let routes = await getInspectRouter({}, {status: 2});
            let trackTree = [];
            let personNoList = [];
            if (routes && routes instanceof Array && routes.length > 0) {
                routes.forEach(route => {
                    if (route && route.ID && route.PatrolerUser !== undefined && route.PatrolerUser !== null) {
                        let PatrolerUser = route.PatrolerUser;
                        let getDataStatus = true;
                        let dataIndex = 0;
                        personNoList.forEach((person, index) => {
                            if (person === PatrolerUser.ID) {
                                getDataStatus = false;
                                dataIndex = index;
                            }
                        });
                        if (getDataStatus) {
                            let children = [];
                            children.push({
                                ID: route.ID,
                                CreateTime: route.CreateTime,
                                EndTime: route.EndTime,
                                Patroler: route.Patroler,
                                Status: route.Status,
                                PatrolerUser: route.PatrolerUser
                            });
                            trackTree.push({
                                ID: PatrolerUser.ID,
                                Full_Name: PatrolerUser.Full_Name,
                                PK: PatrolerUser.PK,
                                Phone: PatrolerUser.Phone,
                                User_Name: PatrolerUser.User_Name,
                                children: children
                            });
                            personNoList.push(PatrolerUser.ID);
                        } else {
                            trackTree[dataIndex].children.push({
                                ID: route.ID,
                                CreateTime: route.CreateTime,
                                EndTime: route.EndTime,
                                Patroler: route.Patroler,
                                Status: route.Status,
                                PatrolerUser: route.PatrolerUser
                            });
                        }
                    }
                });
            }
            await getTrackTree(trackTree);
            this.setState({
                trackTreeLoading: false
            });
        } catch (e) {
            console.log('获取巡检路线', e);
        }
    }
    /* 获取安全隐患点 */
    getRisk = async () => {
        const { getRisk, getRiskTree } = this.props.actions;
        try {
            let data = await getRisk();
            let riskObj = {};
            let risks = [];
            // 安全隐患数据处理
            if (data && data.content) {
                let datas = data.content;
                datas.forEach((v, index) => {
                    // 去除坐标为0的点  和  名称为空的点（名称为空的点   type类型也不一样）
                    if (v['X'] === 0 || v['Y'] === 0 || v['ProblemType'] === '') {
                        return;
                    }
                    let level = v['EventType'];
                    let name = v['ProblemType'];
                    let ResponseOrg = v['ReorganizerObj'];
                    // 位置
                    let locationX = v['X'];
                    let locationY = v['Y'];
                    let coordinates = [locationY, locationX];
                    // 隐患类型
                    let riskType = '';
                    if (v.EventType === 0) {
                        riskType = '质量缺陷';
                    } else if (v.EventType === 1) {
                        riskType = '安全隐患';
                    } else if (v.EventType === 2) {
                        riskType = '其他';
                    }
                    riskObj[level] = riskObj[level] || {
                        key: riskType,
                        properties: {
                            name: riskType
                        },
                        children: []
                    };
                    let status = '';
                    if (v.Status === -1) {
                        status = '已提交';
                    } else if (v.Status === 0) {
                        status = '未审核通过';
                    } else if (v.Status === 1) {
                        status = '（审核通过）整改中';
                    } else if (v.Status === 2) {
                        status = '整改完成';
                    } else if (v.Status === 3) {
                        status = '确认完成';
                    }
                    riskObj[level].children.push({
                        type: 'risk',
                        key: v.ID,
                        properties: {
                            riskType: riskType,
                            measure: '',
                            name: name,
                            Problem: v.Problem,
                            response_org: ResponseOrg ? ResponseOrg.Full_Name : '',
                            status: status,
                            RouteID: v.RouteID,
                            CreateTime: v.CreateTime,
                            ID: v.ID,
                            InputerObj: v.InputerObj,
                            Supervisor: v.Supervisor,
                            type: 'risk'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: coordinates
                        }
                    });
                });
            }
            for (let i in riskObj) {
                risks.push(riskObj[i]);
            }
            await getRiskTree(risks);
            this.setState({
                riskTreeLoading: false
            });
        } catch (e) {

        }
    }
    // 获取树种数据
    getTreeType = async () => {
        const { getTreeTypeAction, getTreetypesTree } = this.props.actions;
        try {
            let treeTypesTreeData = [];
            TREETYPENO.map((tree) => {
                treeTypesTreeData.push({
                    key: tree.id,
                    properties: {
                        name: tree.name
                    },
                    children: []
                });
            });
            let treeData = await getTreeTypeAction();
            if (!(treeData && treeData instanceof Array && treeData.length > 0)) {
                this.setState({
                    treetypeTreeLoading: false
                });
                return;
            }
            treeData.map(tree => {
                if (tree && tree.ID) {
                    for (let i = 0; i < treeTypesTreeData.length; i++) {
                        let code = tree.TreeTypeNo.substr(0, 1);
                        if (Number(code) === Number(treeTypesTreeData[i].key)) {
                            treeTypesTreeData[i].children.push({
                                key: tree.ID,
                                properties: {
                                    name: tree.TreeTypeName,
                                    TreeTypeNo: tree.PTreeTypeNo,
                                    TreeTypeGenera: tree.TreeTypeGenera,
                                    TreeParam: tree.TreeParam,
                                    SamplingParam: tree.SamplingParam,
                                    Pics: tree.Pics,
                                    NurseryParam: tree.NurseryParam,
                                    MorphologicalCharacter: tree.MorphologicalCharacter,
                                    IsLocation: tree.IsLocation,
                                    HaveQRCode: tree.HaveQRCode,
                                    GrowthHabit: tree.GrowthHabit
                                }
                            });
                        }
                    }
                }
            });
            await getTreetypesTree(treeTypesTreeData);
            this.setState({
                treetypeTreeLoading: false
            });
        } catch (e) {
            console.log('树种', e);
        }
    }
    // 获取养护任务
    getCuringTasks = async () => {
        const {
            actions: {
                getCuring,
                getcCuringTypes,
                getCuringTaskTree,
                getCuringTypes
            }
        } = this.props;
        let curingTypesData = await getcCuringTypes();
        let curingTypes = curingTypesData && curingTypesData.content;
        let curingTaskTreeData = [];
        if (curingTypes && curingTypes.length > 0) {
            let curingTaskData = await getCuring();
            let curingTasks = curingTaskData.content;
            if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                for (let i = 0; i < curingTasks.length; i++) {
                    let task = curingTasks[i];
                    if (task && task.ID) {
                        curingTypes.map((type) => {
                            if (type.ID === task.CuringType) {
                                let exist = false;
                                let childData = [];
                                // 查看TreeData里有无这个类型的数据，有的话，push
                                curingTaskTreeData.map((treeNode) => {
                                    if (treeNode.ID === type.ID) {
                                        exist = true;
                                        childData = treeNode.children;
                                        childData.push((task));
                                    }
                                });
                                // 没有的话，创建
                                if (!exist) {
                                    childData.push(task);
                                    curingTaskTreeData.push({
                                        ID: type.ID,
                                        Name: type.Base_Name,
                                        children: childData
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
        await getCuringTaskTree(curingTaskTreeData);
        await getCuringTypes(curingTypes);
        this.setState({
            curingTaskTreeLoading: false
        });
    }
    // 获取初始化数据的树木瓦片图层
    getTileLayerTreeBasic = () => {
        if (this.tileTreeLayerBasic) {
            this.tileTreeLayerBasic.addTo(this.map);
        } else {
            this.tileTreeLayerBasic = L.tileLayer(
                window.config.DASHBOARD_ONSITE +
                        '/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 11,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(this.map);
        }
    }
    // 去除初始化数据的树木瓦片图层
    removeTileTreeLayerBasic () {
        if (this.tileTreeLayerBasic) {
            this.map.removeLayer(this.tileTreeLayerBasic);
        }
    }
    // 加载成活率全部瓦片图层
    getTileTreeSurvivalRateBasic = () => {
        if (this.tileTreeSurvivalRateLayerBasic) {
            this.tileTreeSurvivalRateLayerBasic.addTo(this.map);
        } else {
            this.tileTreeSurvivalRateLayerBasic = L.tileLayer(
                window.config.DASHBOARD_ONSITE +
                '/geoserver/gwc/service/wmts?layer=xatree%3Athinclass&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 11,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(this.map);
        }
    }
    // 去除成活率全部瓦片图层和成活率筛选图层
    removeTileTreeSurvivalRateLayer = () => {
        if (this.tileSurvivalRateLayerFilter) {
            this.map.removeLayer(this.tileSurvivalRateLayerFilter);
        }
        if (this.tileTreeSurvivalRateLayerBasic) {
            this.map.removeLayer(this.tileTreeSurvivalRateLayerBasic);
        }
    }
    // 如初树种筛选瓦片图层
    removeTileTreeTypeLayerFilter = () => {
        if (this.tileTreeTypeLayerFilter) {
            this.map.removeLayer(this.tileTreeTypeLayerFilter);
            this.tileTreeTypeLayerFilter = null;
        }
    }
    // 去除所有后来添加的图层
    removeAllLayer = () => {
        const {
            areaLayerList, // 区域地块图层list
            trackLayerList, // 轨迹图层List
            trackMarkerLayerList, // 轨迹图标图层List
            riskMarkerLayerList, // 安全隐患图标图层List
            curingTaskPlanLayerList, // 养护任务计划养护区域图层List
            curingTaskRealLayerList, // 养护任务实际养护区域图层List
            curingTaskMarkerLayerList, // 养护任务图标图层List
            survivalRateMarkerLayerList, // 成活率图标图层List
            treeMarkerLayer,
            realThinClassLayerList
        } = this.state;
        const {
            dashboardCompomentMenu
        } = this.props;
        try {
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_area') {
                for (let v in areaLayerList) {
                    this.map.removeLayer(areaLayerList[v]);
                }
                if (treeMarkerLayer) {
                    this.map.removeLayer(treeMarkerLayer);
                }
                for (let i in realThinClassLayerList) {
                    this.map.removeLayer(realThinClassLayerList[i]);
                }
                this.setState({
                    areaRadioValue: '全部细班'
                });
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_track') {
                for (let v in trackLayerList) {
                    this.map.removeLayer(trackLayerList[v]);
                }
                for (let v in trackMarkerLayerList) {
                    this.map.removeLayer(trackMarkerLayerList[v]);
                }
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_risk') {
                for (let v in riskMarkerLayerList) {
                    this.map.removeLayer(riskMarkerLayerList[v]);
                }
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_treetype') {
                this.removeTileTreeTypeLayerFilter();
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_curingTask') {
                for (let v in curingTaskPlanLayerList) {
                    curingTaskPlanLayerList[v].map((layer) => {
                        this.map.removeLayer(layer);
                    });
                }
                for (let v in curingTaskRealLayerList) {
                    curingTaskRealLayerList[v].map((layer) => {
                        this.map.removeLayer(layer);
                    });
                }
                for (let v in curingTaskMarkerLayerList) {
                    this.map.removeLayer(curingTaskMarkerLayerList[v]);
                }
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_survivalRate') {
                for (let v in survivalRateMarkerLayerList) {
                    this.map.removeLayer(survivalRateMarkerLayerList[v]);
                }
                this.removeTileTreeSurvivalRateLayer();
                this.survivalRateOptions.map((option) => {
                    this.setState({
                        [option.id]: false
                    });
                });
                this.setState({
                    survivalRateSectionData: '',
                    survivalRateRateData: ''
                });
            }
        } catch (e) {
            console.log('去除所有图层', e);
        }
    }
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            areaTreeLoading,
            trackTreeLoading,
            riskTreeLoading,
            treetypeTreeLoading,
            curingTaskTreeLoading
        } = this.state;
        const {
            platform: {
                tree = {}
            },
            trackTree,
            riskTree,
            treetypesTree,
            curingTaskTree,
            survivalRateTree
        } = this.props;
        let treetypes = [];
        try {
            if (treetypesTree && treetypesTree instanceof Array) {
                for (let i = 0; i < treetypesTree.length; i++) {
                    let children = treetypesTree[i].children;
                    children.map((child) => {
                        treetypes.push(child);
                    });
                }
            }
        } catch (e) {
            console.log('获取不分类树种', e);
        }
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <RadioGroup onChange={this.handleAreaRadioChange.bind(this)} value={this.state.areaRadioValue} style={{marginBottom: 10}}>
                                <Radio value={'全部细班'}>全部细班</Radio>
                                <Radio value={'实际定位'}>实际定位</Radio>
                            </RadioGroup>
                            <PkCodeTree
                                treeData={tree.thinClassTree || []}
                                // selectedKeys={this.state.areaEventKey}
                                onSelect={this._handleAreaSelect.bind(this)}
                            />
                        </Spin>
                    );
                // 巡检路线
                case 'geojsonFeature_track':
                    return (
                        <Spin spinning={trackTreeLoading}>
                            <TrackTree
                                onCheck={this.handleTrackCheck.bind(this)}
                                content={trackTree}
                                featureName={option.value}
                            />
                            {/* <RangePicker
                                style={{
                                    verticalAlign: 'middle',
                                    width: '100%'
                                }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format={'YYYY/MM/DD HH:mm:ss'}
                            /> */}
                        </Spin>
                    );
                // 安全隐患
                case 'geojsonFeature_risk':
                    return (
                        <Spin spinning={riskTreeLoading}>
                            <RiskTree
                                onCheck={this.handleRiskCheck.bind(this)}
                                content={riskTree}
                                featureName={option.value}
                            />
                        </Spin>
                    );
                // 树种筛选
                case 'geojsonFeature_treetype':
                    return (
                        <Spin spinning={treetypeTreeLoading}>
                            <TreeTypeTree
                                onCheck={this.handleTreeTypeCheck.bind(this)}
                                content={treetypesTree}
                                featureName={option.value}
                                treetypes={treetypes}
                            />
                        </Spin>
                    );
                // 养护任务
                case 'geojsonFeature_curingTask':
                    return (
                        <Spin spinning={curingTaskTreeLoading}>
                            <CuringTaskTree
                                onCheck={this.handleCuringTaskCheck.bind(this)}
                                content={curingTaskTree}
                            />
                        </Spin>
                    );
                // 成活率
                case 'geojsonFeature_survivalRate':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <SurvivalRateTree
                                treeData={survivalRateTree}
                                onCheck={this._handleSurvivalRateCheck.bind(this)}
                            />
                        </Spin>
                    );
            }
        }
    }
    render () {
        const {
            seeVisible,
            // createBtnVisible,
            coordinates,
            areaMeasure,
            areaMeasureVisible
        } = this.state;
        const {
            dashboardCompomentMenu,
            menuTreeVisible,
            dashboardAreaMeasure,
            platform: {
                tabs = {}
            }
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        // 计算面积的确定按钮是否可以点击，如果不形成封闭区域，不能点击
        let createMeasureOkDisplay = false;
        if (coordinates.length <= 2) {
            createMeasureOkDisplay = true;
        }
        // 计算面积的上一步按钮是否可以点击，如果没有点，不能点击
        let createMeasureBackDisplay = false;
        if (coordinates.length <= 0) {
            createMeasureBackDisplay = true;
        }
        return (
            <div className={fullScreenState === 'fullScreen' ? 'map-containerFullScreen' : 'map-container'}>
                <div
                    ref='appendBody'
                    className='dashboard-map r-main'
                >
                    <MenuSwitch {...this.props} {...this.state} />
                    { // 左侧第二级菜单的树形结构
                        menuTreeVisible
                            ? (
                                this.options.map(option => {
                                    if (dashboardCompomentMenu === option.value) {
                                        return (
                                            <div className='dashboard-menuPanel' key={option.value}>
                                                <aside className='dashboard-aside' draggable='false'>
                                                    <div className='dashboard-asideTree'>
                                                        {this.renderPanel(option)}
                                                    </div>
                                                </aside>
                                            </div>
                                        );
                                    } else {
                                        return '';
                                    }
                                })
                            ) : ''
                    }
                    { // 成活率右侧范围菜单
                        dashboardCompomentMenu === 'geojsonFeature_survivalRate'
                            ? (
                                <div className='dashboard-menuSwitchSurvivalRateLayout'>
                                    {
                                        this.survivalRateOptions.map((option) => {
                                            return (
                                                <div style={{display: 'inlineBlock'}} key={option.label}>
                                                    <img src={option.img}
                                                        title={option.label}
                                                        className='dashboard-rightMenuSurvivalRateImgLayout' />
                                                    <a className={this.state[option.id] ? 'dashboard-rightMenuSurvivalRateSelLayout' : 'dashboard-rightMenuSurvivalRateUnSelLayout'}
                                                        title={option.label}
                                                        key={option.id}
                                                        onClick={this.handleSurvivalRateButton.bind(this, option)} />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            ) : ''
                    }
                    { // 框选面积的画图按钮
                        dashboardAreaMeasure === 'areaMeasure' ? (
                            <div className='dashboard-editPolygonLayout'>
                                <div>
                                    <Button type='primary' style={{marginRight: 10}} disabled={createMeasureOkDisplay} onClick={this._handleCreateMeasureOk.bind(this)}>确定</Button>
                                    <Button type='info' style={{marginRight: 10}} disabled={createMeasureBackDisplay} onClick={this._handleCreateMeasureRetreat.bind(this)}>上一步</Button>}
                                    <Button type='danger' onClick={this._handleCreateMeasureCancel.bind(this)}>撤销</Button>
                                </div>
                            </div>
                        ) : ''
                    }
                    { // 显示面积
                        areaMeasureVisible ? (
                            <div className='dashboard-areaMeasureLayout'>
                                <span>{`面积：${areaMeasure} 亩`}</span>
                            </div>
                        ) : ''
                    }
                    <div className='dashboard-gisTypeBut'>
                        <div>
                            <Button
                                type={
                                    this.state.mapLayerBtnType
                                        ? 'primary'
                                        : 'info'
                                }
                                onClick={this.toggleTileLayer.bind(this, 1)}
                            >
                                卫星图
                            </Button>
                            <Button
                                type={
                                    this.state.mapLayerBtnType
                                        ? 'info'
                                        : 'primary'
                                }
                                onClick={this.toggleTileLayer.bind(this, 2)}
                            >
                                地图
                            </Button>
                        </div>
                    </div>
                    { // 点击某个树节点展示该节点信息
                        seeVisible
                            ? (
                                <TreeMessModal
                                    {...this.props}
                                    {...this.state}
                                    onCancel={this.handleCancelTreeMess.bind(this)}
                                />
                            ) : ''
                    }
                    <Modal
                        title='隐患详情'
                        width={800}
                        visible={this.state.isShowRisk}
                        onCancel={this._handleCancelVisible.bind(this)}
                        footer={null}
                    >
                        <div>
                            <RiskDetail
                                {...this.props}
                                riskMess={this.state.riskMess}
                            />
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    onClick={this._handleCancelVisible.bind(
                                        this
                                    )}
                                    style={{ float: 'right' }}
                                    type='primary'
                                >
                                    关闭
                                </Button>
                            </Row>
                        </div>
                    </Modal>
                    <div>
                        <div>
                            <div
                                id='mapid'
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    borderLeft: '1px solid #ccc'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // 选择点击全部细班或实际定位
    handleAreaRadioChange = async (e) => {
        this.setState({
            areaRadioValue: e.target.value
        });
    }
    /* 细班选择处理 */
    _handleAreaSelect = async (keys, info) => {
        const {
            areaLayerList,
            areaRadioValue,
            realThinClassLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let areaEventTitle = info.node.props.title;
        this.setState({
            areaEventKey: keys[0],
            areaEventTitle
        });
        try {
            const eventKey = keys[0];
            for (let v in areaLayerList) {
                me.map.removeLayer(areaLayerList[v]);
            }
            if (eventKey) {
                // 细班的key加入了标段，首先对key进行处理
                let handleKey = eventKey.split('-');
                // 如果选中的是细班，则直接添加图层
                if (handleKey.length === 5) {
                    const treeNodeName = info && info.node && info.node.props && info.node.props.title;
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求

                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].addTo(me.map);
                        me.map.fitBounds(areaLayerList[eventKey].getBounds());
                    } else {
                    // 如果不是添加过，需要请求数据
                        await me._addAreaLayer(eventKey, treeNodeName);
                    }
                }
                if (areaRadioValue === '实际定位') {
                    let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                    if (me.tileTreeLayerBasic) {
                        me.map.removeLayer(me.tileTreeLayerBasic);
                    }
                    if (me.tileTreeTypeLayerFilter) {
                        me.map.removeLayer(me.tileTreeTypeLayerFilter);
                        me.tileTreeTypeLayerFilter = null;
                    }
                    for (let i in realThinClassLayerList) {
                        me.map.removeLayer(realThinClassLayerList[i]);
                    }
                    if (realThinClassLayerList[eventKey]) {
                        realThinClassLayerList[eventKey].addTo(me.map);
                    } else {
                        var url = window.config.DASHBOARD_TREETYPE +
                        `/geoserver/xatree/wms?cql_filter=No+LIKE+%27%25${selectNo}%25%27`;
                        let thinClassLayer = L.tileLayer.wms(url,
                            {
                                layers: 'xatree:treelocation',
                                crs: L.CRS.EPSG4326,
                                format: 'image/png',
                                maxZoom: 22,
                                transparent: true
                            }
                        ).addTo(this.map);
                        realThinClassLayerList[eventKey] = thinClassLayer;
                        this.setState({
                            realThinClassLayerList
                        });
                    }
                }
            }
        } catch (e) {
            console.log('处理选中节点', e);
        }
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, treeNodeName) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            let handleKey = eventKey.split('-');
            let no = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
            let section = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
            let me = this;
            let treearea = [];
            try {
                let rst = await getTreearea({}, { no: no });
                if (
                    !(
                        rst &&
                        rst.content &&
                        rst.content instanceof Array &&
                        rst.content.length > 0
                    )
                ) {
                    return;
                }

                let contents = rst.content;
                let data = contents.find(content => content.Section === section);
                let str = data.coords;
                var target1 = str
                    .slice(str.indexOf('(') + 3, str.indexOf(')'))
                    .split(',')
                    .map(item => {
                        return item.split(' ').map(_item => _item - 0);
                    });
                treearea.push(target1);
                let message = {
                    key: 3,
                    type: 'Feature',
                    properties: { name: treeNodeName, type: 'area' },
                    geometry: { type: 'Polygon', coordinates: treearea }
                };
                // let num = computeSignedArea(target1, 1);
                let layer = this._createMarker(message);
                areaLayerList[eventKey] = layer;
                me.setState({
                    areaLayerList
                });
            } catch (e) {
                console.log('await', e);
            }
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }
    // 巡检路线多选树节点
    handleTrackCheck = async (keys, info) => {
        // 当前的选中状态
        let checked = info.checked;
        let selectKey = info.node.props.eventKey;
        if (info && info.node && info.node.props && info.node.props.children) {
            let children = info.node.props.children;
            children.forEach((child, index) => {
                let data = JSON.parse(child.key);
                if (checked) {
                    if (index === children.length - 1) {
                        this.handleTrackAddLayer(data, true);
                    } else {
                        this.handleTrackAddLayer(data, false);
                    }
                } else {
                    this.handleTrackDelLayer(data);
                }
            });
        } else {
            let data = JSON.parse(selectKey);
            if (checked) {
                this.handleTrackAddLayer(data, true);
            } else {
                this.handleTrackDelLayer(data);
            }
        }
    }
    // 加载轨迹图层
    handleTrackAddLayer = async (data, isFocus) => {
        const {
            trackLayerList,
            trackMarkerLayerList
        } = this.state;
        const {
            actions: {
                getMapList,
                getUserDetail
            }
        } = this.props;
        try {
            let selectKey = data.ID;
            if (trackLayerList[selectKey]) {
                trackLayerList[selectKey].addTo(this.map);
                if (trackMarkerLayerList[selectKey]) {
                    trackMarkerLayerList[selectKey].addTo(this.map);
                }
                if (isFocus) {
                    this.map.fitBounds(trackLayerList[selectKey].getBounds());
                }
            } else {
                let routes = await getMapList({ routeID: selectKey });
                if (!(routes && routes instanceof Array && routes.length > 0)) {
                    return;
                }
                let latlngs = [];
                routes.forEach(item => {
                    latlngs.push([item.Y, item.X]);
                });
                if (data && data.PatrolerUser && data.PatrolerUser.PK) {
                    let user = await getUserDetail({pk: data.PatrolerUser.PK});
                    let sectionName = '';
                    if (user && user.account && user.account.sections && user.account.sections.length > 0) {
                        let section = user.account.sections[0];
                        sectionName = getSectionName(section);
                    }
                    let iconData = {
                        geometry: {
                            coordinates: [latlngs[0][0], latlngs[0][1]],
                            type: 'Point'
                        },
                        key: selectKey,
                        properties: {
                            name: user.account.person_name ? user.account.person_name : user.username,
                            organization: user.account.organization ? user.account.organization : '',
                            person_telephone: user.account.person_telephone ? user.account.person_telephone : '',
                            sectionName: sectionName,
                            type: 'track'
                        },
                        type: 'track'
                    };
                    let trackMarkerLayer = this._createMarker(iconData);
                    trackMarkerLayerList[selectKey] = trackMarkerLayer;
                }
                let polyline = L.polyline(latlngs, { color: 'red' }).addTo(
                    this.map
                );
                trackLayerList[selectKey] = polyline;
                if (isFocus) {
                    this.map.fitBounds(polyline.getBounds());
                }
                this.setState({
                    trackLayerList,
                    trackMarkerLayerList
                });
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    // 去除轨迹图层
    handleTrackDelLayer = async (data) => {
        const {
            trackMarkerLayerList,
            trackLayerList
        } = this.state;
        let selectKey = data.ID;
        if (trackMarkerLayerList[selectKey]) {
            this.map.removeLayer(trackMarkerLayerList[selectKey]);
        }
        if (trackLayerList[selectKey]) {
            this.map.removeLayer(trackLayerList[selectKey]);
        }
    }
    /* 安全隐患多选树节点 */
    handleRiskCheck (keys, info) {
        const {
            riskMarkerLayerList
        } = this.state;
        const {
            riskTree
        } = this.props;
        // 移除未选中的
        for (var i in riskMarkerLayerList) {
            let k = keys.find(k => k === i);
            if (!k && riskMarkerLayerList[i]) {
                this.map.removeLayer(riskMarkerLayerList[i]);
            }
        }
        let me = this;
        riskTree.forEach(risk => {
            if (!risk.children) {
                let checkedKey = keys.find(key => key === risk.key);
                if (checkedKey) {
                    if (riskMarkerLayerList[checkedKey]) {
                        riskMarkerLayerList[checkedKey].addTo(me.map);
                    } else {
                        let riskMarkerLayer = me._createMarker(risk);
                        riskMarkerLayerList[checkedKey] = riskMarkerLayer;
                    }
                    me.map.panTo(risk.geometry.coordinates);
                }
            } else {
                risk.children.forEach(riskData => {
                    let checkedKey = keys.find(k => k === riskData.key);
                    if (checkedKey) {
                        if (riskMarkerLayerList[checkedKey]) {
                            riskMarkerLayerList[checkedKey].addTo(me.map);
                        } else {
                            riskMarkerLayerList[checkedKey] = me._createMarker(riskData);
                        }
                        me.map.panTo(riskData.geometry.coordinates);
                    }
                });
            }
            me.setState({
                riskMarkerLayerList
            });
        });
    }
    /* 树种筛选多选树节点 */
    handleTreeTypeCheck = async (keys, info) => {
        let queryData = '';
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] > 6) {
                queryData = queryData + keys[i];
                if (i < keys.length - 1) {
                    queryData = queryData + ',';
                }
            }
        }
        await this.removeTileTreeLayerBasic();
        await this.removeTileTreeTypeLayerFilter();
        let url = window.config.DASHBOARD_TREETYPE +
            `/geoserver/xatree/wms?cql_filter=TreeType%20IN%20(${queryData})`;
        // this.tileTreeTypeLayerFilter指的是一下获取多个树种的图层，单个树种的图层直接存在treeLayerList对象中
        this.tileTreeTypeLayerFilter = L.tileLayer.wms(url,
            {
                layers: 'xatree:treelocation',
                crs: L.CRS.EPSG4326,
                format: 'image/png',
                maxZoom: 22,
                transparent: true
            }
        ).addTo(this.map);
    }
    // 养护任务点击
    handleCuringTaskCheck (keys, info) {
        try {
            let eventKey = info.node.props.eventKey;
            // 当前的选中状态
            let checked = info.checked;
            if (info && info.node && info.node.props && info.node.props.children) {
                let children = info.node.props.children;
                children.map((child, index) => {
                    eventKey = child.key;
                    if (checked) {
                        if (index === children.length - 1) {
                            this.handleCuringTaskAddLayer(eventKey, true);
                        } else {
                            this.handleCuringTaskAddLayer(eventKey, false);
                        }
                    } else {
                        this.handleCuringTaskDelLayer(eventKey);
                    }
                });
            } else {
                if (checked) {
                    this.handleCuringTaskAddLayer(eventKey, true);
                } else {
                    this.handleCuringTaskDelLayer(eventKey);
                }
            }
        } catch (e) {
            console.log('handleCuringTaskCheck', e);
        }
    }
    // 去除任务图层
    handleCuringTaskDelLayer = async (eventKey) => {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskRealLayerList
        } = this.state;
        if (curingTaskPlanLayerList[eventKey]) {
            curingTaskPlanLayerList[eventKey].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
        if (curingTaskMarkerLayerList[eventKey]) {
            this.map.removeLayer(curingTaskMarkerLayerList[eventKey]);
        }
        if (curingTaskRealLayerList[eventKey]) {
            curingTaskRealLayerList[eventKey].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
    }
    // 处理每个任务图层加载，如果之前加载过，直接加载之前的，否则重新获取
    handleCuringTaskAddLayer = async (eventKey, isFocus) => {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskRealLayerList
        } = this.state;
        if (curingTaskPlanLayerList[eventKey]) {
            curingTaskPlanLayerList[eventKey].map((layer) => {
                layer.addTo(this.map);
                if (isFocus) {
                    this.map.fitBounds(layer.getBounds());
                }
            });
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].addTo(this.map);
            }
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].map((layer) => {
                    layer.addTo(this.map);
                });
            }
        } else {
            // 如果不是添加过，需要请求数据
            this.getCuringTaskWkt(eventKey, isFocus);
        }
    }
    // 获取养护任务的计划和实际区域
    getCuringTaskWkt = async (eventKey, isFocus) => {
        const {
            actions: {
                getCuringMessage
            }
        } = this.props;
        try {
            let postData = {
                id: eventKey
            };
            let taskMess = await getCuringMessage(postData);
            let planWkt = taskMess.PlanWKT;
            let realWkt = taskMess.WKT || '';
            if (planWkt) {
                this._handleCuringTaskWkt(planWkt, eventKey, taskMess, 'plan', isFocus);
            }
            if (realWkt) {
                this._handleCuringTaskWkt(realWkt, eventKey, taskMess, 'real', isFocus);
            }
        } catch (e) {
            console.log('handleWKT', e);
        }
    }
    // 处理养护区域的数据，将字符串改为数组
    _handleCuringTaskWkt = async (wkt, eventKey, task, type, isFocus) => {
        let str = '';
        try {
            if (wkt.indexOf('MULTIPOLYGON') !== -1) {
                let data = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf('))') + 1);
                let arr = data.split('),(');
                arr.map((a, index) => {
                    if (index === 0) {
                        str = a.slice(a.indexOf('(') + 1, a.length - 1);
                    } else if (index === arr.length - 1) {
                        str = a.slice(0, a.indexOf(')'));
                    } else {
                        str = a;
                    }
                    // 将图标设置在最后一个图形中，因为最后会聚焦到该位置
                    if (index === arr.length - 1) {
                        if (type === 'plan') {
                            this._handleCuringPlanCoordLayer(str, task, eventKey, index, isFocus);
                        } else if (type === 'real') {
                            this._handleCuringRealCoordLayer(str, task, eventKey, index);
                        }
                    } else {
                        if (type === 'plan') {
                            // 其他图形中不设置图标
                            this._handleCuringPlanCoordLayer(str, task, eventKey);
                        } else if (type === 'real') {
                            this._handleCuringRealCoordLayer(str, task, eventKey);
                        }
                    }
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
                if (type === 'plan') {
                    // 只有一个图形，必须要设置图标
                    this._handleCuringPlanCoordLayer(str, task, eventKey, 1, isFocus);
                } else if (type === 'real') {
                    this._handleCuringRealCoordLayer(str, task, eventKey, 1);
                }
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    // 养护任务计划区域加载图层
    _handleCuringPlanCoordLayer (str, taskMess, eventKey, index, isFocus) {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskMessList
        } = this.state;
        const {
            curingTypes,
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let target = str.split(',').map(item => {
                return item.split(' ').map(_item => _item - 0);
            });
            let treeNodeName = taskMess.CuringMans;
            let typeName = '';
            curingTypes.map((type) => {
                if (type.ID === taskMess.CuringType) {
                    typeName = type.Base_Name;
                }
            });
            let treearea = [];
            let status = '未完成';
            if (taskMess.Status === 2) {
                status = '已上报';
            } else if (taskMess.StartTime && taskMess.EndTime) {
                status = '已完成且未上报';
            }
            let regionData = getTaskThinClassName(taskMess, totalThinClass);
            let sectionName = regionData.regionSectionName;
            let smallClassName = regionData.regionSmallName;
            let thinClassName = regionData.regionThinName;
            taskMess.sectionName = sectionName;
            taskMess.smallClassName = smallClassName;
            taskMess.thinClassName = thinClassName;
            taskMess.status = status;
            taskMess.typeName = typeName;
            curingTaskMessList[eventKey] = taskMess;
            this.setState({
                curingTaskMessList
            });
            let arr = [];
            target.map((data, index) => {
                if ((data[1] > 30) && (data[1] < 45) && (data[0] > 110) && (data[0] < 120)) {
                    arr.push([data[1], data[0]]);
                }
            });
            treearea.push(arr);
            let message = {
                key: 3,
                type: 'curingTask',
                properties: {
                    ID: taskMess.ID,
                    name: treeNodeName,
                    type: 'curingTask',
                    typeName: typeName || '',
                    status: status || '',
                    CuringMans: taskMess.CuringMans || '',
                    Area: (taskMess.Area || '') + '亩',
                    CreateTime: taskMess.CreateTime || '',
                    PlanStartTime: taskMess.PlanStartTime || '',
                    PlanEndTime: taskMess.PlanEndTime || '',
                    StartTime: taskMess.StartTime || '',
                    EndTime: taskMess.EndTime || '',
                    sectionName: taskMess.sectionName || '',
                    smallClassName: taskMess.smallClassName || '',
                    thinClassName: taskMess.thinClassName || ''
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (curingTaskPlanLayerList[eventKey]) {
                curingTaskPlanLayerList[eventKey].push(layer);
            } else {
                curingTaskPlanLayerList[eventKey] = [layer];
            }
            this.setState({
                curingTaskPlanLayerList
            });
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                this.map.fitBounds(layer.getBounds());
            }
            if (!index) {
                return;
            }
            // 设置任务中间的图标
            let centerData = layer.getCenter();
            let iconType = L.divIcon({
                className: getIconType(message.properties.type)
            });
            let marker = L.marker([centerData.lat, centerData.lng], {
                icon: iconType,
                title: message.properties.name
            });
            marker.bindPopup(
                L.popup({ maxWidth: 240 }).setContent(
                    genPopUpContent(message)
                )
            );
            marker.addTo(this.map);
            curingTaskMarkerLayerList[eventKey] = marker;
            this.setState({
                curingTaskMarkerLayerList
            });
        } catch (e) {
            console.log('处理str', e);
        }
    }
    // 添加实际养护区域图层
    _handleCuringRealCoordLayer (str, task, eventKey, index) {
        const {
            curingTaskRealLayerList
        } = this.state;
        try {
            let target = str.split(',').map(item => {
                return item.split(' ').map(_item => _item - 0);
            });
            let treearea = [];
            let arr = [];
            target.map((data, index) => {
                if ((data[1] > 30) && (data[1] < 45) && (data[0] > 110) && (data[0] < 120)) {
                    arr.push([data[1], data[0]]);
                }
            });
            treearea.push(arr);
            let message = {
                key: 3,
                type: 'realCuringTask',
                properties: {
                    type: 'realCuringTask'
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].push(layer);
            } else {
                curingTaskRealLayerList[eventKey] = [layer];
            }
            this.setState({
                curingTaskRealLayerList
            });
        } catch (e) {
            console.log('Realstr', e);
        }
    }
    // 成活率选择标段
    _handleSurvivalRateCheck = async (keys, info) => {
        try {
            let queryData = '';
            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    let eventKey = keys[i];
                    if (eventKey.indexOf('-') !== -1) {
                        queryData = queryData + `'` + eventKey + `'`;
                        if (i < keys.length - 1) {
                            queryData = queryData + ',';
                        }
                    }
                }
            }
            this.setState({
                survivalRateSectionData: queryData
            }, () => {
                this.addSurvivalRateLayer();
            });
        } catch (e) {
            console.log('_handleSurvivalRateCheck', e);
        }
    }
    // 成活率选择成活范围
    handleSurvivalRateButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleSurvivalRateRateData();
            });
        } catch (e) {
            console.log('handleSurvivalRateButton', e);
        }
    }
    handleSurvivalRateRateData = () => {
        let survivalRateRateData = '';
        this.survivalRateOptions.map((option) => {
            if (this.state[option.id]) {
                let data = option.label;
                let arr = data.split('~');
                let arr1 = arr[0];
                let arr2 = arr[1];
                if (survivalRateRateData) {
                    survivalRateRateData += `%20or%20SurvivalRate%20%3E%20${arr1}%20and%20SurvivalRate%20%3C%20${arr2}`;
                } else {
                    survivalRateRateData += `SurvivalRate%20%3E%20${arr1}%20and%20SurvivalRate%20%3C%20${arr2}`;
                }
            }
        });
        this.setState({
            survivalRateRateData
        }, () => {
            this.addSurvivalRateLayer();
        });
    }
    // 成活率加载图层
    addSurvivalRateLayer = async () => {
        const {
            survivalRateSectionData,
            survivalRateRateData
        } = this.state;
        try {
            await this.removeTileTreeSurvivalRateLayer();
            let url = '';
            if (survivalRateRateData && survivalRateSectionData) {
                url = window.config.DASHBOARD_TREETYPE +
                `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
            } else if (survivalRateRateData && !survivalRateSectionData) {
                url = window.config.DASHBOARD_TREETYPE +
                `/geoserver/xatree/wms?cql_filter=${survivalRateRateData}`;
            } else if (!survivalRateRateData && survivalRateSectionData) {
                url = window.config.DASHBOARD_TREETYPE +
                `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})`;
            }
            if (url) {
                this.tileSurvivalRateLayerFilter = L.tileLayer.wms(url,
                    {
                        layers: 'xatree:thinclass',
                        crs: L.CRS.EPSG4326,
                        format: 'image/png',
                        maxZoom: 22,
                        transparent: true
                    }
                ).addTo(this.map);
            } else {
                await this.getTileTreeSurvivalRateBasic();
            }
        } catch (e) {
            console.log('addSurvivalRateLayer', e);
        }
    }

    // 切换为2D
    toggleTileLayer (index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let area = L.geoJson(geo, {
                    style: {
                        fillColor: fillAreaColor(geo.key),
                        weight: 1,
                        opacity: 1,
                        color: '#201ffd',
                        fillOpacity: 0.3
                    },
                    title: geo.properties.name
                }).addTo(this.map);
                this.map.fitBounds(area.getBounds());
                return area;
            } else if (geo.properties.type === 'curingTask') {
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'blue',
                    fillColor: '#93B9F2',
                    fillOpacity: 0.2
                }).addTo(this.map);
                return layer;
            } else if (geo.properties.type === 'realCuringTask') {
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'yellow',
                    fillColor: 'yellow',
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            } else {
                if (
                    !geo.geometry.coordinates[0] ||
                        !geo.geometry.coordinates[1]
                ) {
                    return;
                }
                let iconType = L.divIcon({
                    className: getIconType(geo.type)
                });
                let marker = L.marker(geo.geometry.coordinates, {
                    icon: iconType,
                    title: geo.properties.name
                });
                marker.bindPopup(
                    L.popup({ maxWidth: 240 }).setContent(
                        genPopUpContent(geo)
                    )
                );
                marker.addTo(this.map);
                return marker;
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    // 计算圈选区域面积
    _handleCreateMeasureOk = async () => {
        const {
            coordinates
        } = this.state;
        try {
            let areaMeasure = computeSignedArea(coordinates, 2);
            areaMeasure = areaMeasure * 0.0015;
            this.setState({
                areaMeasure,
                areaMeasureVisible: true
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    // 圈选地图后退
    _handleCreateMeasureRetreat = async () => {
        const {
            coordinates
        } = this.state;
        let me = this;
        if (me.state.polygonData) {
            me.map.removeLayer(me.state.polygonData);
        }
        this.setState({
            areaMeasureVisible: false
        });
        coordinates.pop();
        let polygonData = L.polygon(coordinates, {
            color: 'white',
            fillColor: '#93B9F2',
            fillOpacity: 0.2
        }).addTo(me.map);
        me.setState({
            coordinates,
            polygonData: polygonData
        });
    }
    // 撤销圈选地图
    _handleCreateMeasureCancel = async () => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        this.setState({
            areaMeasureVisible: false
        });
        this._resetRegionState();
    }
    // 取消圈选和按钮的功能
    _resetRegionState = () => {
        const {
            actions: {
                switchDashboardAreaMeasure
            }
        } = this.props;
        switchDashboardAreaMeasure('unAreaMeasure');
        this.setState({
            // createBtnVisible: false,
            polygonData: '',
            coordinates: []
        });
    }
    // 退出隐患详情查看
    _handleCancelVisible () {
        this.setState({
            isShowRisk: false
        });
    }
    // 点击地图上的区域的成活率
    async getSurvivalRateInfo (x, y, that) {
        const {
            platform: {
                tree = {}
            }
        } = that.props;
        const {
            survivalRateMarkerLayerList
        } = that.state;
        let totalThinClass = tree.totalThinClass || [];
        var resolutions = [
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125e-4,
            3.4332275390625e-4,
            1.71661376953125e-4,
            8.58306884765625e-5,
            4.291534423828125e-5,
            2.1457672119140625e-5,
            1.0728836059570312e-5,
            5.364418029785156e-6,
            2.682209014892578e-6,
            1.341104507446289e-6,
            6.705522537231445e-7,
            3.3527612686157227e-7
        ];
        var zoom = that.map.getZoom();
        var resolution = resolutions[zoom];
        var col = (x + 180) / resolution;
        // 林总说明I和J必须是整数
        var colp = Math.floor(col % 256);
        // var colp = col % 256;
        col = Math.floor(col / 256);
        var row = (90 - y) / resolution;
        // 林总说明I和J必须是整数
        var rowp = Math.floor(row % 256);
        // var rowp = row % 256;
        row = Math.floor(row / 256);
        var url =
            window.config.DASHBOARD_ONSITE +
            '/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:thinclass&STYLE=&TILEMATRIX=EPSG:4326:' +
            zoom +
            '&TILEMATRIXSET=EPSG:4326&SERVICE=WMTS&FORMAT=image/png&SERVICE=WMTS&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=' +
            col +
            '&TileRow=' +
            row +
            '&I=' +
            colp +
            '&J=' +
            rowp;
        jQuery.getJSON(url, null, async function (data) {
            try {
                if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                    let properties = data.features[0].properties;
                    for (let i in survivalRateMarkerLayerList) {
                        that.map.removeLayer(survivalRateMarkerLayerList[i]);
                    }
                    let areaData = getThinClassName(properties.no, properties.Section, totalThinClass);
                    let iconData = {
                        geometry: {
                            coordinates: [y, x],
                            type: 'Point'
                        },
                        key: properties.ID,
                        properties: {
                            sectionName: areaData.SectionName ? areaData.SectionName : '',
                            smallClassName: areaData.SmallName ? areaData.SmallName : '',
                            thinClassName: areaData.ThinName ? areaData.ThinName : '',
                            treetype: properties.treetype,
                            SurvivalRate: properties.SurvivalRate,
                            type: 'survivalRate'
                        },
                        type: 'survivalRate'
                    };
                    let survivalRateLayer = that._createMarker(iconData);
                    survivalRateMarkerLayerList[properties.ID] = survivalRateLayer;
                    that.setState({
                        survivalRateMarkerLayerList
                    });
                }
            } catch (e) {

            }
        });
    }
    // 苗木信息Modal关闭
    handleCancelTreeMess () {
        this.setState({
            seeVisible: !this.state.seeVisible
        });
    }
    // 根据点击的地图坐标与实际树的定位进行对比,根据树节点获取树节点信息
    async getTreeInfo (x, y, that) {
        const {
            actions: {
                getTreeflows,
                getNurserys,
                getCarpackbysxm,
                getTreeMess
            },
            platform: {
                tree = {}
            }
        } = this.props;
        let totalThinClass = tree.totalThinClass || [];
        var resolutions = [
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125e-4,
            3.4332275390625e-4,
            1.71661376953125e-4,
            8.58306884765625e-5,
            4.291534423828125e-5,
            2.1457672119140625e-5,
            1.0728836059570312e-5,
            5.364418029785156e-6,
            2.682209014892578e-6,
            1.341104507446289e-6,
            6.705522537231445e-7,
            3.3527612686157227e-7
        ];
        var zoom = that.map.getZoom();
        var resolution = resolutions[zoom];
        var col = (x + 180) / resolution;
        // 林总说明I和J必须是整数
        var colp = Math.floor(col % 256);
        // var colp = col % 256;
        col = Math.floor(col / 256);
        var row = (90 - y) / resolution;
        // 林总说明I和J必须是整数
        var rowp = Math.floor(row % 256);
        // var rowp = row % 256;
        row = Math.floor(row / 256);
        var url =
            window.config.DASHBOARD_ONSITE +
            '/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:treelocation&STYLE=&TILEMATRIX=EPSG:4326:' +
            zoom +
            '&TILEMATRIXSET=EPSG:4326&SERVICE=WMTS&FORMAT=image/png&SERVICE=WMTS&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=' +
            col +
            '&TileRow=' +
            row +
            '&I=' +
            colp +
            '&J=' +
            rowp;
        jQuery.getJSON(url, null, async function (data) {
            if (data.features && data.features.length) {
                if (that.state.treeMarkerLayer) {
                    that.map.removeLayer(that.state.treeMarkerLayer);
                }
                let postdata = {
                    sxm: data.features[0].properties.SXM
                };
                let queryTreeData = await getTreeMess(postdata);
                let treeflowDatas = await getTreeflows({}, postdata);
                let nurserysDatas = await getNurserys({}, postdata);
                let carData = await getCarpackbysxm(postdata);

                let SmallClassName = queryTreeData.SmallClass
                    ? queryTreeData.SmallClass + '号小班'
                    : '';
                let ThinClassName = queryTreeData.ThinClass
                    ? queryTreeData.ThinClass + '号细班'
                    : '';
                // 获取小班细班名称
                if (queryTreeData && queryTreeData.Section && queryTreeData.SmallClass && queryTreeData.ThinClass) {
                    let sections = queryTreeData.Section.split('-');
                    let No =
                        sections[0] +
                        '-' +
                        sections[1] +
                        '-' +
                        queryTreeData.SmallClass +
                        '-' +
                        queryTreeData.ThinClass;
                    let regionData = getThinClassName(No, queryTreeData.Section, totalThinClass);
                    SmallClassName = regionData.SmallName;
                    ThinClassName = regionData.ThinName;
                }

                let treeflowData = {};
                let nurserysData = {};
                if (
                    treeflowDatas && treeflowDatas.content && treeflowDatas.content instanceof Array &&
                    treeflowDatas.content.length > 0
                ) {
                    treeflowData = treeflowDatas.content;
                }
                if (
                    nurserysDatas && nurserysDatas.content && nurserysDatas.content instanceof Array &&
                    nurserysDatas.content.length > 0
                ) {
                    nurserysData = nurserysDatas.content[0];
                }
                let seedlingMess = getSeedlingMess(queryTreeData, carData, nurserysData);
                let treeMess = getTreeMessFun(SmallClassName, ThinClassName, queryTreeData, nurserysData);
                let flowMess = treeflowData;

                let iconType = L.divIcon({
                    className: getIconType('tree')
                });
                let treeMarkerLayer = L.marker([y, x], {
                    icon: iconType,
                    title: data.features[0].properties.SXM
                });
                treeMarkerLayer.addTo(that.map);
                that.setState({
                    seeVisible: true,
                    seedlingMess,
                    treeMess,
                    flowMess,
                    treeMarkerLayer
                });
            }
        });
    }
}
export default Form.create()(OnSite);
