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
 * @Last Modified time: 2019-03-13 16:47:17
 */
import React, { Component } from 'react';
import {
    Button,
    Modal,
    Form,
    Row,
    Col,
    Checkbox,
    Notification,
    Popconfirm
} from 'antd';
import './OnSite.less';
import RiskTree from './Risk/RiskTree';
import TrackTree from './Track/TrackTree';
import TreeTypeTree from './TreeType/TreeTypeTree';
import RiskDetail from './Risk/RiskDetail';
import OnSiteAreaTree from './OnSiteAreaTree';
import TreeMessModal from './TreeMess/TreeMessModal';
import CuringTaskTree from './Curing/CuringTaskTree';
import SurvivalRateTree from './SurvivalRate/SurvivalRateTree';
import TreeAdoptTree from './Adopt/TreeAdoptTree';
import AdoptTreeMessModal from './Adopt/AdoptTreeMessModal';
import SaveUserMapCustomPositionModal from './MapCustom/SaveUserMapCustomPositionModal';
import GetMenuTree from './GetMenuTree';
import TreePipePage from './TreePipe/TreePipePage';
import {
    genPopUpContent,
    getIconType,
    fillAreaColor,
    getThinClassName,
    getSectionName,
    handleAreaLayerData,
    handleCoordinates,
    handleCuringTaskMess,
    handleGetAddressByCoordinate
} from '../auth';
import {
    computeSignedArea
} from '_platform/gisAuth';
import {
    getSeedlingMess,
    getTreeMessFun,
    getCuringMess
} from './TreeMess/TreeInfo';
import {
    PROJECTPOSITIONCENTER,
    FOREST_GIS_API,
    FOREST_GIS_TREETYPE_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import MenuSwitch from '../MenuSwitch';
import {getCompanyDataByOrgCode} from '_platform/auth';
// 存活率图片
import hundredImg from '../SurvivalRateImg/90~100.png';
import ninetyImg from '../SurvivalRateImg/80~90.png';
import eightyImg from '../SurvivalRateImg/70~80.png';
import seventyImg from '../SurvivalRateImg/60~70.png';
import sixtyImg from '../SurvivalRateImg/50~60.png';
import fiftyImg from '../SurvivalRateImg/40~50.png';
import foutyImg from '../SurvivalRateImg/0~40.png';
// 养护任务类型图片
import curingTaskDrainImg from '../CuringTaskImg/drain.png';
import curingTaskFeedImg from '../CuringTaskImg/feed.png';
import curingTaskOtherImg from '../CuringTaskImg/other.png';
import curingTaskReplantingImg from '../CuringTaskImg/replanting.png';
import curingTaskTrimImg from '../CuringTaskImg/trim.png';
import curingTaskWateringImg from '../CuringTaskImg/watering.png';
import curingTaskWeedImg from '../CuringTaskImg/weed.png';
import curingTaskWormImg from '../CuringTaskImg/worm.png';
// 自定义视图
import areaViewImg from '../InitialPositionImg/areaView.png';
import customViewImg from '../InitialPositionImg/customView.png';
import customViewCloseUnSelImg from '../InitialPositionImg/delete1.png';
import customViewCloseSelImg from '../InitialPositionImg/delete2.png';
import distanceMeasureUnSelImg from '../MeasureImg/distanceUnSel.png';
import distanceMeasureSelImg from '../MeasureImg/distanceSel.png';
import areaMeasureUnSelImg from '../MeasureImg/areaUnSel.png';
import areaMeasureSelImg from '../MeasureImg/areaSel.png';

window.config = window.config || {};
class OnSite extends Component {
    // export default class OnSite extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mapLayerBtnType: true, // 切换卫星图和地图
            // 树木详情弹窗数据
            treeMessModalVisible: false,
            treeMessModalLoading: true,
            seedlingMess: '', // 树木信息
            treeMess: '', // 苗木信息
            flowMess: '', // 流程信息
            curingMess: '', // 养护信息
            markers: null, // 点击节点图标
            // 区域地块
            areaEventKey: '', // 区域地块选中节点的key
            areaEventTitle: '', // 区域地块选中节点的name
            // 安全隐患
            riskMess: {}, // 隐患详情
            isShowRisk: false, // 是否显示隐患详情弹窗
            // 图层数据List
            treeMarkerLayer: '',
            areaLayerList: {}, // 区域地块图层list
            realThinClassLayerList: {}, // 实际细班种植图层

            trackLayerList: {}, // 轨迹图层List
            trackMarkerLayerList: {}, // 轨迹图标图层List
            curingTaskPlanLayerList: {},
            curingTaskRealLayerList: {},
            curingTaskMarkerLayerList: {},
            curingTaskMessList: {}, // 养护任务信息List

            survivalRateMarkerLayerList: {},

            adoptTreeMarkerLayerList: {}, // 苗木结缘图标List
            adoptTreeDataList: {}, // 苗木结缘数据List
            // 成活率选项
            survivalRateRateData: '',
            survivalRateSectionData: '',
            switchSurvivalRateFirst: false, // 第一次切换至成活率模块时，因标段数据初始化太麻烦，所以用此字段代表未曾选择过标段数据，只需要根据成活率范围查找
            // 苗木结缘弹窗
            adoptTreeModalVisible: false,
            adoptTreeModalLoading: true,
            adoptTreeMess: '',
            // 成活率范围的点击状态，展示是否选中的图片
            survivalRateHundred: true,
            survivalRateNinety: true,
            survivalRateEighty: true,
            survivalRateSeventy: true,
            survivalRateSixty: true,
            survivalRateFifty: true,
            survivalRateFourty: true,
            // 养护任务类型的点击状态，展示是否选中的图片
            curingTaskFeed: true,
            curingTaskDrain: true,
            curingTaskReplanting: true,
            curingTaskWorm: true,
            curingTaskTrim: true,
            curingTaskWeed: true,
            curingTaskWatering: true,
            curingTaskOther: true,
            // 子组件搜索的树数据
            riskSrarchData: '',
            curingTaskSrarchData: '',
            // 自定义视图
            saveUserMapCustomPositionVisible: false,
            saveUserMapCustomPositionCenter: '',
            saveUserMapCustomPositionZoom: '',
            // 数据测量
            coordinates: [], // 地图圈选
            polygonData: '', // 圈选地图图层
            totalDistanceMeasure: 0, // 总距离
            areaMeasure: 0, // 圈选区域面积
            areaMeasureVisible: false, // 面积数据显示
            distanceMeasureMarkerList: {},
            distanceMeasureLineList: {},
            distanceMeasureNumList: []
        };
        this.tileLayer = null; // 最底部基础图层
        this.tileTreeLayerBasic = null; // 树木区域图层
        this.tileTreeSurvivalRateLayerBasic = null; // 成活率全部图层
        this.tileTreeAdoptLayerBasic = null; // 苗木结缘全部图层
        this.tileTreeWinterThinClassLayerBasic = null;
        this.tileTreeWinterProjectLayerBasic = null;
        
        this.tileSurvivalRateLayerFilter = null; // 成活率范围和标段筛选图层
        this.tileTreePipeBasic = null; // 灌溉管网图层
        this.map = null;
    }
    // 左侧菜单栏的Tree型数据
    options = [
        {
            label: '巡检路线',
            value: 'geojsonFeature_track'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_risk'
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype'
        },
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask'
        },
        {
            label: '成活率',
            value: 'geojsonFeature_survivalRate'
        },
        {
            label: '工程影像',
            value: 'geojsonFeature_projectPic'
        },
        {
            label: '苗木结缘',
            value: 'geojsonFeature_treeAdopt'
        },
        {
            label: '灌溉管网',
            value: 'geojsonFeature_treePipe'
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
    // 养护任务类型
    curingTaskTypeOptions = [
        {
            id: 'curingTaskFeed',
            label: '施肥',
            img: curingTaskFeedImg
        },
        {
            id: 'curingTaskDrain',
            label: '排涝',
            img: curingTaskDrainImg
        },
        {
            id: 'curingTaskReplanting',
            label: '补植',
            img: curingTaskReplantingImg
        },
        {
            id: 'curingTaskWorm',
            label: '病虫害防治',
            img: curingTaskWormImg
        },
        {
            id: 'curingTaskTrim',
            label: '修剪',
            img: curingTaskTrimImg
        },
        {
            id: 'curingTaskWeed',
            label: '除草',
            img: curingTaskWeedImg
        },
        {
            id: 'curingTaskWatering',
            label: '浇水',
            img: curingTaskWateringImg
        },
        {
            id: 'curingTaskOther',
            label: '其他',
            img: curingTaskOtherImg
        }
    ]
    // 灌溉管网类型
    treePipeTypeOptions = [
        {
            id: 'curingTaskFeed',
            label: '快速取水器'
        },
        {
            id: 'curingTaskDrain',
            label: '三通'
        },
        {
            id: 'curingTaskReplanting',
            label: '四通'
        },
        {
            id: 'curingTaskWorm',
            label: '阀水井'
        },
        {
            id: 'curingTaskTrim',
            label: '水井'
        },
        {
            id: 'curingTaskWeed',
            label: '泄水井'
        }
    ]
    // 灌溉管网口径范围
    treePipeRateOptions = [
        {
            id: 'survivalRateHundred',
            label: '0 ~ 63'
        },
        {
            id: 'survivalRateNinety',
            label: '63 ~ 100'
        },
        {
            id: 'survivalRateEighty',
            label: '100 ~ 150'
        }
    ]
    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            actions: {
                getCustomViewByUserID
            }
        } = this.props;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        await getCustomViewByUserID({id: user.id});
        await this.initMap();
    }
    /* 初始化地图 */
    initMap () {
        const {
            customViewByUserID = []
        } = this.props;
        try {
            let me = this;
            let mapInitialization = INITLEAFLET_API;
            if (customViewByUserID && customViewByUserID instanceof Array && customViewByUserID.length > 0) {
                let view = customViewByUserID[0];
                let center = [view.center[0].lat, view.center[0].lng];
                let zoom = view.zoom;
                mapInitialization.center = center;
                mapInitialization.zoom = zoom;
            };
            this.map = L.map('mapid', mapInitialization);

            // L.control.zoom({ position: 'bottomright' }).addTo(this.map);

            this.tileLayer = L.tileLayer(TILEURLS[1], {
                subdomains: [1, 2, 3],
                minZoom: 1,
                maxZoom: 17,
                storagetype: 0
            }).addTo(this.map);
            // 巡检路线的代码   地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                subdomains: [1, 2, 3],
                minZoom: 1,
                maxZoom: 17,
                storagetype: 0
            }).addTo(this.map);
            this.getTileLayerTreeBasic();
            this.getTileTreeWinterThinClassLayerBasic();
            this.getTileTreeWinterProjectLayerBasic();
            // 隐患详情点击事件
            document.querySelector('.leaflet-popup-pane').addEventListener('click', async function (e) {
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
                    coordinates = [],
                    distanceMeasureMarkerList = {},
                    distanceMeasureLineList = {},
                    distanceMeasureNumList = []
                } = me.state;
                const {
                    dashboardCompomentMenu,
                    areaDistanceMeasureMenu,
                    dashboardTreeMess
                } = me.props;
                // 测量面积
                if (areaDistanceMeasureMenu === 'areaMeasureMenu') {
                    coordinates.push([e.latlng.lat, e.latlng.lng]);
                    if (me.state.polygonData) {
                        me.map.removeLayer(me.state.polygonData);
                    }
                    console.log('coordinates', coordinates);
                    let polygonData = L.polygon(coordinates, {
                        color: 'white',
                        fillColor: '#93B9F2',
                        fillOpacity: 0.2
                    }).addTo(me.map);
                    me.setState({
                        coordinates,
                        polygonData: polygonData
                    });
                } else if (areaDistanceMeasureMenu === 'distanceMeasureMenu') {
                    // 测量距离
                    // 如果数据已经存在两个了，则计算最新点击的点和前一个点的距离
                    let distanceMeasure = 0;
                    let lineData = [];
                    if (coordinates.length > 1) {
                        coordinates.push([e.latlng.lat, e.latlng.lng]);
                        let latlng = L.latLng(coordinates[coordinates.length - 2]);
                        // 计算前一个点与当前点的距离
                        distanceMeasure = latlng.distanceTo(L.latLng(coordinates[coordinates.length - 1])).toFixed(2);
                        // 将计算的距离加载在地图上  两点中间
                        let iconType = L.divIcon({
                            html: `${distanceMeasure}`,
                            className: 'dashboard-distanceMeasure-icon',
                            iconSize: 'auto'
                        });
                        let dataX = (coordinates[coordinates.length - 2][0] + e.latlng.lat) / 2;
                        let dataY = (coordinates[coordinates.length - 2][1] + e.latlng.lng) / 2;
                        let marker = L.marker([dataX, dataY], {
                            icon: iconType
                        });
                        marker.addTo(me.map);
                        // 将两点之间的marker图层保存起来
                        let markerId = `${e.latlng.lat}, ${e.latlng.lng}`;
                        distanceMeasureMarkerList[markerId] = marker;
                        // 设置直线数据
                        lineData.push(coordinates[coordinates.length - 2]);
                        lineData.push(coordinates[coordinates.length - 1]);
                    } else if (coordinates.length === 1) {
                        // 如果数据已经存在一个，则计算最新点击的点和当前点的距离
                        coordinates.push([e.latlng.lat, e.latlng.lng]);
                        let latlng = L.latLng(coordinates[0]);
                        // 计算前一个点与当前点的距离
                        distanceMeasure = latlng.distanceTo(L.latLng(coordinates[1])).toFixed(2);
                        // 将计算的距离加载在地图上  两点中间
                        let iconType = L.divIcon({
                            html: `${distanceMeasure}`,
                            className: 'dashboard-distanceMeasure-icon',
                            iconSize: 'auto'
                        });
                        let dataX = (coordinates[coordinates.length - 2][0] + e.latlng.lat) / 2;
                        let dataY = (coordinates[coordinates.length - 2][1] + e.latlng.lng) / 2;
                        let marker = L.marker([dataX, dataY], {
                            icon: iconType
                        });
                        marker.addTo(me.map);
                        // 将两点之间的marker图层保存起来
                        let markerId = `${e.latlng.lat}, ${e.latlng.lng}`;
                        distanceMeasureMarkerList[markerId] = marker;
                        // 设置直线数据
                        lineData.push(coordinates[coordinates.length - 2]);
                        lineData.push(coordinates[coordinates.length - 1]);
                    } else if (coordinates.length === 0) {
                        // 如果数据不存在，则不计算距离
                        coordinates.push([e.latlng.lat, e.latlng.lng]);
                        lineData.push([e.latlng.lat, e.latlng.lng]);
                    }

                    if (distanceMeasure) {
                        distanceMeasureNumList.push(distanceMeasure);
                    }
                    let totalDistanceMeasure = 0;
                    distanceMeasureNumList.map((distance) => {
                        totalDistanceMeasure = (Number(totalDistanceMeasure) +
                            Number(distance) + 0).toFixed(2);
                    });
                    let polygonData = L.polygon(lineData, {
                        color: 'white',
                        fillColor: '#93B9F2',
                        fillOpacity: 0.2
                    }).addTo(me.map);
                    let lineID = `${e.latlng.lat}, ${e.latlng.lng}`;
                    distanceMeasureLineList[lineID] = polygonData;
                    me.setState({
                        coordinates,
                        distanceMeasureLineList,
                        totalDistanceMeasure,
                        distanceMeasureMarkerList,
                        distanceMeasureNumList
                    });
                } else if (dashboardTreeMess === 'treeMess') {
                    me.getSxmByLocation(e.latlng.lng, e.latlng.lat, me, 'treeMess');
                } else if (dashboardCompomentMenu === 'geojsonFeature_survivalRate') {
                    me.getSxmByLocation(e.latlng.lng, e.latlng.lat, me, 'geojsonFeature_survivalRate');
                } else if (dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
                    me.getSxmByLocation(e.latlng.lng, e.latlng.lat, me, 'geojsonFeature_treeAdopt');
                }
            });
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 切换全部细班时，将其余图层去除，加载最初始图层
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            dashboardCompomentMenu,
            dashboardAreaTreeLayer,
            dashboardTreeMess,
            platform: {
                tabs = {}
            }
        } = this.props;
        // 去除树木信息图标图层
        if (!dashboardTreeMess && prevProps.dashboardTreeMess && dashboardTreeMess !== prevProps.dashboardTreeMess) {
            await this.handleRemoveTreeMarkerLayer();
        }
        // 在各个菜单之间切换时需要处理的图层
        if (dashboardCompomentMenu && dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            await this.removeAllLayer();
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate') {
                // 选择成活率菜单
                await this.handleRemoveTreeMarkerLayer();
                await this.removeTileTreeLayerBasic();
                await this.getTileTreeSurvivalRateBasic();
                await this.survivalRateOptions.map(async (option) => {
                    await this.setState({
                        [option.id]: true
                    });
                });
                await this.getSurvivalRateRateDataDefault();
            } else if (dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
                // 选择苗木结缘菜单
                await this.handleRemoveTreeMarkerLayer();
                await this.removeTileTreeLayerBasic();
                await this.getTileTreeAdoptBasic();
            } else if (dashboardCompomentMenu === 'geojsonFeature_curingTask') {
                // 选择养护任务菜单
                await this.curingTaskTypeOptions.map(async (option) => {
                    await this.setState({
                        [option.id]: true
                    });
                });
                await this.getTileLayerTreeBasic();
                await this.handleCuringTaskTypeAddLayer();
            } else if (dashboardCompomentMenu === 'geojsonFeature_risk') {
                await this.getTileLayerTreeBasic();
            } else if (dashboardCompomentMenu === 'geojsonFeature_treePipe') {
                // 选择灌溉管网菜单
                await this.getTileLayerTreeBasic();
            } else {
                await this.getTileLayerTreeBasic();
            }
        }
        // 去除树图层
        if (
            dashboardAreaTreeLayer && dashboardAreaTreeLayer === 'removeTileTreeLayerBasic' &&
            prevProps.dashboardAreaTreeLayer !== dashboardAreaTreeLayer
        ) {
            await this.removeTileTreeLayerBasic();
        }
        // 加载树图层
        // 需要考虑选择实际定位时，需要获取筛选图层
        // 需要考虑选择成活率时，需要获取成活率图层
        // 需要考虑选择苗木结缘时，需要获取苗木结缘图层
        // 需要考虑取消选择某个菜单时，不能回复原状，完成展示效果
        if (
            dashboardAreaTreeLayer && dashboardAreaTreeLayer === 'tileTreeLayerBasic' &&
            prevProps.dashboardAreaTreeLayer !== dashboardAreaTreeLayer &&
            dashboardCompomentMenu !== 'geojsonFeature_survivalRate' &&
            dashboardCompomentMenu !== 'geojsonFeature_treetype' &&
            dashboardCompomentMenu !== 'geojsonFeature_auxiliaryManagement' &&
            dashboardCompomentMenu !== 'geojsonFeature_treeAdopt'
        ) {
            await this.getTileLayerTreeBasic();
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
        } else if (docElm.mozRequestFullScreen) {
            // FireFox
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            // Chrome等
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            // IE11
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
    // 获取初始化数据的树木瓦片图层
    getTileLayerTreeBasic = () => {
        if (this.map) {
            if (this.tileTreeLayerBasic) {
                this.tileTreeLayerBasic.addTo(this.map);
            } else {
                this.tileTreeLayerBasic = L.tileLayer(
                    FOREST_GIS_API +
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
    }
    // 去除初始化数据的树木瓦片图层
    removeTileTreeLayerBasic () {
        if (this.tileTreeLayerBasic) {
            this.map.removeLayer(this.tileTreeLayerBasic);
        }
    }
    // 获取秋冬季的细班
    getTileTreeWinterThinClassLayerBasic = () => {
        if (this.map) {
            if (this.tileTreeWinterThinClassLayerBasic) {
                this.tileTreeLayerBasic.addTo(this.map);
            } else {
                this.tileTreeWinterThinClassLayerBasic = L.tileLayer(
                    FOREST_GIS_API +
                            'geoserver/gwc/service/wmts?layer=xatree%3Aland&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                    {
                        opacity: 1.0,
                        subdomains: [1, 2, 3],
                        minZoom: 11,
                        maxZoom: 21,
                        storagetype: 0,
                        tiletype: 'wtms'
                    }
                );
                console.log('this.tileTreeWinterThinClassLayerBasic', this.tileTreeWinterThinClassLayerBasic);
                this.tileTreeWinterThinClassLayerBasic.setOpacity(0.7);
                this.tileTreeWinterThinClassLayerBasic.addTo(this.map);
            }
        }
    }
    // 获取秋冬季的区块范围
    getTileTreeWinterProjectLayerBasic = () => {
        if (this.map) {
            if (this.tileTreeWinterProjectLayerBasic) {
                this.tileTreeLayerBasic.addTo(this.map);
            } else {
                this.tileTreeWinterProjectLayerBasic = L.tileLayer(
                    FOREST_GIS_API +
                            'geoserver/gwc/service/wmts?layer=xatree%3Athinclass&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                    {
                        opacity: 1.0,
                        subdomains: [1, 2, 3],
                        minZoom: 11,
                        maxZoom: 21,
                        storagetype: 0,
                        tiletype: 'wtms'
                    }
                );
                this.tileTreeWinterProjectLayerBasic.setOpacity(0.7);
                this.tileTreeWinterProjectLayerBasic.addTo(this.map);
            }
        }
    }
    // 加载成活率全部瓦片图层
    getTileTreeSurvivalRateBasic = () => {
        if (this.tileTreeSurvivalRateLayerBasic) {
            this.tileTreeSurvivalRateLayerBasic.addTo(this.map);
        } else {
            this.tileTreeSurvivalRateLayerBasic = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Asurvivalrate&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
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
    // 加载苗木结缘全部瓦片图层
    getTileTreeAdoptBasic = () => {
        if (this.tileTreeAdoptLayerBasic) {
            this.tileTreeAdoptLayerBasic.addTo(this.map);
        } else {
            this.tileTreeAdoptLayerBasic = L.tileLayer(
                FOREST_GIS_API +
                // '/geoserver/gwc/service/wmts?layer=xatree%3Aalladopttree&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                '/geoserver/gwc/service/wmts?layer=xatree%3Aadopttree&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
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
    // 去除苗木结缘全部瓦片图层
    removeTileTreeAdoptLayer = () => {
        if (this.tileTreeAdoptLayerBasic) {
            this.map.removeLayer(this.tileTreeAdoptLayerBasic);
        }
    }
    // 各个模块之间切换时，去除除当前模块外所有后来添加的图层
    removeAllLayer = () => {
        const {
            survivalRateMarkerLayerList, // 成活率图标图层List
            adoptTreeMarkerLayerList
        } = this.state;
        const {
            dashboardCompomentMenu
        } = this.props;
        try {
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_curingTask') {
                this.handleRemoveAllCuringTaskLayer();
                this.curingTaskTypeOptions.map((option) => {
                    this.setState({
                        [option.id]: false
                    });
                });
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
                    survivalRateRateData: '',
                    switchSurvivalRateFirst: false
                });
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_treeAdopt') {
                this.removeTileTreeAdoptLayer();
                for (let t in adoptTreeMarkerLayerList) {
                    this.map.removeLayer(adoptTreeMarkerLayerList[t]);
                }
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_auxiliaryManagement') {
                this.handleRemoveRealThinClassLayer();
            }
        } catch (e) {
            console.log('去除所有图层', e);
        }
    }
    // 去除树木信息图标图层
    handleRemoveTreeMarkerLayer = () => {
        if (this.state.treeMarkerLayer) {
            this.map.removeLayer(this.state.treeMarkerLayer);
        }
    }
    // 去除全部养护任务图层
    handleRemoveAllCuringTaskLayer = () => {
        const {
            curingTaskPlanLayerList, // 养护任务计划养护区域图层List
            curingTaskRealLayerList, // 养护任务实际养护区域图层List
            curingTaskMarkerLayerList // 养护任务图标图层List
        } = this.state;
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
            curingTaskMarkerLayerList[v].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
    }
    // 去除细班实际区域的图层
    handleRemoveRealThinClassLayer = () => {
        const {
            realThinClassLayerList
        } = this.state;
        for (let i in realThinClassLayerList) {
            this.map.removeLayer(realThinClassLayerList[i]);
        }
    }
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            treetypesTree
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
                // 巡检路线
                case 'geojsonFeature_track':
                    return (
                        <TrackTree
                            {...this.props}
                            {...this.state}
                            map={this.map}
                            featureName={option.value}
                        />
                    );
                // 树种筛选
                case 'geojsonFeature_treetype':
                    return (
                        <TreeTypeTree
                            {...this.props}
                            {...this.state}
                            map={this.map}
                            removeTileTreeLayerBasic={this.removeTileTreeLayerBasic.bind(this)}
                            featureName={option.value}
                            treetypes={treetypes}
                        />
                    );
                // 养护任务
                case 'geojsonFeature_curingTask':
                    return (
                        <CuringTaskTree
                            {...this.props}
                            {...this.state}
                            onSearchData={this.handleCuringTaskSearchData.bind(this)}
                        />
                    );
                // 成活率
                case 'geojsonFeature_survivalRate':
                    return (
                        <SurvivalRateTree
                            {...this.props}
                            {...this.state}
                            onCheck={this._handleSurvivalRateCheck.bind(this)}
                        />
                    );
                // 苗木结缘
                case 'geojsonFeature_treeAdopt':
                    return (
                        <TreeAdoptTree
                            {...this.props}
                            {...this.state}
                            onCheck={this._handleAdoptCheck.bind(this)}
                            onSelect={this._handleAdoptSelect.bind(this)}
                        />
                    );
            }
        }
    }
    render () {
        const {
            treeMessModalVisible,
            coordinates,
            areaMeasure,
            areaMeasureVisible,
            adoptTreeModalVisible,
            saveUserMapCustomPositionVisible,
            totalDistanceMeasure,
            distanceMeasureLineList
        } = this.state;
        const {
            dashboardCompomentMenu,
            menuTreeVisible,
            dashboardDataMeasurement,
            dashboardRightMenu,
            dashboardFocus,
            userMapPositionName = '',
            customViewByUserID = [],
            areaDistanceMeasureMenu = '',
            platform: {
                tabs = {},
                tree = {}
            }
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        // 计算面积的确定按钮是否可以点击，如果不形成封闭区域，不能点击
        let createAreaMeasureOkDisplay = false;
        if (coordinates.length <= 2) {
            createAreaMeasureOkDisplay = true;
        }
        // 计算面积的上一步按钮是否可以点击，如果没有点，不能点击
        let createAreaMeasureBackDisplay = false;
        if (coordinates.length <= 0) {
            createAreaMeasureBackDisplay = true;
        }

        // 计算距离的上一步按钮是否可以点击，如果没有点，不能点击
        let createDistanceMeasureBackDisplay = false;
        if (Object.keys(distanceMeasureLineList).length <= 0) {
            createDistanceMeasureBackDisplay = true;
        }
        let onSiteAreaTreeData = [];
        if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 1) {
            onSiteAreaTreeData = tree.thinClassTree;
        } else if (tree.onSiteThinClassTree && tree.onSiteThinClassTree instanceof Array && tree.onSiteThinClassTree.length > 0) {
            onSiteAreaTreeData = tree.onSiteThinClassTree;
        }
        return (
            <div className={fullScreenState === 'fullScreen' ? 'map-containerFullScreen' : 'map-container'}>
                <div
                    ref='appendBody'
                    className='dashboard-map r-main'
                >
                    <MenuSwitch {...this.props} {...this.state} />
                    <GetMenuTree {...this.props} {...this.state} />
                    { // 左侧第二级菜单的树形结构
                        menuTreeVisible
                            ? (
                                this.options.map(option => {
                                    if (option.value === 'geojsonFeature_treePipe') {
                                        return '';
                                    } else {
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
                                    }
                                })
                            ) : ''
                    }
                    { // 右侧菜单当选择区域地块时，显示区域地块树
                        dashboardRightMenu && dashboardRightMenu === 'area'
                            ? (
                                <div className='dashboard-rightAreaMenu'>
                                    <aside className='dashboard-rightAreaMenu-aside' draggable='false'>
                                        <div className='dashboard-rightAreaMenu-areaTree'>
                                            <OnSiteAreaTree
                                                {...this.props}
                                                treeData={onSiteAreaTreeData || []}
                                                // selectedKeys={this.state.areaEventKey}
                                                onSelect={this._handleAreaSelect.bind(this)}
                                            />
                                        </div>
                                    </aside>
                                </div>
                            ) : ''
                    }
                    { // 右侧菜单当选择区域视图时，展示区域视图页面
                        dashboardFocus && dashboardFocus === 'mapFoucs'
                            ? (
                                <div className='dashboard-rightInitialPositionMenu'>
                                    <aside className='dashboard-rightInitialPositionMenu-aside' draggable='false'>
                                        <div className='dashboard-rightInitialPositionMenu-areaTree'>
                                            <div style={{height: '100%'}}>
                                                <div className='dashboard-rightInitialPositionMenu-viewList'>
                                                    <div className='dashboard-rightInitialPositionMenu-areaViewTitle'>
                                                        <img src={areaViewImg} style={{marginRight: 10, marginTop: -1}} />
                                                        <span>区域视图</span>
                                                    </div>
                                                    <div>
                                                        {
                                                            PROJECTPOSITIONCENTER.map((view, index) => {
                                                                return (<div className='dashboard-rightInitialPositionMenu-areaViewData' key={view.name}>
                                                                    <Button
                                                                        className='dashboard-rightInitialPositionMenu-areaViewData-button'
                                                                        onClick={this.locationToMapCustomPosition.bind(this, view)}
                                                                        type={userMapPositionName === view.name ? 'primary' : ''}>
                                                                        {view.name}
                                                                    </Button>
                                                                </div>);
                                                            })
                                                        }
                                                    </div>
                                                    <div className='dashboard-rightInitialPositionMenu-customViewTitle'>
                                                        <img src={customViewImg} style={{marginRight: 10, marginTop: -1}} />
                                                        <span>自定义视图</span>
                                                    </div>
                                                    <div>
                                                        {
                                                            customViewByUserID.map((view, index) => {
                                                                if (userMapPositionName === view.name) {
                                                                    return (<div className='dashboard-rightInitialPositionMenu-customViewData-Select' key={view.id}>
                                                                        <a className='dashboard-rightInitialPositionMenu-customViewData-ALabel-Select'
                                                                            title={view.name}
                                                                            onClick={this.locationToMapCustomPosition.bind(this, view)}>
                                                                            {view.name}
                                                                        </a>
                                                                        <Popconfirm title='确认要删除么'
                                                                            onConfirm={this.handleDeleteMapCustomPosition.bind(this, view)}
                                                                            onCancel={this.handleDeleteMapCustomPositionCancel.bind(this)}
                                                                            okText='Yes' cancelText='No'>
                                                                            <img src={customViewCloseSelImg} className='dashboard-rightInitialPositionMenu-customViewData-deleteImg' />
                                                                        </Popconfirm>
                                                                    </div>);
                                                                } else {
                                                                    return (<div className='dashboard-rightInitialPositionMenu-customViewData-Unselect' key={view.id}>
                                                                        <a className='dashboard-rightInitialPositionMenu-customViewData-ALabel-Unselect'
                                                                            title={view.name}
                                                                            onClick={this.locationToMapCustomPosition.bind(this, view)}>
                                                                            {view.name}
                                                                        </a>
                                                                        <Popconfirm title='确认要删除么'
                                                                            onConfirm={this.handleDeleteMapCustomPosition.bind(this, view)}
                                                                            onCancel={this.handleDeleteMapCustomPositionCancel.bind(this)}
                                                                            okText='Yes' cancelText='No'>
                                                                            <img src={customViewCloseUnSelImg}
                                                                                className='dashboard-rightInitialPositionMenu-customViewData-deleteImg' />
                                                                        </Popconfirm>
                                                                    </div>);
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className='dashboard-rightInitialPositionMenu-footerButton'>
                                                    <Button style={{width: '100%', height: 40}}
                                                        onClick={this.saveUserMapCustomPosition.bind(this)}
                                                        type='primary' ghost>
                                                        保存当前视图
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                            ) : ''
                    }
                    { // 添加自定义视图的弹窗
                        saveUserMapCustomPositionVisible
                            ? (
                                <SaveUserMapCustomPositionModal
                                    {...this.props}
                                    {...this.state}
                                    onCancel={this.handleCancelMapCustomPositionModal.bind(this)} />
                            ) : ''
                    }
                    { // 数据测量
                        dashboardDataMeasurement && dashboardDataMeasurement === 'dataMeasurement'
                            ? (
                                <div className='dashboard-rightDataMeasureMenu'>
                                    <aside className='dashboard-rightDataMeasureMenu-aside' draggable='false'>
                                        <div>
                                            <div className={areaDistanceMeasureMenu === 'distanceMeasureMenu' ? 'dashboard-rightDataMeasureMenu-back-Select' : 'dashboard-rightDataMeasureMenu-back-Unselect'}>
                                                <img src={areaDistanceMeasureMenu === 'distanceMeasureMenu' ? distanceMeasureSelImg : distanceMeasureUnSelImg}
                                                    onClick={this.handleSwitchMeasureMenu.bind(this, 'distanceMeasureMenu')}
                                                    title='距离计算'
                                                    className='dashboard-rightDataMeasureMenu-clickImg' />
                                            </div>
                                            <div className={areaDistanceMeasureMenu === 'areaMeasureMenu' ? 'dashboard-rightDataMeasureMenu-back-Select' : 'dashboard-rightDataMeasureMenu-back-Unselect'}>
                                                <img src={areaDistanceMeasureMenu === 'areaMeasureMenu' ? areaMeasureSelImg : areaMeasureUnSelImg}
                                                    onClick={this.handleSwitchMeasureMenu.bind(this, 'areaMeasureMenu')}
                                                    title='面积计算'
                                                    className='dashboard-rightDataMeasureMenu-clickImg' />
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                            ) : ''
                    }
                    { // 框选面积的画图按钮
                        areaDistanceMeasureMenu === 'areaMeasureMenu' ? (
                            <div className='dashboard-editPolygonLayout'>
                                <div>
                                    <Button type='primary' style={{marginRight: 10}}
                                        disabled={createAreaMeasureOkDisplay}
                                        onClick={this._handleCreateMeasureOk.bind(this)}>
                                        确定
                                    </Button>
                                    <Button type='info' style={{marginRight: 10}}
                                        disabled={createAreaMeasureBackDisplay}
                                        onClick={this._handleCreateMeasureRetreat.bind(this)}>
                                        上一步
                                    </Button>
                                    <Button type='danger'
                                        onClick={this.handleCloseMeasureMenu.bind(this)}>
                                        撤销
                                    </Button>
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
                    { // 框选面积的画图按钮
                        areaDistanceMeasureMenu === 'distanceMeasureMenu' ? (
                            <div className='dashboard-editPolygonLayout'>
                                <div>
                                    <Button type='info' style={{marginRight: 10}}
                                        disabled={createDistanceMeasureBackDisplay}
                                        onClick={this._handleCreateMeasureRetreat.bind(this)}>
                                        上一步
                                    </Button>
                                    <Button type='danger'
                                        onClick={this.handleCloseMeasureMenu.bind(this)}>
                                        撤销
                                    </Button>
                                </div>
                            </div>
                        ) : ''
                    }
                    { // 显示距离
                        totalDistanceMeasure ? (
                            <div className='dashboard-areaMeasureLayout'>
                                <span>{`总距离：${totalDistanceMeasure} 米`}</span>
                            </div>
                        ) : ''
                    }
                    { // 成活率右侧范围菜单
                        dashboardCompomentMenu === 'geojsonFeature_survivalRate'
                            ? (
                                <div className='dashboard-menuSwitchSurvivalRateLayout'>
                                    {
                                        this.survivalRateOptions.map((option) => {
                                            return (
                                                <div style={{display: 'inlineBlock'}} key={option.id}>
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
                    { // 安全隐患右侧类型菜单
                        dashboardCompomentMenu === 'geojsonFeature_risk'
                            ? (
                                <RiskTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 养护任务右侧类型菜单
                        dashboardCompomentMenu === 'geojsonFeature_curingTask'
                            ? (
                                <div className='dashboard-menuSwitchCuringTaskTypeLayout'>
                                    {
                                        <div>
                                            <div style={{display: 'inlineBlock', marginTop: 8}} />
                                            {
                                                this.curingTaskTypeOptions.map((option) => {
                                                    return (
                                                        <div style={{display: 'inlineBlock', height: 20}} key={option.id}>
                                                            <p className='dashboard-menuLabel1'>{option.label}</p>
                                                            <img src={option.img}
                                                                title={option.label}
                                                                className='dashboard-rightMenuCuringTaskTypeImgLayout' />
                                                            <a className={this.state[option.id] ? 'dashboard-rightMenuCuringTaskTypeSelLayout' : 'dashboard-rightMenuCuringTaskTypeUnSelLayout'}
                                                                title={option.label}
                                                                key={option.id}
                                                                onClick={this.handleCuringTaskTypeButton.bind(this, option)} />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>

                                    }
                                </div>
                            ) : ''
                    }
                    { // 灌溉管网菜单
                        dashboardCompomentMenu === 'geojsonFeature_treePipe'
                            ? (
                                <TreePipePage
                                    map={this.map}
                                    {...this.props}
                                    {...this.state}

                                />
                                // <div className='dashboard-menuSwitchTreePipeLayout'>
                                //     <div style={{margin: 10}}>
                                //         <Row className='dashboard-menuSwitchTreePipeBorder'>
                                //             <span>类型</span>
                                //         </Row>
                                //         <Row>
                                //             {
                                //                 this.treePipeTypeOptions.map((option) => {
                                //                     return (
                                //                         <Col span={12} style={{marginTop: 5}}>
                                //                             <Checkbox onChange={this.pipeTypeChange.bind(this, option)}>{option.label}</Checkbox>
                                //                         </Col>
                                //                     );
                                //                 })
                                //             }
                                //         </Row>
                                //     </div>
                                //     <div style={{margin: 10}}>
                                //         <Row className='dashboard-menuSwitchTreePipeBorder'>
                                //             <span>口径</span>
                                //         </Row>
                                //         <Row>
                                //             {
                                //                 this.treePipeRateOptions.map((option) => {
                                //                     return (
                                //                         <Col span={12} style={{marginTop: 5}}>
                                //                             <Checkbox onChange={this.pipeCaliberChange.bind(this, option)}>{option.label}</Checkbox>
                                //                         </Col>
                                //                     );
                                //                 })
                                //             }
                                //         </Row>
                                //     </div>
                                // </div>
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
                        treeMessModalVisible
                            ? (
                                <TreeMessModal
                                    {...this.props}
                                    {...this.state}
                                    onCancel={this.handleCancelTreeMessModal.bind(this)}
                                />
                            ) : ''
                    }
                    { // 苗木结缘弹窗展示树木信息
                        adoptTreeModalVisible
                            ? (
                                <AdoptTreeMessModal
                                    {...this.props}
                                    {...this.state}
                                    onCancel={this.handleCancelAdoptTreeMessModal.bind(this)} />
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
    /* 细班选择处理 */
    _handleAreaSelect = async (keys, info) => {
        const {
            areaLayerList,
            realThinClassLayerList
        } = this.state;
        const {
            dashboardCompomentMenu
        } = this.props;
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
                areaLayerList[v].map((layer) => {
                    me.map.removeLayer(layer);
                });
            }
            if (eventKey) {
                // 细班的key加入了标段，首先对key进行处理
                let handleKey = eventKey.split('-');
                // 如果选中的是细班，则直接添加图层
                if (handleKey.length === 5) {
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].map((layer) => {
                            layer.addTo(me.map);
                            me.map.fitBounds(layer.getBounds());
                        });
                    } else {
                    // 如果不是添加过，需要请求数据
                        await me._addAreaLayer(eventKey);
                    }
                }
                if (dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement') {
                    let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                    let selectSectionNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                    if (me.tileTreeLayerBasic) {
                        me.map.removeLayer(me.tileTreeLayerBasic);
                    }
                    me.handleRemoveRealThinClassLayer();
                    if (realThinClassLayerList[eventKey]) {
                        realThinClassLayerList[eventKey].addTo(me.map);
                    } else {
                        var url = FOREST_GIS_TREETYPE_API +
                        `/geoserver/xatree/wms?cql_filter=No+LIKE+%27%25${selectNo}%25%27%20and%20Section+LIKE+%27%25${selectSectionNo}%25%27`;
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
    _addAreaLayer = async (eventKey) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            console.log('eventKey', eventKey);
            let coords = await handleAreaLayerData(eventKey, getTreearea);
            console.log('coords2', coords);
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    let message = {
                        key: 3,
                        type: 'Feature',
                        properties: {name: '', type: 'area'},
                        geometry: { type: 'Polygon', coordinates: treearea }
                    };
                    let layer = this._createMarker(message);
                    if (i === coords.length - 1) {
                        this.map.fitBounds(layer.getBounds());
                    }
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].push(layer);
                    } else {
                        areaLayerList[eventKey] = [layer];
                    }
                }
                this.setState({
                    areaLayerList
                });
            };
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }
    // 搜索之后的养护任务数据
    handleCuringTaskSearchData = (searchData) => {
        this.setState({
            curingTaskSrarchData: searchData
        }, () => {
            this.handleCuringTaskTypeAddLayer();
        });
    }
    // 养护任务选择类型
    handleCuringTaskTypeButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleCuringTaskTypeAddLayer();
            });
        } catch (e) {
            console.log('handleCuringTaskTypeButton', e);
        }
    }
    // 加载某个类型的养护任务图层
    handleCuringTaskTypeAddLayer = () => {
        const {
            curingTaskSrarchData
        } = this.state;
        const {
            curingTaskTree
        } = this.props;
        try {
            let checkedKeys = [];
            this.handleRemoveAllCuringTaskLayer();
            this.curingTaskTypeOptions.map((option) => {
                if (this.state[option.id]) {
                    checkedKeys.push(option.label);
                }
            });
            let checkedData = [];
            if (curingTaskSrarchData) {
                checkedData = curingTaskSrarchData;
            } else {
                checkedData = curingTaskTree;
            }
            checkedData.map((curingTaskData) => {
                checkedKeys.map((checkedKey) => {
                    if (curingTaskData && curingTaskData.Name === checkedKey) {
                        let children = curingTaskData.children;
                        children.forEach((child, index) => {
                            if (index === children.length - 1) {
                                this.handleCuringTaskAddLayer(child, true);
                            } else {
                                this.handleCuringTaskAddLayer(child, false);
                            }
                        });
                    }
                });
            });
        } catch (e) {

        }
    }
    // 处理每个任务图层加载，如果之前加载过，直接加载之前的，否则重新获取
    handleCuringTaskAddLayer = async (task, isFocus) => {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskRealLayerList
        } = this.state;
        let eventKey = task.ID;
        if (curingTaskPlanLayerList[eventKey]) {
            curingTaskPlanLayerList[eventKey].map((layer) => {
                layer.addTo(this.map);
                if (isFocus) {
                    this.map.fitBounds(layer.getBounds());
                }
            });
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].map((layer) => {
                    layer.addTo(this.map);
                });
            }
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].map((layer) => {
                    layer.addTo(this.map);
                    if (isFocus) {
                        this.map.fitBounds(layer.getBounds());
                    }
                });
            }
        } else {
            // 如果不是添加过，需要请求数据
            this.getCuringTaskWkt(task, eventKey, isFocus);
        }
    }
    // 获取养护任务的计划和实际区域
    getCuringTaskWkt = async (taskMess, eventKey, isFocus) => {
        try {
            if (taskMess.Status === 2) {
                let realWkt = taskMess.WKT || '';
                if (realWkt) {
                    this._handleCuringTaskWkt(realWkt, eventKey, taskMess, 'real', isFocus);
                }
            } else {
                let planWkt = taskMess.PlanWKT;
                if (planWkt) {
                    this._handleCuringTaskWkt(planWkt, eventKey, taskMess, 'plan', isFocus);
                }
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
                            this._handleCuringRealCoordLayer(str, task, eventKey, index, isFocus);
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
                    this._handleCuringRealCoordLayer(str, task, eventKey, 1, isFocus);
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
            curingTaskMarkerLayerList
        } = this.state;
        const {
            curingTypes,
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let message = handleCuringTaskMess(str, taskMess, totalThinClass, curingTypes, bigTreeList);
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
            // // 多选的话，只需要聚焦最后一个
            // if (isFocus) {
            //     this.map.fitBounds(layer.getBounds());
            // }
            // // 如果是一个任务多个区域的话，只在最后一个任务显示任务总结
            // if (!index) {
            //     return;
            // }
            // 设置任务中间的图标
            let centerData = layer.getCenter();
            let iconType = L.divIcon({
                className: getIconType(message.properties.typeName)
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
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].push(marker);
            } else {
                curingTaskMarkerLayerList[eventKey] = [marker];
            }
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                this.map.fitBounds(layer.getBounds());
            }
            this.setState({
                curingTaskMarkerLayerList
            });
        } catch (e) {
            console.log('处理str', e);
        }
    }
    // 添加实际养护区域图层
    _handleCuringRealCoordLayer (str, task, eventKey, index, isFocus) {
        const {
            curingTaskRealLayerList,
            curingTaskMarkerLayerList
        } = this.state;
        const {
            curingTypes,
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let message = handleCuringTaskMess(str, task, totalThinClass, curingTypes, bigTreeList);
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
            // // 多选的话，只需要聚焦最后一个
            // if (isFocus) {
            //     this.map.fitBounds(layer.getBounds());
            // }
            // // 如果是一个任务多个区域的话，只在最后一个任务显示任务总结
            // if (!index) {
            //     return;
            // }
            // 设置任务中间的图标
            let centerData = layer.getCenter();
            let iconType = L.divIcon({
                className: getIconType(message.properties.typeName)
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
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].push(marker);
            } else {
                curingTaskMarkerLayerList[eventKey] = [marker];
            }
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                this.map.fitBounds(layer.getBounds());
            }
            this.setState({
                curingTaskMarkerLayerList
            });
        } catch (e) {
            console.log('Realstr', e);
        }
    }
    // 切换到成活率模块后对成活率标段数据进行处理
    getSurvivalRateRateDataDefault = () => {
        let survivalRateRateData = this.handleSurvivalRateRateData();
        this.setState({
            survivalRateRateData,
            switchSurvivalRateFirst: true
        });
    }
    // 成活率选择标段
    _handleSurvivalRateCheck = async (keys, info) => {
        const {
            switchSurvivalRateFirst
        } = this.state;
        try {
            let queryData = '';
            for (let i = 0; i < keys.length; i++) {
                if (keys.length > 0 && keys[i] !== '全部') {
                    let eventKey = keys[i];
                    let eventKeyArr = eventKey.split('-');
                    if (eventKeyArr && eventKeyArr.length === 3) {
                        queryData = queryData + `'` + eventKey + `'`;
                        if (i < keys.length - 1) {
                            queryData = queryData + ',';
                        }
                    }
                }
            }
            // 如果queryData最后一位为逗号，则去除最后一位的逗号
            let data = queryData.substr(queryData.length - 1, 1);
            if (data === ',') {
                queryData = queryData.substr(0, queryData.length - 1);
            }
            // 在选择标段数据后，将首次切换至成活率字段改为false
            if (switchSurvivalRateFirst) {
                this.setState({
                    switchSurvivalRateFirst: false
                });
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
                this.getSurvivalRateRateData();
            });
        } catch (e) {
            console.log('handleSurvivalRateButton', e);
        }
    }
    // 在获取成活率数据处理后，加载图层
    getSurvivalRateRateData = () => {
        let survivalRateRateData = this.handleSurvivalRateRateData();
        this.setState({
            survivalRateRateData
        }, () => {
            this.addSurvivalRateLayer();
        });
    }
    // 根据选择的成活范围对成活率数据进行处理
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
        return survivalRateRateData;
    }
    // 成活率加载图层
    addSurvivalRateLayer = async () => {
        const {
            survivalRateSectionData,
            survivalRateRateData,
            switchSurvivalRateFirst
        } = this.state;
        try {
            await this.removeTileTreeLayerBasic();
            await this.removeTileTreeSurvivalRateLayer();
            let url = '';
            // 之前任意一种状态存在 都可以进行搜索
            // if (survivalRateRateData && survivalRateSectionData) {
            //     url = FOREST_GIS_TREETYPE_API +
            //     `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
            // } else if (survivalRateRateData && !survivalRateSectionData) {
            //     url = FOREST_GIS_TREETYPE_API +
            //     `/geoserver/xatree/wms?cql_filter=${survivalRateRateData}`;
            // } else if (!survivalRateRateData && survivalRateSectionData) {
            //      url = FOREST_GIS_TREETYPE_API +
            //      `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})`;
            // }
            // 初次进入成活率模块，没有对标段数据进行处理，选择了范围数据直接对图层进行更改
            if (switchSurvivalRateFirst) {
                url = FOREST_GIS_TREETYPE_API +
                `/geoserver/xatree/wms?cql_filter=${survivalRateRateData}`;
            } else if (survivalRateRateData && survivalRateSectionData) {
                // 在点击过标段数据之后，只有两种状态都存在，才能进行搜索
                url = FOREST_GIS_TREETYPE_API +
                `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
            }
            if (url) {
                this.tileSurvivalRateLayerFilter = L.tileLayer.wms(url,
                    {
                        layers: 'xatree:survivalrate',
                        crs: L.CRS.EPSG4326,
                        format: 'image/png',
                        maxZoom: 22,
                        transparent: true
                    }
                ).addTo(this.map);
            } else {
                // await this.getTileTreeSurvivalRateBasic();
            }
        } catch (e) {
            console.log('addSurvivalRateLayer', e);
        }
    }
    // 加载苗木结缘图层
    _handleAdoptCheck = async (adoptTrees) => {
        const {
            adoptTreeDataList,
            adoptTreeMarkerLayerList
        } = this.state;
        try {
            for (let t in adoptTreeMarkerLayerList) {
                this.map.removeLayer(adoptTreeMarkerLayerList[t]);
            }
            if (adoptTrees && adoptTrees instanceof Array && adoptTrees.length > 0) {
                for (let i = 0; i < adoptTrees.length; i++) {
                    let adoptTree = adoptTrees[i];
                    let ID = adoptTree.ID;
                    let iconType = L.divIcon({
                        className: getIconType('adopt')
                    });
                    let adoptTreeMarkerLayer = L.marker([adoptTree.Y, adoptTree.X], {
                        icon: iconType
                        // title: adoptTree.SXM // 如果有title字段  无法点击图标 进行查询树木信息的操作
                    });
                    adoptTreeMarkerLayer.addTo(this.map);
                    adoptTreeDataList[ID] = adoptTree;
                    adoptTreeMarkerLayerList[ID] = adoptTreeMarkerLayer;
                    this.setState({
                        adoptTreeDataList,
                        adoptTreeMarkerLayerList
                    });
                    if (i === 0) {
                        this.map.panTo([adoptTree.Y, adoptTree.X]);
                    }
                }
            }
        } catch (e) {
            console.log('_handleAdoptCheck', e);
        }
    }
    // 定位至点击树种所在位置
    _handleAdoptSelect = async (keys, info) => {
        const {
            adoptTreeDataList
        } = this.state;
        try {
            const eventKey = keys[0];
            let data = adoptTreeDataList[eventKey];
            this.map.panTo([data.Y, data.X]);
        } catch (e) {
            console.log('_handleAdoptSelect', e);
        }
    }
    // 切换为2D
    toggleTileLayer (index) {
        this.tileLayer.setUrl(TILEURLS[index]);
        this.setState({
            TileLayerUrl: TILEURLS[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            } else if (geo.properties.type === 'planCuringTask') {
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
    // 退出隐患详情查看
    _handleCancelVisible () {
        this.setState({
            isShowRisk: false
        });
    }
    // 根据点击的地图坐标与实际树的定位进行对比,根据树节点获取树节点信息
    getSxmByLocation (x, y, that, type) {
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
        let zoom = that.map.getZoom();
        let resolution = resolutions[zoom];
        let col = (x + 180) / resolution;
        // 林总说明I和J必须是整数
        let colp = Math.floor(col % 256);
        // let colp = col % 256;
        col = Math.floor(col / 256);
        let row = (90 - y) / resolution;
        // 林总说明I和J必须是整数
        let rowp = Math.floor(row % 256);
        // let rowp = row % 256;
        row = Math.floor(row / 256);
        let url =
            FOREST_GIS_API +
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
        if (type === 'geojsonFeature_survivalRate') {
            url =
            FOREST_GIS_API +
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
        }
        jQuery.getJSON(url, null, async function (data) {
            if (data.features && data.features.length) {
                if (type === 'treeMess') {
                    await that.setState({
                        treeMessModalVisible: true,
                        treeMessModalLoading: true
                    });
                    await that.getTreeMessData(data, x, y);
                    await that.handleOkTreeMessModal(data, x, y);
                } else if (type === 'geojsonFeature_survivalRate') {
                    that.getSurvivalRateInfo(data, x, y);
                } else if (type === 'geojsonFeature_treeAdopt') {
                    let adoptTreeMess = await that.getTreeAdoptInfo(data, x, y);
                    if (adoptTreeMess) {
                        await that.setState({
                            adoptTreeModalVisible: true,
                            adoptTreeModalLoading: true
                        });
                        await that.getTreeMessData(data, x, y);
                        await that.handleOkAdoptTreeMessModal();
                    }
                }
            }
        });
    }
    // 获取树木详情信息
    getTreeMessData = async (data, x, y) => {
        const {
            actions: {
                getTreeflows,
                getNurserys,
                getCarpackbysxm,
                getTreeMess,
                getCuringTreeInfo,
                getCuringTypes,
                getCuringMessage,
                getForestUserDetail,
                getUserDetail,
                getOrgTreeByCode,
                getTreeLocation,
                getTreeLocationCoord,
                getLocationNameByCoordinate
            },
            platform: {
                tree = {}
            },
            curingTypes,
            dashboardTreeMess
        } = this.props;
        try {
            let postdata = {
                sxm: data.features[0].properties.SXM
                // sxm: 'CAF2578'
            };
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let queryTreeData = await getTreeMess(postdata);
            if (!queryTreeData) {
                queryTreeData = {};
            }
            let treeflowDatas = {};
            // 树木审批流程信息
            if (dashboardTreeMess === 'treeMess') {
                treeflowDatas = await getTreeflows({}, postdata);
            }
            // 苗圃数据
            let nurserysDatas = await getNurserys({}, postdata);
            // 车辆打包数据
            let carData = await getCarpackbysxm(postdata);
            // 养护树木信息
            let curingTreeData = await getCuringTreeInfo({}, postdata);
            // 获取树的地理坐标信息
            let treeLocationData = await getTreeLocationCoord(postdata);

            let curingTypeArr = [];
            if (!curingTypes) {
                let curingTypesData = await getCuringTypes();
                curingTypeArr = curingTypesData && curingTypesData.content;
            } else {
                curingTypeArr = curingTypes;
            };

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
                let regionData = getThinClassName(No, queryTreeData.Section, totalThinClass, bigTreeList);
                SmallClassName = regionData.SmallName;
                ThinClassName = regionData.ThinName;
            }

            let treeflowData = [];
            let nurserysData = {};
            let curingTaskData = [];
            let curingTaskArr = [];
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
            if (
                curingTreeData && curingTreeData.content && curingTreeData.content instanceof Array &&
                        curingTreeData.content.length > 0
            ) {
                let content = curingTreeData.content;
                content.map((task) => {
                    if (curingTaskArr.indexOf(task.CuringID) === -1) {
                        curingTaskData.push(task);
                        curingTaskArr.push(task.CuringID);
                    }
                });
            }
            // 根据苗圃的起苗坐标获取起苗地址
            let nurserysAddressData = await handleGetAddressByCoordinate(nurserysData.location, getLocationNameByCoordinate);
            let nurserysAddressName = (nurserysAddressData && nurserysAddressData.regeocode && nurserysAddressData.regeocode.formatted_address) || '';
            nurserysData.nurserysAddressName = nurserysAddressName;
            // 根据树木的定位坐标获取定位地址
            let location = '';
            if (treeLocationData && treeLocationData.X && treeLocationData.Y) {
                location = `${treeLocationData.X},${treeLocationData.Y}`;
            }
            console.log('location', location);
            queryTreeData.locationCoord = location;
            // let treeAddressData = await handleGetAddressByCoordinate(location, getLocationNameByCoordinate);
            // let queryTreeAddressName = (treeAddressData && treeAddressData.regeocode && treeAddressData.regeocode.formatted_address) || '';
            // queryTreeData.queryTreeAddressName = queryTreeAddressName;

            let seedlingMess = getSeedlingMess(queryTreeData, carData, nurserysData);
            let treeMess = getTreeMessFun(SmallClassName, ThinClassName, queryTreeData, nurserysData, bigTreeList);
            for (let i = 0; i < treeflowData.length; i++) {
                let userForestData = await getForestUserDetail({id: treeflowData[i].FromUser});
                if (userForestData && userForestData.PK) {
                    let userEcidiData = await getUserDetail({pk: userForestData.PK});
                    let orgCode = userEcidiData && userEcidiData.account && userEcidiData.account.org_code;
                    let parent = await getCompanyDataByOrgCode(orgCode, getOrgTreeByCode);
                    let companyName = parent.name;
                    treeflowData[i].companyName = companyName;
                    treeflowData[i].orgData = parent;
                }
            }
            let flowMess = treeflowData;
            let curingMess = await getCuringMess(curingTaskData, curingTypeArr, getCuringMessage);
            this.setState({
                seedlingMess,
                treeMess,
                flowMess,
                curingMess
            });
        } catch (e) {
            console.log('getTreeMessData', e);
        }
    }
    // 显示苗木信息Modal 和 图标
    handleOkTreeMessModal (data, x, y) {
        try {
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let postdata = {
                    sxm: data.features[0].properties.SXM
                    // sxm: 'AUT9860'
                };
                if (this.state.treeMarkerLayer) {
                    this.map.removeLayer(this.state.treeMarkerLayer);
                }
                let iconType = L.divIcon({
                    className: getIconType('tree')
                });
                let treeMarkerLayer = L.marker([y, x], {
                    icon: iconType,
                    title: postdata.sxm
                });
                treeMarkerLayer.addTo(this.map);
                this.setState({
                    treeMarkerLayer,
                    // treeMessModalVisible: true,
                    treeMessModalLoading: false
                });
            }
        } catch (e) {

        }
    }
    // 苗木信息Modal关闭
    handleCancelTreeMessModal () {
        this.handleModalMessData();
        this.setState({
            treeMessModalVisible: false,
            treeMessModalLoading: true
        });
    }
    // 点击地图上的区域的成活率
    async getSurvivalRateInfo (data, x, y) {
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        const {
            survivalRateMarkerLayerList
        } = this.state;
        let totalThinClass = tree.totalThinClass || [];
        try {
            let bigTreeList = (tree && tree.bigTreeList) || [];
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let properties = data.features[0].properties;
                for (let i in survivalRateMarkerLayerList) {
                    this.map.removeLayer(survivalRateMarkerLayerList[i]);
                }
                let areaData = getThinClassName(properties.no, properties.Section, totalThinClass, bigTreeList);
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
                let survivalRateLayer = L.popup()
                    .setLatLng([y, x])
                    .setContent(genPopUpContent(iconData))
                    .addTo(this.map);
                // let survivalRateLayer = this._createMarker(iconData);
                survivalRateMarkerLayerList[properties.ID] = survivalRateLayer;
                this.setState({
                    survivalRateMarkerLayerList
                });
            }
        } catch (e) {
            console.log('getSurvivalRateInfo', e);
        }
    }
    // 获取苗木结缘信息
    getTreeAdoptInfo = async (data, x, y) => {
        const {
            actions: {
                getAdoptTrees
            }
        } = this.props;
        try {
            let adoptTreeMess = '';
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let postdata = {
                    sxm: data.features[0].properties.SXM
                };
                let adoptData = await getAdoptTrees({}, postdata);
                let content = (adoptData && adoptData.content) || [];
                if (content && content.length > 0) {
                    adoptTreeMess = content[0];
                    this.setState({
                        adoptTreeMess
                    });
                }
            }
            return adoptTreeMess;
        } catch (e) {
            console.log('getTreeAdoptInfo', e);
        }
    }
    // 显示苗木结缘Modal
    handleOkAdoptTreeMessModal () {
        this.setState({
            adoptTreeModalLoading: false
        });
    }
    // 关闭苗木结缘Modal
    handleCancelAdoptTreeMessModal () {
        this.handleModalMessData();
        this.setState({
            adoptTreeModalVisible: false,
            adoptTreeModalLoading: true
        });
    }
    // 清除苗木结缘弹窗内用到的数据
    handleModalMessData () {
        this.setState({
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            curingMess: '',
            adoptTreeMess: ''
        });
    }
    // 定位至视图所在的坐标位置
    locationToMapCustomPosition = async (view) => {
        const {
            actions: {
                setUserMapPositionName
            }
        } = this.props;
        await setUserMapPositionName(view.name);
        // 修改地图聚焦点
        if (view && view.id && view.center && view.center instanceof Array && view.center.length > 0) {
            let center = [view.center[0].lat, view.center[0].lng];
            await this.map.panTo(center);
        } else {
            await this.map.panTo(view.center);
        }
        // await this.map.setZoom(view.zoom);
        // 因先设置直接跳转,然后直接修改放大层级，无法展示，只能在跳转坐标之后，设置时间再重新修改放大层级
        setTimeout(async () => {
            // if (view && view.id && view.center && view.center instanceof Array && view.center.length > 0) {
            //     let center = [view.center[0].lat, view.center[0].lng];
            //     await this.map.panTo(center);
            // } else {
            //     await this.map.panTo(view.center);
            // }
            await this.map.setZoom(view.zoom);
        }, 500);
    }
    // 删除选择的视图
    handleDeleteMapCustomPosition = async (view) => {
        const {
            actions: {
                deleteUserCustomView,
                getCustomViewByUserID
            }
        } = this.props;
        try {
            let postData = {
                id: view.id
            };
            let data = await deleteUserCustomView(postData);
            if (data) {
                Notification.error({
                    message: '删除视图失败',
                    duration: 3
                });
            } else {
                Notification.success({
                    message: '删除视图成功',
                    duration: 3
                });
            }
            const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
            await getCustomViewByUserID({id: user.id});
        } catch (e) {
            console.log('e', e);
        }
    }
    handleDeleteMapCustomPositionCancel = async () => {

    }
    // 获取当前视图的中心和放大层级，打开保存自定义视图弹窗
    saveUserMapCustomPosition = async () => {
        const {
            customViewByUserID = []
        } = this.props;
        if (customViewByUserID && customViewByUserID instanceof Array && customViewByUserID.length < 3) {
            let center = this.map.getCenter();
            let zoom = this.map.getZoom();
            this.setState({
                saveUserMapCustomPositionVisible: true,
                saveUserMapCustomPositionCenter: center,
                saveUserMapCustomPositionZoom: zoom
            });
        } else {
            Notification.info({
                message: '自定义视图最多为三个',
                duration: 3
            });
        }
    }
    // 关闭保存自定义视图弹窗
    handleCancelMapCustomPositionModal = async () => {
        this.setState({
            saveUserMapCustomPositionVisible: false,
            saveUserMapCustomPositionCenter: '',
            saveUserMapCustomPositionZoom: ''
        });
    }
    // 计算圈选区域面积
    _handleCreateMeasureOk = async () => {
        const {
            coordinates
        } = this.state;
        try {
            let areaMeasure = computeSignedArea(coordinates, 2);
            areaMeasure = (areaMeasure * 0.0015).toFixed(2);
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
            coordinates,
            distanceMeasureMarkerList,
            distanceMeasureLineList,
            distanceMeasureNumList
        } = this.state;
        const {
            areaDistanceMeasureMenu
        } = this.props;
        let me = this;
        // 计算距离
        if (areaDistanceMeasureMenu === 'distanceMeasureMenu') {
            if (Object.keys(distanceMeasureMarkerList).length > 0) {
                me.map.removeLayer(distanceMeasureMarkerList[Object.keys(distanceMeasureMarkerList)[Object.keys(distanceMeasureMarkerList).length - 1]]);
                delete distanceMeasureMarkerList[Object.keys(distanceMeasureMarkerList)[Object.keys(distanceMeasureMarkerList).length - 1]];
            }
            if (Object.keys(distanceMeasureLineList).length > 0) {
                me.map.removeLayer(distanceMeasureLineList[Object.keys(distanceMeasureLineList)[Object.keys(distanceMeasureLineList).length - 1]]);
                delete distanceMeasureLineList[Object.keys(distanceMeasureLineList)[Object.keys(distanceMeasureLineList).length - 1]];
            }
            distanceMeasureNumList.pop();
            let totalDistanceMeasure = 0;
            distanceMeasureNumList.map((distance) => {
                totalDistanceMeasure = (Number(totalDistanceMeasure) +
                    Number(distance) + 0).toFixed(2);
            });
            coordinates.pop();
            me.setState({
                distanceMeasureMarkerList,
                distanceMeasureLineList,
                totalDistanceMeasure,
                distanceMeasureNumList,
                coordinates
            });
        } else if (areaDistanceMeasureMenu === 'areaMeasureMenu') {
            // 计算面积
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
    }
    // 选择是测量面积还是距离
    handleSwitchMeasureMenu = async (type) => {
        const {
            actions: {
                switchAreaDistanceMeasureMenu
            },
            areaDistanceMeasureMenu
        } = this.props;
        await switchAreaDistanceMeasureMenu(type);
        if (areaDistanceMeasureMenu && areaDistanceMeasureMenu !== type) {
            await this.handleCloseMeasureMenu();
        }
    }
    // 撤销测量面积或者距离的图层
    handleCloseMeasureMenu = async () => {
        const {
            distanceMeasureMarkerList,
            distanceMeasureLineList,
            polygonData
        } = this.state;
        // 去除框选地图的面积图层
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        // 去除距离测量的显示的距离图层
        for (let i in distanceMeasureMarkerList) {
            this.map.removeLayer(distanceMeasureMarkerList[i]);
        }
        // 去除距离测量的各个直线的图层
        for (let i in distanceMeasureLineList) {
            this.map.removeLayer(distanceMeasureLineList[i]);
        }
        this.setState({
            coordinates: [],
            polygonData: '',
            areaMeasure: 0,
            areaMeasureVisible: false,
            totalDistanceMeasure: 0,
            distanceMeasureNumList: [],
            distanceMeasureLineList: {},
            distanceMeasureMarkerList: {}
        });
    }
    // 管网类型选中
    pipeTypeChange = () => {

    }
    // 管网口径选中
    pipeCaliberChange = () => {

    }
}
export default Form.create()(OnSite);
