import React, { Component } from 'react';
import {
    Button, Modal, Collapse
} from 'antd';
import {genPopUpContent, fillAreaColor} from '../auth';
import '../Curing.less';
window.config = window.config || {};

export default class TaskStatisGis extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            isVisibleMapBtn: true,
            mapLayerBtnType: true,
            selectedMenu: '1',
            taskLayerList: {}, // 任务图层list
            markerLayerList: {}, // 任务图标图层list
            curingTypes: [], // 养护类型
            taskMessList: {} // 养护任务详情list
        };
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.map = null;
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };

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
        let me = this;
        this.map = L.map('mapid', window.config.initLeaflet);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);

        this.tileLayer2 = L.tileLayer(
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
    componentDidUpdate (prevState, prevProps) {
        const {
            taskStatisGisVisible,
            taskStatisSelectTask
        } = this.props;
        if (taskStatisGisVisible && taskStatisGisVisible !== prevProps.taskStatisGisVisible) {
            if (taskStatisSelectTask) {
                this.handleTaskSelect(taskStatisSelectTask);
            }
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
                    className='l-map r-main'
                >
                    {this.state.isVisibleMapBtn ? (
                        <div className='treeControl'>
                            {/* <iframe allowTransparency={true} className={styles.btnCtro}/> */}
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
                    ) : (
                        ''
                    )}
                    <div className='treeControl3'>
                        <div className='buttonStyle'>
                            <Button type='primary' style={{marginRight: 10}} onClick={this._handleReturnTable.bind(this)}>返回</Button>
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
    _handleReturnTable = () => {
        const {
            actions: {
                changeTaskStatisGisVisible
            }
        } = this.props;
        const {
            taskLayerList,
            markerLayerList
        } = this.state;
        // 单选，需要先全部去除图层
        for (let i in taskLayerList) {
            taskLayerList[i].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
        for (let i in markerLayerList) {
            this.map.removeLayer(markerLayerList[i]);
        }
        changeTaskStatisGisVisible(false);
    }
    handleTaskSelect = async (task) => {
        const {
            taskLayerList,
            markerLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let eventKey = task.ID;
        try {
            if (taskLayerList[eventKey]) {
                taskLayerList[eventKey].map((layer) => {
                    layer.addTo(me.map);
                    me.map.fitBounds(layer.getBounds());
                });
                if (markerLayerList[eventKey]) {
                    markerLayerList[eventKey].addTo(me.map);
                }
            } else {
                // 如果不是添加过，需要请求数据
                me._addTaskLayer(eventKey, task);
            }
        } catch (e) {
            console.log('任务选中', e);
        }
    }
    _addTaskLayer = async (eventKey, task) => {
        let planWkt = task.PlanWKT;
        let str = '';
        try {
            if (planWkt.indexOf('MULTIPOLYGON') !== -1) {
                let data = planWkt.slice(planWkt.indexOf('(') + 2, planWkt.indexOf('))') + 1);
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
                        this._handleCoordLayer(str, task, eventKey, index);
                    } else {
                        // 其他图形中不设置图标
                        this._handleCoordLayer(str, task, eventKey);
                    }
                });
            } else {
                str = planWkt.slice(planWkt.indexOf('(') + 3, planWkt.indexOf(')'));
                // 只有一个图形，必须要设置图标
                this._handleCoordLayer(str, task, eventKey, 1);
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    _handleCoordLayer (str, task, eventKey, index) {
        const {
            taskLayerList,
            curingTypes,
            markerLayerList,
            taskMessList
        } = this.state;
        console.log('eventKey', eventKey);
        try {
            let target = str.split(',').map(item => {
                return item.split(' ').map(_item => _item - 0);
            });
            let treeNodeName = task.CuringMans;
            let typeName = '';
            // curingTypes.map((type) => {
            //     if (type.ID === task.CuringType) {
            //         typeName = type.Base_Name;
            //     }
            // });
            let treearea = [];
            let status = '未完成';
            if (task.StartTime && task.EndTime) {
                status = '已完成';
            }
            task.status = status;
            task.typeName = typeName;
            taskMessList[eventKey] = task;
            this.setState({
                taskMessList
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
                type: 'task',
                properties: {
                    ID: task.ID,
                    name: treeNodeName,
                    type: 'task',
                    typeName: typeName || '',
                    status: status || '',
                    CuringMans: task.CuringMans || '',
                    CreateTime: task.CreateTime || '',
                    PlanStartTime: task.PlanStartTime || '',
                    PlanEndTime: task.PlanEndTime || '',
                    StartTime: task.StartTime || '',
                    EndTime: task.EndTime || ''
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (taskLayerList[eventKey]) {
                taskLayerList[eventKey].push(layer);
            } else {
                taskLayerList[eventKey] = [layer];
            }
            this.setState({
                taskLayerList
            });
            if (!index) {
                return;
            }
            // 设置任务中间的图标
            let centerData = layer.getCenter();
            let iconType = L.divIcon({
                className: this.getIconType(message.properties.type)
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
            console.log('处理str', e);
        }
    }
    // 获取对应的ICON
    getIconType (type) {
        switch (type) {
            case 'task':
                return 'taskIcon';
            default:
                break;
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        if (geo.properties.type === 'task') {
            let layer = L.polygon(geo.geometry.coordinates, {
                color: 'white',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(this.map);
            this.map.fitBounds(layer.getBounds());
            return layer;
        } else if (geo.properties.type === 'area') {
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
        }
    }
    // 切换为2D
    _toggleTileLayer (index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
}
