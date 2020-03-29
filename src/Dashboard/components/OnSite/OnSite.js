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
 * @Last Modified time: 2020-03-29 13:38:34
 */
import React, { Component } from 'react';
import {
    Button,
    Form
} from 'antd';
import L from 'leaflet';
import Scrollbar from 'smooth-scrollbar';
import './OnSite.less';
import AreaTree from './Area/AreaTree';
import RiskTree from './Risk/RiskTree';
import TrackTree from './Track/TrackTree';
import TreeTypeTree from './TreeType/TreeTypeTree';
import TreeMessGisOnClickHandle from './TreeMess/TreeMessGisOnClickHandle';
import CuringTaskTree from './Conservation/CuringTaskTree';
import SurvivalRateTree from './SurvivalRate/SurvivalRateTree';
import TreeAdoptTree from './Adopt/TreeAdoptTree';
import TreeTransferTree from './TreeTransfer/TreeTransferTree';
import GetMenuTree from './GetMenuTree';
import TreePipePage from './TreePipe/TreePipePage';
import AreaDistanceMeasure from './AreaDistanceMeasure/AreaDistanceMeasure';
import ViewPositionManage from './MapCustom/ViewPositionManage';
import DeviceTree from './Device/DeviceTree';
import DataVIew from './DataView/DataVIew';
import MenuSwitch from '../MenuSwitch';
import {
    fillAreaColor,
    handleCoordinates
} from '../auth';
import {
    FOREST_GIS_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import {handleAreaLayerData} from '_platform/gisAuth';
import {getUser} from '_platform/auth';

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

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            actions: {
                getCustomViewByUserID
            }
        } = this.props;
        try {
            // if (document.querySelector('#mapid')) {
            //     Scrollbar.init(document.querySelector('#mapid'));
            // };
            // Scrollbar.initAll();
            let user = getUser();
            await getCustomViewByUserID({ id: user.ID });
            await this.initMap();
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    /* 初始化地图 */
    initMap () {
        const {
            customViewByUserID = []
        } = this.props;
        try {
            // 地图默认配置
            let mapInitialization = INITLEAFLET_API;
            // 根据用户的自定义视图来查看聚焦点
            if (customViewByUserID && customViewByUserID instanceof Array && customViewByUserID.length > 0) {
                let view = customViewByUserID[0];
                let center = [view.Lat, view.Lng];
                let zoom = view.Zoom;
                mapInitialization.center = center;
                mapInitialization.zoom = zoom;
            };
            mapInitialization.crs = L.CRS.EPSG4326;
            mapInitialization.attributionControl = false;
            this.map = L.map('mapid', mapInitialization);
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 12,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
                minZoom: 12,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 加载苗木图层
            this.getTileLayerTreeBasic();
            // 加载秋冬季的细班图层
            this.getTileTreeWinterThinClassLayerBasic();
            // 获取秋冬季的区块范围
            this.getTileTreeWinterProjectLayerBasic();
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 切换全部细班时，将其余图层去除，加载最初始图层
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            dashboardCompomentMenu,
            dashboardAreaTreeLayer
        } = this.props;
        if (!dashboardCompomentMenu && prevProps.dashboardCompomentMenu) {
            await this.getTileLayerTreeBasic();
        }
        // 在各个菜单之间切换时需要处理的图层
        if (dashboardCompomentMenu && dashboardCompomentMenu !== prevProps.dashboardCompomentMenu) {
            // 去除各个模块切换的图层，其他模块的图层在退出模块时自动去除，辅助管理的图层在主文件中
            if (dashboardCompomentMenu &&
                dashboardCompomentMenu !== 'geojsonFeature_auxiliaryManagement'
            ) {
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
    }
    // 获取初始化数据的树木瓦片图层
    getTileLayerTreeBasic = () => {
        if (this.map) {
            if (this.tileTreeLayerBasic) {
                this.tileTreeLayerBasic.addTo(this.map);
            } else {
                this.tileTreeLayerBasic = L.tileLayer(
                    FOREST_GIS_API +
                    '/geoserver/gwc/service/wmts?layer=xatree%3Anewtreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                    {
                        opacity: 1.0,
                        subdomains: [1, 2, 3],
                        minZoom: 12,
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
                        minZoom: 12,
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
                        minZoom: 12,
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
    // 细班选择处理
    _handleAreaSelect = async (keys, info) => {
        const {
            areaLayerList,
            realThinClassLayerList
        } = this.state;
        const {
            dashboardCompomentMenu
        } = this.props;
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
                    this.map.removeLayer(layer);
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
                            layer.addTo(this.map);
                            this.map.fitBounds(layer.getBounds());
                        });
                    } else {
                        // 如果不是添加过，需要请求数据
                        await this._addAreaLayer(eventKey);
                    }
                }
                if (dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement') {
                    let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                    let selectSectionNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                    if (this.tileTreeLayerBasic) {
                        this.map.removeLayer(this.tileTreeLayerBasic);
                    }
                    this.handleRemoveRealThinClassLayer();
                    if (realThinClassLayerList[eventKey]) {
                        realThinClassLayerList[eventKey].addTo(this.map);
                    } else {
                        var url = FOREST_GIS_API +
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
            let coordsList = await handleAreaLayerData(eventKey, getTreearea);
            if (coordsList && coordsList instanceof Array && coordsList.length > 0) {
                for (let t = 0; t < coordsList.length; t++) {
                    let coords = coordsList[t];
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
                    };
                }
                this.setState({
                    areaLayerList
                });
            }
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
            console.log('_createMarker', e);
        }
    }
    render () {
        const {
            dashboardCompomentMenu,
            dashboardTreeMess,
            areaDistanceMeasureMenu,
            dashboardDataMeasurement,
            dashboardRightMenu,
            dashboardDataView,
            dashboardFocus,
            platform: {
                tabs = {},
                tree = {}
            }
        } = this.props;
        const {
            mapLayerBtnType
        } = this.state;
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
                    className={
                        areaDistanceMeasureMenu === 'areaMeasureMenu'
                            ? 'dashboard-map-area r-main'
                            : 'dashboard-map r-main'
                    }
                    id='onSiteDom'
                >
                    <MenuSwitch {...this.props} {...this.state} map={this.map} />
                    <GetMenuTree {...this.props} {...this.state} />
                    <div className='dashboard-gisTypeBut'>
                        <div>
                            <a
                                onClick={this.toggleTileLayer.bind(this, 1)}
                                className={
                                    mapLayerBtnType
                                        ? 'dashboard-gisTypeButSel'
                                        : 'dashboard-gisTypeButUnSel'}>
                                卫星图
                            </a>
                            <a
                                onClick={this.toggleTileLayer.bind(this, 2)}
                                className={
                                    mapLayerBtnType
                                        ? 'dashboard-gisTypeButUnSel'
                                        : 'dashboard-gisTypeButSel'}>
                                地图
                            </a>
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
                    { // 右侧菜单当选择区域地块时，显示区域地块树
                        dashboardRightMenu && dashboardRightMenu === 'area'
                            ? (
                                <AreaTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                    treeData={onSiteAreaTreeData || []}
                                    // selectedKeys={this.state.areaEventKey}
                                    onSelect={this._handleAreaSelect.bind(this)}
                                />
                            ) : ''
                    }
                    {// 右侧菜单当选择区域地块时，显示区域地块树
                        dashboardDataView && dashboardDataView === 'dataView'
                            ? (
                                <DataVIew
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                    treeData={onSiteAreaTreeData || []}
                                />
                            ) : ''
                    }
                    { // 视图管理
                        dashboardFocus && dashboardFocus === 'mapFoucs'
                            ? (
                                <ViewPositionManage
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 树种筛选
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_treetype'
                            ? (
                                <TreeTypeTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                    removeTileTreeLayerBasic={this.removeTileTreeLayerBasic.bind(this)}
                                    getTileLayerTreeBasic={this.getTileLayerTreeBasic.bind(this)}
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
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_survivalRate'
                            ? (
                                <SurvivalRateTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 安全隐患
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_risk'
                            ? (
                                <RiskTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 养护任务
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_curingTask'
                            ? (
                                <CuringTaskTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    { // 灌溉管网
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_treePipe'
                            ? (
                                <TreePipePage
                                    map={this.map}
                                    {...this.props}
                                    {...this.state}

                                />
                            ) : ''
                    }
                    { // 机械
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_device'
                            ? (
                                <DeviceTree
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
                    {
                        // 树木信息
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_treeAdopt'
                            ? (
                                <TreeAdoptTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                    {
                        // 苗木迁移
                        dashboardCompomentMenu && dashboardCompomentMenu === 'geojsonFeature_treeTransfer'
                            ? (
                                <TreeTransferTree
                                    {...this.props}
                                    {...this.state}
                                    map={this.map}
                                />
                            ) : ''
                    }
                </div>
            </div>
        );
    }
}
export default Form.create()(OnSite);
