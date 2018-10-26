import React, { Component } from 'react';
import {
    Button, Collapse, Notification, Spin, Checkbox
} from 'antd';
import AreaTreeCreate from '../AreaTreeCreate';
import CheckGroupTree from '../CheckGroupTree';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from '../auth';
import {
    getHandleWktData,
    getWktData,
    computeSignedArea
} from '_platform/gisAuth';
import TaskCreateModal from './TaskCreateModal';
import '../Checkwork.less';

const Panel = Collapse.Panel;
window.config = window.config || {};

export default class TaskCreateTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 270 /* 菜单宽度 */,
            mapLayerBtnType: true,
            selectedMenu: '1',
            treeLayerChecked: true,
            // 考勤管理树
            groupSelected: false, // 考勤群体是否被选中
            groupSelectKey: '', // 考勤群体选中节点
            groupFenceData: [], // 考勤群体选中节点电子围栏数据
            groupFenceStatus: false, // 考勤群体选中节点是否存在电子围栏
            // 手动框选
            coordinates: [], // 圈选地图各个点的坐标
            areaLayerList: {}, // 选择各个细班的图层列表
            createBtnVisible: false, // 控制圈选地图的按钮的Visible
            polygonData: '', // 圈选地图图层
            // 框选地图内的数据
            // treeNum: 0, // 圈选地图内的树木数量
            regionThinClass: [], // 圈选地图内的细班
            regionArea: 0, // 圈选区域内面积
            // 下发任务Modal数据
            wkt: '',
            groupwkt: '',
            noLoading: false
        };
        this.tileLayer = null;
        this.tileTreeLayerBasic = null;
        this.map = null;
        this.totalSmallClass = [];
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 270,
            maxWidth: 500
        };
    }

    options = [
        { label: '区域地块', value: 'geojsonFeature_area' },
        { label: '考勤管理', value: 'geojsonFeature_checkWork' }
    ];
    subDomains = ['7'];
    WMSTileLayerUrl = window.config.WMSTileLayerUrl;

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    async componentDidMount () {
        try {
            // 初始化地图
            await this._initMap();
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    /* 初始化地图 */
    _initMap () {
        let me = this;
        this.map = L.map('mapid', window.config.initLeaflet);
        // 放大缩小地图的按钮
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);
        // 加载基础图层
        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 加载树图层
        this.getTileLayer2();
        // 地图点击事件
        this.map.on('click', function (e) {
            const {
                coordinates,
                createBtnVisible,
                groupSelected
            } = me.state;
            if (!createBtnVisible) {
                return;
            }
            if (!groupSelected) {
                Notification.info({
                    message: '未选择考勤群体，不能圈选地图',
                    duration: 3
                });
                return;
            }
            coordinates.push([e.latlng.lat, e.latlng.lng]);
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

    render () {
        const {
            createBtnVisible,
            taskModalVisible,
            coordinates,
            groupSelected,
            groupFenceStatus
        } = this.state;
        let okDisplay = false;
        if (coordinates.length <= 2) {
            okDisplay = true;
        }
        let retreatDisplay = false;
        if (coordinates.length <= 0) {
            retreatDisplay = true;
        }
        return (
            <div className='checkWork-container'>
                <div
                    ref='appendBody'
                    className='checkWork-map checkWork-r-main'
                >
                    <div
                        className={`checkWork-menuPanel`}
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
                        <aside className='checkWork-aside' draggable='false'>
                            <div style={{margin: 10}}>
                                <Checkbox checked={this.state.treeLayerChecked} onChange={this.treeLayerChange.bind(this)}>展示树图层</Checkbox>
                            </div>
                            <Collapse
                                defaultActiveKey={[this.options[0].value]}
                                accordion
                            >
                                {this.options.map(option => {
                                    return (
                                        <Panel
                                            key={option.value}
                                            header={option.label}
                                        >
                                            {this.renderPanel(option)}
                                        </Panel>
                                    );
                                })}
                            </Collapse>
                        </aside>
                        {this.state.menuIsExtend ? (
                            <div
                                className='checkWork-foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this._extendAndFold.bind(this)}
                            >
                                收起
                            </div>
                        ) : (
                            <div
                                className='checkWork-foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this._extendAndFold.bind(this)}
                            >
                                展开
                            </div>
                        )}
                    </div>
                    {
                        groupSelected && !createBtnVisible ? (
                            <div className='checkWork-treeControl2'>
                                <div>
                                    {
                                        groupFenceStatus
                                            ? (
                                                <div>
                                                    <Button type='primary' style={{marginRight: 10}} onClick={this._handlePutFence.bind(this)}>修改</Button>
                                                    <Button type='danger' onClick={this._handleDelectFence.bind(this)}>删除</Button>
                                                </div>
                                            )
                                            : (
                                                <Button type='primary' style={{marginRight: 10}} onClick={this._handleAddFence.bind(this)}>创建</Button>
                                            )
                                    }
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        createBtnVisible ? (
                            <div className='checkWork-treeControl2'>
                                <div>
                                    <Button type='primary' style={{marginRight: 10}} disabled={okDisplay} onClick={this._handleCreateTaskOk.bind(this)}>确定</Button>
                                    <Button type='info' style={{marginRight: 10}} disabled={retreatDisplay} onClick={this._handleCreateTaskRetreat.bind(this)}>上一步</Button>
                                    <Button type='danger' onClick={this._handleCreateTaskCancel.bind(this)}>撤销</Button>
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        taskModalVisible ? (
                            <TaskCreateModal
                                {...this.props}
                                {...this.state}
                                onOk={this.handleTaskModalOk.bind(this)}
                                onCancel={this.handleTaskModalCancel.bind(this)}
                            />
                        ) : ''
                    }
                    <div className='checkWork-treeControl'>
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
            </div>);
    }
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            platform: {
                tree = {}
            },
            groupTreeLoading,
            areaTreeLoading,
            checkGroupsData = []
        } = this.props;
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <AreaTreeCreate
                                {...this.props}
                                {...this.state}
                                onCheck={this.handleAreaCheck.bind(this)}
                                content={tree.thinClassTree || []}
                            />
                        </Spin>

                    );
                case 'geojsonFeature_checkWork':
                    return (
                        <Spin spinning={groupTreeLoading}>
                            <CheckGroupTree
                                {...this.props}
                                {...this.state}
                                onSelect={this.handleGroupSelect.bind(this)}
                                content={checkGroupsData || []}
                            />
                        </Spin>
                    );
            }
        }
    }
    // 控制基础树图层是否展示
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
    // 选择标段是否展示数据，或是隐藏数据
    async handleAreaCheck (keys, info) {
        const {
            areaLayerList
        } = this.state;
        let me = this;
        try {
            console.log('info', info);
            console.log('info.node.props', info.node.props);

            // 当前选中的节点
            let eventKey = info.node.props.eventKey;
            let children = info.node.props.children;
            // 当前的选中状态
            let checked = info.checked;
            // 选中节点对key进行处理
            let handleKey = eventKey.split('-');
            // 如果选中的是小班，则遍历添加图层
            if (handleKey.length === 4) {
                if (children) {
                    if (checked) {
                        children.map((child) => {
                            this.handleThinClassSelect(child.key);
                        });
                    } else {
                        children.map((child) => {
                            if (areaLayerList[child.key]) {
                                areaLayerList[child.key].map((layer) => {
                                    me.map.removeLayer(layer);
                                });
                            }
                        });
                    }
                }
            } else if (handleKey.length === 5) {
                // 如果选中的是细班，则直接添加图层
                if (checked) {
                    this.handleThinClassSelect(eventKey);
                } else {
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].map((layer) => {
                            me.map.removeLayer(layer);
                        });
                    }
                }
            }
        } catch (e) {
            console.log('分辨是否为标段', e);
        }
    }
    // 处理细班选择的状态
    handleThinClassSelect = async (eventKey) => {
        const {
            areaLayerList
        } = this.state;
        // 如果之前添加过，直接将添加过的再次添加，不用再次请求
        if (areaLayerList[eventKey]) {
            areaLayerList[eventKey].map((layer) => {
                layer.addTo(this.map);
                this.map.fitBounds(layer.getBounds());
            });
        } else {
            // 如果不是添加过，需要请求数据
            this._addAreaLayer(eventKey);
        }
    }
    // 选中标段，则在地图上加载电子围栏图层
    async _addAreaLayer (eventKey) {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: {
                getTreearea
            }
        } = this.props;
        console.log('areaLayerList', areaLayerList);
        console.log('getTreearea', getTreearea);

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
                    console.log('treearea', treearea);
                    console.log('coords', coords);
                }

                this.setState({
                    areaLayerList
                });
            };
        } catch (e) {

        }
    }
    // 群体选中的处理
    handleGroupSelect = async (keys, info) => {
        const {
            actions: {
                getCheckScope
            }
        } = this.props;
        try {
            console.log('keys', keys);
            console.log('info', info);
            let selected = info.selected;
            let node = info.node.props;
            let eventKey = (keys && keys[0]) || '';
            let groupFenceData = [];
            let groupFenceStatus = false;
            if (selected) {
                let data = await getCheckScope({id: eventKey});
                console.log('data', data);
                // 存在数据  说明有电子围栏
                if (data && data instanceof Array && data.length > 0) {
                    groupFenceStatus = true;
                    groupFenceData = data;
                }
            }
            this.setState({
                groupSelectKey: eventKey,
                groupSelected: selected,
                groupFenceStatus,
                groupFenceData
            });
        } catch (e) {
            console.log('e', e);
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
            return layer;
        } else if (geo.properties.type === 'realTask') {
            let layer = L.polygon(geo.geometry.coordinates, {
                color: 'yellow',
                fillColor: 'yellow',
                fillOpacity: 0.3
            }).addTo(this.map);
            return layer;
        } else if (geo.properties.type === 'area') {
            // 创建区域图形
            let layer = L.polygon(geo.geometry.coordinates, {
                color: '#201ffd',
                fillColor: fillAreaColor(geo.key),
                fillOpacity: 0.3
            }).addTo(this.map);
            return layer;
        }
    }
    // 更新电子围栏
    _handlePutFence = async () => {
        this.setState({
            createBtnVisible: true
        });
    }
    // 增加电子围栏
    _handleAddFence = async () => {
        this.setState({
            createBtnVisible: true
        });
    }
    // 删除电子围栏
    _handleDelectFence = async () => {

    }
    // 确定圈选地图
    _handleCreateTaskOk = async () => {
        const {
            coordinates
        } = this.state;
        // this.setState({
        //     taskModalVisible: true
        // });
        let coords = [];
        coords = coordinates;
        try {
            console.log('coordinates', coordinates);
            // 坐标
            let wkt = '';
            // 选择面积
            let regionArea = 0;
            wkt = 'POLYGON(';
            // 获取手动框选坐标wkt
            wkt = wkt + getHandleWktData(coords);
            wkt = wkt + ')';
            regionArea = computeSignedArea(coords, 2);

            regionArea = regionArea * 0.0015;
            console.log('wkt', wkt);
            console.log('regionArea', regionArea);
            this.setState({
                wkt,
                groupwkt: coords,
                regionArea,
                noLoading: true
            });
        } catch (e) {
            console.log('树木数量', e);
        }
    }
    // 圈选图层返回上一步
    _handleCreateTaskRetreat = async () => {
        const {
            coordinates
        } = this.state;
        let me = this;
        if (me.state.polygonData) {
            me.map.removeLayer(me.state.polygonData);
        }
        coordinates.pop();
        if (coordinates.length === 0) {
            this.setState({
                polygonData: '',
                coordinates: []
            });
            return;
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
    }
    // 撤销圈选图层
    _handleCreateTaskCancel =() => {
        const {
            areaLayerList,
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        for (let i in areaLayerList) {
            areaLayerList[i].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
        this.resetButState();
    }
    // 确认下发任务
    handleTaskModalOk = () => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        this.resetModalState();
        this.resetButState();
    }
    // 取消下发任务
    handleTaskModalCancel = () => {
        this.resetModalState();
    }
    // 取消下发任务时清空之前存储的state
    resetModalState = () => {
        this.setState({
            taskModalVisible: false,
            noLoading: false,
            // treeNum: 0,
            regionThinClass: [],
            regionArea: 0,
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
    componentDidUpdate (prevProps, prevState) {

    }
    /* 菜单展开收起 */
    _extendAndFold () {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
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
