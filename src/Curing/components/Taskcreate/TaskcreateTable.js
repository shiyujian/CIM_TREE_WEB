import React, { Component } from 'react';
import {
    Button, Collapse, Notification, Spin, Checkbox
} from 'antd';
import DashPanel from '../DashPanel';
import TaskCheckTree from '../TaskCheckTree';
import {getThinClass, getSmallClass, fillAreaColor, getSectionName, getHandleWktData, getWktData, computeSignedArea, genPopUpContent, getIconType} from '../auth';
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
            menuWidth: 260 /* 菜单宽度 */,
            mapLayerBtnType: true,
            selectedMenu: '1',
            treeLayerChecked: true,
            // 细班树
            areaTreeData: [],
            areaTreeLoading: false,
            // 养护任务树
            taskTreeData: [], // 养护任务tree数据
            curingTypes: [],
            taskLayerList: {},
            taskMarkerLayerList: {},
            taskMessList: {}, // 养护任务详情list
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
        this.tileLayer2 = null;
        this.map = null;
        this.sections = [];
        this.section = '';
        this.totalThinClass = [];
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
        { label: '区域地块', value: 'geojsonFeature_area', IconName: 'square' },
        { label: '养护任务', value: 'geojsonFeature_task', IconName: 'task' }
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
            areaTreeData,
            areaTreeLoading,
            taskTreeData
        } = this.state;
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <DashPanel
                                {...this.props}
                                style={{ height: '200px' }}
                                onCheck={this.handleAreaCheck.bind(this)}
                                onSelect={this.handleAreaSelect.bind(this)}
                                content={areaTreeData}
                            />
                        </Spin>

                    );
                case 'geojsonFeature_task':
                    return (
                        <TaskCheckTree
                            onCheck={this.handleTaskCheck.bind(this)}
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
            await this._loadAreaData();
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
                fillColor: '#93B9F2',
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
            actions: { getTreeNodeList, getLittleBan }
        } = this.props;
        try {
            this.setState({
                areaTreeLoading: true
            });
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
            for (let i = 0; i < unitProjectList.length; i++) {
                let unitProject = unitProjectList[i];
                let list = await getLittleBan({ no: unitProject.No });
                let smallClassList = getSmallClass(list);
                let unitProjectThinArr = [];
                smallClassList.map(smallClass => {
                    let thinClassList = getThinClass(smallClass, list);

                    unitProjectThinArr = unitProjectThinArr.concat(thinClassList);
                    smallClass.children = thinClassList;
                });
                this.totalThinClass.push({
                    unitProject: unitProject.No,
                    thinClass: unitProjectThinArr
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
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let postData = {
                section: section
            };
            let curingTypesData = await getcCuringTypes();
            let curingTypes = curingTypesData && curingTypesData.content;
            let taskTreeData = [];
            if (curingTypes && curingTypes.length > 0) {
                let curingTaskData = await getCuring({}, postData);
                let curingTasks = curingTaskData.content;
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
            console.log('taskTreeData', taskTreeData);
            this.setState({
                taskTreeData,
                curingTypes
            });
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
    /* 选中节点 */
    async handleAreaSelect (keys, info) {
    }
    // 选择细班是否展示数据，或是隐藏数据
    async handleAreaCheck (keys, info) {
        const {
            areaLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let eventKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        try {
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
                        areaLayerList[eventKey].addTo(me.map);
                        me.map.fitBounds(areaLayerList[eventKey].getBounds());
                        this.setState({
                            createBtnVisible: true
                        });
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
            areaLayerList,
            treeCoords
        } = this.state;
        const {
            actions: {
                getTreearea
            }
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

            let layer = this._createMarker(message);
            areaLayerList[eventKey] = layer;
            treeCoords[eventKey] = treearea;
            if (treeCoords && Object.keys(treeCoords).length > 0) {
                this.setState({
                    createBtnVisible: true
                });
            } else {
                this.setState({
                    createBtnVisible: false
                });
            }
            me.setState({
                areaLayerList,
                treeCoords
            });
        } catch (e) {
            console.log('await', e);
        }
    }
    // 任务选中节点
    handleTaskCheck = async (keys, info) => {
        console.log('keys', keys);
        console.log('info', info);
        try {
            let eventKey = info.node.props.eventKey;
            // 当前的选中状态
            let checked = info.checked;
            if (info && info.node && info.node.props && info.node.props.children) {
                let children = info.node.props.children;
                children.map((child, index) => {
                    eventKey = child.key;
                    if (checked) {
                        if (index === children.length - 1) {
                            this.handleTaskAddLayer(eventKey, true);
                        } else {
                            this.handleTaskAddLayer(eventKey, false);
                        }
                    } else {
                        this.handleTaskDelLayer(eventKey);
                    }
                });
            } else {
                if (checked) {
                    this.handleTaskAddLayer(eventKey, true);
                } else {
                    this.handleTaskDelLayer(eventKey);
                }
            }
        } catch (e) {
            console.log('handleTaskCheck', e);
        }
    }
    // 去除图层
    handleTaskDelLayer = async (eventKey) => {
        const {
            taskLayerList,
            taskMarkerLayerList
        } = this.state;
        if (taskLayerList[eventKey]) {
            taskLayerList[eventKey].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
        if (taskMarkerLayerList[eventKey]) {
            this.map.removeLayer(taskMarkerLayerList[eventKey]);
        }
    }
    // 处理每个check的任务如何加载图层
    handleTaskAddLayer = async (eventKey, isFocus) => {
        const {
            taskLayerList,
            taskMarkerLayerList
        } = this.state;
        if (taskLayerList[eventKey]) {
            taskLayerList[eventKey].map((layer) => {
                layer.addTo(this.map);
                if (isFocus) {
                    this.map.fitBounds(layer.getBounds());
                }
            });
            if (taskMarkerLayerList[eventKey]) {
                taskMarkerLayerList[eventKey].addTo(this.map);
            }
        } else {
            // 如果不是添加过，需要请求数据
            this._addTaskLayer(eventKey, isFocus);
        }
    }
    _addTaskLayer = async (eventKey, isFouus) => {
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
            let WKT = taskMess.WKT || taskMess.PlanWKT;
            console.log('WKT', WKT);
            let str = '';
            if (WKT.indexOf('MULTIPOLYGON') !== -1) {
                let data = WKT.slice(WKT.indexOf('(') + 2, WKT.indexOf('))') + 1);
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
                        this._handleCoordLayer(str, taskMess, eventKey, index, isFouus);
                    } else {
                        // 其他图形中不设置图标
                        this._handleCoordLayer(str, taskMess, eventKey);
                    }
                });
            } else {
                str = WKT.slice(WKT.indexOf('(') + 3, WKT.indexOf(')'));
                // 只有一个图形，必须要设置图标
                this._handleCoordLayer(str, taskMess, eventKey, 1, isFouus);
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    // 养护任务加载图层
    _handleCoordLayer (str, taskMess, eventKey, index, isFouus) {
        const {
            taskLayerList,
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
            if (taskMess.StartTime && taskMess.EndTime) {
                status = '已完成';
            }
            let regionData = this.getTaskThinClassName(taskMess);
            let sectionName = regionData.regionSectionName;
            let thinClassName = regionData.regionThinName;
            taskMess.sectionName = sectionName;
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
                    EndTime: taskMess.EndTime || ''
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
            // 多选的话，只需要聚焦最后一个
            if (isFouus) {
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
            taskMarkerLayerList[eventKey] = marker;
            this.setState({
                taskMarkerLayerList,
                selected: true
            });
        } catch (e) {
            console.log('处理str', e);
        }
    }
    getTaskThinClassName = (task) => {
        try {
            let thinClass = task.ThinClass;
            let section = task.Section;
            let thinClassList = thinClass.split(',');
            let regionSectionName = '';
            let regionThinName = '';
            if (thinClassList && thinClassList instanceof Array && thinClassList.length > 0) {
                thinClassList.map((thinNo, index) => {
                    this.totalThinClass.map((unitProjectData) => {
                        let unitProject = unitProjectData.unitProject;
                        // 首先根据区块找到对应的细班list
                        if (section.indexOf(unitProject) !== -1) {
                            let children = unitProjectData.thinClass;
                            children.map((child) => {
                            // tree结构的数据经过了处理，需要和api获取的数据调整一致
                                let handleKey = child.No.split('-');
                                let childNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                                let childSection = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                                if (thinNo.indexOf(childNo) !== -1 && childSection === section) {
                                // 找到符合条件的数据的name
                                    let name = child.Name;
                                    let sectionName = getSectionName(section);
                                    regionSectionName = sectionName;
                                    if (index === 0) {
                                        regionThinName = regionThinName + name;
                                    } else {
                                        regionThinName = regionThinName + ' ,' + name;
                                    }
                                }
                            });
                        }
                    });
                });
            }

            let regionData = {
                regionThinName: regionThinName,
                regionSectionName: regionSectionName
            };
            return regionData;
        } catch (e) {
            console.log('getTaskThinClassName', e);
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
    // 确定圈选地图
    _handleCreateTaskOk = async () => {
        const {
            actions: {
                postTreeLocationNumByRegion, // 查询圈选地图内的树木数量
                postThinClassesByRegion // 查询圈选地图内的细班
            },
            selectMap,
            checkedKeys
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
                    thinAreaNum = thinAreaNum + 1;
                    let arr = treeCoords[key];
                    thinClassCoords = thinClassCoords.concat(arr);
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
            let regionData = await this._getThinClassName(regionThinClass);
            let sectionBool = regionData.sectionBool;
            if (!sectionBool) {
                Notification.error({
                    message: '当前所选区域存在不属于登录用户所在标段，请重新选择区域',
                    duration: 2
                });
                if (this.state.polygonData) {
                    this.map.removeLayer(this.state.polygonData);
                }
                this.resetModalState();
                this.resetButState();
                return;
            }
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
    // 查找区域内的细班的名称
    _getThinClassName = async (regionThinClass) => {
        // 细班数组，查看细班是否重复，重复不再查询
        let thinNoList = [];
        // 经过筛选后的细班No
        let regionThinNo = '';
        // 经过筛选后的细班Name
        let regionThinName = '';
        // 经过筛选后的标段No
        let regionSectionNo = '';
        // 经过筛选后的标段Name
        let regionSectionName = '';
        // 标段是否是登陆用户所在标段
        let sectionBool = true;
        let signSection = this.sections[0];
        try {
            regionThinClass.map((thinData, index) => {
                let section = thinData.Section;
                // 如果圈选的区域不在登录用户的标段内，则不能下发任务
                if (signSection !== section) {
                    sectionBool = false;
                    return;
                }
                // 如果圈选的区域不在登录用户的标段内，不需要循环获取数据
                if (!sectionBool) {
                    return;
                }
                let thinNo = thinData.no;
                let pushState = true;
                // 获取的thinNo可能又会重复的，需要进行处理
                thinNoList.map((data) => {
                    if (data === thinNo) {
                        pushState = false;
                    }
                });
                if (!pushState) {
                    return;
                }
                thinNoList.push(thinNo);
                this.totalThinClass.map((unitProjectData) => {
                    let unitProject = unitProjectData.unitProject;
                    // 首先根据区块找到对应的细班list
                    if (section.indexOf(unitProject) !== -1) {
                        let children = unitProjectData.thinClass;
                        children.map((child) => {
                        // tree结构的数据经过了处理，需要和api获取的数据调整一致
                            let handleKey = child.No.split('-');
                            let childNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                            let childSection = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                            if (childNo.indexOf(thinNo) !== -1 && childSection === section) {
                            // 找到符合条件的数据的name
                                let name = child.Name;
                                let sectionName = getSectionName(section);
                                regionSectionNo = section;
                                regionSectionName = sectionName;
                                if (index === 0) {
                                    regionThinName = regionThinName + name;
                                    regionThinNo = regionThinNo + thinNo;
                                } else {
                                    regionThinName = regionThinName + ' ,' + name;
                                    regionThinNo = regionThinNo + ' ,' + thinNo;
                                }
                            }
                        });
                    }
                });
            });
        } catch (e) {
            console.log('细班名称', e);
        }
        let regionData = {
            regionThinName: regionThinName,
            regionThinNo: regionThinNo,
            regionSectionNo: regionSectionNo,
            regionSectionName: regionSectionName,
            sectionBool: sectionBool
        };
        return regionData;
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
            this.map.removeLayer(areaLayerList[i]);
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
                    this.map.removeLayer(areaLayerList[i]);
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
