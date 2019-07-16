import React, { Component } from 'react';
import { Button, Row } from 'antd';
import L from 'leaflet';
import './AuxiliaryAcceptanceGis.less';
import {
    getUser,
    getAreaTreeData
} from '_platform/auth';
import {
    FOREST_GIS_API,
    TILEURLS,
    INITLEAFLET_API,
    WMSTILELAYERURL
} from '_platform/api';
import AreaTree from './AreaTree';
import {
    handleAreaRealLayerData,
    handleCoordinates,
    fillAreaColor,
    getHandleWktData,
    computeSignedArea,
    getSmallThinNameByThinClassData,
    getSectionNameBySection,
    getProjectNameBySection
} from '_platform/gisAuth';
import AuxiliaryAcceptanceModal from './AuxiliaryAcceptanceModal';

export default class AuxiliaryAcceptanceGis extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 270 /* 菜单宽度 */,
            mapLayerBtnType: true,
            selectedMenu: '1',
            areaTreeLoading: false,
            areaLayerList: {}, // 区域地块图层list
            realThinClassLayerList: {}, // 实际细班种植图层
            createBtnVisible: false, // 确定，后退，撤销的visible
            coordinates: [], // 圈选地图的坐标数组
            polygonData: '', // 圈选地图图层
            auxiliaryModalVisible: false, // modal的visible
            noLoading: true, // modal的loading效果
            areaEventKey: '',
            selectProjectName: '',
            selectSectionNo: '',
            selectSectionName: '',
            selectThinClassNo: '',
            selectThinClassName: '',
            treeNum: 0,
            treeTypeNumDatas: []

        };
        this.tileLayer = null;
        this.tileTreeLayerBasic = null;
    }

    async componentDidMount () {
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        this.user = getUser();
        let sections = this.user.sections;
        this.sections = JSON.parse(sections);
        if (this.sections && this.sections instanceof Array && this.sections.length > 0) {
            this.section = this.sections[0];
        }
        try {
            // 初始化地图
            await this._initMap();
            // 获取地块树数据
            if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0) {
                this.setState({
                    areaTreeLoading: false
                });
            } else {
                await this._loadAreaData();
            }
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    /* 初始化地图 */
    _initMap () {
        let me = this;
        let mapInitialization = INITLEAFLET_API;
        mapInitialization.crs = L.CRS.EPSG4326;
        this.map = L.map('mapid', mapInitialization);
        // 加载基础图层
        this.tileLayer = L.tileLayer(TILEURLS[1], {
            subdomains: [1, 2, 3], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 地图上边的地点的名称
        L.tileLayer(WMSTILELAYERURL, {
            subdomains: [1, 2, 3],
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 加载树图层
        this.getTileLayer2();
        // 地图点击事件
        this.map.on('click', function (e) {
            const {
                coordinates,
                createBtnVisible,
                areaEventKey
            } = me.state;
            if (!areaEventKey) {
                return;
            }
            coordinates.push([e.latlng.lat, e.latlng.lng]);
            if (coordinates.length > 2 && !createBtnVisible) {
                me.setState({
                    createBtnVisible: true
                });
            }
            if (me.state.polygonData) {
                me.map.removeLayer(me.state.polygonData);
            }
            let polygonData = L.polygon(coordinates, {
                color: 'white',
                fillColor: 'red',
                fillOpacity: 0.5
            }).addTo(me.map);
            me.setState({
                coordinates,
                polygonData: polygonData
            });
        });
    }
    // 获取树图层
    getTileLayer2 = () => {
        if (this.tileTreeLayerBasic) {
            this.tileTreeLayerBasic.addTo(this.map);
        } else {
            this.tileTreeLayerBasic = L.tileLayer(
                FOREST_GIS_API +
                        '/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(this.map);
        }
    }
    // 获取地块树数据
    async _loadAreaData () {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            }
        } = this.props;
        try {
            this.setState({
                areaTreeLoading: true
            });
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];

            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                areaTreeLoading: false
            });
        } catch (e) {
            console.log(e);
        }
    }
    render () {
        const {
            platform: {
                tabs = {},
                tree = {}
            }
        } = this.props;
        const {
            createBtnVisible,
            coordinates,
            auxiliaryModalVisible
        } = this.state;
        // 计算面积的确定按钮是否可以点击，如果不形成封闭区域，不能点击
        let createBtnOkDisplay = false;
        if (coordinates.length <= 2) {
            createBtnOkDisplay = true;
        }
        // 计算面积的上一步按钮是否可以点击，如果没有点，不能点击
        let createBtnBackDisplay = false;
        if (coordinates.length <= 0) {
            createBtnBackDisplay = true;
        }
        return (
            <div className='AuxiliaryAcceptanceGis-container'>
                <div
                    className='AuxiliaryAcceptanceGis-map AuxiliaryAcceptanceGis-r-main'
                >
                    <div
                        className={`AuxiliaryAcceptanceGis-menuPanel`}
                        style={
                            this.state.menuIsExtend
                                ? {
                                    transform: 'translateX(0)',
                                    width: this.state.menuWidth
                                }
                                : {
                                    transform: `translateX(-${
                                        this.state.menuWidth
                                    }px)`,
                                    width: this.state.menuWidth
                                }
                        }
                    >
                        <aside className='AuxiliaryAcceptanceGis-aside' draggable='false'>
                            <div className='AuxiliaryAcceptanceGis-asideTree'>
                                <AreaTree
                                    {...this.props}
                                    {...this.state}
                                    treeData={tree.thinClassTree || []}
                                    onSelect={this._handleAreaSelect.bind(this)}
                                />
                            </div>
                        </aside>
                        {this.state.menuIsExtend ? (
                            <div
                                className='AuxiliaryAcceptanceGis-foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this._extendAndFold.bind(this)}
                            >
                                收起
                            </div>
                        ) : (
                            <div
                                className='AuxiliaryAcceptanceGis-foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this._extendAndFold.bind(this)}
                            >
                                展开
                            </div>
                        )}
                    </div>
                    { // 框选面积的画图按钮
                        createBtnVisible ? (
                            <div className='AuxiliaryAcceptanceGis-editPolygonLayout'>
                                <div>
                                    <Row>
                                        <Button type='primary' style={{marginBottom: 10}} disabled={createBtnOkDisplay} onClick={this._handleCreateBtnOk.bind(this)}>确定</Button>
                                    </Row>
                                    <Row>
                                        <Button type='info' style={{marginBottom: 10}} disabled={createBtnBackDisplay} onClick={this._handleCreateBtnRetreat.bind(this)}>后退</Button>
                                    </Row>
                                    <Row>
                                        <Button type='danger' onClick={this._handleCreateBtnCancel.bind(this)}>撤销</Button>
                                    </Row>
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        auxiliaryModalVisible ? (
                            <AuxiliaryAcceptanceModal
                                {...this.props}
                                {...this.state}
                                onOk={this.handleAuxiliaryModalOk.bind(this)}
                                onCancel={this.handleAuxiliaryModalCancel.bind(this)}
                            />
                        ) : ''
                    }
                    <div className='AuxiliaryAcceptanceGis-treeControl'>
                        <div>
                            <Button
                                type={
                                    this.state.mapLayerBtnType
                                        ? 'primary'
                                        : 'info'
                                }
                                onClick={this._toggleTileLayer.bind(this, 1)}
                            >
                                卫星图
                            </Button>
                            <Button
                                type={
                                    this.state.mapLayerBtnType
                                        ? 'info'
                                        : 'primary'
                                }
                                onClick={this._toggleTileLayer.bind(this, 2)}
                            >
                                地图
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div
                            style={
                                this.state.selectedMenu === '1' &&
                                this.state.isNotThree
                                    ? {}
                                    : { display: 'none' }
                            }
                        >
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
            for (let i in realThinClassLayerList) {
                me.map.removeLayer(realThinClassLayerList[i]);
            }
            if (eventKey) {
                // 细班的key加入了标段，首先对key进行处理
                let handleKey = eventKey.split('-');
                // 如果选中的是细班，则直接添加图层
                if (handleKey.length === 5) {
                    const treeNodeName = info && info.node && info.node.props && info.node.props.title;
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求

                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].map((layer) => {
                            layer.addTo(me.map);
                            me.map.fitBounds(layer.getBounds());
                        });
                    } else {
                    // 如果不是添加过，需要请求数据
                        await me._addAreaLayer(eventKey, treeNodeName);
                    }
                }

                // 实际定位数据
                let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                if (me.tileTreeLayerBasic) {
                    me.map.removeLayer(me.tileTreeLayerBasic);
                }

                if (realThinClassLayerList[eventKey]) {
                    realThinClassLayerList[eventKey].addTo(me.map);
                } else {
                    var url = FOREST_GIS_API +
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
            } else {
                this.getTileLayer2();
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
            let coords = await handleAreaRealLayerData(eventKey, treeNodeName, getTreearea);
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    let message = {
                        key: 3,
                        type: 'Feature',
                        properties: {name: treeNodeName, type: 'area'},
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
    /* 菜单展开收起 */
    _extendAndFold () {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }
    // 切换为2D
    _toggleTileLayer (index) {
        this.tileLayer.setUrl(TILEURLS[index]);
        this.setState({
            TileLayerUrl: TILEURLS[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
    // 计算圈选区域面积
    _handleCreateBtnOk = async () => {
        const {
            coordinates,
            areaEventKey
        } = this.state;
        const {
            actions: {
                getTreeTypeStatByRegion
            },
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            this.setState({
                auxiliaryModalVisible: true
            });
            let thinClassTree = tree.thinClassTree;
            // 坐标
            let wkt = '';
            // 选择面积
            let regionArea = 0;
            wkt = 'POLYGON(';
            // 获取手动框选坐标wkt
            wkt = wkt + getHandleWktData(coordinates);
            wkt = wkt + ')';
            regionArea = computeSignedArea(coordinates, 2);
            regionArea = regionArea * 0.0015;

            let areaEventKeyArr = areaEventKey.split('-');
            let selectSectionNo = areaEventKeyArr[0] + '-' + areaEventKeyArr[1] + '-' + areaEventKeyArr[2];
            let selectThinClassNo = areaEventKeyArr[0] + '-' + areaEventKeyArr[1] + '-' + areaEventKeyArr[3] + '-' + areaEventKeyArr[4];

            console.log('selectSectionNo', selectSectionNo);
            console.log('thinClassTree', thinClassTree);
            console.log('selectThinClassNo', selectThinClassNo);
            let selectProjectName = getProjectNameBySection(selectSectionNo, thinClassTree);
            let selectSectionName = getSectionNameBySection(selectSectionNo, thinClassTree);
            let selectThinClassName = getSmallThinNameByThinClassData(areaEventKey, thinClassTree);
            console.log('selectProjectName', selectProjectName);
            console.log('selectSectionName', selectSectionName);
            console.log('selectThinClassName', selectThinClassName);
            let postData = {
                section: selectSectionNo,
                no: selectThinClassNo,
                wkt: wkt
            };
            let treeTypeNumDatas = await getTreeTypeStatByRegion({}, postData);
            console.log('treeTypeNumDatas', treeTypeNumDatas);
            let treeNum = 0;
            treeTypeNumDatas.map((data) => {
                if (data && data.Num) {
                    treeNum = treeNum + data.Num;
                }
            });
            this.setState({
                wkt,
                regionArea,
                noLoading: false,
                selectProjectName,
                selectSectionNo,
                selectSectionName,
                selectThinClassNo,
                selectThinClassName,
                treeNum,
                treeTypeNumDatas
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    // 圈选地图后退
    _handleCreateBtnRetreat = async () => {
        const {
            coordinates
        } = this.state;
        let me = this;
        if (me.state.polygonData) {
            me.map.removeLayer(me.state.polygonData);
        }
        // this.setState({
        //     areaMeasureVisible: false
        // });
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
    _handleCreateBtnCancel = async () => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        this.setState({
            createBtnVisible: false,
            coordinates: []
        });
    }
    // 打开更新细班弹窗
    handleAuxiliaryModalOk = async () => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        this.resetModalState();
        this.resetButState();
    }
    // 关闭更新细班弹窗
    handleAuxiliaryModalCancel = async () => {
        this.resetModalState();
    }
    // 取消更新细班信息时清空之前存储的state
    resetModalState = () => {
        this.setState({
            auxiliaryModalVisible: false,
            noLoading: true,
            wkt: ''
        });
    }
    // 取消圈选和按钮的功能
    resetButState = () => {
        this.setState({
            createBtnVisible: false,
            polygonData: '',
            coordinates: []
        });
    }
}
