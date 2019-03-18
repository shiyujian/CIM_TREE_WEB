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
 * @Last Modified time: 2019-03-18 11:18:38
 */
import React, { Component } from 'react';
import {
    Button,
    Form
} from 'antd';
import './OnSite.less';
import RiskTree from './Risk/RiskTree';
import TrackTree from './Track/TrackTree';
import TreeTypeTree from './TreeType/TreeTypeTree';
import OnSiteAreaTree from './OnSiteAreaTree';
import TreeMessGisOnClickHandle from './TreeMess/TreeMessGisOnClickHandle';
import CuringTaskTree from './Curing/CuringTaskTree';
import SurvivalRateTree from './SurvivalRate/SurvivalRateTree';
import TreeAdoptTree from './Adopt/TreeAdoptTree';
import GetMenuTree from './GetMenuTree';
import TreePipePage from './TreePipe/TreePipePage';
import AreaDistanceMeasure from './AreaDistanceMeasure/AreaDistanceMeasure';
import ViewPositionManage from './MapCustom/ViewPositionManage';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from '../auth';
import {
    FOREST_GIS_API,
    FOREST_GIS_TREETYPE_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import MenuSwitch from '../MenuSwitch';

window.config = window.config || {};
class OnSite extends Component {
    // export default class OnSite extends Component {
    constructor (props) {
        super(props);
        this.state = {
            mapLayerBtnType: true, // 切换卫星图和地图
            // 区域地块
            areaEventKey: '', // 区域地块选中节点的key
            areaEventTitle: '', // 区域地块选中节点的name
            // 图层数据List
            areaLayerList: {}, // 区域地块图层list
            realThinClassLayerList: {} // 实际细班种植图层
        };
        this.tileLayer = null; // 最底部基础图层
        this.tileTreeLayerBasic = null; // 树木区域图层
        this.tileTreeAdoptLayerBasic = null; // 苗木结缘全部图层
        this.tileTreeWinterThinClassLayerBasic = null;
        this.tileTreeWinterProjectLayerBasic = null;

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
        }
    ];

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
            let mapInitialization = INITLEAFLET_API;
            if (customViewByUserID && customViewByUserID instanceof Array && customViewByUserID.length > 0) {
                let view = customViewByUserID[0];
                let center = [view.center[0].lat, view.center[0].lng];
                let zoom = view.zoom;
                mapInitialization.center = center;
                mapInitialization.zoom = zoom;
            };
            this.map = L.map('mapid', mapInitialization);
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
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 切换全部细班时，将其余图层去除，加载最初始图层
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            dashboardCompomentMenu,
            dashboardAreaTreeLayer,
            platform: {
                tabs = {}
            }
        } = this.props;
        // 在各个菜单之间切换时需要处理的图层
        if (dashboardCompomentMenu && dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            // 去除各个模块切换的图层，其他模块的图层在退出模块时自动去除，辅助管理的图层在主文件中
            if (dashboardCompomentMenu && dashboardCompomentMenu !== 'geojsonFeature_auxiliaryManagement') {
                await this.handleRemoveRealThinClassLayer();
            }
            // 选择苗木结缘  成活率  灌溉管网时 需要将基本树木图层去除
            if (dashboardCompomentMenu === 'geojsonFeature_treeAdopt' ||
                dashboardCompomentMenu === 'geojsonFeature_survivalRate' ||
                dashboardCompomentMenu === 'geojsonFeature_treePipe'
            ) {
                await this.removeTileTreeLayerBasic();
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
                // 苗木结缘
                case 'geojsonFeature_treeAdopt':
                    return (
                        <TreeAdoptTree
                            {...this.props}
                            {...this.state}
                            map={this.map}
                        />
                    );
            }
        }
    }
    render () {
        const {
            dashboardCompomentMenu,
            dashboardTreeMess,
            menuTreeVisible,
            dashboardDataMeasurement,
            dashboardRightMenu,
            dashboardFocus,
            platform: {
                tabs = {},
                tree = {}
            }
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
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
                                <ViewPositionManage
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 数据测量
                        dashboardDataMeasurement && dashboardDataMeasurement === 'dataMeasurement'
                            ? (
                                <AreaDistanceMeasure
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 成活率
                        dashboardCompomentMenu === 'geojsonFeature_survivalRate'
                            ? (
                                <SurvivalRateTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 安全隐患
                        dashboardCompomentMenu === 'geojsonFeature_risk'
                            ? (
                                <RiskTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 养护任务
                        dashboardCompomentMenu === 'geojsonFeature_curingTask'
                            ? (
                                <CuringTaskTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 灌溉管网
                        dashboardCompomentMenu === 'geojsonFeature_treePipe'
                            ? (
                                <TreePipePage
                                    map={this.map}
                                    {...this.props}
                                    {...this.state}

                                />
                            ) : ''
                    }
                    { // 树木信息
                        dashboardTreeMess && dashboardTreeMess === 'dashboardTreeMess'
                            ? (
                                <TreeMessGisOnClickHandle
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    <div className='dashboard-gisTypeBut'>
                        <div>
                            <Button
                                type={
                                    this.state.mapLayerBtnType
                                        ? 'primary'
                                        : 'default'
                                }
                                onClick={this.toggleTileLayer.bind(this, 1)}
                            >
                                卫星图
                            </Button>
                            <Button
                                type={
                                    this.state.mapLayerBtnType
                                        ? 'default'
                                        : 'primary'
                                }
                                onClick={this.toggleTileLayer.bind(this, 2)}
                            >
                                地图
                            </Button>
                        </div>
                    </div>
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
            }
        } catch (e) {
            console.log('e', e);
        }
    }
}
export default Form.create()(OnSite);
