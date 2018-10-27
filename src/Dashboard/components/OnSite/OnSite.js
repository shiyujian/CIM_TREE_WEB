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
 * @Last Modified time: 2018-10-27 10:13:38
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
import OnSiteAreaTree from './OnSiteAreaTree';
import TreeMessModal from './TreeMessModal';
import CuringTaskTree from './CuringTaskTree';
import SurvivalRateTree from './SurvivalRateTree';
import TreeAdoptTree from './TreeAdoptTree';
import AdoptTreeMessModal from './AdoptTreeMessModal';
import GetMenuTree from './GetMenuTree';
import {
    genPopUpContent,
    getIconType,
    fillAreaColor,
    getTaskThinClassName,
    getThinClassName,
    getSectionName,
    getAreaData,
    handleAreaLayerData,
    handleCoordinates,
    handleCuringTaskMess
} from '../auth';
import {
    computeSignedArea
} from '_platform/gisAuth';
import {
    getSeedlingMess,
    getTreeMessFun,
    getCuringMess
} from './TreeInfo';
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
// 安全隐患类型图片
import riskDangerImg from './RiskImg/danger.png';
import riskQualityImg from './RiskImg/quality.png';
import riskOtherImg from './RiskImg/other.png';
// 养护任务类型图片
import curingTaskDrainImg from './CuringTaskImg/drain.png';
import curingTaskFeedImg from './CuringTaskImg/feed.png';
import curingTaskOtherImg from './CuringTaskImg/other.png';
import curingTaskReplantingImg from './CuringTaskImg/replanting.png';
import curingTaskTrimImg from './CuringTaskImg/trim.png';
import curingTaskWateringImg from './CuringTaskImg/watering.png';
import curingTaskWeedImg from './CuringTaskImg/weed.png';
import curingTaskWormImg from './CuringTaskImg/worm.png';

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
            treeMessModalVisible: false,
            seedlingMess: '', // 树木信息
            treeMess: '', // 苗木信息
            flowMess: '', // 流程信息
            curingMess: '', // 养护信息
            markers: null, // 点击节点图标
            // 区域地块
            areaEventKey: '', // 区域地块选中节点的key
            areaEventTitle: '', // 区域地块选中节点的name
            // 地图圈选
            areaRadioValue: '全部细班',
            coordinates: [],
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

            adoptTreeMarkerLayerList: {}, // 苗木结缘图标List
            adoptTreeDataList: {}, // 苗木结缘数据List
            // 成活率选项
            survivalRateRateData: '',
            survivalRateSectionData: '',
            // 苗木结缘弹窗
            adoptTreeModalVisible: false,
            adoptTreeMess: '',
            // 成活率范围的点击状态，展示是否选中的图片
            survivalRateHundred: true,
            survivalRateNinety: true,
            survivalRateEighty: true,
            survivalRateSeventy: true,
            survivalRateSixty: true,
            survivalRateFifty: true,
            survivalRateFourty: true,
            // 安全隐患类型的点击状态，展示是否选中的图片
            riskTypeQuality: false,
            riskTypeDanger: false,
            riskTypeOther: false,
            // 养护任务类型的点击状态，展示是否选中的图片
            curingTaskFeed: false,
            curingTaskDrain: false,
            curingTaskReplanting: false,
            curingTaskWorm: false,
            curingTaskTrim: false,
            curingTaskWeed: false,
            curingTaskWatering: false,
            curingTaskOther: false,
            // 子组件搜索的树数据
            riskSrarchData: '',
            curingTaskSrarchData: ''
        };
        this.tileLayer = null; // 最底部基础图层
        this.tileTreeLayerBasic = null; // 树木区域图层
        this.tileTreeSurvivalRateLayerBasic = null; // 成活率全部图层
        this.tileTreeAdoptLayerBasic = null; // 苗木结缘全部图层

        this.tileTreeTypeLayerFilter = null; // 树种筛选图层
        this.tileSurvivalRateLayerFilter = null; // 成活率范围和标段筛选图层
        this.map = null;
        this.userDetailList = {}; // 人员信息List
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    // 左侧菜单栏的Tree型数据
    options = [
        // {
        //     label: '区域地块',
        //     value: 'geojsonFeature_treeMess'
        // },
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
    // 安全隐患类型
    riskTypeOptions = [
        {
            id: 'riskTypeQuality',
            label: '质量缺陷',
            img: riskQualityImg
        },
        {
            id: 'riskTypeDanger',
            label: '安全隐患',
            img: riskDangerImg
        },
        {
            id: 'riskTypeOther',
            label: '其他',
            img: riskOtherImg
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
    // 初始化地图，获取目录树数据
    async componentDidMount () {
        await this.initMap();
    }
    // 切换全部细班时，将其余图层去除，加载最初始图层
    componentDidUpdate = async (prevProps, prevState) => {
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
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate') {
                // 选择成活率菜单
                await this.removeTileTreeLayerBasic();
                await this.getTileTreeSurvivalRateBasic();
            } else if (dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
                await this.removeTileTreeLayerBasic();
                await this.getTileTreeAdoptBasic();
            } else {
                await this.getTileLayerTreeBasic();
            }
        }
        // 去除树图层
        if (
            dashboardAreaTreeLayer && dashboardAreaTreeLayer === 'removeTileTreeLayerBasic' &&
            prevProps.dashboardAreaTreeLayer !== dashboardAreaTreeLayer
        ) {
            this.removeTileTreeLayerBasic();
        }
        // 加载树图层
        // 需要考虑选择实际定位时，需要获取筛选图层
        // 需要考虑选择成活率时，需要获取成活率图层
        // 需要考虑取消选择某个菜单时，不能回复原状，完成展示效果
        if (
            dashboardAreaTreeLayer && dashboardAreaTreeLayer === 'tileTreeLayerBasic' &&
            prevProps.dashboardAreaTreeLayer !== dashboardAreaTreeLayer &&
            dashboardCompomentMenu !== 'geojsonFeature_survivalRate' &&
            dashboardCompomentMenu !== 'geojsonFeature_treetype' &&
            dashboardCompomentMenu !== 'geojsonFeature_auxiliaryManagement' &&
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
                coordinates
            } = me.state;
            const {
                dashboardCompomentMenu,
                dashboardAreaMeasure
            } = me.props;
            if (dashboardAreaMeasure === 'areaMeasure') {
                coordinates.push([e.latlng.lat, e.latlng.lng]);
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
            } else if (dashboardCompomentMenu === 'geojsonFeature_treeMess') {
                // getThinClass(e.latlng.lng,e.latlng.lat);
                me.getSxmByLocation(e.latlng.lng, e.latlng.lat, me, 'geojsonFeature_treeMess');
            } else if (dashboardCompomentMenu === 'geojsonFeature_survivalRate') {
                me.getSxmByLocation(e.latlng.lng, e.latlng.lat, me, 'geojsonFeature_survivalRate');
            } else if (dashboardCompomentMenu === 'geojsonFeature_treeAdopt') {
                me.getSxmByLocation(e.latlng.lng, e.latlng.lat, me, 'geojsonFeature_treeAdopt');
            }
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
    // 加载苗木结缘全部瓦片图层
    getTileTreeAdoptBasic = () => {
        if (this.tileTreeAdoptLayerBasic) {
            this.tileTreeAdoptLayerBasic.addTo(this.map);
        } else {
            this.tileTreeAdoptLayerBasic = L.tileLayer(
                window.config.DASHBOARD_ONSITE +
                '/geoserver/gwc/service/wmts?layer=xatree%3Aalladopttree&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                // '/geoserver/gwc/service/wmts?layer=xatree%3Aadopttree&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
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
    // 去除苗木结缘全部瓦片图层
    removeTileTreeAdoptLayer = () => {
        if (this.tileTreeAdoptLayerBasic) {
            this.map.removeLayer(this.tileTreeAdoptLayerBasic);
        }
    }
    // 去除树种筛选瓦片图层
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
            survivalRateMarkerLayerList, // 成活率图标图层List
            treeMarkerLayer,
            realThinClassLayerList,
            adoptTreeMarkerLayerList
        } = this.state;
        const {
            dashboardCompomentMenu
        } = this.props;
        try {
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_treeMess') {
                for (let v in areaLayerList) {
                    areaLayerList[v].map((layer) => {
                        this.map.removeLayer(layer);
                    });
                }
                if (treeMarkerLayer) {
                    this.map.removeLayer(treeMarkerLayer);
                }
                for (let i in realThinClassLayerList) {
                    this.map.removeLayer(realThinClassLayerList[i]);
                }
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_track') {
                this.handleRemoveAllTrackLayer();
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_risk') {
                this.handleRemoveAllRiskLayer();
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_treetype') {
                this.removeTileTreeTypeLayerFilter();
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_curingTask') {
                this.handleRemoveAllCuringTaskLayer();
            }
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_survivalRate') {
                for (let v in survivalRateMarkerLayerList) {
                    this.map.removeLayer(survivalRateMarkerLayerList[v]);
                }
                this.removeTileTreeSurvivalRateLayer();
                this.survivalRateOptions.map((option) => {
                    this.setState({
                        [option.id]: true
                    });
                });
                this.setState({
                    survivalRateSectionData: '',
                    survivalRateRateData: ''
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
    // 去除全部巡检路线图层
    handleRemoveAllTrackLayer = () => {
        const {
            trackLayerList, // 轨迹图层List
            trackMarkerLayerList // 轨迹图标图层List
        } = this.state;
        for (let v in trackLayerList) {
            this.map.removeLayer(trackLayerList[v]);
        }
        for (let v in trackMarkerLayerList) {
            this.map.removeLayer(trackMarkerLayerList[v]);
        }
    }
    // 去除全部安全隐患图层
    handleRemoveAllRiskLayer = () => {
        const {
            riskMarkerLayerList // 安全隐患图标图层List
        } = this.state;
        for (let v in riskMarkerLayerList) {
            this.map.removeLayer(riskMarkerLayerList[v]);
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
            this.map.removeLayer(curingTaskMarkerLayerList[v]);
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
                            onRemoveAllLayer={this.handleRemoveAllTrackLayer.bind(this)}
                            onLocation={this.handleTrackLocation.bind(this)}
                            onCheck={this.handleTrackCheck.bind(this)}
                            featureName={option.value}
                        />
                    );
                // 安全隐患
                case 'geojsonFeature_risk':
                    return (
                        <RiskTree
                            {...this.props}
                            onSearchData={this.handleRiskSearchData.bind(this)}
                            featureName={option.value}
                        />
                    );
                // 树种筛选
                case 'geojsonFeature_treetype':
                    return (
                        <TreeTypeTree
                            {...this.props}
                            onCheck={this.handleTreeTypeCheck.bind(this)}
                            featureName={option.value}
                            treetypes={treetypes}
                        />
                    );
                // 养护任务
                case 'geojsonFeature_curingTask':
                    return (
                        <CuringTaskTree
                            {...this.props}
                            onSearchData={this.handleCuringTaskSearchData.bind(this)}
                        />
                    );
                // 成活率
                case 'geojsonFeature_survivalRate':
                    return (
                        <SurvivalRateTree
                            {...this.props}
                            onCheck={this._handleSurvivalRateCheck.bind(this)}
                        />
                    );
                // 成活率
                case 'geojsonFeature_treeAdopt':
                    return (
                        <TreeAdoptTree
                            {...this.props}
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
            adoptTreeModalVisible
        } = this.state;
        const {
            dashboardCompomentMenu,
            menuTreeVisible,
            dashboardAreaMeasure,
            dashboardRightMenu,
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
        let createMeasureOkDisplay = false;
        if (coordinates.length <= 2) {
            createMeasureOkDisplay = true;
        }
        // 计算面积的上一步按钮是否可以点击，如果没有点，不能点击
        let createMeasureBackDisplay = false;
        if (coordinates.length <= 0) {
            createMeasureBackDisplay = true;
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
                    {
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
                                <div className='dashboard-menuSwitchRiskTypeLayout'>
                                    {
                                        this.riskTypeOptions.map((option) => {
                                            return (
                                                <div style={{display: 'inlineBlock', marginTop: 10}} key={option.id}>
                                                    <img src={option.img}
                                                        title={option.label}
                                                        className='dashboard-rightMenuRiskTypeImgLayout' />
                                                    <a className={this.state[option.id] ? 'dashboard-rightMenuRiskTypeSelLayout' : 'dashboard-rightMenuRiskTypeUnSelLayout'}
                                                        title={option.label}
                                                        key={option.id}
                                                        onClick={this.handleRiskTypeButton.bind(this, option)} />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            ) : ''
                    }
                    { // 养护任务右侧类型菜单
                        dashboardCompomentMenu === 'geojsonFeature_curingTask'
                            ? (
                                <div className='dashboard-menuSwitchCuringTaskTypeLayout'>
                                    {
                                        this.curingTaskTypeOptions.map((option) => {
                                            return (
                                                <div style={{display: 'inlineBlock', marginTop: 5}} key={option.id}>
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
                            ) : ''
                    }
                    { // 框选面积的画图按钮
                        dashboardAreaMeasure === 'areaMeasure' ? (
                            <div className='dashboard-editPolygonLayout'>
                                <div>
                                    <Button type='primary' style={{marginRight: 10}} disabled={createMeasureOkDisplay} onClick={this._handleCreateMeasureOk.bind(this)}>确定</Button>
                                    <Button type='info' style={{marginRight: 10}} disabled={createMeasureBackDisplay} onClick={this._handleCreateMeasureRetreat.bind(this)}>上一步</Button>
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
                        treeMessModalVisible
                            ? (
                                <TreeMessModal
                                    {...this.props}
                                    {...this.state}
                                    onCancel={this.handleCancelTreeMessModal.bind(this)}
                                />
                            ) : ''
                    }
                    {
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
                    if (me.tileTreeLayerBasic) {
                        me.map.removeLayer(me.tileTreeLayerBasic);
                    }
                    me.handleRemoveRealThinClassLayer();
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
    _addAreaLayer = async (eventKey) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            let coords = await handleAreaLayerData(eventKey, getTreearea);
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
    // 搜索人员姓名定位
    handleTrackLocation = async (ckeckedData) => {
        try {
            this.handleRemoveAllTrackLayer();
            ckeckedData.forEach((child, index) => {
                if (index === ckeckedData.length - 1) {
                    this.handleTrackAddLayer(child, true);
                } else {
                    this.handleTrackAddLayer(child, false);
                }
            });
        } catch (e) {
            console.log('handleTrackLocation', e);
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
                    let user = {};
                    if (this.userDetailList[data.PatrolerUser.PK]) {
                        user = this.userDetailList[data.PatrolerUser.PK];
                    } else {
                        user = await getUserDetail({pk: data.PatrolerUser.PK});
                        this.userDetailList[data.PatrolerUser.PK] = user;
                    };
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
    // 搜索之后的安全隐患数据
    handleRiskSearchData = (srarchData) => {
        this.setState({
            riskSrarchData: srarchData
        }, () => {
            this.handleRiskTypeAddLayer();
        });
    }
    // 安全隐患选择类型
    handleRiskTypeButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleRiskTypeAddLayer();
            });
        } catch (e) {
            console.log('handleRiskTypeButton', e);
        }
    }
    handleRiskTypeAddLayer = async () => {
        const {
            riskSrarchData,
            riskMarkerLayerList
        } = this.state;
        const {
            riskTree
        } = this.props;
        try {
            let checkedKeys = [];
            this.handleRemoveAllRiskLayer();
            this.riskTypeOptions.map((option) => {
                if (this.state[option.id]) {
                    checkedKeys.push(option.label);
                }
            });
            let checkedData = [];
            if (riskSrarchData) {
                checkedData = riskSrarchData;
            } else {
                checkedData = riskTree;
            }
            checkedData.map((riskData) => {
                checkedKeys.map((checkedKey) => {
                    if (riskData && riskData.key === checkedKey) {
                        let children = riskData.children;
                        children.forEach((riskData, index) => {
                            if (riskMarkerLayerList[riskData.key]) {
                                riskMarkerLayerList[riskData.key].addTo(this.map);
                            } else {
                                riskMarkerLayerList[riskData.key] = this._createMarker(riskData);
                            }
                            if (index === children.length - 1) {
                                this.map.panTo(riskData.geometry.coordinates);
                            }
                        });
                        this.setState({
                            riskMarkerLayerList
                        });
                    }
                });
            });
        } catch (e) {

        }
    }
    /* 树种筛选多选树节点 */
    handleTreeTypeCheck = async (keys, info) => {
        let queryData = '';
        let selectAllStatus = false;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === '全部') {
                selectAllStatus = true;
            }
            // 字符串中不获取‘全部’的字符串
            if (keys[i] > 6 && keys[i] !== '全部') {
                queryData = queryData + keys[i];
                if (i < keys.length - 1) {
                    queryData = queryData + ',';
                }
            }
        }
        // 如果选中全部，并且最后一位为逗号，则去除最后一位的逗号
        if (selectAllStatus) {
            let data = queryData.substr(queryData.length - 1, 1);
            if (data === ',') {
                queryData = queryData.substr(0, queryData.length - 1);
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
    // 搜索之后的养护任务数据
    handleCuringTaskSearchData = (srarchData) => {
        this.setState({
            curingTaskSrarchData: srarchData
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
            console.log('handleRiskTypeButton', e);
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
                curingTaskMarkerLayerList[eventKey].addTo(this.map);
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
            let message = handleCuringTaskMess(str, taskMess, totalThinClass, curingTypes);
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
            // // 如果是一个任务多个区域的话，只在最后一个任务显示任务总结
            // if (!index) {
            //     return;
            // }
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
            let message = handleCuringTaskMess(str, task, totalThinClass, curingTypes);
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
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                this.map.fitBounds(layer.getBounds());
            }
            // // 如果是一个任务多个区域的话，只在最后一个任务显示任务总结
            // if (!index) {
            //     return;
            // }
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
            console.log('Realstr', e);
        }
    }
    // 成活率选择标段
    _handleSurvivalRateCheck = async (keys, info) => {
        try {
            let queryData = '';
            for (let i = 0; i < keys.length; i++) {
                if (keys.length > 0 && keys[i] !== '全部') {
                    let eventKey = keys[i];
                    if (eventKey.indexOf('-') !== -1) {
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
    // 成活率选择成活范围后对数据进行处理
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
            // 之前任意一种状态存在 都可以进行搜索
            // if (survivalRateRateData && survivalRateSectionData) {
            //     url = window.config.DASHBOARD_TREETYPE +
            //     `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
            // } else if (survivalRateRateData && !survivalRateSectionData) {
            //     url = window.config.DASHBOARD_TREETYPE +
            //     `/geoserver/xatree/wms?cql_filter=${survivalRateRateData}`;
            // } else if (!survivalRateRateData && survivalRateSectionData) {
            //     url = window.config.DASHBOARD_TREETYPE +
            //     `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})`;
            // }
            // 只有两种状态都存在，才能进行搜索
            if (survivalRateRateData && survivalRateSectionData) {
                url = window.config.DASHBOARD_TREETYPE +
                `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
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
                    // let popupData = {
                    //     type: 'adoptTree',
                    //     key: adoptTree.ID,
                    //     properties: {
                    //         ID: adoptTree.ID,
                    //         Aadopter: adoptTree.Aadopter,
                    //         AdoptTime: adoptTree.AdoptTime,
                    //         CreateTime: adoptTree.CreateTime,
                    //         EndTime: adoptTree.EndTime,
                    //         SXM: adoptTree.SXM,
                    //         StartTime: adoptTree.StartTime,
                    //         type: 'adoptTree'
                    //     },
                    //     geometry: {
                    //         type: 'Point',
                    //         coordinates: [adoptTree.Y, adoptTree.X]
                    //     }
                    // };
                    // adoptTreeMarkerLayer.bindPopup(
                    //     L.popup({ maxWidth: 240 }).setContent(
                    //         genPopUpContent(popupData)
                    //     )
                    // );
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
        if (type === 'geojsonFeature_survivalRate') {
            url =
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
        }
        jQuery.getJSON(url, null, async function (data) {
            if (data.features && data.features.length) {
                if (type === 'geojsonFeature_treeMess') {
                    await that.getTreeMessData(data, x, y);
                    await that.handleOkTreeMessModal(data, x, y);
                } else if (type === 'geojsonFeature_survivalRate') {
                    that.getSurvivalRateInfo(data, x, y);
                } else if (type === 'geojsonFeature_treeAdopt') {
                    let adoptTreeMess = await that.getTreeAdoptInfo(data, x, y);
                    if (adoptTreeMess) {
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
                getOrgTreeByCode
            },
            platform: {
                tree = {}
            },
            curingTypes,
            dashboardCompomentMenu
        } = this.props;
        try {
            let postdata = {
                sxm: data.features[0].properties.SXM
                // sxm: 'ATH0619'
            };
            let totalThinClass = tree.totalThinClass || [];
            let queryTreeData = await getTreeMess(postdata);
            let treeflowDatas = {};
            if (dashboardCompomentMenu === 'geojsonFeature_treeMess') {
                treeflowDatas = await getTreeflows({}, postdata);
            }
            let nurserysDatas = await getNurserys({}, postdata);
            let carData = await getCarpackbysxm(postdata);
            let curingTreeData = await getCuringTreeInfo({}, postdata);
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
                let regionData = getThinClassName(No, queryTreeData.Section, totalThinClass);
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
            let seedlingMess = getSeedlingMess(queryTreeData, carData, nurserysData);
            let treeMess = getTreeMessFun(SmallClassName, ThinClassName, queryTreeData, nurserysData);
            for (let i = 0; i < treeflowData.length; i++) {
                let userForestData = await getForestUserDetail({id: treeflowData[i].FromUser});
                let userEcidiData = await getUserDetail({pk: userForestData.PK});
                let orgCode = userEcidiData && userEcidiData.account && userEcidiData.account.org_code;
                let parent = await getCompanyDataByOrgCode(orgCode, getOrgTreeByCode);
                let companyName = parent.name;
                treeflowData[i].companyName = companyName;
                treeflowData[i].orgData = parent;
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
                    treeMessModalVisible: true
                });
            }
        } catch (e) {

        }
    }
    // 苗木信息Modal关闭
    handleCancelTreeMessModal () {
        this.handleModalMessData();
        this.setState({
            treeMessModalVisible: false
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
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let properties = data.features[0].properties;
                for (let i in survivalRateMarkerLayerList) {
                    this.map.removeLayer(survivalRateMarkerLayerList[i]);
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
                let survivalRateLayer = this._createMarker(iconData);
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
            adoptTreeModalVisible: true
        });
    }
    // 关闭苗木结缘Modal
    handleCancelAdoptTreeMessModal () {
        this.handleModalMessData();
        this.setState({
            adoptTreeModalVisible: false
        });
    }
    handleModalMessData () {
        this.setState({
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            curingMess: '',
            adoptTreeMess: ''
        });
    }
}
export default Form.create()(OnSite);
