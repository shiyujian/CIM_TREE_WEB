import React, { Component } from 'react';
import {
    Button, Modal, Collapse, Notification, Spin, Checkbox
} from 'antd';
import AreaTreeReport from '../AreaTreeReport';
import TaskTree from '../TaskTree';
import {
    getThinClass,
    getSmallClass,
    fillAreaColor,
    getHandleWktData,
    computeSignedArea,
    getSectionName,
    genPopUpContent,
    getTaskThinClassName,
    getThinClassName,
    getIconType
} from '../auth';
import '../Curing.less';
import { getUser } from '_platform/auth';
import TaskReportModal from './TaskReportModal';
const Panel = Collapse.Panel;
window.config = window.config || {};

export default class TaskReportTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 260 /* 菜单宽度 */,
            mapLayerBtnType: true,
            selectedMenu: '1',
            // 区域地块树
            areaTreeData: [],
            areaLayerList: {}, // 细班选择图层list
            areaTreeLoading: true,
            // 养护任务树
            taskTreeData: [], // 养护任务tree数据
            taskTreeLoading: true,
            taskPlanLayerList: {}, // 任务图层list
            taskMarkerLayerList: {}, // 任务图标图层list
            taskRealLayerList: {},
            curingTypes: [], // 养护类型
            taskMessList: {}, // 养护任务详情list
            taskEventKey: '',
            taskTrackLayerList: {}, // 养护轨迹list
            taskCuringManList: {}, // 养护人员list
            // 手动框选
            createBtnVisible: false,
            coordinates: [],
            polygonData: '', // 圈选地图图层
            // 养护任务Modal
            selected: false,
            isShowTaskModal: false,
            taskMess: '',
            // treeNum: 0, // 圈选地图内的树木数量
            regionThinClass: [], // 圈选地图内的细班
            regionThinName: '', // 圈选区域内的细班名称
            regionThinNo: '', // 圈选区域内的细班code
            regionSectionNo: '', // 圈选区域内的标段code
            regionSectionName: '', // 圈选区域内的标段名称
            regionArea: 0, // 圈选区域内面积
            wkt: '',
            noLoading: false,
            treeLayerChecked: true
        };
        this.checkMarkers = [];
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.map = null;
        this.totalThinClass = [];
        this.sections = [];
        this.section = '';
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 260,
            maxWidth: 500
        };
    }

    options = [
        { label: '养护任务', value: 'geojsonFeature_task', IconName: 'task' },
        { label: '区域地块', value: 'geojsonFeature_area', IconName: 'square' }

    ];

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };

    async componentDidMount () {
        this.user = getUser();
        let sections = this.user.sections;
        this.sections = JSON.parse(sections);
        if (this.sections && this.sections instanceof Array && this.sections.length > 0) {
            this.section = this.sections[0];
        }
        // 初始化地图
        await this._initMap();
        // 获取地块树数据
        await this._loadAreaData();
        // 获取任务数据
        await this._loadTaskData();
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
            const {
                coordinates,
                createBtnVisible,
                selected
            } = me.state;
            if (!selected) {
                return;
            }
            coordinates.push([e.latlng.lat, e.latlng.lng]);
            if (coordinates.length > 0 && !createBtnVisible) {
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
                fillOpacity: 0.5
            }).addTo(me.map);
            me.setState({
                coordinates,
                polygonData: polygonData
            });
        });
        // 任务详情点击事件
        document
            .querySelector('.leaflet-popup-pane')
            .addEventListener('click', async function (e) {
                let target = e.target;
                // 绑定隐患详情点击事件
                if (target.getAttribute('class') === 'btnViewTask') {
                    me._handleCreateTaskOk();
                }
            });
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
                    if (this.user.username === 'admin') {
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
                    } else if (this.section) {
                        let sectionArr = this.section.split('-');
                        let projectKey = sectionArr[0];
                        let unitProjectKey = sectionArr[0] + '-' + sectionArr[1];
                        if (node.Type === '项目工程' && node.No.indexOf(projectKey) !== -1) {
                            projectList.push({
                                Name: node.Name,
                                No: node.No
                            });
                        } else if (node.Type === '子项目工程' && node.No.indexOf(unitProjectKey) !== -1) {
                            unitProjectList.push({
                                Name: node.Name,
                                No: node.No,
                                Parent: node.Parent
                            });
                        }
                    }
                });
                for (let i = 0; i < projectList.length; i++) {
                    projectList[i].children = unitProjectList.filter(node => {
                        return node.Parent === projectList[i].No;
                    });
                }
            }
            // let totalThinClass = [];
            for (let i = 0; i < unitProjectList.length; i++) {
                let unitProject = unitProjectList[i];
                let list = await getLittleBan({ no: unitProject.No });
                let smallClassList = getSmallClass(list);
                smallClassList.map(smallClass => {
                    let thinClassList = getThinClass(smallClass, list);
                    smallClass.children = thinClassList;
                });
                this.totalThinClass.push({
                    unitProject: unitProject.No,
                    smallClassList: smallClassList
                });
                unitProject.children = smallClassList;
            }
            this.setState({
                areaTreeData: projectList,
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
                getcCuringTypes
            }
        } = this.props;
        this.user = getUser();
        let sections = this.user.sections;
        sections = JSON.parse(sections);
        let taskTreeData = [];
        let curingTypes = [];
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let postData = {
                section: section
            };
            let curingTypesData = await getcCuringTypes();
            curingTypes = curingTypesData && curingTypesData.content;
            if (curingTypes && curingTypes.length > 0) {
                let curingTaskData = await getCuring({}, postData);
                let curingTasks = curingTaskData && curingTaskData.content;
                if (curingTasks && curingTasks instanceof Array && curingTasks.length > 0) {
                    for (let i = 0; i < curingTasks.length; i++) {
                        let task = curingTasks[i];
                        if (task && task.ID) {
                            curingTypes.map((type) => {
                                if (type.ID === task.CuringType) {
                                    let exist = false;
                                    let childData = [];
                                    // 查看TreeData里有无这个类型的数据，有的话，push
                                    taskTreeData.map((treeNode) => {
                                        if (treeNode.ID === type.ID) {
                                            exist = true;
                                            childData = treeNode.children;
                                            childData.push((task));
                                        }
                                    });
                                    // 没有的话，创建
                                    if (!exist) {
                                        childData.push(task);
                                        taskTreeData.push({
                                            ID: type.ID,
                                            Name: type.Base_Name,
                                            children: childData
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
        this.setState({
            taskTreeData,
            curingTypes,
            taskTreeLoading: false
        });
    }
    render () {
        const {
            createBtnVisible,
            selected
        } = this.state;
        return (
            <div className='Curing-container'>
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
                    <div className='treeControl2'>
                        <div className='buttonStyle'>
                            {
                                selected
                                    ? <Button type='primary' style={{marginRight: 10}} onClick={this._handleCreateTaskOk.bind(this)}>上报</Button>
                                    : ''
                            }
                            {
                                createBtnVisible
                                    ? (
                                        <div className='buttonStyle'>
                                            <Button type='info' style={{marginRight: 10}} onClick={this._handleCreateTaskRetreat.bind(this)}>上一步</Button>
                                            <Button type='danger' onClick={this._handleCreateTaskCancel.bind(this)}>撤销</Button>
                                        </div>
                                    )
                                    : ''
                            }
                        </div>
                    </div>
                    <TaskReportModal
                        {...this.props}
                        {...this.state}
                        onOk={this.handleModalCancel.bind(this)}
                        onCancel={this.handleModalCancel.bind(this)}
                    />
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
    treeLayerChange = () => {
        const {
            treeLayerChecked
        } = this.state;
        console.log('treeLayerChecked', treeLayerChecked);
        if (treeLayerChecked) {
            if (this.tileLayer2) {
                this.map.removeLayer(this.tileLayer2);
            }
        } else {
            if (this.tileLayer2) {
                this.tileLayer2.addTo(this.map);
            } else {
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
        }
        this.setState({
            treeLayerChecked: !treeLayerChecked
        });
    }
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            areaTreeData,
            taskTreeData,
            areaTreeLoading,
            taskTreeLoading
        } = this.state;
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <AreaTreeReport
                                {...this.props}
                                onCheck={this._handleAreaCheck.bind(this)}
                                content={areaTreeData}
                            />
                        </Spin>
                    );
                    // 养护任务
                case 'geojsonFeature_task':
                    return (
                        <Spin spinning={taskTreeLoading}>
                            <TaskTree
                                onSelect={this.handleTaskSelect.bind(this)}
                                content={taskTreeData}
                            />
                        </Spin>
                    );
            }
        }
    }
    // 选择细班是否展示数据，或是隐藏数据
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
                        me._addAreaLayer(eventKey, treeNodeName);
                    }
                } else {
                    if (areaLayerList[eventKey]) {
                        me.map.removeLayer(areaLayerList[eventKey]);
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
            var target = str
                .slice(str.indexOf('(') + 3, str.indexOf(')'))
                .split(',')
                .map(item => {
                    return item.split(' ').map(_item => _item - 0);
                });
            treearea.push(target);
            let message = {
                key: 3,
                type: 'Feature',
                properties: { name: treeNodeName, type: 'area' },
                geometry: { type: 'Polygon', coordinates: treearea }
            };

            let layer = this._createMarker(message);
            areaLayerList[eventKey] = layer;
            me.setState({
                areaLayerList
            });
        } catch (e) {
            console.log('await', e);
        }
    }
    // 任务点击节点
    handleTaskSelect = async (keys, info) => {
        const {
            taskPlanLayerList,
            taskRealLayerList,
            taskMarkerLayerList,
            taskTrackLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let eventKey = keys[0];
        // 当前的选中状态
        let selected = info.selected;
        if (!selected) {
            this.setState({
                selected
            });
        }
        this.setState({
            taskEventKey: eventKey
        });
        try {
            // 需要把圈选地图撤销
            me._handleCreateTaskCancel();
            // 单选，需要先全部去除图层
            // 去除养护任务计划区域图层
            for (let i in taskPlanLayerList) {
                taskPlanLayerList[i].map((layer) => {
                    this.map.removeLayer(layer);
                });
            }
            // 去除养护任务实际养护区域图层
            for (let i in taskRealLayerList) {
                taskRealLayerList[i].map((layer) => {
                    this.map.removeLayer(layer);
                });
            }
            // 去除养护任务图标图层
            for (let i in taskMarkerLayerList) {
                this.map.removeLayer(taskMarkerLayerList[i]);
            }
            // 去除养护任务轨迹图层
            for (let i in taskTrackLayerList) {
                taskTrackLayerList[i].map((layer) => {
                    this.map.removeLayer(layer);
                });
            }

            // 选中加载图层
            if (selected) {
                if (taskPlanLayerList[eventKey]) {
                    // 加载养护任务计划区域图层
                    taskPlanLayerList[eventKey].map((layer) => {
                        layer.addTo(me.map);
                        me.map.fitBounds(layer.getBounds());
                    });
                    // 加载养护任务实际养护区域图层
                    if (taskRealLayerList[eventKey]) {
                        taskRealLayerList[eventKey].map((layer) => {
                            layer.addTo(me.map);
                        });
                    }
                    // 加载养护任务图标图层
                    if (taskMarkerLayerList[eventKey]) {
                        taskMarkerLayerList[eventKey].addTo(me.map);
                    }
                    this.setState({
                        selected
                    });
                } else {
                    // 如果不是添加过，需要请求数据
                    me.getTaskWkt(eventKey);
                }
                // 加载养护任务轨迹图层
                if (taskTrackLayerList[eventKey]) {
                    taskTrackLayerList[eventKey].map((layer) => {
                        layer.addTo(this.map);
                    });
                } else {
                    this.getTaskTracks(eventKey);
                }
            }
        } catch (e) {
            console.log('任务选中', e);
        }
    }
    // 获取养护任务的计划和实际区域
    getTaskWkt = async (eventKey) => {
        const {
            actions: {
                getCuringMessage
            }
        } = this.props;
        try {
            let postData = {
                id: eventKey
            };
            let taskMess = await getCuringMessage(postData);
            let planWkt = taskMess.PlanWKT;
            let realWkt = taskMess.WKT || '';
            if (planWkt) {
                this._handleTaskWkt(planWkt, eventKey, taskMess, 'plan');
            }
            if (realWkt) {
                this._handleTaskWkt(realWkt, eventKey, taskMess, 'real');
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
                str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
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
    _handlePlanCoordLayer (str, taskMess, eventKey, index) {
        const {
            taskPlanLayerList,
            curingTypes,
            taskMarkerLayerList,
            taskMessList
        } = this.state;
        try {
            let target = str.split(',').map(item => {
                return item.split(' ').map(_item => _item - 0);
            });
            let treeNodeName = taskMess.CuringMans;
            let typeName = '';
            curingTypes.map((type) => {
                if (type.ID === taskMess.CuringType) {
                    typeName = type.Base_Name;
                }
            });
            let treearea = [];
            let status = '未完成';
            if (taskMess.Status === 2) {
                status = '已上报';
            } else if (taskMess.StartTime && taskMess.EndTime) {
                status = '已完成且未上报';
            }
            let regionData = getTaskThinClassName(taskMess, this.totalThinClass);
            let sectionName = regionData.regionSectionName;
            let smallClassName = regionData.regionSmallName;
            let thinClassName = regionData.regionThinName;
            taskMess.sectionName = sectionName;
            taskMess.smallClassName = smallClassName;
            taskMess.thinClassName = thinClassName;
            taskMess.status = status;
            taskMess.typeName = typeName;
            taskMessList[eventKey] = taskMess;
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
                    ID: taskMess.ID,
                    name: treeNodeName,
                    type: 'task',
                    typeName: typeName || '',
                    status: status || '',
                    CuringMans: taskMess.CuringMans || '',
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
            taskMarkerLayerList[eventKey] = marker;
            this.setState({
                taskMarkerLayerList,
                selected: true
            });
        } catch (e) {
            console.log('处理str', e);
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
            let treearea = [];
            let arr = [];
            target.map((data, index) => {
                if ((data[1] > 30) && (data[1] < 45) && (data[0] > 110) && (data[0] < 120)) {
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
        console.log('taskPositionMess', taskPositionMess);
        let taskTracks = taskPositionMess && taskPositionMess.content;
        if (taskTracks && taskTracks instanceof Array && taskTracks.length > 0) {
            this._addTrackLayer(taskTracks, eventKey);
        }
    }
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
            console.log('tracksList', tracksList);
            console.log('CuringManList', CuringManList);
            let layerList = [];
            tracksList.map((track, index) => {
                let polylineData = L.polyline(track, { color: 'black' }).addTo(
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
                fillOpacity: 0.1
            }).addTo(this.map);
            this.map.fitBounds(layer.getBounds());
            return layer;
        } else if (geo.properties.type === 'realTask') {
            let layer = L.polygon(geo.geometry.coordinates, {
                color: 'yellow',
                fillColor: 'yellow',
                fillOpacity: 0.5
            }).addTo(this.map);
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
    // 取消任务详情Modal
    handleModalCancel = () => {
        this.setState({
            isShowTaskModal: false,
            noLoading: false
        });
    }
    // 确定圈选地图
    _handleCreateTaskOk = async () => {
        const {
            actions: {
                // postTreeLocationNumByRegion, // 查询圈选地图内的树木数量
                postThinClassesByRegion // 查询圈选地图内的细班
            }
        } = this.props;
        const {
            coordinates,
            polygonData,
            taskEventKey,
            taskMessList
        } = this.state;
        // 首先查看有没有关联标段，没有关联的人无法获取人员
        if (!this.section) {
            Notification.error({
                message: '当前登录用户未关联标段，不能查看任务',
                duration: 2
            });
            return;
        }
        try {
            let taskMess = taskMessList[taskEventKey];
            if (polygonData) {
                if (coordinates && coordinates.length <= 2) {
                    Notification.error({
                        message: '圈选地图区域未形成封闭图形，请重新圈选区域',
                        duration: 3
                    });
                    return;
                }
                this.setState({
                    isShowTaskModal: true
                });
                // 选择面积
                let regionArea = 0;
                // 坐标
                let wkt = 'POLYGON(';
                wkt = wkt + getHandleWktData(coordinates);
                wkt = wkt + ')';
                regionArea = computeSignedArea(coordinates, 2);
                regionArea = regionArea * 0.0015;
                // 包括的细班号
                let regionThinClass = await postThinClassesByRegion({}, {WKT: wkt});
                // let regionData = await this._getThinClassName(regionThinClass);
                let regionData = getThinClassName(regionThinClass, this.totalThinClass, this.sections);
                // let sectionBool = regionData.sectionBool;
                // if (!sectionBool) {
                //     Notification.error({
                //         message: '当前所选任务不属于登录用户所在标段，请重新选择',
                //         duration: 2
                //     });
                //     this.map.removeLayer(polygonData);
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
                    noLoading: true,
                    taskMess
                });
            } else {
                this.setState({
                    noLoading: true,
                    isShowTaskModal: true,
                    taskMess
                });
            }
        } catch (e) {
            console.log('树木数量', e);
        }
    }
    // 撤销圈选图层
    _handleCreateTaskCancel =() => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        this.resetButState();
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
            fillColor: '#93B9F2',
            fillOpacity: 0.5
        }).addTo(me.map);
        me.setState({
            coordinates,
            polygonData: polygonData
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
