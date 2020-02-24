import React, { Component } from 'react';
import {
    Button,
    Notification,
    Spin
} from 'antd';
import XLSX from 'xlsx';
import L from 'leaflet';
import 'leaflet-editable';
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
    getHandleWktData
} from '_platform/gisAuth';
import './CompletionPlanTable.less';

export default class CompletionPlanTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isSuperAdmin: false,
            section: '',
            areaLayerList: {},
            createBtnVisible: false,
            loading: false,
            permission: false
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
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            areaEventKey
        } = this.props;
        const {
            isSuperAdmin,
            section
        } = this.state;
        if (areaEventKey && areaEventKey !== prevProps.areaEventKey) {
            if (isSuperAdmin || section) {
                this.handleSelectThinClass(areaEventKey);
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
    handleSelectThinClass = async (eventKey) => {
        const {
            areaLayerList
        } = this.state;
        try {
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
            }
        } catch (e) {
            console.log('handleSelectThinClass', e);
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

    handleExportPipeCoordinateOk = async () => {
        const {
            actions: {
                postPipeCoordinate
            }
        } = this.props;
        const {
            section,
            isSuperAdmin
        } = this.state;
        if (this.editPolygon && section) {
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
            let postData = {
                Sql: ` and  Section = "${section}"`,
                Bbox: wkt
            };
            let data = await postPipeCoordinate({}, postData);
            console.log('data', data);
            if (data && data.Pipes && data.PipeNodes) {
                let pipeNodes = data.PipeNodes;
                let pipes = data.Pipes;
                let PipeNodesName = [`管点`];
                let PipeNodesNameData = PipeNodesName.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 1
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let _pipeNodesHeader = ['名称', '类型', '创建时间', '标段', '坐标'];
                let pipeNodesHeader = _pipeNodesHeader.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 2
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let pipeNodesData = [];
                let pipeNodesTableData = [];
                if (pipeNodes instanceof Array && pipeNodes.length > 0) {
                    pipeNodes.map(item => {
                        let obj = {};
                        obj['名称'] = item.Name;
                        obj['类型'] = item.PipeType;
                        obj['创建时间'] = item.CreateTime;
                        obj['标段'] = item.Section;
                        obj['坐标'] = item.Geom;
                        pipeNodesData.push(obj);
                    });
                    pipeNodesTableData = pipeNodesData.map((data, i) =>
                        _pipeNodesHeader.map((k, j) =>
                            Object.assign(
                                {},
                                {
                                    v: data[k],
                                    position: String.fromCharCode(65 + j) + (i + 3)
                                }))).reduce((prev, next) =>
                        prev.concat(next)).reduce((prev, next) =>
                        Object.assign(
                            {}, prev, {
                                [next.position]: { v: next.v }
                            }),
                    {});
                }

                let length = pipeNodes.length;
                let pipesName = [`管线`];
                let pipesNameData = pipesName.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + (length + 5)
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let _pipesHeader = ['材质', '创建时间', '长度', '标段', '坐标'];
                let pipesHeader = _pipesHeader.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + (length + 6)
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let pipesData = [];
                let pipesTableData = [];
                if (pipes instanceof Array && pipes.length > 0) {
                    pipes.map(item => {
                        let obj = {};
                        obj['材质'] = item.Material;
                        obj['创建时间'] = item.CreateTime;
                        obj['长度'] = item.Length;
                        obj['标段'] = item.Section;
                        obj['坐标'] = item.Geom;
                        pipesData.push(obj);
                    });
                    pipesTableData = pipesData.map((data, i) =>
                        _pipesHeader.map((k, j) =>
                            Object.assign(
                                {},
                                {
                                    v: data[k],
                                    position: String.fromCharCode(65 + j) + (i + length + 7)
                                }))).reduce((prev, next) =>
                        prev.concat(next)).reduce((prev, next) =>
                        Object.assign(
                            {}, prev, {
                                [next.position]: { v: next.v }
                            }),
                    {});
                }

                let output = Object.assign(
                    {},
                    PipeNodesNameData,
                    pipeNodesHeader,
                    pipeNodesTableData,
                    pipesNameData,
                    pipesHeader,
                    pipesTableData
                );
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
                XLSX.writeFile(wb, `灌溉坐标表.xlsx`);
                this.setState({
                    loading: false
                });
            } else {
                Notification.error({
                    message: '获取数据为空，请重新框选范围'
                });
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
    render () {
        const {
            createBtnVisible,
            isSuperAdmin,
            loading,
            section,
            permission
        } = this.state;
        return (
            <div style={{height: '100%', width: '100%'}}>
                <div className='CompletionPlanTable-container'>
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
                    {
                        createBtnVisible ? (
                            <div className='CompletionPlanTable-button-layout'>
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
                                    {/* <Button
                                        disabled={loading}
                                        style={{marginRight: 10}}
                                        onClick={this.handleExportPipeCoordinateOk.bind(this)}>
                                                坐标表格
                                    </Button> */}
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
