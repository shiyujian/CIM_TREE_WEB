import React, { Component } from 'react';
import {
    Button, Modal, Collapse
} from 'antd';
import PanelTree from '../PanelTree';
import TaskTree from '../TaskTree';
import {getThinClass, getSmallClass, fillAreaColor} from '../auth';
import '../Curing.less';
import { getUser } from '_platform/auth';
const Panel = Collapse.Panel;
window.config = window.config || {};

export default class TaskStatisTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 260 /* 菜单宽度 */,
            isVisibleMapBtn: true,
            mapLayerBtnType: true,
            selectedMenu: '1',
            treeType: [],
            projectList: [],
            unitProjectList: [],
            coordinates: [],
            polygon: '',
            areaLayerList: {},
            polygonData: '',
            TaskTreeData: [],
            taskLayerList: {}
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

    async componentDidMount () {
        // 获取任务数据
        this._loadTaskData();
        // 获取地块树数据
        this._loadAreaData();
        // 初始化地图
        this._initMap();
    }
    // 获取任务数据
    async _loadTaskData () {
        const {
            actions: {
                getCuring,
                getcCuringTypes
            }
        } = this.props;
        let user = getUser();
        let sections = user.sections;
        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let postData = {
                section: 'P010-01-01'
            };
            let curingTypes = await getcCuringTypes();
            let content = curingTypes && curingTypes.content;
            if (content && content.length > 0) {
                let curingTaskData = await getCuring({}, postData);
                console.log('curingTaskData', curingTaskData);
                let curingTasks = curingTaskData.content;
                console.log('curingTasks', curingTasks);
                let TaskTreeData = [];
                curingTasks.map((task) => {
                    if (task && task.ID) {
                        content.map((type) => {
                            if (type.ID === task.CuringType) {
                                console.log('type', type);
                                let exist = false;
                                let childData = [];
                                // 查看TreeData里有无这个类型的数据，有的话，push
                                TaskTreeData.map((treeNode) => {
                                    if (treeNode.ID === type.ID) {
                                        exist = true;
                                        childData = treeNode.children;
                                        childData.push((task));
                                    }
                                });
                                // 没有的话，创建
                                if (!exist) {
                                    childData.push(task);
                                    TaskTreeData.push({
                                        ID: type.ID,
                                        Name: type.Base_Name,
                                        children: childData
                                    });
                                }
                            }
                        });
                    }
                });
                this.setState({
                    TaskTreeData
                });
            }
        }
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
    }
    render () {
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
                            {/* <div style={{ height: '20px' }} /> */}
                        </aside>
                        {/* <div
                            className='resizeSenseArea'
                            onMouseDown={this._onStartResizeMenu.bind(this)}
                        /> */}
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
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            treeLists,
            TaskTreeData
        } = this.state;
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <PanelTree
                            {...this.props}
                            tyle={{ height: '200px' }}
                            onCheck={this._handleAreaCheck.bind(this)}
                            onSelect={this._handleAreaSelect.bind(this)}
                            content={treeLists}
                        />
                    );
                    // 养护任务
                case 'geojsonFeature_task':
                    return (
                        <TaskTree
                            onCheck={this.handleTaskCheck.bind(this)}
                            onSelect={this.handleTaskSelect.bind(this)}
                            content={TaskTreeData}
                        />
                    );
            }
        }
    }
    /* 选中节点 */
    async _handleAreaSelect (keys, info) {
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
                    me.map.removeLayer(areaLayerList[eventKey]);
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
            me.setState({
                areaLayerList
            });
        } catch (e) {
            console.log('await', e);
        }
    }
    // 任务点击节点
    handleTaskSelect = async (keys, info) => {
        console.log('keys', keys);
        console.log('info', info);
        let me = this;
        // 当前选中的节点
        let eventKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
    }
    // 任务选中节点
    handleTaskCheck = async (keys, info) => {
        const {
            taskLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let eventKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        console.log('keys', keys);
        console.log('info', info);
        try {
            if (checked) {
                if (taskLayerList[eventKey]) {
                    taskLayerList[eventKey].addTo(me.map);
                    me.map.fitBounds(taskLayerList[eventKey].getBounds());
                } else {
                    // 如果不是添加过，需要请求数据
                    me._addTaskLayer(eventKey);
                }
            } else {
                me.map.removeLayer(taskLayerList[eventKey]);
            }
        } catch (e) {
            console.log('任务选中', e);
        }
    }
    _addTaskLayer = async (eventKey) => {
        const {
            actions: {
                getCuringMessage
            }
        } = this.props;
        let postData = {
            id: eventKey
        };
        let taskMess = await getCuringMessage(postData);
        console.log('taskMess', taskMess);
        let planWkt = taskMess.PlanWKT;

        let str = '';
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
                this._handleCoordLayer();
            });
        } else {
            str = planWkt.slice(planWkt.indexOf('(') + 3, planWkt.indexOf(')'));
        }
    }
    _handleCoordLayer (str, taskMess) {
        let target1 = str.split(',').map(item => {
            return item.split(' ').map(_item => _item - 0);
        });
        let treeNodeName = taskMess.CuringMans;
        let treearea = [];
        treearea.push(target1);
        let message = {
            key: 3,
            type: 'Feature',
            properties: { name: treeNodeName, type: 'task' },
            geometry: { type: 'Polygon', coordinates: treearea }
        };
        let layer = this._createMarker(message);
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        if (geo.properties.type !== 'area') {
            if (
                !geo.geometry.coordinates[0] ||
                !geo.geometry.coordinates[1]
            ) {
                return;
            }
            let iconType = L.divIcon({
                className: this.getIconType(geo.type)
            });
            let marker = L.marker(geo.geometry.coordinates, {
                icon: iconType,
                title: geo.properties.name
            });
            marker.bindPopup(
                L.popup({ maxWidth: 240 }).setContent(
                    this.genPopUpContent(geo)
                )
            );
            marker.addTo(this.map);
            return marker;
        } else {
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
