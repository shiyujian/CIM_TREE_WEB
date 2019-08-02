import React, { Component } from 'react';
import {
    Button, Collapse, Notification, Spin, Checkbox, Popconfirm
} from 'antd';
import L from 'leaflet';
import AreaTree from '../AreaTree';
import {FOREST_GIS_API, WMSTILELAYERURL, TILEURLS, INITLEAFLET_API} from '_platform/api';
import CheckGroupTree from '../CheckGroupTree';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from '../auth';
import {
    computeSignedArea,
    handlePOLYGONWktData
} from '_platform/gisAuth';
import ScopeCreateModal from './ScopeCreateModal';
import '../Checkwork.less';

const Panel = Collapse.Panel;

export default class ScopeCreateTable extends Component {
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
            groupSelectKey: '', // 考勤群体选中节点的KEY
            groupSelectTitle: '', // 考勤群体选中节点的名字
            groupScopeDataList: {}, // 考勤群体选中节点电子围栏数据
            groupScopeStatus: false, // 考勤群体选中节点是否存在电子围栏
            // 手动框选
            coordinates: [], // 圈选地图各个点的坐标
            createBtnVisible: false, // 控制圈选地图的按钮的Visible
            polygonData: '', // 圈选地图图层
            // 图层数据
            areaLayerList: {}, // 选择各个细班的图层列表
            groupScopeLayerList: {}, // 各个群体的图层列表
            regionArea: 0, // 圈选区域内面积
            // 创建电子围栏的Modal数据
            noLoading: false,
            scopeModalVisible: false, // 创建电子围栏的Modal的visible
            scopeAddStatus: '创建' // 是创建电子围栏，还是更新电子围栏
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
        { label: '考勤管理', value: 'geojsonFeature_checkWork' },
        { label: '区域地块', value: 'geojsonFeature_area' }
    ];
    subDomains = ['7'];
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
        L.tileLayer(WMSTILELAYERURL, {
            subdomains: [1, 2, 3],
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
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
        const {
            groupScopeLayerList,
            groupScopeDataList
        } = this.state;
        try {
            this._handleCreateScopeCancel();
            // 节点的点击状态
            let selected = info.selected;
            // 节点的具体信息
            let node = info.node.props;
            // 点击节点的key
            let eventKey = (keys && keys[0]) || '';
            // 点击节点是否存在电子围栏数据
            let groupScopeStatus = false;
            // 群体的名称
            let groupSelectTitle = '';
            for (let i in groupScopeLayerList) {
                this.map.removeLayer(groupScopeLayerList[i]);
            }
            if (selected) {
                // 群体名称
                groupSelectTitle = node.title;
                // 如果之前获取过数据  则直接加载
                if (groupScopeLayerList[eventKey]) {
                    groupScopeLayerList[eventKey].addTo(this.map);
                    this.map.fitBounds(groupScopeLayerList[eventKey].getBounds());
                    groupScopeStatus = true;
                } else {
                    // 否则重新获取
                    let data = await getCheckScope({groupId: eventKey});
                    // 存在数据  说明有电子围栏
                    if (data && data.content && data.content instanceof Array && data.content.length > 0) {
                        groupScopeStatus = true;
                        groupScopeDataList[eventKey] = data.content[0];
                        // 点击群体的电子围栏的坐标数据
                        let wkt = data.content[0].Gem;
                        let str = '';
                        let groupScopeData = '';
                        if (wkt) {
                            str = handlePOLYGONWktData(wkt);
                            groupScopeData = handleCoordinates(str);
                            let groupScopeLayer = L.polygon(groupScopeData, {
                                color: 'yellow',
                                fillColor: 'yellow',
                                fillOpacity: 0.3
                            }).addTo(this.map);
                            this.map.fitBounds(groupScopeLayer.getBounds());
                            groupScopeLayerList[eventKey] = groupScopeLayer;
                        }
                    }
                }
            }
            this.setState({
                groupSelectKey: eventKey,
                groupSelected: selected,
                groupSelectTitle,
                groupScopeStatus,
                groupScopeDataList,
                groupScopeLayerList
            });
        } catch (e) {
            console.log('handleGroupSelect', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        if (geo.properties.type === 'area') {
            // 创建区域图形
            let layer = L.polygon(geo.geometry.coordinates, {
                color: '#201ffd',
                fillColor: fillAreaColor(geo.key),
                fillOpacity: 0.3
            }).addTo(this.map);
            return layer;
        }
    }
    // 更新电子围栏按钮
    _handlePutScope = async () => {
        this.setState({
            createBtnVisible: true,
            scopeAddStatus: '更新'
        });
    }
    // 增加电子围栏按钮
    _handleAddScope = async () => {
        this.setState({
            createBtnVisible: true,
            scopeAddStatus: '创建'
        });
    }
    // 删除电子围栏按钮
    _handleDelectScope = async () => {
        const {
            groupScopeDataList,
            groupSelectKey
        } = this.state;
        const {
            actions: {
                deleteCheckScope
            }
        } = this.props;
        try {
            // 删除选中群体的电子围栏
            let data = await deleteCheckScope({id: groupScopeDataList[groupSelectKey].id});
            if (data && data.code && data.code === 1) {
                Notification.success({
                    message: '电子围栏删除成功',
                    duration: 3
                });
                this.deleteGroupSelectScope();
            } else {
                Notification.error({
                    message: '电子围栏删除失败',
                    duration: 3
                });
                return;
            }
        } catch (e) {
            console.log('delete', e);
        }
    }
    // 确定圈选地图
    _handleCreateScopeOk = async () => {
        const {
            coordinates
        } = this.state;
        this.setState({
            scopeModalVisible: true
        });
        try {
            // 坐标
            // 选择面积
            let regionArea = 0;
            regionArea = computeSignedArea(coordinates, 2);

            regionArea = regionArea * 0.0015;
            this.setState({
                regionArea,
                noLoading: true
            });
        } catch (e) {
            console.log('树木数量', e);
        }
    }
    // 圈选图层返回上一步
    _handleCreateScopeRetreat = async () => {
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
    _handleCreateScopeCancel =() => {
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
        this.reSetButState();
    }
    // 确认下发任务
    handleScopeModalOk = async () => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        await this.deleteGroupSelectScope();
        // 取消下发任务时清空之前存储的state
        await this.reSetModalState();
        // 取消圈选地图和按钮的visible
        await this.reSetButState();
        // 更新电子围栏之后，需要重新点击获取电子围栏，所以需要将选中的节点设置为未选中状态
        await this.reSetGroupTreeSelect();
    }
    // 在增加，更新，或删除电子围栏之后，需要将地图上的信息去除，存储的信息去除
    deleteGroupSelectScope = () => {
        const {
            groupScopeDataList,
            groupScopeLayerList,
            groupSelectKey
        } = this.state;
        // 删除选中的电子围栏坐标数据
        if (groupScopeDataList[groupSelectKey]) {
            delete groupScopeDataList[groupSelectKey];
        }
        // 删除选中的电子围栏图层数据
        if (groupScopeLayerList[groupSelectKey]) {
            this.map.removeLayer(groupScopeLayerList[groupSelectKey]);
            delete groupScopeLayerList[groupSelectKey];
        }
        this.setState({
            groupScopeStatus: false,
            groupScopeDataList,
            groupScopeLayerList
        });
    }
    // 更新电子围栏之后，需要重新点击获取电子围栏，所以需要将选中的节点设置为未选中状态
    reSetGroupTreeSelect = () => {
        this.setState({
            groupSelectKey: '',
            groupSelected: false,
            groupSelectTitle: ''
        });
    }
    // 取消下发任务
    handleScopeModalCancel = () => {
        this.reSetModalState();
    }
    // 取消下发任务时清空之前存储的state
    reSetModalState = () => {
        this.setState({
            scopeModalVisible: false,
            noLoading: false,
            regionArea: 0
        });
    }
    // 取消圈选地图和按钮的visible
    reSetButState = () => {
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
    // 切换为2D
    _toggleTileLayer (index) {
        this.tileLayer.setUrl(TILEURLS[index]);
        this.setState({
            TileLayerUrl: TILEURLS[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
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
                            <AreaTree
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
    render () {
        const {
            createBtnVisible,
            scopeModalVisible,
            coordinates,
            groupSelected,
            groupScopeStatus
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
                                        groupScopeStatus
                                            ? (
                                                <div>
                                                    <Button type='primary' style={{marginRight: 10}} onClick={this._handlePutScope.bind(this)}>修改</Button>
                                                    <Popconfirm
                                                        onConfirm={this._handleDelectScope.bind(this)}
                                                        title='确定要删除该群体的电子围栏么'
                                                        okText='确定'
                                                        cancelText='取消'>
                                                        <Button type='danger'>删除</Button>
                                                    </Popconfirm>
                                                </div>
                                            )
                                            : (
                                                <Button type='primary' style={{marginRight: 10}} onClick={this._handleAddScope.bind(this)}>创建</Button>
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
                                    <Button type='primary' style={{marginRight: 10}} disabled={okDisplay} onClick={this._handleCreateScopeOk.bind(this)}>确定</Button>
                                    <Button type='default' style={{marginRight: 10}} disabled={retreatDisplay} onClick={this._handleCreateScopeRetreat.bind(this)}>上一步</Button>
                                    <Button type='danger' onClick={this._handleCreateScopeCancel.bind(this)}>撤销</Button>
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        scopeModalVisible ? (
                            <ScopeCreateModal
                                {...this.props}
                                {...this.state}
                                onOk={this.handleScopeModalOk.bind(this)}
                                onCancel={this.handleScopeModalCancel.bind(this)}
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
}
