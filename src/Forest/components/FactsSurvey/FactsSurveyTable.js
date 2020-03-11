import React, { Component } from 'react';
import {
    Button,
    Notification,
    Spin,
    Tree
} from 'antd';
import XLSX from 'xlsx';
import L from 'leaflet';
import 'leaflet-editable';
import Scrollbar from 'smooth-scrollbar';
import { getUser } from '_platform/auth';
import {
    FOREST_GIS_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API,
    DOCEXPORT_API,
    TREEPIPEEXPORTSECTIONS,
    TREEPIPEEXPORTPERSONS
} from '_platform/api';
import {
    handleAreaLayerData,
    fillAreaColor,
    handleCoordinates,
    computeSignedArea,
    handlePolygonLatLngs,
    handlePolylineLatLngs,
    getHandleWktData,
    handlePOLYGONWktData
} from '_platform/gisAuth';
import './FactsSurveyTable.less';
import decoration from './FactsSurveyImg/decoration.png';
import hide from './FactsSurveyImg/hide2.png';
import display from './FactsSurveyImg/display2.png';

const TreeNode = Tree.TreeNode;

export default class FactsSurveyTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isSuperAdmin: false,
            section: '',
            areaLayerList: {},
            createBtnVisible: false,
            loading: false,
            permission: false,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 665, /* 菜单宽度 */
            pointsData: [],
            linesData: [],
            polygonsData: [],
            layerList: {},
            investigationLoading: false
        };
        this.tileTreeLayerBasic = null;
        this.tileLayerTreeFilter = null;
        this.tileTreePipeBasic = null;
        this.tileLayerTreeThinClass = null;
        this.tileTreePipeNodeBasic = null;
        this.editPolygon = null;
    }
    componentWillMount () {
        let userData = getUser();
        let userSection = userData.section;
        let permission = false;
        if (userData.username === 'admin') {
            permission = true;
        } else if (userSection) {
            // permission = true;
            // 需要判断用户当前标段有无签约，是否有权限
            TREEPIPEEXPORTSECTIONS.map((companyData) => {
                if (companyData && companyData.section && companyData.section === userSection) {
                    TREEPIPEEXPORTPERSONS.map((person) => {
                        if (person.username === userData.username) {
                            permission = true;
                        }
                    });
                }
            });
        }
        console.log('userData', userData);

        this.setState({
            permission: permission
        });
    }
    componentDidMount () {
        let userData = getUser();
        let userSection = userData.section;
        console.log('用户的标段', this.userSection);
        if (userData.username === 'admin') {
            this.setState({
                isSuperAdmin: true,
                section: ''
            }, () => {
                // 初始化地图
                this.initMap();
            });
        } else if (userSection) {
            this.setState({
                isSuperAdmin: false,
                section: userSection || ''
            }, () => {
                // 初始化地图
                this.initMap();
            });
        }
        if (document.querySelector('#FactsSurveyAsideDom')) {
            let FactsSurveyAsideDom = Scrollbar.init(document.querySelector('#FactsSurveyAsideDom'));
            console.log('FactsSurveyAsideDom', FactsSurveyAsideDom);
        }
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        const {
            isSuperAdmin,
            section
        } = this.state;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            if (isSuperAdmin || section) {
                await this.handleGetInvestigationTypes(leftkeycode);
                await this.handleGetInvestigationPoints(leftkeycode);
                await this.handleGetInvestigationLines(leftkeycode);
                await this.handleGetInvestigationPolygons(leftkeycode);
            }
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        try {
            await map.off('mouseup', this.handleMapMeasureClickFunction);
            await map.off('click', this.handleMapMeasureClickFunction);
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    initMap = async () => {
        const {
            section,
            isSuperAdmin
        } = this.state;
        // 基础设置
        let mapInitialization = INITLEAFLET_API;
        mapInitialization.crs = L.CRS.EPSG4326;
        mapInitialization.attributionControl = false;
        this.map = L.map('mapid', mapInitialization);
        // 基础图层
        this.tileLayer = L.tileLayer(TILEURLS[1], {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 道路图层
        L.tileLayer(WMSTILELAYERURL, {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 加载苗木图层
        // await this.getTileLayerTreeBasic();
        // 灌溉管网下的树木图层
        // await this.getTileLayerTreeFilter();
        // 树种区域图层
        await this.getTileLayerTreeThinClass();
        // 加载灌溉管网图层
        await this.getTreePipeLayer();
        // 加载灌溉管网图层
        await this.getTreePipeNodeLayer();
        if (section || isSuperAdmin) {
            this.editPolygon = this.map.editTools.startPolygon();
        } else {
            Notification.error({
                message: '当前用户未关联标段，请重新切换用户'
            });
        }
        await this.map.on('mouseup', this.handleMapMeasureClickFunction);
        await this.map.on('click', this.handleMapMeasureClickFunction);
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
                        minZoom: 10,
                        maxZoom: 21,
                        storagetype: 0,
                        tiletype: 'wtms'
                    }
                ).addTo(this.map);
            }
        }
    }
    // 灌溉管网下的树木图层
    getTileLayerTreeFilter = async => {
        try {
            this.tileLayerTreeFilter = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Aland&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(this.map);
        } catch (e) {
            console.log('getTileLayerTreeFilter', e);
        }
    }
    // 灌溉管网下的细班图层
    getTileLayerTreeThinClass = async => {
        try {
            this.tileLayerTreeThinClass = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Athinclass&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(this.map);
        } catch (e) {
            console.log('getTileLayerTreeThinClass', e);
        }
    }
    // 加载灌溉管网图层
    getTreePipeLayer = async () => {
        try {
            // this.tileTreePipeBasic = L.tileLayer(
            //     FOREST_GIS_API +
            //     '/geoserver/gwc/service/wmts?layer=xatree%3Apipe&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
            //     {
            //         opacity: 1.0,
            //         subdomains: [1, 2, 3],
            //         minZoom: 10,
            //         maxZoom: 21,
            //         storagetype: 0,
            //         tiletype: 'wtms'
            //     }
            // ).addTo(this.map);
            this.tileTreePipeBasic = L.tileLayer.wms(
                FOREST_GIS_API +
                '/geoserver/xatree/wms?style=',
                {
                    layers: 'xatree:pipe',
                    crs: L.CRS.EPSG4326,
                    format: 'image/png',
                    minZoom: 11,
                    maxZoom: 21,
                    transparent: true
                }
            ).addTo(this.map);
        } catch (e) {
            console.log('getTreePipeLayer', e);
        }
    }
    // 加载灌溉管网图层
    getTreePipeNodeLayer = async () => {
        try {
            // this.tileTreePipeNodeBasic = L.tileLayer(
            //     FOREST_GIS_API +
            //     '/geoserver/gwc/service/wmts?layer=xatree%3Apipenode&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
            //     {
            //         opacity: 1.0,
            //         subdomains: [1, 2, 3],
            //         minZoom: 10,
            //         maxZoom: 21,
            //         storagetype: 0,
            //         tiletype: 'wtms'
            //     }
            // ).addTo(this.map);
            this.tileTreePipeNodeBasic = L.tileLayer.wms(
                FOREST_GIS_API +
                '/geoserver/xatree/wms?style=',
                {
                    layers: 'xatree:pipenode',
                    crs: L.CRS.EPSG4326,
                    format: 'image/png',
                    minZoom: 11,
                    maxZoom: 21,
                    transparent: true
                }
            ).addTo(this.map);
        } catch (e) {
            console.log('getTreePipeNodeLayer', e);
        }
    }
    // 获取调查类型列表
    handleGetInvestigationTypes = async (eventKey) => {
        const {
            actions: {
                getInvestigationTypes
            }
        } = this.props;
        try {
            this.setState({
                investigationLoading: true
            });
            let investigationTypes = await getInvestigationTypes();
            console.log('investigationTypes', investigationTypes);
        } catch (e) {
            console.log('handleGetInvestigationTypes', e);
        }
    }
    // 现状调查查询（点要素）
    handleGetInvestigationPoints = async (eventKey) => {
        const {
            actions: {
                getInvestigationPoints
            }
        } = this.props;
        try {
            let postData = {
                land: eventKey
            };
            let pointsData = [];
            let data = await getInvestigationPoints({}, postData);
            console.log('data', data);
            if (data && data.content && data.content instanceof Array) {
                pointsData = data.content;
            }
            this.setState({
                pointsData
            });
        } catch (e) {
            console.log('handleGetInvestigationPoints', e);
        }
    }
    // 现状调查查询（线要素）
    handleGetInvestigationLines = async (eventKey) => {
        const {
            actions: {
                getInvestigationLines
            }
        } = this.props;
        try {
            let postData = {
                land: eventKey
            };
            let linesData = [];
            let data = await getInvestigationLines({}, postData);
            console.log('data', data);
            if (data && data.content && data.content instanceof Array) {
                linesData = data.content;
            }
            this.setState({
                linesData
            });
        } catch (e) {
            console.log('handleGetInvestigationLines', e);
        }
    }
    // 现状调查查询（面要素）
    handleGetInvestigationPolygons = async (eventKey) => {
        const {
            actions: {
                getInvestigationPolygons
            }
        } = this.props;
        try {
            let postData = {
                land: eventKey
            };
            let polygonsData = [];
            let data = await getInvestigationPolygons({}, postData);
            console.log('data', data);
            if (data && data.content && data.content instanceof Array) {
                polygonsData = data.content;
            }
            this.setState({
                polygonsData,
                investigationLoading: false
            });
        } catch (e) {
            console.log('handleGetInvestigationPolygons', e);
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
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let polygon = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return polygon;
            } else if (geo.properties.type === 'line') {
                // 创建区域图形
                let polyline = L.polyline(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return polyline;
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    handleMapMeasureClickFunction = async (e) => {
        // 测量面积
        if (this.editPolygon) {
            let coordinates = handlePolygonLatLngs(this.editPolygon);
            console.log('coordinates', coordinates);
            if (coordinates.length > 2) {
                this.setState({
                    createBtnVisible: true
                });
            } else {
                this.setState({
                    createBtnVisible: false
                });
            }
        }
    }
    handleExportPipeDrawingOk = async () => {
        const {
            actions: {
                getExportPipeDrawing
            }
        } = this.props;
        const {
            section,
            isSuperAdmin
        } = this.state;
        if (this.editPolygon && (section || isSuperAdmin)) {
            this.setState({
                loading: true
            });
            let coordinates = handlePolygonLatLngs(this.editPolygon);
            console.log('coordinates', coordinates);
            let wkt = 'POLYGON(';
            // 获取手动框选坐标wkt
            wkt = wkt + getHandleWktData(coordinates);
            wkt = wkt + ')';
            console.log('wkt', wkt);
            // let postData = {
            //     bbox: wkt
            // };
            // await getExportPipeDrawing({}, postData);
            if (isSuperAdmin) {
                let downloadUrl = `${DOCEXPORT_API}?action=pipedrawing&bbox=${wkt}`;
                await this.createLink(this, downloadUrl);
                this.setState({
                    loading: false
                });
            } else {
                let downloadUrl = `${DOCEXPORT_API}?action=pipedrawing&bbox=${wkt}&section=${section}`;
                await this.createLink(this, downloadUrl);
                this.setState({
                    loading: false
                });
            }
        } else {
            Notification.error({
                message: '当前用户未关联标段，请重新切换用户'
            });
        }
    }
    createLink = async (name, url) => {
        // 下载
        let link = document.createElement('a');
        link.download = name;
        link.href = url;
        await link.setAttribute('download', this);
        await link.setAttribute('target', '_blank');
        await document.body.appendChild(link);
        await link.click();
        await document.body.removeChild(link);
    };

    handleCreateTaskCancel = async () => {
        if (this.editPolygon) {
            this.map.removeLayer(this.editPolygon);
            this.editPolygon = '';
        }
        this.editPolygon = this.map.editTools.startPolygon();
        this.setState({
            createBtnVisible: false
        });
    }
    // 树节点选中
    handleTreeCheck = async (checkedKeys, e) => {
        console.log('onCheck', checkedKeys);
        console.log('e', e);
        let checked = e.checked;
        let node = e && e.node && e.node.props;
        console.log('node', node);
        if (checked) {
            if (node && node.children && node.children instanceof Array && node.children.length > 0) {
                let children = node.children;
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    let focus = false;
                    if (i === children.length - 1) {
                        focus = true;
                    }
                    this.handleDrawMapData((child && child.props), focus);
                }
            } else {
                this.handleDrawMapData(node, true);
            }
        } else {
            if (node && node.children && node.children instanceof Array && node.children.length > 0) {
                let children = node.children;
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    this.handleRemoveMapData((child && child.props));
                }
            } else {
                this.handleRemoveMapData(node);
            }
        }
        this.setState({ checkedKeys });
    }
    // 在地图上进行标注
    handleDrawMapData = async (node, focus) => {
        const {
            layerList = {}
        } = this.state;
        let geom = (node && node.Geom) || '';
        if (geom.indexOf('POINT') !== -1) {
            let str = handlePOLYGONWktData(geom);
            let data = str.split(' ');
            if (data && data instanceof Array && data.length > 0) {
                let coordinates = [];
                if (data && data instanceof Array && data.length === 2) {
                    coordinates.push(data[1], data[0]);
                    let marker = L.marker(coordinates, {});
                    marker.addTo(this.map);
                    layerList[node.ID] = marker;
                    if (focus) {
                        this.map.panTo(coordinates);
                    }
                }
            }
        } else if (geom.indexOf('LINESTRING') !== -1) {
            let str = handlePOLYGONWktData(geom);
            let coordinates = handleCoordinates(str);
            let message = {
                key: 3,
                type: 'Feature',
                properties: {name: '', type: 'line'},
                geometry: { type: 'PolyLine', coordinates: coordinates }
            };
            let layer = this._createMarker(message);
            layerList[node.ID] = layer;
            if (focus) {
                this.map.fitBounds(layer.getBounds());
            }
        } else if (geom.indexOf('POLYGON') !== -1) {
            let str = handlePOLYGONWktData(geom);
            let coordinates = handleCoordinates(str);
            let message = {
                key: 3,
                type: 'Feature',
                properties: {name: '', type: 'area'},
                geometry: { type: 'Polygon', coordinates: coordinates }
            };
            let layer = this._createMarker(message);
            layerList[node.ID] = layer;
            if (focus) {
                this.map.fitBounds(layer.getBounds());
            }
        }
        this.setState({
            layerList
        });
    }
    // 取消地图标注
    handleRemoveMapData = async (node) => {
        const {
            layerList
        } = this.state;
        if (layerList[node.ID]) {
            this.map.removeLayer(layerList[node.ID]);
        }
    }
    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }
    // 树数据处理
    renderTreeNodes = (data) => {
        if (data) {
            return (
                <TreeNode
                    title={data.title || data.Title}
                    key={data.Key || data.ID}
                    {...data}
                >
                    {data.children &&
                        data.children.map(m => {
                            return this.renderTreeNodes(m);
                        })}
                </TreeNode>
            );
        }
    }
    render () {
        const {
            createBtnVisible,
            isSuperAdmin,
            loading,
            investigationLoading,
            section,
            permission,
            menuIsExtend,
            menuWidth,
            pointsData = [],
            linesData = [],
            polygonsData = []
        } = this.state;
        let treeData = [
            {
                title: '点数据',
                key: '点数据',
                children: pointsData
            },
            {
                title: '线数据',
                key: '线数据',
                children: linesData
            },
            {
                title: '面数据',
                key: '面数据',
                children: polygonsData
            }
        ];
        return (
            <div style={{height: '100%', width: '100%'}}>
                <div className='FactsSurveyTable-container'>
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            overflow: 'hidden',
                            border: '3px solid #ccc'
                        }}>
                        {
                            permission
                                ? <Spin spinning={loading}>
                                    <div
                                        id='mapid'
                                        style={{height: 700, width: '100%'}} />
                                </Spin> : '暂无权限'
                        }
                    </div>
                    <div className='FactsSurveyTable-Data-container'>
                        <div className='FactsSurveyTable-r-main'>
                            {
                                menuIsExtend ? '' : (
                                    <img src={display}
                                        className='FactsSurveyTable-foldBtn'
                                        onClick={this._extendAndFold.bind(this)} />
                                )
                            }
                            <div
                                className={`FactsSurveyTable-menuPanel`}
                                style={
                                    menuIsExtend
                                        ? {
                                            width: menuWidth,
                                            transform: 'translateX(0)'
                                        }
                                        : {
                                            width: menuWidth,
                                            transform: `translateX(-${
                                                menuWidth
                                            }px)`
                                        }
                                }
                            >
                                <div className='FactsSurveyTable-menuBackground' />
                                <aside className='FactsSurveyTable-aside' id='FactsSurveyAsideDom'>
                                    <div className='FactsSurveyTable-MenuNameLayout'>
                                        <img src={decoration} />
                                        <span className='FactsSurveyTable-MenuName'>现状数据</span>
                                        <img src={hide}
                                            onClick={this._extendAndFold.bind(this)}
                                            className='FactsSurveyTable-MenuHideButton' />
                                    </div>
                                    <div className='FactsSurveyTable-asideTree'>
                                        <Spin spinning={investigationLoading}>
                                            <div className='FactsSurveyTable-StatusButton'>
                                                <Tree
                                                    onCheck={this.handleTreeCheck.bind(this)}
                                                    selectable={false}
                                                    checkable>
                                                    {
                                                        treeData.map(data => {
                                                            return this.renderTreeNodes(data);
                                                        })
                                                    }
                                                </Tree>
                                                {/* <div>
                                                    导出
                                                </div> */}
                                            </div>
                                        </Spin>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                    {
                        createBtnVisible ? (
                            <div className='FactsSurveyTable-button-layout'>
                                <div>
                                    {/* {
                                        isSuperAdmin
                                            ? <Button
                                                disabled={loading}
                                                type='primary'
                                                style={{marginRight: 10}}
                                                onClick={this.handleExportPipeDrawingOk.bind(this)}>
                                                竣工图
                                            </Button> : ''
                                    } */}
                                    <Button
                                        disabled={loading}
                                        type='primary'
                                        style={{marginRight: 10}}
                                        onClick={this.handleExportPipeDrawingOk.bind(this)}>
                                                竣工图
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        type='danger'
                                        onClick={this.handleCreateTaskCancel.bind(this)}>
                                                撤销
                                    </Button>
                                </div>
                            </div>
                        ) : ''
                    }
                </div>
            </div>
        );
    }
}
