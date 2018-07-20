import React, { Component } from 'react';
import {
    Button
} from 'antd';
import DashPanel from '../DashPanel';
import {getThinClass, getSmallClass, fillAreaColor, getSectionName} from '../auth';
import TaskCreateModal from './TaskCreateModal';
import '../Curing.less';
window.config = window.config || {};

export default class TaskCreateTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNotThree: true,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 200 /* 菜单宽度 */,
            isVisibleMapBtn: true,
            mapLayerBtnType: true,
            selectedMenu: '1',
            projectList: [], // 区域地块项目级数据
            unitProjectList: [], // 区域地块区块级数据
            coordinates: [], // 圈选地图各个点的坐标
            areaLayerList: {}, // 选择各个细班的图层列表
            createBtnVisible: false, // 先建任务Modal的可视
            polygonData: '', // 全选地图图层
            centerPoint: '', // 全选地图的中心点
            treeNum: 0, // 圈选地图内的树木数量
            regionThinClass: [], // 圈选地图内的细班
            totalThinClass: [], // 全部细班
            regionThinName: '', // 圈选区域内的细班名称
            regionThinNo: '', // 圈选区域内的细班code
            regionSectionNo: '', // 圈选区域内的标段code
            regionSectionName: '', // 圈选区域内的标段名称
            wkt: ''

        };
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
        // 获取地块树数据
        this._loadAreaData();
        // 初始化地图
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
            let totalThinClass = [];
            unitProjectList.map(async unitProject => {
                let list = await getLittleBan({ no: unitProject.No });
                let smallClassList = getSmallClass(list);
                let unitProjectThinArr = [];
                smallClassList.map(smallClass => {
                    let thinClassList = getThinClass(smallClass, list);

                    unitProjectThinArr = unitProjectThinArr.concat(thinClassList);
                    smallClass.children = thinClassList;
                });
                totalThinClass.push({
                    unitProject: unitProject.No,
                    thinClass: unitProjectThinArr
                });
                unitProject.children = smallClassList;
                this.setState({
                    treeLists: projectList,
                    totalThinClass
                });
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
            if (me.state.centerPoint) {
                me.map.removeLayer(me.state.centerPoint);
            }
            let polygonData = L.polygon(coordinates, {
                color: 'white',
                fillColor: '#93B9F2',
                fillOpacity: 0.2
            }).addTo(me.map);
            console.log('polygonData', polygonData);
            // let test = polygonData.getCenter();
            // // debugger;
            // console.log('test', test);
            // console.log('[test.lat, test.lng]', [test.lat, test.lng]);
            // let centerPoint = L.polygon([[test.lat, test.lng]], {
            //     color: 'red',
            //     fillColor: '#93B9F2',
            //     fillOpacity: 0.2
            // }).addTo(me.map);

            me.setState({
                coordinates,
                polygonData: polygonData
                // centerPoint
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
        console.log('eventKey', eventKey);
        console.log('keys', keys);
        try {
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
                    } else {
                        // 如果不是添加过，需要请求数据
                        me._addAreaLayer(eventKey, treeNodeName);
                    }
                } else {
                    me.map.removeLayer(areaLayerList[eventKey]);
                }
            } else {
                if (checked) {
                    // 如果选中的不是细班，则需要进行遍历，找到此次点击的节点，然后一个个添加
                    let selectKeys = [];
                    const treeNodeName = info && info.node && info.node.props && info.node.props.title;
                    try {
                        keys.map((key) => {
                            let selectKey = key.split('#');
                            // if (key.indexOf(eventKey) !== -1 && selectKey.length === 2) {
                            //     selectKeys.push(selectKey[0]);
                            // }
                            if (selectKey.length <= 1) {
                                selectKeys.push(key);
                            }
                        });
                        console.log('selectKeys', selectKeys);
                        selectKeys.map((selectKey) => {
                            me._addAreaLayer(selectKey, treeNodeName);
                        });
                    } catch (e) {

                    }
                } else {

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
            me.setState({
                areaLayerList
            });
        } catch (e) {
            console.log('await', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
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
    _handleCreateTaskOk = async () => {
        const {
            actions: {
                getTreeLocationNumByRegion, // 查询圈选地图内的树木数量
                getThinClassesByRegion // 查询圈选地图内的细班
            }
        } = this.props;
        const {
            coordinates,
            totalThinClass
        } = this.state;
        try {
            let wkt = '';
            if (coordinates && coordinates.length >= 3) {
                let len = coordinates.length;
                for (let i = 0; i < coordinates.length; i++) {
                    if (i === 0) {
                        wkt = 'POLYGON((' + wkt + coordinates[i][1] + ' ' + coordinates[i][0] + ',';
                    } else if (i === len - 1) {
                        wkt = wkt + coordinates[i][1] + ' ' + coordinates[i][0] + ',' + coordinates[0][1] + ' ' + coordinates[0][0] + '))';
                    } else {
                        wkt = wkt + coordinates[i][1] + ' ' + coordinates[i][0] + ',';
                    }
                }
                console.log('coordinates', coordinates);
                console.log('totalThinClass', totalThinClass);
                console.log('wkt', wkt);
                // let treeNum = await getTreeLocationNumByRegion({wkt: wkt});
                let regionThinClass = await getThinClassesByRegion({wkt: wkt});
                let regionData = await this._getThinClassName(regionThinClass);
                console.log('regionData', regionData);
                let regionThinName = regionData.regionThinName;
                let regionThinNo = regionData.regionThinNo;
                let regionSectionNo = regionData.regionSectionNo;
                let regionSectionName = regionData.regionSectionName;
                this.setState({
                    taskModalVisible: true,
                    wkt,
                    // treeNum,
                    regionData,
                    regionThinName,
                    regionThinNo,
                    regionSectionNo,
                    regionSectionName
                });
            }
        } catch (e) {
            console.log('树木数量', e);
        }
    }
    // 查找区域内的细班的名称
    _getThinClassName = async (regionThinClass) => {
        const {
            totalThinClass
        } = this.state;

        let thinNoList = [];
        let regionThinNo = '';
        let regionThinName = '';
        let regionSectionNo = '';
        let regionSectionName = '';
        try {
            regionThinClass.map((thinData, index) => {
                let section = thinData.Section;
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
                totalThinClass.map((unitProjectData) => {
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
            regionSectionName: regionSectionName
        };
        console.log('regionThinName', regionThinName);
        console.log('regionThinNo', regionThinNo);
        console.log('regionSectionNo', regionSectionNo);
        console.log('regionSectionName', regionSectionName);
        return regionData;
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
