import React, { Component } from 'react';
import {
    Button
} from 'antd';
import L from 'leaflet';
import {
    FOREST_GIS_API,
    TILEURLS,
    INITLEAFLET_API,
    WMSTILELAYERURL
} from '_platform/api';
import {
    handlePOLYGONWktData
} from '_platform/gisAuth';
import {genPopUpContent, getIconType, getTaskStatus} from '../auth';
import '../Curing.less';

export default class TaskStatisGis extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            isVisibleMapBtn: true,
            mapLayerBtnType: true,
            selectedMenu: '1',
            taskPlanLayerList: {}, // 计划任务图层list
            taskRealLayerList: {}, // 实际任务图层List
            taskTrackLayerList: {}, // 任务轨迹
            taskCuringManList: {}, // 养护人员list
            markerLayerList: {}, // 任务图标图层list
            curingTypes: [], // 养护类型
            taskMessList: {}, // 养护任务详情list
            treeLayerChecked: true
        };
        this.tileLayer = null;
        this.tileTreeLayerBasic = null;
        this.map = null;
    }

    subDomains = ['7'];

    async componentDidMount () {
        // 初始化地图
        await this._initMap();
        const {
            taskStatisSelectTask
        } = this.props;
        if (taskStatisSelectTask) {
            this.handleTaskSelect(taskStatisSelectTask);
        }
    }
    /* 初始化地图 */
    _initMap () {
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
    }
    componentDidUpdate (prevState, prevProps) {
        const {
            taskStatisGisVisible,
            taskStatisSelectTask
        } = this.props;
        if (taskStatisGisVisible && taskStatisGisVisible !== prevProps.taskStatisGisVisible) {
            // if (taskStatisSelectTask) {
            //     this.handleTaskSelect(taskStatisSelectTask);
            // }
        }
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
    render () {
        const {
            taskStatisGisVisible
        } = this.props;
        let display = 'none';
        if (taskStatisGisVisible) {
            display = 'flex';
        }
        return (
            <div className='Curing-container' style={{display: display}}>
                <div
                    ref='appendBody'
                    className='Curing-map Curing-r-main'
                >
                    {this.state.isVisibleMapBtn ? (
                        <div className='Curing-treeControl'>
                            <div>
                                <Button
                                    type={
                                        this.state.mapLayerBtnType
                                            ? 'primary'
                                            : 'default'
                                    }
                                    onClick={this._toggleTileLayer.bind(this, 1)}
                                >
                                    卫星图
                                </Button>
                                <Button
                                    type={
                                        this.state.mapLayerBtnType
                                            ? 'default'
                                            : 'primary'
                                    }
                                    onClick={this._toggleTileLayer.bind(this, 2)}
                                >
                                    地图
                                </Button>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                    <div className='Curing-treeControl3'>
                        <div className='Curing-buttonStyle'>
                            <Button type='primary' style={{marginRight: 10}} onClick={this._handleReturnTable.bind(this)}>返回</Button>
                        </div>
                        <div className='Curing-buttonStyle'>
                            <Button type={this.state.treeLayerChecked ? 'primary' : 'default'} onClick={this.treeLayerChange.bind(this)}>{this.state.treeLayerChecked ? '取消树图层' : '展示树图层'}</Button>
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
            </div>);
    }
    // 是否加载树图层
    treeLayerChange = () => {
        const {
            treeLayerChecked
        } = this.state;
        if (treeLayerChecked) {
            if (this.tileTreeLayerBasic) {
                this.map.removeLayer(this.tileTreeLayerBasic);
            }
        } else {
            this.getTileLayer2();
        }
        this.setState({
            treeLayerChecked: !treeLayerChecked
        });
    }
    // 返回任务统计Table页面
    _handleReturnTable = () => {
        const {
            actions: {
                changeTaskStatisGisVisible
            }
        } = this.props;
        changeTaskStatisGisVisible(false);
    }
    handleTaskSelect = async (task) => {
        const {
            taskPlanLayerList,
            taskRealLayerList,
            taskTrackLayerList,
            markerLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let eventKey = task.ID;
        try {
            if (taskPlanLayerList[eventKey]) {
                taskPlanLayerList[eventKey].map((layer) => {
                    layer.addTo(me.map);
                    me.map.fitBounds(layer.getBounds());
                });
                if (markerLayerList[eventKey]) {
                    markerLayerList[eventKey].addTo(me.map);
                }
                if (taskRealLayerList[eventKey]) {
                    taskRealLayerList[eventKey].map((layer) => {
                        layer.addTo(me.map);
                    });
                }
            } else {
                // 如果不是添加过，需要请求数据
                me.getTaskWkt(eventKey, task);
            }
            if (taskTrackLayerList[eventKey]) {
                taskTrackLayerList[eventKey].map((layer) => {
                    layer.addTo(this.map);
                });
            } else {
                this.getTaskTracks(eventKey);
            }
        } catch (e) {
            console.log('任务选中', e);
        }
    }
    // 获取养护任务的计划和实际区域
    getTaskWkt = async (eventKey, task) => {
        try {
            let planWkt = task.PlanWKT;
            let realWkt = task.WKT || '';
            if (planWkt) {
                this._handleTaskWkt(planWkt, eventKey, task, 'plan');
            }
            if (realWkt) {
                this._handleTaskWkt(realWkt, eventKey, task, 'real');
            }
        } catch (e) {
            console.log('handleWKT', e);
        }
    }
    // 处理养护区域的数据，将字符串改为数组
    _handleTaskWkt = async (wkt, eventKey, task, type) => {
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
                            this._handlePlanCoordLayer(str, task, eventKey, index);
                        } else if (type === 'real') {
                            this._handleRealCoordLayer(str, task, eventKey, index);
                        }
                    } else {
                        if (type === 'plan') {
                            // 其他图形中不设置图标
                            this._handlePlanCoordLayer(str, task, eventKey);
                        } else if (type === 'real') {
                            this._handleRealCoordLayer(str, task, eventKey);
                        }
                    }
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = await handlePOLYGONWktData(wkt);
                if (type === 'plan') {
                    // 只有一个图形，必须要设置图标
                    this._handlePlanCoordLayer(str, task, eventKey, 1);
                } else if (type === 'real') {
                    this._handleRealCoordLayer(str, task, eventKey, 1);
                }
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    // 添加计划养护区域图层
    _handlePlanCoordLayer (str, task, eventKey, index) {
        const {
            taskPlanLayerList,
            curingTypes,
            markerLayerList,
            taskMessList
        } = this.state;
        try {
            console.log('_handlePlanCoordLayertarget', str);
            let target = str.split(',').map(item => {
                return item.split(' ').map(_item => _item - 0);
            });
            console.log('_handlePlanCoordLayertarget', target);
            let treearea = [];
            let status = getTaskStatus(task);
            task.status = status;
            taskMessList[eventKey] = task;
            this.setState({
                taskMessList
            });
            let arr = [];
            target.map((data, index) => {
                if (data && data instanceof Array && data[1] && data[0]) {
                    arr.push([data[1], data[0]]);
                }
            });
            treearea.push(arr);
            let message = {
                key: 3,
                type: 'task',
                properties: {
                    ID: task.ID,
                    name: task.CuringMans,
                    type: 'task',
                    typeName: task.typeName,
                    status: status || '',
                    CuringMans: task.CuringMans || '',
                    Area: (task.Area || '') + '亩',
                    CreateTime: task.CreateTime || '',
                    PlanStartTime: task.PlanStartTime || '',
                    PlanEndTime: task.PlanEndTime || '',
                    StartTime: task.StartTime || '',
                    EndTime: task.EndTime || '',
                    sectionName: task.sectionName || '',
                    smallClassName: task.smallClassName || '',
                    thinClassName: task.thinClassName || ''
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (taskPlanLayerList[eventKey]) {
                taskPlanLayerList[eventKey].push(layer);
            } else {
                taskPlanLayerList[eventKey] = [layer];
            }
            this.setState({
                taskPlanLayerList
            });
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
            markerLayerList[eventKey] = marker;
            this.setState({
                markerLayerList
            });
        } catch (e) {
            console.log('Planstr', e);
        }
    }
    // 添加实际养护区域图层
    _handleRealCoordLayer (str, task, eventKey, index) {
        const {
            taskRealLayerList
        } = this.state;
        try {
            let target = str.split(',').map(item => {
                return item.split(' ').map(_item => _item - 0);
            });
            console.log('_handleRealCoordLayer', target);

            let treearea = [];
            let arr = [];
            target.map((data, index) => {
                if (data && data instanceof Array && data[1] && data[0]) {
                    arr.push([data[1], data[0]]);
                }
            });
            treearea.push(arr);
            let message = {
                key: 3,
                type: 'realTask',
                properties: {
                    type: 'realTask'
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (taskRealLayerList[eventKey]) {
                taskRealLayerList[eventKey].push(layer);
            } else {
                taskRealLayerList[eventKey] = [layer];
            }
            this.setState({
                taskRealLayerList
            });
        } catch (e) {
            console.log('Realstr', e);
        }
    }
    // 获取轨迹数据
    getTaskTracks = async (eventKey) => {
        const {
            actions: {
                getCuringPositions
            }
        } = this.props;
        let positionPostData = {
            curingid: eventKey
        };
        let taskPositionMess = await getCuringPositions({}, positionPostData);
        let taskTracks = taskPositionMess && taskPositionMess.content;
        if (taskTracks && taskTracks instanceof Array && taskTracks.length > 0) {
            this._addTrackLayer(taskTracks, eventKey);
        }
    }
    // 添加轨迹图层
    _addTrackLayer (taskTracks, eventKey) {
        const {
            taskTrackLayerList,
            taskCuringManList
        } = this.state;
        try {
            let tracksList = [];
            tracksList[0] = [];
            let CuringManList = [];
            let CuringManTimes = 0;
            let CuringMan = taskTracks[0].CuringMan;
            CuringManList.push(CuringMan);
            taskTracks.map((track) => {
                if (CuringMan !== track.CuringMan) {
                    CuringManList.push(CuringMan);
                    CuringManTimes = CuringManTimes + 1;
                    tracksList[CuringManTimes] = [];
                    CuringMan = track.CuringMan;
                }
                tracksList[CuringManTimes].push([track.Y, track.X]);
            });
            let layerList = [];
            tracksList.map((track, index) => {
                let polylineData = L.polyline(track, { color: 'pink' }).addTo(
                    this.map
                );
                layerList.push(polylineData);
            });
            taskTrackLayerList[eventKey] = layerList;
            taskCuringManList[eventKey] = CuringManList;
            this.setState({
                taskTrackLayerList,
                taskCuringManList
            });
        } catch (e) {
            console.log('_addTrackLayer', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        if (geo.properties.type === 'task') {
            let layer = L.polygon(geo.geometry.coordinates, {
                color: 'blue',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(this.map);
            this.map.fitBounds(layer.getBounds());
            return layer;
        } else if (geo.properties.type === 'realTask') {
            let layer = L.polygon(geo.geometry.coordinates, {
                color: 'yellow',
                fillColor: 'yellow',
                fillOpacity: 0.5
            }).addTo(this.map);
            this.map.fitBounds(layer.getBounds());
            return layer;
        }
    }
    // 切换为2D
    _toggleTileLayer (index) {
        this.tileLayer.setUrl(TILEURLS[index]);
        this.setState({
            TileLayerUrl: TILEURLS[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
}
