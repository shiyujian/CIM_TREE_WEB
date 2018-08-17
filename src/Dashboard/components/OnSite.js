/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-04-26 10:45:34
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-08-17 14:24:35
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store';
import {
    Button,
    Modal,
    Collapse,
    Form,
    Row,
    DatePicker,
    Radio,
    Spin
} from 'antd';
import { PROJECT_UNITS, FOREST_API } from '_platform/api';
import './OnSite.less';
import DashPanel from './DashPanel';
import TreeTypeTree from './TreeTypeTree';
import RiskDetail from './RiskDetail';
import moment from 'moment';
import PkCodeTree from './PkCodeTree';
import TreeMessModal from './TreeMessModal';
import CuringTaskTree from './CuringTaskTree';
import {
    getThinClass,
    getSmallClass,
    genPopUpContent,
    computeSignedArea,
    getIconType,
    getSectionName,
    onImgClick,
    fillAreaColor,
    getTaskThinClassName
} from './auth';
import { getUser } from '_platform/auth';
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const Panel = Collapse.Panel;

window.config = window.config || {};
@connect(
    state => {
        const { map = {} } = state.dashboard || {};
        return map;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
class OnSite extends Component {
    // export default class OnSite extends Component {
    constructor (props) {
        super(props);
        this.state = {
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 260 /* 菜单宽度 */,
            selectedMenu: '1',
            isVisibleMapBtn: true, // 是否显示卫星图和地图切换按钮
            mapLayerBtnType: true, // 切换卫星图和地图
            isNotThree: true,
            // leafletCenter: [22.516818, 113.868495],
            leafletCenter: [38.92, 115.98], // 雄安
            // 树木详情弹窗数据
            seeVisible: false,
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            markers: null,
            // 区域地块
            areaTreeData: [],
            leftkeycode: '',
            areaEventTitle: '', // 区域地块选中节点的name
            // 地图圈选
            radioValue: '全部细班',
            coordinates: [],
            createBtnVisible: false,
            polygonData: '', // 圈选地图图层
            areaMeasure: 0, // 圈选区域面积
            areaMeasureVisible: false,
            // 巡检轨迹
            trackUsersTreeData: [], // 人员树
            // 安全隐患
            riskTreeData: [], // 安全隐患
            riskMess: {}, // 隐患详情
            isShowRisk: false, // 是否显示隐患详情弹窗
            // 树种筛选
            treeTypesTreeData: [], // 树种筛选树数据
            // 养护任务
            curingTaskTreeData: [], // 养护任务数据
            curingTypes: [], // 养护类型
            // 图层数据List
            areaLayerList: {}, // 区域地块图层list
            realThinClassLayerList: {}, // 实际细班种植图层
            trackLayerList: {}, // 轨迹图层List
            trackMarkerLayerList: {}, // 轨迹图标图层List
            treeTypesLayerList: {}, // 树种图层list
            riskMarkerLayerList: {}, // // 安全隐患图标图层List
            curingTaskPlanLayerList: {},
            curingTaskMarkerLayerList: {},
            curingTaskRealLayerList: {},
            curingTaskMessList: {}, // 养护任务信息List
            // 左侧菜单按钮是否选中
            geojsonFeature_area: false,
            geojsonFeature_track: false,
            geojsonFeature_risk: false,
            geojsonFeature_treetype: false,
            geojsonFeature_curingTask: false,
            // 树加载loading
            areaTreeLoading: true,
            trackTreeLoading: true,
            riskTreeLoading: true,
            treetypeTreeLoading: true,
            curingTaskTreeLoading: true,
            // 各个树的默认选中节点，因为各个树点开都是重新渲染，所以需要保存之前点击的节点
            areaTreeKeys: [],
            trackTreeKeys: [],
            riskTreeKeys: [],
            treetypeTreeKeys: [],
            treetypeTreeIsDefault: 0,
            curingTaskTreeKeys: []

        };
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.tileLayer3 = null;
        this.map = null;
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

    async componentDidMount () {
        await this.initMap();
        await this.loadAreaData();
        // 巡检路线
        await this.getMapRouter();
        // 安全隐患
        await this.getRisk();
        // 树种筛选
        await this.getTreeType();
        // 养护任务
        await this.getCuringTasks();
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };

    options = [
        {
            label: '区域地块',
            value: 'geojsonFeature_area',
            IconName: 'square'
        },
        {
            label: '巡检路线',
            value: 'geojsonFeature_track',
            IconUrl: require('./ImageIcon/people.png'),
            IconName: 'universal-access'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_risk',
            IconUrl: require('./ImageIcon/risk.png'),
            IconName: 'warning'
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype',
            IconName: 'square'
        },
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask',
            IconName: 'curingTask'
        }
    ];

    handleMenuButton (e) {
        let target = e.target;
        let buttonID = target.getAttribute('id');
        this.options.map((option) => {
            if (option.value === buttonID) {
                this.setState({
                    [option.value]: !this.state[option.value]
                });
            } else {
                this.setState({
                    [option.value]: false
                });
            }
        });
    }
    /* 渲染菜单panel */
    renderPanel (option) {
        const {
            areaTreeLoading,
            trackTreeLoading,
            riskTreeLoading,
            treetypeTreeLoading,
            curingTaskTreeLoading,
            areaTreeKeys,
            trackTreeKeys,
            riskTreeKeys,
            treetypeTreeKeys,
            treetypeTreeIsDefault,
            curingTaskTreeKeys
        } = this.state;
        let content = this.getPanelData(option.value);
        if (option && option.value) {
            switch (option.value) {
                // 区域地块
                case 'geojsonFeature_area':
                    return (
                        <Spin spinning={areaTreeLoading}>
                            <RadioGroup onChange={this.handleRadioChange.bind(this)} value={this.state.radioValue} style={{marginBottom: 10}}>
                                <Radio value={'全部细班'}>全部细班</Radio>
                                <Radio value={'实际定位'}>实际定位</Radio>
                            </RadioGroup>
                            <PkCodeTree
                                treeData={content}
                                selectedKeys={this.state.leftkeycode}
                                onSelect={this._handleAreaSelect.bind(this)}
                                areaTreeKeys={areaTreeKeys}
                            />
                        </Spin>
                    );
                // 巡检路线
                case 'geojsonFeature_track':
                    return (
                        <Spin spinning={trackTreeLoading}>
                            <DashPanel
                                onCheck={this.handleTrackCheck.bind(this)}
                                content={content}
                                featureName={option.value}
                                trackTreeKeys={trackTreeKeys}
                            />
                            {/* <RangePicker
                                style={{
                                    verticalAlign: 'middle',
                                    width: '100%'
                                }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format={'YYYY/MM/DD HH:mm:ss'}
                            /> */}
                        </Spin>
                    );
                // 安全隐患
                case 'geojsonFeature_risk':
                    return (
                        <Spin spinning={riskTreeLoading}>
                            <DashPanel
                                onCheck={this.handleRiskCheck.bind(this)}
                                content={content}
                                featureName={option.value}
                                riskTreeKeys={riskTreeKeys}
                            />
                        </Spin>
                    );
                // 树种筛选
                case 'geojsonFeature_treetype':
                    return (
                        <Spin spinning={treetypeTreeLoading}>
                            <TreeTypeTree
                                onCheck={this.handleTreeTypeCheck.bind(this)}
                                content={content}
                                featureName={option.value}
                                treetypeTreeKeys={treetypeTreeKeys}
                                treetypeTreeIsDefault={treetypeTreeIsDefault}
                            />
                        </Spin>
                    );
                // 养护任务
                case 'geojsonFeature_curingTask':
                    return (
                        <Spin spinning={curingTaskTreeLoading}>
                            <CuringTaskTree
                                onCheck={this.handleCuringTaskCheck.bind(this)}
                                content={content}
                                curingTaskTreeKeys={curingTaskTreeKeys}
                            />
                        </Spin>
                    );
            }
        }
    }
    /* 获取对应图层数据 */
    getPanelData (featureName) {
        var content = {};
        switch (featureName) {
            case 'geojsonFeature_track':
                content = this.state.trackUsersTreeData;
                break;
            case 'geojsonFeature_risk':
                content = this.state.riskTreeData;
                break;
            case 'geojsonFeature_area':
                content = this.state.areaTreeData;
                break;
            case 'geojsonFeature_treetype':
                content = this.state.treeTypesTreeData;
                break;
            case 'geojsonFeature_curingTask':
                content = this.state.curingTaskTreeData;
                break;
        }
        return content;
    }
    /* 初始化地图 */
    initMap () {
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
            // window.config.DASHBOARD_TREETYPE +
            // '/geoserver/xatree/wms?cql_filter=TreeType%20IN%20(64,65)&service=WMS&request=GetMap&layers=xatree%3Atreelocation&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326&bbox={min.y, min.x, max.y, max.x}',
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
        // 巡检路线的代码   地图上边的地点的名称
        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 隐患详情点击事件
        document
            .querySelector('.leaflet-popup-pane')
            .addEventListener('click', async function (e) {
                let target = e.target;
                // 绑定隐患详情点击事件
                if (target.getAttribute('class') === 'btnViewRisk') {
                    let idRisk = target.getAttribute('data-id');
                    let risk = null;
                    me.state.riskTreeData.forEach(v => {
                        if (!risk) {
                            risk = v.children.find(v1 => v1.key === idRisk);
                        }
                    });
                    if (risk) {
                        // 获取隐患处理措施
                        const { getRiskContactSheet } = me.props.actions;
                        let contact = await getRiskContactSheet({ ID: idRisk });
                        if (contact && contact.ID) {
                            me.setState({
                                riskMess: contact,
                                isShowRisk: true
                            });
                        }
                    }
                }
            });

        this.map.on('click', function (e) {
            const {
                radioValue,
                coordinates,
                createBtnVisible
            } = me.state;
            if (radioValue === '实际定位') {
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
                    fillOpacity: 0.2
                }).addTo(me.map);
                me.setState({
                    coordinates,
                    polygonData: polygonData
                });
            } else {
                // getThinClass(e.latlng.lng,e.latlng.lat);
                me.getTreeInfo(e.latlng.lng, e.latlng.lat, me);
            }
        });
    }
    // 获取地块树数据
    async loadAreaData () {
        const {
            actions: { getTreeNodeList, getLittleBan }
        } = this.props;
        try {
            let rst = await getTreeNodeList();
            if (rst instanceof Array && rst.length > 0) {
                rst.forEach((item, index) => {
                    rst[index].children = [];
                });
            } else {
                this.setState({
                    areaTreeLoading: false
                });
                return;
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
            console.log('获取地块树数据', e);
        }
    }
    /* 查询巡检路线 */
    getMapRouter () {
        let me = this;
        const { getMapRouter } = this.props.actions;
        getMapRouter().then(orgs => {
            let orgArr = [];
            if (orgs && orgs instanceof Array && orgs.length > 0) {
                orgs.map(or => {
                    if (
                        or &&
                        or.ID &&
                        or.PatrolerUser !== undefined &&
                        or.PatrolerUser !== null
                    ) {
                        orgArr.push({
                            key: or.ID,
                            properties: {
                                name: or.PatrolerUser.Full_Name,
                                ID: or.PatrolerUser.ID,
                                User_Name: or.PatrolerUser.User_Name,
                                PK: or.PatrolerUser.PK,
                                Phone: or.PatrolerUser.Phone
                            }
                        });
                    }
                });
            }
            me.setState({
                trackUsersTreeData: orgArr,
                trackTreeLoading: false
            });
        });
    }
    /* 获取安全隐患点 */
    getRisk = async () => {
        const { getRisk } = this.props.actions;
        let me = this;
        try {
            let data = await getRisk();
            let riskObj = {};
            let risks = [];
            // 安全隐患数据处理
            if (data && data.content) {
                let datas = data.content;
                datas.forEach((v, index) => {
                    // 去除坐标为0的点  和  名称为空的点（名称为空的点   type类型也不一样）
                    if (v['X'] === 0 || v['Y'] === 0 || v['ProblemType'] === '') {
                        return;
                    }
                    let level = v['EventType'];
                    let name = v['ProblemType'];
                    let ResponseOrg = v['ReorganizerObj'];
                    // 位置
                    let locationX = v['X'];
                    let locationY = v['Y'];
                    let coordinates = [locationY, locationX];
                    // 隐患类型
                    let riskType = '';
                    if (v.EventType === 0) {
                        riskType = '质量缺陷';
                    } else if (v.EventType === 1) {
                        riskType = '安全隐患';
                    } else if (v.EventType === 2) {
                        riskType = '其他';
                    }
                    riskObj[level] = riskObj[level] || {
                        key: riskType,
                        properties: {
                            name: riskType
                        },
                        children: []
                    };
                    let status = '';
                    if (v.Status === -1) {
                        status = '已提交';
                    } else if (v.Status === 0) {
                        status = '未审核通过';
                    } else if (v.Status === 1) {
                        status = '（审核通过）整改中';
                    } else if (v.Status === 2) {
                        status = '整改完成';
                    } else if (v.Status === 3) {
                        status = '确认完成';
                    }
                    riskObj[level].children.push({
                        type: 'risk',
                        key: v.ID,
                        properties: {
                            riskType: riskType,
                            measure: '',
                            name: name,
                            Problem: v.Problem,
                            response_org: ResponseOrg ? ResponseOrg.Full_Name : '',
                            status: status,
                            RouteID: v.RouteID,
                            CreateTime: v.CreateTime,
                            ID: v.ID,
                            InputerObj: v.InputerObj,
                            Supervisor: v.Supervisor,
                            type: 'risk'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: coordinates
                        }
                    });
                });
            }
            for (let i in riskObj) {
                risks.push(riskObj[i]);
            }
            me.setState({
                riskTreeData: risks,
                riskTreeLoading: false
            });
        } catch (e) {

        }
    }
    // 获取树种数据
    async getTreeType () {
        const { getTreeTypeAction } = this.props.actions;
        try {
            let arrData = [];
            let treeTypesTreeData = [
                {
                    key: Math.random.toString(),
                    properties: {
                        name: '全部树种'
                    },
                    children: []
                }
            ];
            let treeData = await getTreeTypeAction();
            if (!(treeData && treeData instanceof Array && treeData.length > 0)) {
                this.setState({
                    treeTypesTreeData,
                    treetypeTreeLoading: false
                });
                return;
            }
            treeData.map(tree => {
                if (tree && tree.ID) {
                    arrData.push({
                        key: tree.ID,
                        properties: {
                            name: tree.TreeTypeName,
                            TreeTypeNo: tree.PTreeTypeNo,
                            TreeTypeGenera: tree.TreeTypeGenera,
                            TreeParam: tree.TreeParam,
                            SamplingParam: tree.SamplingParam,
                            Pics: tree.Pics,
                            NurseryParam: tree.NurseryParam,
                            MorphologicalCharacter: tree.MorphologicalCharacter,
                            IsLocation: tree.IsLocation,
                            HaveQRCode: tree.HaveQRCode,
                            GrowthHabit: tree.GrowthHabit
                        }
                    });
                }
            });
            treeTypesTreeData[0].children = arrData;
            this.setState({
                treeTypesTreeData,
                treetypeTreeLoading: false
            });
        } catch (e) {
            console.log('树种', e);
        }
    }
    // 获取养护任务
    getCuringTasks = async () => {
        const {
            actions: {
                getCuring,
                getcCuringTypes
            }
        } = this.props;
        let curingTypesData = await getcCuringTypes();
        let curingTypes = curingTypesData && curingTypesData.content;
        let curingTaskTreeData = [];
        if (curingTypes && curingTypes.length > 0) {
            let curingTaskData = await getCuring();
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
                                curingTaskTreeData.map((treeNode) => {
                                    if (treeNode.ID === type.ID) {
                                        exist = true;
                                        childData = treeNode.children;
                                        childData.push((task));
                                    }
                                });
                                // 没有的话，创建
                                if (!exist) {
                                    childData.push(task);
                                    curingTaskTreeData.push({
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
        this.setState({
            curingTaskTreeData,
            curingTypes,
            curingTaskTreeLoading: false
        });
    }
    // 切换全部细班时，将其余图层去除，加载最初始图层
    componentDidUpdate = async (prevState, prevProps) => {
        const {
            radioValue,
            geojsonFeature_area
        } = this.state;
        if (radioValue === '全部细班' && radioValue !== prevState.radioValue && geojsonFeature_area) {
            this.addTotalMapLayer();
        }
    }
    // 添加全部植树图层
    addTotalMapLayer = () => {
        this.removeAllLayer();
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
    // 去除除初始化数据以外的全部图层
    removeAllLayer () {
        const {
            realThinClassLayerList,
            treeTypesLayerList
        } = this.state;
        try {
            if (this.tileLayer3) {
                this.map.removeLayer(this.tileLayer3);
                this.tileLayer3 = null;
            }
            for (let i in treeTypesLayerList) {
                this.map.removeLayer(treeTypesLayerList[i]);
            }
            for (let i in realThinClassLayerList) {
                this.map.removeLayer(realThinClassLayerList[i]);
            }
        } catch (e) {

        }
    }

    render () {
        const {
            seeVisible,
            createBtnVisible,
            coordinates,
            areaMeasure,
            areaMeasureVisible
        } = this.state;
        let okDisplay = false;
        if (coordinates.length <= 2) {
            okDisplay = true;
        }
        return (
            <div className='map-container'>
                <div
                    ref='appendBody'
                    className='dashboard-map r-main'
                    onMouseUp={this.onEndResize.bind(this)}
                    onMouseMove={this.onResizingMenu.bind(this)}
                >
                    <div className='menuButton'>
                        {this.options.map(option => {
                            return (
                                <div className='menuButtonLayout'>
                                    <Button type={this.state[option.value] ? 'primary' : 'info'} size='large' id={option.value} onClick={this.handleMenuButton.bind(this)}>{option.label}</Button>
                                </div>
                            );
                        })}
                    </div>
                    {
                        this.options.map(option => {
                            if (this.state[option.value]) {
                                return (
                                    <div className='dashboard-menuPanel'>
                                        <aside className='dashboard-aside' draggable='false'>
                                            <div className='dashboard-asideTree'>
                                                {this.renderPanel(option)}
                                            </div>

                                        </aside>
                                    </div>
                                );
                            } else {
                                return '';
                            }
                        })
                    }
                    {
                        createBtnVisible ? (
                            <div className='editPolygonLayout'>
                                <div>
                                    <Button type='primary' style={{marginRight: 10}} disabled={okDisplay} onClick={this._handleCreateMeasureOk.bind(this)}>确定</Button>
                                    <Button type='info' style={{marginRight: 10}} onClick={this._handleCreateMeasureRetreat.bind(this)}>上一步</Button>}
                                    <Button type='danger' onClick={this._handleCreateMeasureCancel.bind(this)}>撤销</Button>
                                </div>
                            </div>
                        ) : ''
                    }
                    {
                        areaMeasureVisible ? (
                            <div className='areaMeasureLayout'>
                                <span>{`面积：${areaMeasure} 亩`}</span>
                            </div>
                        ) : ''
                    }
                    {this.state.isVisibleMapBtn ? (
                        <div className='treeControl'>
                            <div>
                                <Button
                                    type={
                                        this.state.mapLayerBtnType
                                            ? 'primary'
                                            : 'info'
                                    }
                                    onClick={this.toggleTileLayer.bind(this, 1)}
                                >
                                    卫星图
                                </Button>
                                <Button
                                    type={
                                        this.state.mapLayerBtnType
                                            ? 'info'
                                            : 'primary'
                                    }
                                    onClick={this.toggleTileLayer.bind(this, 2)}
                                >
                                    地图
                                </Button>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                    {
                        seeVisible
                            ? (
                                <TreeMessModal
                                    {...this.props}
                                    {...this.state}
                                    onCancel={this.toggleIcon1.bind(this)}
                                />
                            ) : ''
                    }
                    <Modal
                        title='隐患详情'
                        width={800}
                        visible={this.state.isShowRisk}
                        onCancel={this._handleCancelVisible.bind(this)}
                        footer={null}
                    >
                        <div>
                            {
                                <RiskDetail
                                    {...this.props}
                                    map={this.map}
                                    riskMess={this.state.riskMess}
                                    isShowRisk={this.state.isShowRisk}
                                    close={this.exitRiskDetail.bind(this)}
                                />
                            }
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    onClick={this._handleCancelVisible.bind(
                                        this
                                    )}
                                    style={{ float: 'right' }}
                                    type='primary'
                                >
                                    关闭
                                </Button>
                            </Row>
                        </div>
                    </Modal>
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
            </div>
        );
    }

    // 巡检路线多选树节点
    async handleTrackCheck (keys, info) {
        const { getMapList, getUserDetail } = this.props.actions;
        const {
            trackLayerList,
            trackMarkerLayerList,
            trackUsersTreeData
        } = this.state;
        let me = this;
        this.setState({
            trackTreeKeys: keys
        });
        // 当前选中的节点
        let selectKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        if (checked) {
            try {
                if (trackLayerList[selectKey]) {
                    trackLayerList[selectKey].addTo(me.map);
                    if (trackMarkerLayerList[selectKey]) {
                        trackMarkerLayerList[selectKey].addTo(me.map);
                    }
                    me.map.fitBounds(trackLayerList[selectKey].getBounds());
                } else {
                    let routes = await getMapList({ routeID: selectKey });
                    if (!(routes && routes instanceof Array && routes.length > 0)) {
                        return;
                    }
                    let set = {};
                    routes.forEach(item => {
                        set[item.RouteID] = [];
                    });
                    routes.forEach(item => {
                        if (set[item.RouteID]) {
                            set[item.RouteID].push({
                                GPSTime: item.GPSTime,
                                ID: item.ID,
                                Patroler: item.Patroler,
                                X: item.X,
                                Y: item.Y
                            });
                        }
                    });
                    let arr1 = [];
                    for (var t in set) {
                        arr1.push(set[t]);
                    }
                    let latlngs = [];
                    if (arr1 && arr1 instanceof Array && arr1.length > 0) {
                        arr1[0].map(rst => {
                            if (rst && rst.X && rst.Y) {
                                latlngs.push([rst.Y, rst.X]);
                            }
                        });
                    }
                    // 选中节点的数据
                    let selectData = '';
                    trackUsersTreeData.map(data => {
                        if (data.key === selectKey) {
                            selectData = data;
                        }
                    });
                    if (selectData && selectData.properties && selectData.properties.PK) {
                        let user = await getUserDetail({
                            pk: selectData.properties.PK
                        });
                        let sectionName = '';
                        if (user && user.account && user.account.sections && user.account.sections.length > 0) {
                            try {
                                let section = user.account.sections[0];
                                let arr = section.split('-');
                                if (arr && arr instanceof Array && arr.length === 3) {
                                    PROJECT_UNITS.map(project => {
                                        if (project.code === arr[0]) {
                                            let units = project.units;
                                            sectionName = project.value;
                                            units.map(unit => {
                                                if (unit.code === section) {
                                                    sectionName =
                                                    sectionName + unit.value;
                                                }
                                            });
                                        }
                                    });
                                }
                            } catch (e) {
                                console.log('获取标段', e);
                            }
                        }
                        let iconData = {
                            geometry: {
                                coordinates: [latlngs[0][0], latlngs[0][1]],
                                type: 'Point'
                            },
                            key: selectKey,
                            properties: {
                                name: user.account.person_name
                                    ? user.account.person_name
                                    : user.username,
                                organization: user.account.organization
                                    ? user.account.organization
                                    : '',
                                person_telephone: user.account.person_telephone
                                    ? user.account.person_telephone
                                    : '',
                                sectionName: sectionName,
                                type: 'track'
                            },
                            type: 'track'
                        };
                        let trackMarkerLayer = me._createMarker(iconData);
                        trackMarkerLayerList[selectKey] = trackMarkerLayer;
                    }

                    let polyline = L.polyline(latlngs, { color: 'red' }).addTo(
                        this.map
                    );
                    trackLayerList[selectKey] = polyline;
                    this.map.fitBounds(polyline.getBounds());
                    this.setState({
                        trackLayerList,
                        trackMarkerLayerList
                    });
                }
            } catch (e) {
                console.log('e', e);
            }
        } else {
            // 如果取消选中 则将数据删除
            // 移除未选中的
            if (trackMarkerLayerList[selectKey]) {
                this.map.removeLayer(trackMarkerLayerList[selectKey]);
            }
            if (trackLayerList[selectKey]) {
                this.map.removeLayer(trackLayerList[selectKey]);
            }
        }
    }
    /* 安全隐患多选树节点 */
    handleRiskCheck (keys, info) {
        const {
            riskTreeData,
            riskMarkerLayerList
        } = this.state;
        // 移除未选中的
        for (var i in riskMarkerLayerList) {
            let k = keys.find(k => k === i);
            if (!k && riskMarkerLayerList[i]) {
                this.map.removeLayer(riskMarkerLayerList[i]);
            }
        }
        this.setState({
            riskTreeKeys: keys
        });

        let me = this;
        riskTreeData.forEach(risk => {
            if (!risk.children) {
                let checkedKey = keys.find(key => key === risk.key);
                if (checkedKey) {
                    if (riskMarkerLayerList[checkedKey]) {
                        riskMarkerLayerList[checkedKey].addTo(me.map);
                    } else {
                        let riskMarkerLayer = me._createMarker(risk);
                        riskMarkerLayerList[checkedKey] = riskMarkerLayer;
                    }
                }
            } else {
                risk.children.forEach(riskData => {
                    let checkedKey = keys.find(k => k === riskData.key);
                    if (checkedKey) {
                        if (riskMarkerLayerList[checkedKey]) {
                            riskMarkerLayerList[checkedKey].addTo(me.map);
                        } else {
                            riskMarkerLayerList[checkedKey] = me._createMarker(riskData);
                        }
                        me.map.panTo(riskData.geometry.coordinates);
                    }
                });
            }
            me.setState({
                riskMarkerLayerList
            });
        });
    }
    /* 树种筛选多选树节点 */
    handleTreeTypeCheck (keys, info) {
        const {
            treeTypesLayerList,
            treeTypesTreeData,
            treetypeTreeIsDefault
        } = this.state;
        this.setState({
            treetypeTreeKeys: keys,
            treetypeTreeIsDefault: treetypeTreeIsDefault + 1
        });
        let me = this;
        // 当前选中的节点
        let selectKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        // 所有树种的Key
        let allTreeKey = '';
        if (treeTypesTreeData && treeTypesTreeData.length > 0) {
            allTreeKey = treeTypesTreeData[0].key;
        }
        let queryData = '';
        for (let i = 0; i < keys.length; i++) {
            queryData = queryData + keys[i];
            if (i < keys.length - 1) {
                queryData = queryData + ',';
            }
        }

        // 如果是选中节点，首先看是否是选中全部，如果是，就加载所有树种的图层

        if (allTreeKey === selectKey && checked) {
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
        } else if (keys && keys.length === 0) {
            // 如果是取消选中，首先看是否是取消全部，如果是，直接把所有图层去除
            try {
                if (this.tileLayer2) {
                    this.map.removeLayer(this.tileLayer2);
                }
                this.removeAllLayer();
            } catch (e) {
                console.log('去除全部树种', e);
            }
        } else {
            if (checked) {
                // 不是选中全部，一定是选中某个节点，将这个节点添加就可以
                // 首先看之前选中过没有，选中过的话，直接添加该图层就好
                if (treeTypesLayerList[selectKey]) {
                    treeTypesLayerList[selectKey].addTo(this.map);
                } else {
                    // 没选中的话，需要重新请求，然后添加到state里面
                    var url = window.config.DASHBOARD_TREETYPE +
                    `/geoserver/xatree/wms?cql_filter=TreeType%20IN%20(${selectKey})`;
                    let checkedTreeLayer = L.tileLayer.wms(url,
                        {
                            layers: 'xatree:treelocation',
                            crs: L.CRS.EPSG4326,
                            format: 'image/png',
                            maxZoom: 22,
                            transparent: true
                        }
                    ).addTo(this.map);
                    treeTypesLayerList[selectKey] = checkedTreeLayer;
                    me.setState({
                        treeTypesLayerList
                    });
                }
            } else {
                // 不是取消选中全部，首先看之前的列表中有没有点击过这个节点，点击过，取消，未点击过，就重新获取数据
                if (treeTypesLayerList[selectKey]) {
                    this.map.removeLayer(treeTypesLayerList[selectKey]);
                    // delete treeTypesLayerList[selectKey];
                } else {
                    if (this.tileLayer2) {
                        this.map.removeLayer(this.tileLayer2);
                    }
                    if (this.tileLayer3) {
                        this.map.removeLayer(this.tileLayer3);
                        this.tileLayer3 = null;
                    }
                    var url = window.config.DASHBOARD_TREETYPE +
                        `/geoserver/xatree/wms?cql_filter=TreeType%20IN%20(${queryData})`;
                    // this.tileLayer3指的是一下获取多个树种的图层，单个树种的图层直接存在treeLayerList对象中
                    this.tileLayer3 = L.tileLayer.wms(url,
                        {
                            layers: 'xatree:treelocation',
                            crs: L.CRS.EPSG4326,
                            format: 'image/png',
                            maxZoom: 22,
                            transparent: true
                        }
                    ).addTo(this.map);
                }
            }
        }
    }
    // 养护任务点击
    handleCuringTaskCheck (keys, info) {
        // 当前选中的节点
        this.setState({
            curingTaskTreeKeys: keys
        });

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
                            this.handleCuringTaskAddLayer(eventKey, true);
                        } else {
                            this.handleCuringTaskAddLayer(eventKey, false);
                        }
                    } else {
                        this.handleCuringTaskDelLayer(eventKey);
                    }
                });
            } else {
                if (checked) {
                    this.handleCuringTaskAddLayer(eventKey, true);
                } else {
                    this.handleCuringTaskDelLayer(eventKey);
                }
            }
        } catch (e) {
            console.log('handleCuringTaskCheck', e);
        }
    }
    // 去除任务图层
    handleCuringTaskDelLayer = async (eventKey) => {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskRealLayerList
        } = this.state;
        if (curingTaskPlanLayerList[eventKey]) {
            curingTaskPlanLayerList[eventKey].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
        if (curingTaskMarkerLayerList[eventKey]) {
            this.map.removeLayer(curingTaskMarkerLayerList[eventKey]);
        }
        if (curingTaskRealLayerList[eventKey]) {
            curingTaskRealLayerList[eventKey].map((layer) => {
                this.map.removeLayer(layer);
            });
        }
    }
    // 处理每个check的任务如何加载图层
    handleCuringTaskAddLayer = async (eventKey, isFocus) => {
        const {
            curingTaskPlanLayerList,
            curingTaskMarkerLayerList,
            curingTaskRealLayerList
        } = this.state;
        if (curingTaskPlanLayerList[eventKey]) {
            curingTaskPlanLayerList[eventKey].map((layer) => {
                layer.addTo(this.map);
                if (isFocus) {
                    this.map.fitBounds(layer.getBounds());
                }
            });
            if (curingTaskMarkerLayerList[eventKey]) {
                curingTaskMarkerLayerList[eventKey].addTo(this.map);
            }
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].map((layer) => {
                    layer.addTo(this.map);
                });
            }
        } else {
            // 如果不是添加过，需要请求数据
            this.getCuringTaskWkt(eventKey, isFocus);
        }
    }
    // 获取养护任务的计划和实际区域
    getCuringTaskWkt = async (eventKey, isFocus) => {
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
                this._handleCuringTaskWkt(planWkt, eventKey, taskMess, 'plan', isFocus);
            }
            if (realWkt) {
                this._handleCuringTaskWkt(realWkt, eventKey, taskMess, 'real', isFocus);
            }
        } catch (e) {
            console.log('handleWKT', e);
        }
    }
    // 处理养护区域的数据，将字符串改为数组
    _handleCuringTaskWkt = async (wkt, eventKey, task, type, isFocus) => {
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
                            this._handleCuringPlanCoordLayer(str, task, eventKey, index, isFocus);
                        } else if (type === 'real') {
                            this._handleCuringRealCoordLayer(str, task, eventKey, index);
                        }
                    } else {
                        if (type === 'plan') {
                            // 其他图形中不设置图标
                            this._handleCuringPlanCoordLayer(str, task, eventKey);
                        } else if (type === 'real') {
                            this._handleCuringRealCoordLayer(str, task, eventKey);
                        }
                    }
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
                if (type === 'plan') {
                    // 只有一个图形，必须要设置图标
                    this._handleCuringPlanCoordLayer(str, task, eventKey, 1, isFocus);
                } else if (type === 'real') {
                    this._handleCuringRealCoordLayer(str, task, eventKey, 1);
                }
            }
        } catch (e) {
            console.log('处理wkt', e);
        }
    }
    // 养护任务计划区域加载图层
    _handleCuringPlanCoordLayer (str, taskMess, eventKey, index, isFocus) {
        const {
            curingTaskPlanLayerList,
            curingTypes,
            curingTaskMarkerLayerList,
            curingTaskMessList
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
            console.log('taskMess', taskMess);
            console.log('this.totalThinClass', this.totalThinClass);
            let regionData = getTaskThinClassName(taskMess, this.totalThinClass);
            console.log('regionData', regionData);
            let sectionName = regionData.regionSectionName;
            let smallClassName = regionData.regionSmallName;
            let thinClassName = regionData.regionThinName;
            taskMess.sectionName = sectionName;
            taskMess.smallClassName = smallClassName;
            taskMess.thinClassName = thinClassName;
            taskMess.status = status;
            taskMess.typeName = typeName;
            curingTaskMessList[eventKey] = taskMess;
            this.setState({
                curingTaskMessList
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
                type: 'curingTask',
                properties: {
                    ID: taskMess.ID,
                    name: treeNodeName,
                    type: 'curingTask',
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
            if (curingTaskPlanLayerList[eventKey]) {
                curingTaskPlanLayerList[eventKey].push(layer);
            } else {
                curingTaskPlanLayerList[eventKey] = [layer];
            }
            this.setState({
                curingTaskPlanLayerList
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
            curingTaskMarkerLayerList[eventKey] = marker;
            this.setState({
                curingTaskMarkerLayerList
            });
        } catch (e) {
            console.log('处理str', e);
        }
    }
    // 添加实际养护区域图层
    _handleCuringRealCoordLayer (str, task, eventKey, index) {
        const {
            curingTaskRealLayerList
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
                type: 'realCuringTask',
                properties: {
                    type: 'realCuringTask'
                },
                geometry: { type: 'Polygon', coordinates: treearea }
            };
            let layer = this._createMarker(message);
            // 因为有可能会出现多个图形的情况，所以要设置为数组，去除的话，需要遍历数组，全部去除
            if (curingTaskRealLayerList[eventKey]) {
                curingTaskRealLayerList[eventKey].push(layer);
            } else {
                curingTaskRealLayerList[eventKey] = [layer];
            }
            this.setState({
                curingTaskRealLayerList
            });
        } catch (e) {
            console.log('Realstr', e);
        }
    }

    // 切换为2D
    toggleTileLayer (index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
    // 苗木信息Modal关闭
    toggleIcon1 () {
        this.setState({
            seeVisible: !this.state.seeVisible
        });
    }
    handleRadioChange = async (e) => {
        this.setState({
            radioValue: e.target.value
        });
    }
    /* 细班选择处理 */
    _handleAreaSelect = async (keys, info) => {
        const {
            areaLayerList,
            radioValue,
            treeTypesLayerList,
            realThinClassLayerList
        } = this.state;
        let me = this;
        // 当前选中的节点
        let areaEventTitle = info.node.props.title;
        let selected = info.selected;
        this.setState({
            leftkeycode: keys[0],
            areaEventTitle,
            areaTreeKeys: keys
        });
        try {
            const eventKey = keys[0];
            for (let v in areaLayerList) {
                me.map.removeLayer(areaLayerList[v]);
            }
            if (eventKey) {
                // 细班的key加入了标段，首先对key进行处理
                let handleKey = eventKey.split('-');
                // 如果选中的是细班，则直接添加图层
                if (handleKey.length === 5) {
                    const treeNodeName = info && info.node && info.node.props && info.node.props.title;
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求

                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].addTo(me.map);
                        me.map.fitBounds(areaLayerList[eventKey].getBounds());
                    } else {
                    // 如果不是添加过，需要请求数据
                        await me._addAreaLayer(eventKey, treeNodeName);
                    }
                }
                if (radioValue === '实际定位') {
                    let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                    if (me.tileLayer2) {
                        me.map.removeLayer(me.tileLayer2);
                    }
                    if (me.tileLayer3) {
                        me.map.removeLayer(me.tileLayer3);
                        me.tileLayer3 = null;
                    }
                    for (let i in treeTypesLayerList) {
                        me.map.removeLayer(treeTypesLayerList[i]);
                    }
                    for (let i in realThinClassLayerList) {
                        me.map.removeLayer(realThinClassLayerList[i]);
                    }
                    if (realThinClassLayerList[eventKey]) {
                        realThinClassLayerList[eventKey].addTo(me.map);
                    } else {
                        var url = window.config.DASHBOARD_TREETYPE +
                        `/geoserver/xatree/wms?cql_filter=No+LIKE+%27%25${selectNo}%25%27`;
                        let thinClassLayer = L.tileLayer.wms(url,
                            {
                                layers: 'xatree:treelocation',
                                crs: L.CRS.EPSG4326,
                                format: 'image/png',
                                maxZoom: 22,
                                transparent: true
                            }
                        ).addTo(this.map);
                        realThinClassLayerList[eventKey] = thinClassLayer;
                        this.setState({
                            realThinClassLayerList
                        });
                    }
                }
            }
        } catch (e) {
            console.log('处理选中节点', e);
        }
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, treeNodeName) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        try {
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
                // let num = computeSignedArea(target1, 1);
                let layer = this._createMarker(message);
                areaLayerList[eventKey] = layer;
                me.setState({
                    areaLayerList
                });
            } catch (e) {
                console.log('await', e);
            }
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
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
            } else if (geo.properties.type === 'curingTask') {
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'blue',
                    fillColor: '#93B9F2',
                    fillOpacity: 0.2
                }).addTo(this.map);
                return layer;
            } else if (geo.properties.type === 'realCuringTask') {
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: 'yellow',
                    fillColor: 'yellow',
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            } else {
                if (
                    !geo.geometry.coordinates[0] ||
                        !geo.geometry.coordinates[1]
                ) {
                    return;
                }
                let iconType = L.divIcon({
                    className: getIconType(geo.type)
                });
                let marker = L.marker(geo.geometry.coordinates, {
                    icon: iconType,
                    title: geo.properties.name
                });
                marker.bindPopup(
                    L.popup({ maxWidth: 240 }).setContent(
                        genPopUpContent(geo)
                    )
                );
                marker.addTo(this.map);
                return marker;
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    _handleCreateMeasureOk = async () => {
        const {
            coordinates
        } = this.state;
        try {
            let areaMeasure = computeSignedArea(coordinates, 2);
            areaMeasure = areaMeasure * 0.0015;
            this.setState({
                areaMeasure,
                areaMeasureVisible: true
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    _handleCreateMeasureCancel = async () => {
        const {
            polygonData
        } = this.state;
        if (polygonData) {
            this.map.removeLayer(polygonData);
        }
        this.setState({
            areaMeasureVisible: false
        });
        this._resetRegionState();
    }
    _handleCreateMeasureRetreat = async () => {
        const {
            coordinates
        } = this.state;
        let me = this;
        if (me.state.polygonData) {
            me.map.removeLayer(me.state.polygonData);
        }
        this.setState({
            areaMeasureVisible: false
        });
        coordinates.pop();
        if (coordinates.length === 0) {
            this._resetRegionState();
            return;
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
    }
    // 取消圈选和按钮的功能
    _resetRegionState = () => {
        this.setState({
            createBtnVisible: false,
            polygonData: '',
            coordinates: []
        });
    }
    /* 菜单展开收起 */
    extendAndFold () {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }
    /* 手动调整菜单宽度 */
    onStartResizeMenu (e) {
        e.preventDefault();
        this.menu.startPos = e.clientX;
        this.menu.isStart = true;
        this.menu.tempMenuWidth = this.state.menuWidth;
        this.menu.count = 0;
    }
    onEndResize (e) {
        this.menu.isStart = false;
    }
    onResizingMenu (e) {
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
    //  切换标签页
    tabChange (key) {
    }
    // 退出隐患详情查看
    exitRiskDetail () {
        this.setState({ isShowRisk: false });
    }
    _handleCancelVisible () {
        this.setState({
            isShowRisk: false
        });
    }
    // 点击树节点获取树节点信息
    async getTreeInfo (x, y, that) {
        const {
            actions: {
                getTreeflows,
                getNurserys,
                getCarpackbysxm,
                getTreeMess,
                getLittleBan
            }
        } = this.props;
        let me = this;
        var resolutions = [
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125e-4,
            3.4332275390625e-4,
            1.71661376953125e-4,
            8.58306884765625e-5,
            4.291534423828125e-5,
            2.1457672119140625e-5,
            1.0728836059570312e-5,
            5.364418029785156e-6,
            2.682209014892578e-6,
            1.341104507446289e-6,
            6.705522537231445e-7,
            3.3527612686157227e-7
        ];
        var zoom = that.map.getZoom();
        var resolution = resolutions[zoom];
        var col = (x + 180) / resolution;
        // 林总说明I和J必须是整数
        var colp = Math.floor(col % 256);
        // var colp = col % 256;
        col = Math.floor(col / 256);
        var row = (90 - y) / resolution;
        // 林总说明I和J必须是整数
        var rowp = Math.floor(row % 256);
        // var rowp = row % 256;
        row = Math.floor(row / 256);
        var url =
            window.config.DASHBOARD_ONSITE +
            '/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:treelocation&STYLE=&TILEMATRIX=EPSG:4326:' +
            zoom +
            '&TILEMATRIXSET=EPSG:4326&SERVICE=WMTS&FORMAT=image/png&SERVICE=WMTS&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=' +
            col +
            '&TileRow=' +
            row +
            '&I=' +
            colp +
            '&J=' +
            rowp;
        jQuery.getJSON(url, null, async function (data) {
            if (data.features && data.features.length) {
                let postdata = {
                    sxm: data.features[0].properties.SXM
                };

                let queryTreeData = await getTreeMess(postdata);
                let treeflowDatas = await getTreeflows({}, postdata);
                let nurserysDatas = await getNurserys({}, postdata);
                let carData = await getCarpackbysxm(postdata);

                let SmallClassName = queryTreeData.SmallClass
                    ? queryTreeData.SmallClass + '号小班'
                    : '';
                let ThinClassName = queryTreeData.ThinClass
                    ? queryTreeData.ThinClass + '号细班'
                    : '';
                if (
                    queryTreeData &&
                    queryTreeData.Section &&
                    queryTreeData.SmallClass &&
                    queryTreeData.ThinClass
                ) {
                    let data = {
                        no: queryTreeData.Section
                    };
                    let noList = await getLittleBan(data);
                    let sections = queryTreeData.Section.split('-');
                    let No =
                        sections[0] +
                        '-' +
                        sections[1] +
                        '-' +
                        queryTreeData.SmallClass +
                        '-' +
                        queryTreeData.ThinClass +
                        '-' +
                        sections[2];
                    noList.map(rst => {
                        if (rst.No.indexOf(No) !== -1) {
                            SmallClassName = rst.SmallClassName
                                ? rst.SmallClassName + '号小班'
                                : SmallClassName;
                            ThinClassName = rst.ThinClassName
                                ? rst.ThinClassName + '号细班'
                                : ThinClassName;
                        }
                    });
                }
                // let queryTreeData = {}
                let treeflowData = {};
                let nurserysData = {};

                // if(queryTreeDatas && queryTreeDatas.content && queryTreeDatas.content instanceof Array && queryTreeDatas.content.length>0){
                //     queryTreeData =  queryTreeDatas.content[0]
                // }
                if (
                    treeflowDatas &&
                    treeflowDatas.content &&
                    treeflowDatas.content instanceof Array &&
                    treeflowDatas.content.length > 0
                ) {
                    treeflowData = treeflowDatas.content;
                }
                if (
                    nurserysDatas &&
                    nurserysDatas.content &&
                    nurserysDatas.content instanceof Array &&
                    nurserysDatas.content.length > 0
                ) {
                    nurserysData = nurserysDatas.content[0];
                }

                let seedlingMess = {
                    sxm: queryTreeData.ZZBM ? queryTreeData.ZZBM : '',
                    car: carData.LicensePlate ? carData.LicensePlate : '',
                    TreeTypeName: nurserysData.TreeTypeObj
                        ? nurserysData.TreeTypeObj.TreeTypeName
                        : '',
                    TreePlace: nurserysData.TreePlace
                        ? nurserysData.TreePlace
                        : '',
                    Factory: nurserysData.Factory ? nurserysData.Factory : '',
                    NurseryName: nurserysData.NurseryName
                        ? nurserysData.NurseryName
                        : '',
                    LifterTime: nurserysData.LifterTime
                        ? moment(nurserysData.LifterTime).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                        : '',
                    location: nurserysData.location
                        ? nurserysData.location
                        : '',
                    InputerObj: nurserysData.InputerObj
                        ? nurserysData.InputerObj
                        : '',
                    GD: nurserysData.GD ? nurserysData.GD : '',
                    GDFJ: nurserysData.GDFJ
                        ? onImgClick(nurserysData.GDFJ)
                        : '',
                    GF: nurserysData.GF ? nurserysData.GF : '',
                    GFFJ: nurserysData.GFFJ
                        ? onImgClick(nurserysData.GFFJ)
                        : '',
                    TQZJ: nurserysData.TQZJ ? nurserysData.TQZJ : '',
                    TQZJFJ: nurserysData.TQZJFJ
                        ? onImgClick(nurserysData.TQZJFJ)
                        : '',
                    TQHD: nurserysData.TQHD ? nurserysData.TQHD : '',
                    TQHDFJ: nurserysData.TQHDFJ
                        ? onImgClick(nurserysData.TQHDFJ)
                        : '',
                    DJ: nurserysData.DJ ? nurserysData.DJ : '',
                    DJFJ: nurserysData.DJFJ
                        ? onImgClick(nurserysData.DJFJ)
                        : '',
                    XJ: nurserysData.XJ ? nurserysData.XJ : '',
                    XJFJ: nurserysData.XJFJ
                        ? onImgClick(nurserysData.XJFJ)
                        : ''
                };

                // 项目code
                let land = queryTreeData.Land ? queryTreeData.Land : '';
                // 项目名称
                let landName = '';
                // 项目下的标段
                let sections = [];
                // 查到的标段code
                let Section = queryTreeData.Section
                    ? queryTreeData.Section
                    : '';
                // 标段名称
                let sectionName = '';

                PROJECT_UNITS.map(unit => {
                    if (land === unit.code) {
                        sections = unit.units;
                        landName = unit.value;
                    }
                });
                sections.map(section => {
                    if (section.code === Section) {
                        sectionName = section.value;
                    }
                });

                let treeMess = {
                    sxm: queryTreeData.ZZBM ? queryTreeData.ZZBM : '',
                    landName: landName,
                    sectionName: sectionName,
                    SmallClass: SmallClassName,
                    ThinClass: ThinClassName,
                    TreeTypeName: nurserysData.TreeTypeObj
                        ? nurserysData.TreeTypeObj.TreeTypeName
                        : '',
                    Location: queryTreeData.LocationTime
                        ? queryTreeData.LocationTime
                        : '',
                    LocationX: queryTreeData.Location
                        ? queryTreeData.Location.X
                        : '',
                    LocationY: queryTreeData.Location
                        ? queryTreeData.Location.Y
                        : '',
                    DJ: queryTreeData.DJ ? queryTreeData.DJ : '',
                    DJFJ: queryTreeData.DJFJ
                        ? onImgClick(queryTreeData.DJFJ)
                        : '',
                    GD: queryTreeData.GD ? queryTreeData.GD : '',
                    GDFJ: queryTreeData.GDFJ
                        ? onImgClick(queryTreeData.GDFJ)
                        : '',
                    GF: queryTreeData.GF ? queryTreeData.GF : '',
                    GFFJ: queryTreeData.GFFJ
                        ? onImgClick(queryTreeData.GFFJ)
                        : '',
                    MD: queryTreeData.MD ? queryTreeData.MD : '',
                    MDFJ: queryTreeData.MDFJ
                        ? onImgClick(queryTreeData.MDFJ)
                        : '',
                    MJ: queryTreeData.MJ ? queryTreeData.MJ : '',
                    MJFJ: queryTreeData.MJFJ
                        ? onImgClick(queryTreeData.MJFJ)
                        : '',
                    TQHD: queryTreeData.TQHD ? queryTreeData.TQHD : '',
                    TQHDFJ: queryTreeData.TQHDFJ
                        ? onImgClick(queryTreeData.TQHDFJ)
                        : '',
                    TQZJ: queryTreeData.TQZJ ? queryTreeData.TQZJ : '',
                    TQZJFJ: queryTreeData.TQZJFJ
                        ? onImgClick(queryTreeData.TQZJFJ)
                        : '',
                    XJ: queryTreeData.XJ ? queryTreeData.XJ : '',
                    XJFJ: queryTreeData.XJFJ
                        ? onImgClick(queryTreeData.XJFJ)
                        : ''
                };
                let flowMess = treeflowData;

                that.setState({
                    seeVisible: true,
                    seedlingMess,
                    treeMess,
                    flowMess
                });
                if (that.state.markers) {
                    that.state.markers.remove();
                }
            }
        });
    }
}
export default Form.create()(OnSite);
