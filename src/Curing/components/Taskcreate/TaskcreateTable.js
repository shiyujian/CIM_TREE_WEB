import React, { Component } from 'react';
import {
    Button, Collapse, Notification, Spin, Checkbox
} from 'antd';
import AreaTreeCreate from '../AreaTreeCreate';
import TaskCheckTree from '../TaskCheckTree';
import {
    fillAreaColor,
    getHandleWktData,
    getWktData,
    computeSignedArea,
    genPopUpContent,
    getIconType,
    getTaskThinClassName,
    getThinClassName,
    getTaskStatus,
    getAreaTreeData,
    getCuringTaskCreateTreeData,
    handleAreaLayerData,
    handleCoordinates
} from '../auth';
import TaskCreateModal from './TaskCreateModal';
import '../Curing.less';
import { getUser } from '_platform/auth';

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
            curingLayerChecked: true,
            // 细班树
            areaTreeLoading: false,
            // 养护任务树
            taskTreeData: [], // 养护任务tree数据
            curingTypes: [],
            taskPlanLayerList: {},
            taskPlanMarkerLayerList: {},
            taskRealMarkerLayerList: {},
            taskRealLayerList: {},
            // 手动框选
            coordinates: [], // 圈选地图各个点的坐标
            areaLayerList: {}, // 选择各个细班的图层列表
            createBtnVisible: false, // 先建任务Modal的可视
            polygonData: '', // 圈选地图图层
            // 框选地图内的数据
            // treeNum: 0, // 圈选地图内的树木数量
            regionThinClass: [], // 圈选地图内的细班
            regionThinName: '', // 圈选区域内的细班名称
            regionThinNo: '', // 圈选区域内的细班code
            regionSectionNo: '', // 圈选区域内的标段code
            regionSectionName: '', // 圈选区域内的标段名称
            regionArea: 0, // 圈选区域内面积
            // 直接选择细班坐标数据
            treeCoords: {},
            // 下发任务Modal数据
            wkt: '',
            noLoading: false
        };
        this.tileLayer = null;
        this.tileTreeLayerBasic = null;
        this.map = null;
        this.sections = [];
        this.section = '';
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
        { label: '区域地块', value: 'geojsonFeature_area', IconName: 'square' }
        // { label: '养护任务', value: 'geojsonFeature_task', IconName: 'task' }
    ];

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            areaTreeLoading,
            taskTreeData
        } = this.state;
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <AreaTreeCreate
                                {...this.props}
                                onCheck={this.handleAreaCheck.bind(this)}
                                content={tree.thinClassTree || []}
                            />
                        </Spin>

                    );
                case 'geojsonFeature_task':
                    return (
                        <TaskCheckTree
                            // onCheck={this.handleTaskCheck.bind(this)}
                            content={taskTreeData}
                        />
                    );
            }
        }
    }
    async componentDidMount () {
        const {
            actions: {
                changeCheckedKeys,
                changeSelectMap
            },
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
            await changeCheckedKeys([]);
            await changeSelectMap('细班选择');
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
            // 获取任务树数据
            await this._loadTaskData();
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
        // 加载树图层
        this.getTileLayer2();
        // 地图点击事件
        this.map.on('click', function (e) {
            const {
                coordinates,
                createBtnVisible
            } = me.state;
            const {
                selectMap
            } = me.props;
            if (selectMap === '细班选择') {
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
            console.log('data', data);
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
    // 获取任务数据
    async _loadTaskData () {
        const {
            actions: {
                getCuring,
                getCuringTypes
            }
        } = this.props;
        let data = await getCuringTaskCreateTreeData(getCuringTypes, getCuring);
        let curingTypes = data.curingTypes || [];
        let taskTreeData = data.taskTreeData || [];
        console.log('taskTreeData', taskTreeData);
        this.setState({
            taskTreeData,
            curingTypes
        }, () => {
            this.getCuringRealTileLayer();
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
    // 获取实际养护区域图层
    getCuringRealTileLayer = () => {
        const {
            taskTreeData
        } = this.state;
        for (let i = 0; i < taskTreeData.length; i++) {
            if (taskTreeData[i] && taskTreeData[i].children) {
                let children = taskTreeData[i].children;
                for (let v = 0; v < children.length; v++) {
                    let child = children[v];
                    let realWkt = child.WKT;
                    let eventKey = child.ID;
                    let isFocus = false;
                    if ((i === taskTreeData.length - 1) && (v === children.length - 1)) {
                        isFocus = true;
                    }
                    this._handleTaskWkt(realWkt, eventKey, child, 'real', isFocus);
                }
            }
        }
    }

    render () {
        const {
            createBtnVisible,
            taskModalVisible,
            coordinates
        } = this.state;
        const {
            selectMap
        } = this.props;
        let RetreatDisplay = false;
        let okDisplay = false;
        if (selectMap === '细班选择') {
            RetreatDisplay = true;
        } else if (coordinates.length <= 2) {
            okDisplay = true;
        }
        return (
            <div className='Curing-container'>
                <div
                    ref='appendBody'
                    className='l-map r-main'
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
                            <div style={{margin: 10}}>
                                <Checkbox checked={this.state.treeLayerChecked} onChange={this.treeLayerChange.bind(this)}>展示树图层</Checkbox>
                                <Checkbox checked={this.state.curingLayerChecked} onChange={this.curingLayerChange.bind(this)}>展示养护图层</Checkbox>
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
                                    <Button type='primary' style={{marginRight: 10}} disabled={okDisplay} onClick={this._handleCreateTaskOk.bind(this)}>确定</Button>
                                    {RetreatDisplay ? '' : <Button type='info' style={{marginRight: 10}} onClick={this._handleCreateTaskRetreat.bind(this)}>上一步</Button>}
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
                    <div className='treeControl'>
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
    // 控制基础树图层是否展示
    treeLayerChange = () => {
        const {
            treeLayerChecked
        } = this.state;
        console.log('treeLayerChecked', treeLayerChecked);
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
    // 控制养护图层是否展示
    curingLayerChange = () => {
        const {
            curingLayerChecked,
            taskRealLayerList,
            taskRealMarkerLayerList
        } = this.state;
        console.log('curingLayerChecked', curingLayerChecked);
        try {
            if (!curingLayerChecked) {
                if (taskRealLayerList && Object.keys(taskRealLayerList).length > 0) {
                    for (let i in taskRealLayerList) {
                        taskRealLayerList[i].map((layer) => {
                            layer.addTo(this.map);
                        });
                    }
                    for (let i in taskRealMarkerLayerList) {
                        taskRealMarkerLayerList[i].addTo(this.map);
                    }
                } else {
                    this._loadTaskData();
                }
            } else {
                for (let i in taskRealLayerList) {
                    taskRealLayerList[i].map((layer) => {
                        this.map.removeLayer(layer);
                    });
                }
                for (let i in taskRealMarkerLayerList) {
                    this.map.removeLayer(taskRealMarkerLayerList[i]);
                }
            }
            this.setState({
                curingLayerChecked: !curingLayerChecked
            });
        } catch (e) {
            console.log('curingLayerChange', e);
        }
    }
    // 选择细班是否展示数据，或是隐藏数据
    async handleAreaCheck (keys, info) {
        const {
            areaLayerList
        } = this.state;
        let me = this;
        try {
            // 当前选中的节点
            let eventKey = info.node.props.eventKey;
            // 当前的选中状态
            let checked = info.checked;
            if (keys && keys.length === 0) {
                this.setState({
                    createBtnVisible: false
                });
            }
            // 选中节点对key进行处理
            let handleKey = eventKey.split('-');
            // 如果选中的是细班，则直接添加图层
            if (handleKey.length === 5) {
                if (checked) {
                    const treeNodeName = info && info.node && info.node.props && info.node.props.title;
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].map((layer) => {
                            layer.addTo(me.map);
                            me.map.fitBounds(layer.getBounds());
                        });
                        this.setState({
                            createBtnVisible: true
                        });
                    } else {
                        // 如果不是添加过，需要请求数据
                        me._addAreaLayer(eventKey, treeNodeName);
                    }
                } else {
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].map((layer) => {
                            me.map.removeLayer(layer);
                        });
                    }
                }
            }
        } catch (e) {
            console.log('分辨是否为细班', e);
        }
    }
    // 选中细班，则在地图上加载细班图层
    async _addAreaLayer (eventKey, treeNodeName) {
        const {
            areaLayerList,
            treeCoords
        } = this.state;
        const {
            actions: {
                getTreearea
            }
        } = this.props;
        try {
            let coords = await handleAreaLayerData(eventKey, treeNodeName, getTreearea);
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
                    if (treeCoords[eventKey]) {
                        treeCoords[eventKey].push(treearea);
                    } else {
                        treeCoords[eventKey] = [treearea];
                    }
                    console.log('treearea', treearea);
                    console.log('coords', coords);
                }
                console.log('treeCoords[eventKey]', treeCoords[eventKey]);
                if (treeCoords && Object.keys(treeCoords).length > 0) {
                    this.setState({
                        createBtnVisible: true
                    });
                } else {
                    this.setState({
                        createBtnVisible: false
                    });
                }
                this.setState({
                    areaLayerList,
                    treeCoords
                });
            };
        } catch (e) {

        }
    }

    // 处理养护区域的数据，将字符串改为数组
    _handleTaskWkt = async (wkt, eventKey, task, type, isFocus) => {
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
                            this._handlePlanCoordLayer(str, task, eventKey, index, isFocus);
                        } else if (type === 'real') {
                            this._handleRealCoordLayer(str, task, eventKey, index, isFocus);
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
                str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
                if (type === 'plan') {
                    // 只有一个图形，必须要设置图标
                    this._handlePlanCoordLayer(str, task, eventKey, 1, isFocus);
                } else if (type === 'real') {
                    this._handleRealCoordLayer(str, task, eventKey, 1, isFocus);
                }
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    // 处理任务数据
    _handleTaskMess (taskMess) {
        const {
            platform: {
                tree = {}
            }
        } = this.props;
        const {
            curingTypes
        } = this.state;
        try {
            let totalThinClass = tree.totalThinClass || [];
            let typeName = '';
            curingTypes.map((type) => {
                if (type.ID === taskMess.CuringType) {
                    typeName = type.Base_Name;
                }
            });
            let status = getTaskStatus(taskMess);
            let regionData = getTaskThinClassName(taskMess, totalThinClass);
            console.log('regionData', regionData);
            let sectionName = regionData.regionSectionName;
            let smallClassName = regionData.regionSmallName;
            let thinClassName = regionData.regionThinName;
            taskMess.sectionName = sectionName;
            taskMess.smallClassName = smallClassName;
            taskMess.thinClassName = thinClassName;
            taskMess.status = status;
            taskMess.typeName = typeName;
            return taskMess;
        } catch (e) {
            console.log('_handleTaskMess', e);
        }
    }
    // 养护任务计划区域加载图层
    _handlePlanCoordLayer (str, task, eventKey, index, isFocus) {
        const {
            taskPlanLayerList,
            taskPlanMarkerLayerList
        } = this.state;
        try {
            let taskMess = this._handleTaskMess(task);
            let treearea = handleCoordinates(str);
            let message = {
                key: 3,
                type: 'task',
                properties: {
                    ID: taskMess.ID,
                    name: taskMess.CuringMans,
                    type: 'task',
                    typeName: taskMess.typeName || '',
                    status: taskMess.status || '',
                    CuringMans: taskMess.CuringMans || '',
                    Area: (taskMess.Area || '') + '亩',
                    CreateTime: taskMess.CreateTime || '',
                    PlanStartTime: taskMess.PlanStartTime || '',
                    PlanEndTime: taskMess.PlanEndTime || '',
                    StartTime: taskMess.StartTime || '',
                    EndTime: taskMess.EndTime || '',
                    sectionName: taskMess.sectionName || '',
                    smallClassName: taskMess.smallClassName || '',
                    thinClassName: taskMess.thinClassName || ''
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
            // 多选的话，只需要聚焦最后一个
            if (isFocus) {
                this.map.fitBounds(layer.getBounds());
            }
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
            taskPlanMarkerLayerList[eventKey] = marker;
            this.setState({
                taskPlanMarkerLayerList
            });
        } catch (e) {
            console.log('处理str', e);
        }
    }
    // 添加实际养护区域图层
    _handleRealCoordLayer (str, task, eventKey, index, isFocus) {
        const {
            taskRealLayerList,
            taskRealMarkerLayerList
        } = this.state;
        try {
            let taskMess = this._handleTaskMess(task);
            let treearea = handleCoordinates(str);
            let message = {
                key: 3,
                type: 'realTask',
                properties: {
                    type: 'realTask',
                    ID: taskMess.ID,
                    name: taskMess.CuringMans,
                    typeName: taskMess.typeName || '',
                    status: taskMess.status || '',
                    CuringMans: taskMess.CuringMans || '',
                    Area: (taskMess.Area || '') + '亩',
                    CreateTime: taskMess.CreateTime || '',
                    PlanStartTime: taskMess.PlanStartTime || '',
                    PlanEndTime: taskMess.PlanEndTime || '',
                    StartTime: taskMess.StartTime || '',
                    EndTime: taskMess.EndTime || '',
                    sectionName: taskMess.sectionName || '',
                    smallClassName: taskMess.smallClassName || '',
                    thinClassName: taskMess.thinClassName || ''
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            if (isFocus) {
                this.map.fitBounds(layer.getBounds());
            }
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (taskRealLayerList[eventKey]) {
                taskRealLayerList[eventKey].push(layer);
            } else {
                taskRealLayerList[eventKey] = [layer];
            }
            this.setState({
                taskRealLayerList
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
            taskRealMarkerLayerList[eventKey] = marker;
            this.setState({
                taskRealMarkerLayerList
            });
        } catch (e) {
            console.log('Realstr', e);
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
    // 确定圈选地图
    _handleCreateTaskOk = async () => {
        const {
            actions: {
                postThinClassesByRegion // 查询圈选地图内的细班
            },
            selectMap,
            checkedKeys,
            platform: {
                tree = {}
            }
        } = this.props;
        const {
            coordinates,
            treeCoords
        } = this.state;

        let sections = this.user.sections;
        this.sections = JSON.parse(sections);
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (!(this.sections && this.sections instanceof Array && this.sections.length > 0)) {
            Notification.error({
                message: '当前登录用户未关联标段，不能下发任务',
                duration: 2
            });
            return;
        }
        this.setState({
            taskModalVisible: true
        });
        let coords = [];
        let thinAreaNum = 0;
        if (selectMap === '细班选择') {
            let thinClassCoords = [];
            checkedKeys.map((key) => {
                if (treeCoords[key]) {
                    let arrData = treeCoords[key];
                    arrData.map((arr) => {
                        thinAreaNum = thinAreaNum + 1;
                        thinClassCoords = thinClassCoords.concat(arr);
                    });
                }
            });
            if (thinClassCoords.length === 1) {
                coords = thinClassCoords[0];
            } else {
                coords = thinClassCoords;
            }
        } else if (selectMap === '手动框选') {
            coords = coordinates;
        }
        try {
            let totalThinClass = tree.totalThinClass || [];
            // 坐标
            let wkt = '';
            // 选择面积
            let regionArea = 0;
            if (selectMap === '细班选择' && thinAreaNum > 1) {
                wkt = 'MULTIPOLYGON((';
                coords.map((coord, index) => {
                    let num = computeSignedArea(coord, 1);
                    regionArea = regionArea + num;
                    if (index === 0) {
                        // 获取细班选择坐标wkt
                        wkt = wkt + getWktData(coord);
                    } else {
                        wkt = wkt + ',' + getWktData(coord);
                    }
                });
                wkt = wkt + '))';
            } else if (selectMap === '手动框选') {
                wkt = 'POLYGON(';
                // 获取手动框选坐标wkt
                wkt = wkt + getHandleWktData(coords);
                wkt = wkt + ')';
                regionArea = computeSignedArea(coords, 2);
            } else {
                let num = computeSignedArea(coords, 1);
                regionArea = regionArea + num;
                wkt = 'POLYGON(';
                wkt = wkt + getWktData(coords);
                wkt = wkt + ')';
            }
            regionArea = regionArea * 0.0015;
            // 包括的细班号
            let regionThinClass = await postThinClassesByRegion({}, {WKT: wkt});
            let regionData = getThinClassName(regionThinClass, totalThinClass, this.sections);
            console.log('regionData', regionData);
            // let sectionBool = regionData.sectionBool;
            // if (!sectionBool) {
            //     Notification.error({
            //         message: '当前所选区域存在不属于登录用户所在标段，请重新选择区域',
            //         duration: 2
            //     });
            //     if (this.state.polygonData) {
            //         this.map.removeLayer(this.state.polygonData);
            //     }
            //     this.resetModalState();
            //     this.resetButState();
            //     return;
            // }
            let regionThinName = regionData.regionThinName;
            let regionThinNo = regionData.regionThinNo;
            let regionSectionNo = regionData.regionSectionNo;
            let regionSectionName = regionData.regionSectionName;
            // 区域内树木数量
            // let treeNum = await postTreeLocationNumByRegion({}, {WKT: wkt});
            this.setState({
                wkt,
                regionArea,
                // treeNum,
                regionData,
                regionThinName,
                regionThinNo,
                regionSectionNo,
                regionSectionName,
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
            this.resetButState();
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
        const {
            actions: {
                changeCheckedKeys
            }
        } = this.props;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        changeCheckedKeys([]);
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
            regionThinName: '',
            regionThinNo: '',
            regionSectionNo: '',
            regionSectionName: '',
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
        const {
            selectMap,
            actions: {
                changeCheckedKeys
            }
        } = this.props;
        const {
            polygonData,
            areaLayerList
        } = this.state;
        if (selectMap && selectMap !== prevProps.selectMap) {
            if (selectMap === '细班选择') {
                if (polygonData) {
                    this.map.removeLayer(polygonData);
                }
            } else {
                changeCheckedKeys([]);
                for (let i in areaLayerList) {
                    areaLayerList[i].map((layer) => {
                        this.map.removeLayer(layer);
                    });
                }
            }
            this.resetButState();
        }
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
