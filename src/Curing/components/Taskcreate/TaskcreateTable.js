import React, { Component } from 'react';
import {
    Button, Modal
} from 'antd';
import DashPanel from '../DashPanel';
import {getThinClass, getSmallClass, fillAreaColor} from '../auth';
import TaskCreateModal from './TaskCreateModal';
import '../Curing.less';
window.config = window.config || {};

export default class TaskcreateTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 200 /* 菜单宽度 */,
            isVisibleMapBtn: true,
            mapLayerBtnType: true,
            selectedMenu: '1',
            treeType: [],
            projectList: [],
            unitProjectList: [],
            coordinates: [],
            polygon: '',
            areaLayerList: {},
            createBtnVisible: false,
            polygonData: ''
        };
        this.checkMarkers = [];
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.map = null;
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 200,
            maxWidth: 500
        };
    }

    options = [
        { label: '区域地块', value: 'geojsonFeature_area', IconName: 'square' }
    ];

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };

    async componentDidMount () {
        this._loadAreaData();
        this._initMap();
    }

    // 获取地块树数据
    async _loadAreaData () {
        const {
            actions: { getTreeNodeList, getLittleBan }
        } = this.props;
        try {
            let rst = await getTreeNodeList();
            if (rst instanceof Array && rst.length > 0) {
                rst.forEach((item, index) => {
                    rst[index].children = [];
                });
            }
            // 项目级
            let projectList = [];
            // 子项目级
            let unitProjectList = [];
            if (rst instanceof Array && rst.length > 0) {
                rst.map(node => {
                    if (node.Type === '项目工程') {
                        projectList.push({
                            Name: node.Name,
                            No: node.No
                        });
                    } else if (node.Type === '子项目工程') {
                        unitProjectList.push({
                            Name: node.Name,
                            No: node.No,
                            Parent: node.Parent
                        });
                    }
                });
                this.setState({
                    projectList,
                    unitProjectList
                });

                for (let i = 0; i < projectList.length; i++) {
                    projectList[i].children = unitProjectList.filter(node => {
                        return node.Parent === projectList[i].No;
                    });
                }
            }
            unitProjectList.map(async section => {
                let list = await getLittleBan({ no: section.No });
                let smallClassList = getSmallClass(list);
                smallClassList.map(smallClass => {
                    let thinClassList = getThinClass(smallClass, list);
                    smallClass.children = thinClassList;
                });
                section.children = smallClassList;
                this.setState({ treeLists: projectList });
            });
        } catch (e) {
            console.log(e);
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

        this.map.on('click', function (e) {
            // coordinates.push({ Lat: e.latlng.lat, Lng: e.latlng.lng });
            const {
                coordinates,
                createBtnVisible
            } = me.state;
            console.log('coordinates', coordinates);
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
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(me.map);
            me.setState({
                coordinates,
                polygonData: polygonData
            });
        });
    }

    render () {
        const {
            treeLists,
            createBtnVisible,
            taskModalVisible
        } = this.state;
        return (
            <div className='map-container'>
                <div
                    ref='appendBody'
                    className='l-map r-main'
                    onMouseUp={this._handleEndResize.bind(this)}
                    onMouseMove={this._handleResizingMenu.bind(this)}
                >
                    <div
                        className={`menuPanel ${
                            this.state.isNotThree ? '' : 'hide'
                        } ${
                            this.state.menuIsExtend ? 'animExtend' : 'animFold'
                        }`}
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
                        <aside className='aside' draggable='false'>
                            <DashPanel
                                tyle={{ height: '200px' }}
                                onCheck={this._handleAreaCheck.bind(this)}
                                onSelect={this._handleAreaSelect.bind(this)}
                                content={treeLists}
                            />
                            <div style={{ height: '20px' }} />
                        </aside>
                        <div
                            className='resizeSenseArea'
                            onMouseDown={this._onStartResizeMenu.bind(this)}
                        />
                        {this.state.menuIsExtend ? (
                            <div
                                className='foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this._extendAndFold.bind(this)}
                            >
                                收起
                            </div>
                        ) : (
                            <div
                                className='foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this._extendAndFold.bind(this)}
                            >
                                展开
                            </div>
                        )}
                    </div>
                    {
                        createBtnVisible ? (
                            <div className='treeControl2'>
                                <div>
                                    <Button type='primary' style={{marginRight: 10}} onClick={this._handleCreateTaskOk.bind(this)}>确定</Button>
                                    <Button type='info' onClick={this._handleCreateTaskCancel.bind(this)}>撤销</Button>
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        taskModalVisible ? (
                            <TaskCreateModal
                                {...this.props}
                                {...this.state}
                                onCancel={this.handleTaskModalCancel.bind(this)}
                            />
                        ) : ''
                    }
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

    /* 弹出信息框 */
    async _handleAreaSelect (keys, info) {
    }

    async _handleAreaCheck (keys, info) {
        const {
            areaLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let eventKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        try {
            // 为了让各小班的key值不一样，加入了@@，首先对key进行处理
            let handleKey = eventKey.split('-');
            // 如果选中的是细班，则直接添加图层
            if (handleKey.length === 5) {
                if (checked) {
                    const treeNodeName = info && info.node && info.node.props && info.node.props.title;
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].addTo(me.map);
                        me.map.fitBounds(areaLayerList[eventKey].getBounds());
                    } else {
                        // 如果不是添加过，需要请求数据
                        me.addAreaLayer(eventKey, treeNodeName);
                    }
                } else {
                    me.map.removeLayer(areaLayerList[eventKey]);
                }
            } else {
                if (checked) {
                    // 如果选中的不是细班，则需要进行遍历，找到此次点击的节点，然后一个个添加
                    let selectKeys = [];
                    try {
                        keys.map((key) => {
                            let selectKey = key.split('@@');
                            if (key.indexOf(eventKey) !== -1 && selectKey.length === 2) {
                                selectKeys.push(selectKey[0]);
                            }
                        });
                    } catch (e) {

                    }
                    // selectKeys.map((seKey) => {
                    //     if (areaLayerList[seKey]) {
                    //         areaLayerList[seKey].addTo(me.map);
                    //     } else {
                    //         me.addAreaLayer(seKey, '');
                    //     }
                    // });
                } else {

                }
            }
        } catch (e) {
            console.log('分辨是否为细班', e);
        }
    }

    async addAreaLayer (eventKey, treeNodeName) {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
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

            let layer = this.createMarker(message);
            areaLayerList[eventKey] = layer;
            me.setState({
                areaLayerList
            });
        } catch (e) {
            console.log('await', e);
        }
    }
    /* 在地图上添加marker和polygan */
    createMarker (geo) {
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
    // 确定圈选地图
    _handleCreateTaskOk = () => {
        this.setState({
            taskModalVisible: true
        });
    }
    // 撤销圈选图层
    _handleCreateTaskCancel =() => {
        const {
            polygonData
        } = this.state;
        this.map.removeLayer(polygonData);
        this.setState({
            createBtnVisible: false,
            polygonData: '',
            coordinates: []
        });
    }
    // 取消下发任务
    handleTaskModalCancel = () => {
        this.setState({
            taskModalVisible: false
        });
    }

    /* 菜单展开收起 */
    _extendAndFold () {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }

    /* 手动调整菜单宽度 */
    _onStartResizeMenu (e) {
        e.preventDefault();
        this.menu.startPos = e.clientX;
        this.menu.isStart = true;
        this.menu.tempMenuWidth = this.state.menuWidth;
        this.menu.count = 0;
    }

    // 切换为2D
    _toggleTileLayer (index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }

    _handleEndResize (e) {
        this.menu.isStart = false;
    }
    _handleResizingMenu (e) {
        if (this.menu.isStart) {
            e.preventDefault();
            this.menu.count++;
            let ys = this.menu.count % 5;
            if (ys === 0 || ys === 1 || ys === 3 || ys === 4) return; // 降低事件执行频率
            let dx = e.clientX - this.menu.startPos;
            let menuWidth = this.menu.tempMenuWidth + dx;
            if (menuWidth > this.menu.maxWidth) menuWidth = this.menu.maxWidth;
            if (menuWidth < this.menu.minWidth) menuWidth = this.menu.minWidth;
            this.setState({ menuWidth: menuWidth });
        }
    }
}
