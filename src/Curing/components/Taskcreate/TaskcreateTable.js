import React, { Component } from 'react';
import {
    Button, Collapse
} from 'antd';
import DashPanel from '../DashPanel';
import {getThinClass, getSmallClass, fillAreaColor, getSectionName} from '../auth';
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
            regionArea: 0, // 圈选区域内面积
            wkt: '',
            areaData: [],
            noLoading: false,
            treeCoords: {}
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
            minWidth: 260,
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
                createBtnVisible,
                areaData
            } = me.state;
            const {
                selectMap
            } = me.props;
            if (selectMap === '细班选择') {
                return;
            }
            console.log('coordinates', coordinates);
            coordinates.push([e.latlng.lat, e.latlng.lng]);
            areaData.push(e.latlng);
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
                polygonData: polygonData,
                areaData
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
                                onOk={this.handleTaskModalOk.bind(this)}
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

    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            treeLists
        } = this.state;
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <DashPanel
                            {...this.props}
                            style={{ height: '200px' }}
                            onCheck={this.handleAreaCheck.bind(this)}
                            onSelect={this.handleAreaSelect.bind(this)}
                            content={treeLists}
                        />
                    );
                // 养护任务
                case 'geojsonFeature_task':
                    return (
                        <DashPanel
                            // onCheck={this.handleRiskCheck.bind(this)}
                            // onSelect={this.handleRiskSelect.bind(this)}
                            // content={content}
                            // userCheckKeys={this.state.userCheckedKeys}
                        />
                    );
            }
        }
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
                    // if (treeCoords[eventKey]) {
                    //     delete treeCoords[eventKey];
                    // }
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
            console.log('target1', target1);
            console.log('treearea', treearea);
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
            },
            selectMap,
            checkedKeys
        } = this.props;
        const {
            coordinates,
            totalThinClass,
            treeCoords
        } = this.state;
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
            console.log('thinClassCoords', thinClassCoords);
            if (thinClassCoords.length === 1) {
                coords = thinClassCoords[0];
            } else {
                coords = thinClassCoords;
            }
        } else if (selectMap === '手动框选') {
            console.log('coordinates', coordinates);
            coords = coordinates;
        }
        console.log('coords', coords);
        try {
            // 坐标
            let wkt = '';
            // 选择面积
            let regionArea = 0;
            if (selectMap === '细班选择' && thinAreaNum > 1) {
                wkt = 'MULTIPOLYGON((';
                coords.map((coord, index) => {
                    let num = this.computeSignedArea(coord);
                    console.log('num', num);
                    regionArea = regionArea + num;
                    console.log('regionArea', regionArea);
                    console.log('wkt', wkt);
                    if (index === 0) {
                        wkt = wkt + this._getWktData(coord);
                    } else {
                        wkt = wkt + ',' + this._getWktData(coord);
                    }
                });
                wkt = wkt + '))';
            } else if (selectMap === '手动框选') {
                wkt = 'POLYGON(';
                wkt = wkt + this._getHandleWktData(coords);
                wkt = wkt + ')';
                regionArea = this.computeSignedArea(coords);
                console.log('regionArea', regionArea);
            } else {
                let num = this.computeSignedArea(coords);
                console.log('num', num);
                regionArea = regionArea + num;
                console.log('regionArea', regionArea);
                console.log('wkt', wkt);
                wkt = 'POLYGON(';
                wkt = wkt + this._getWktData(coords);
                wkt = wkt + ')';
            }
            console.log('wktwktwktwktwktwktwkt', wkt);
            console.log('totalThinClass', totalThinClass);

            // 区域内树木数量
            let treeNum = await getTreeLocationNumByRegion({wkt: wkt});
            // 包括的细班号
            let regionThinClass = await getThinClassesByRegion({wkt: wkt});
            console.log('regionThinClass', regionThinClass);
            let regionData = await this._getThinClassName(regionThinClass);
            console.log('treeNum', treeNum);
            let regionThinName = regionData.regionThinName;
            let regionThinNo = regionData.regionThinNo;
            let regionSectionNo = regionData.regionSectionNo;
            let regionSectionName = regionData.regionSectionName;
            this.setState({
                wkt,
                regionArea,
                treeNum,
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
    // 获取手动框选坐标wkt
    _getHandleWktData (coords) {
        let wkt = '';
        let len = coords.length;
        for (let i = 0; i < coords.length; i++) {
            if (i === 0) {
                wkt = '(' + wkt + coords[i][1] + ' ' + coords[i][0] + ',';
            } else if (i === len - 1) {
                wkt = wkt + coords[i][1] + ' ' + coords[i][0] + ',' + coords[0][1] + ' ' + coords[0][0] + ')';
            } else {
                wkt = wkt + coords[i][1] + ' ' + coords[i][0] + ',';
            }
        }
        return wkt;
    }
    // 获取细班选择坐标wkt
    _getWktData (coords) {
        let wkt = '';
        let len = coords.length;
        for (let i = 0; i < coords.length; i++) {
            if (i === 0) {
                wkt = '(' + wkt + coords[i][0] + ' ' + coords[i][1] + ',';
            } else if (i === len - 1) {
                wkt = wkt + coords[i][0] + ' ' + coords[i][1] + ',' + coords[0][0] + ' ' + coords[0][1] + ')';
            } else {
                wkt = wkt + coords[i][0] + ' ' + coords[i][1] + ',';
            }
        }
        return wkt;
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
        return regionData;
    }
    // 查找区域面积
    computeSignedArea (path) {
        const {
            selectMap
        } = this.props;
        console.log('path', path);
        let radius = 6371009;
        let len = path.length;
        if (len < 3) return 0;
        let total = 0;
        let prev = path[len - 1];
        let indexT = 1;
        let indexG = 0;
        if (selectMap === '细班选择') {
            indexT = 0;
            indexG = 1;
        }
        let prevTanLat = Math.tan(((Math.PI / 2 - prev[indexG] / 180 * Math.PI) / 2));
        let prevLng = (prev[indexT]) / 180 * Math.PI;
        for (let i in path) {
            let tanLat = Math.tan((Math.PI / 2 -
                (path[i][indexG]) / 180 * Math.PI) / 2);
            let lng = (path[i][indexT]) / 180 * Math.PI;
            total += this.polarTriangleArea(tanLat, lng, prevTanLat, prevLng);
            prevTanLat = tanLat;
            prevLng = lng;
        }
        return Math.abs(total * (radius * radius));
    }
    polarTriangleArea (tan1, lng1, tan2, lng2) {
        let deltaLng = lng1 - lng2;
        let t = tan1 * tan2;
        return 2 * Math.atan2(t * Math.sin(deltaLng), 1 + t * Math.cos(deltaLng));
    }
    // 撤销圈选图层
    _handleCreateTaskCancel =() => {
        const {
            polygonData
        } = this.state;
        const {
            selectMap
        } = this.props;
        if (selectMap === '手动框选') {
            if (polygonData) {
                this.map.removeLayer(polygonData);
            }
            this.setState({
                createBtnVisible: false,
                polygonData: '',
                coordinates: []
            });
        }
    }
    // 确认下发任务
    handleTaskModalOk = () => {
        const {
            polygonData
        } = this.state;
        this.map.removeLayer(polygonData);
        this.setState({
            createBtnVisible: false,
            polygonData: '',
            coordinates: [],
            taskModalVisible: false,
            noLoading: false,
            treeNum: 0,
            regionThinClass: [],
            totalThinClass: [],
            regionThinName: '',
            regionThinNo: '',
            regionSectionNo: '',
            regionSectionName: '',
            regionArea: 0,
            wkt: ''
        });
    }
    // 取消下发任务
    handleTaskModalCancel = () => {
        this.setState({
            taskModalVisible: false,
            noLoading: false,
            treeNum: 0,
            regionThinClass: [],
            totalThinClass: [],
            regionThinName: '',
            regionThinNo: '',
            regionSectionNo: '',
            regionSectionName: '',
            regionArea: 0,
            wkt: ''
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
                this.setState({
                    createBtnVisible: false,
                    polygonData: '',
                    coordinates: []
                });
            } else {
                changeCheckedKeys([]);
                for (let i in areaLayerList) {
                    this.map.removeLayer(areaLayerList[i]);
                }
            }
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
