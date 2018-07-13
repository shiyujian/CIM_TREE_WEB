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
 * @Last Modified time: 2018-07-12 11:45:53
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
    Input,
    Tabs,
    Row,
    DatePicker
} from 'antd';
import { PROJECT_UNITS, FOREST_API } from '_platform/api';
import './OnSite.less';
import DashPanel from './DashPanel';
import RiskDetail from './RiskDetail';
import moment from 'moment';
import PkCodeTree from './PkCodeTree';
const TabPane = Tabs.TabPane;
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
            treeLists: [],
            leftkeycode: '',
            tree: '',
            mapLayerBtnType: true,
            isNotThree: true,
            seeVisible: false,
            markers: null,
            // leafletCenter: [22.516818, 113.868495],
            leafletCenter: [38.92, 115.98], // 雄安
            toggle: true,
            areaJson: [], // 区域地块
            users: [], // 人员树
            safetys: [], // 安全监测
            hazards: [], // 安全隐患
            userCheckedKeys: [], // 用户被选中键值
            isShowTrack: false,
            trackId: null,
            trackUser: null,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 200 /* 菜单宽度 */,
            risk: {},
            selectedMenu: '1',
            isVisibleMapBtn: true,
            treeType: [],
            projectList: [],
            unitProjectList: [],
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            mapList: {}, // 轨迹列表
            isShowRisk: false,
            treeTypes: [],
            treeLayerList: {}
        };
        this.checkMarkers = [];
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.tileLayer3 = null;
        this.map = null;
        this.track = null;
        this.orgs = null;
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 200,
            maxWidth: 500
        };
        /* 现场人员 */
        this.user = {
            orgs: {},
            userList: {}
        };
    }

    async componentDidMount () {
        this.loadAreaData();
        this.initMap();
        // 巡检路线
        this.getMapRouter();
        // 安全隐患
        this.getArea();
        this.getRisk();
        // 树种筛选
        this.getTreeType();
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
        // {
        //     label: '巡检路线',
        //     value: 'geojsonFeature_people',
        //     IconUrl: require('./ImageIcon/people.png'),
        //     IconName: 'universal-access'
        // },
        // {
        //     label: '安全隐患',
        //     value: 'geojsonFeature_hazard',
        //     IconUrl: require('./ImageIcon/danger.png'),
        //     IconName: 'warning'
        // },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype',
            IconName: 'square'
        }
    ];

    /* 渲染菜单panel */
    renderPanel (option) {
        let content = this.getPanelData(option.value);
        if (option && option.value) {
            switch (option.value) {
                case 'geojsonFeature_people':
                    return (
                        <div>
                            <DashPanel
                                style={{ height: '200px' }}
                                onCheck={this.handleTrackCheck.bind(this)}
                                onSelect={this.handleTrackSelect.bind(this)}
                                content={content}
                                userCheckKeys={this.state.userCheckedKeys}
                                featureName={option.value}
                            />
                            <RangePicker
                                style={{
                                    verticalAlign: 'middle',
                                    width: '100%'
                                }}
                                showTime={{ format: 'HH:mm:ss' }}
                                format={'YYYY/MM/DD HH:mm:ss'}
                            />
                        </div>
                    );
                case 'geojsonFeature_hazard':
                    return (
                        <DashPanel
                            onCheck={this.handleRiskCheck.bind(this)}
                            onSelect={this.handleRiskSelect.bind(this)}
                            content={content}
                            userCheckKeys={this.state.userCheckedKeys}
                            featureName={option.value}
                        />
                    );
                case 'geojsonFeature_area':
                    return (
                        <PkCodeTree
                            treeData={content}
                            selectedKeys={this.state.leftkeycode}
                            onSelect={this.handleAreaSelect.bind(this)}
                            showIcon={false}
                        />
                    );
                case 'geojsonFeature_treetype':
                    return (
                        <DashPanel
                            onCheck={this.handleTreeTypeCheck.bind(this)}
                            onSelect={this.handleTreeTypeSelect.bind(this)}
                            content={content}
                            // userCheckKeys={this.state.userCheckedKeys}
                            featureName={option.value}
                        />
                    );
            }
        }
    }
    /* 获取对应图层数据 */
    getPanelData (featureName) {
        var content = {};
        switch (featureName) {
            case 'geojsonFeature_people':
                content = this.state.users;
                break;
            case 'geojsonFeature_hazard':
                content = this.state.hazards;
                break;
            case 'geojsonFeature_area':
                content = this.state.treeLists;
                break;
            case 'geojsonFeature_treetype':
                content = this.state.treeTypes;
                break;
        }
        return content;
    }
    genPopUpContent (geo) {
        const { properties = {} } = geo;
        switch (geo.type) {
            case 'people': {
                return `<div class="popupBox">
						<h2><span>姓名：</span>${properties.name}</h2>
						<h2><span>所属单位：</span>${properties.organization}</h2>
						<h2><span>联系方式：</span>${properties.person_telephone}</h2>
						<h2><span>标段：</span>${properties.sectionName}</h2>
					</div>`;
            }
            case 'danger': {
                return `<div>
						<h2><span>隐患内容：</span>${properties.name}</h2>
                        <h2><span>隐患类型：</span>${properties.riskType}</h2>
                        <h2><span>隐患描述：</span>${properties.Problem}</h2>
						<h2><span>整改状态：</span>${properties.status}</h2>
                        <h2 class="btnRow">
                            <a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
                        </h2>
					</div>`;
            }
            default: {
                return null;
            }
        }
    }
    /* 在地图上添加marker和polygan */
    createMarker (geo, oldMarker) {
        if (geo.properties.type !== 'area') {
            if (!oldMarker) {
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
            }

            return oldMarker;
        } else {
            // 创建区域图形
            if (!oldMarker) {
                let area = L.geoJson(geo, {
                    style: {
                        fillColor: this.fillAreaColor(geo.key),
                        weight: 1,
                        opacity: 1,
                        color: '#201ffd',
                        fillOpacity: 0.3
                    },
                    title: geo.properties.name
                }).addTo(this.map);
                // 地块标注
                // let latlng = area.getBounds().getCenter()
                // let label = L.marker([latlng.lat, latlng.lng], {
                //     icon: L.divIcon({
                //         // className: this.getIconType('people'),
                //         // className: 'label-text',
                //         html: geo.properties.name,
                //         iconSize: [48, 20],
                //     }),
                // })
                // area.addLayer(label)
                // area.bindTooltip(geo.properties.name).openTooltip();
                this.map.fitBounds(area.getBounds());

                return area;
            }
            return oldMarker;
        }
    }
    // 获取对应的ICON
    getIconType (type) {
        switch (type) {
            case 'people':
                return 'peopleIcon';
            case 'safety':
                return 'cameraIcon';
            case 'danger':
                return 'dangerIcon';
            case 'tree':
                return 'treeIcon';
            default:
                break;
        }
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

        /**
         * 增加巡检路线后代码
         */
        // 巡检路线的代码   地图上边的地点的名称
        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);

        /**
         * 增加安全隐患后代码
         */
        // 隐患详情点击事件
        document
            .querySelector('.leaflet-popup-pane')
            .addEventListener('click', async function (e) {
                let target = e.target;
                // 绑定隐患详情点击事件
                if (target.getAttribute('class') === 'btnViewRisk') {
                    let idRisk = target.getAttribute('data-id');
                    let risk = null;
                    me.state.hazards.forEach(v => {
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
                                risk: contact,
                                isShowRisk: true
                            });
                        }
                    }
                }
                // 绑定轨迹查看点击事件
                if (target.getAttribute('class') === 'btnViewTrack') {
                    let id = target.getAttribute('data-id');
                    // 开始显示轨迹
                    me.setState({
                        isShowTrack: true,
                        trackId: id,
                        trackUser: name
                    });
                }
            });

        const that = this;
        this.map.on('click', function (e) {
            // getThinClass(e.latlng.lng,e.latlng.lat);
            that.getTreeInfo(e.latlng.lng, e.latlng.lat, that);
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
                let smallClassList = this.getSmallClass(list);
                smallClassList.map(smallClass => {
                    let thinClassList = this.getThinClass(smallClass, list);
                    smallClass.children = thinClassList;
                });
                section.children = smallClassList;
                this.setState({ treeLists: projectList });
            });
        } catch (e) {
            console.log('获取地块树数据', e);
        }
    }
    // 小班排列
    getSmallClass (smallClassList) {
        // 将小班的code获取到，进行去重
        let uniqueSmallClass = [];
        // 进行数组去重的数组
        let array = [];

        let test = [];
        smallClassList.map(list => {
            // 加入项目，地块的code，使No不重复，如果重复，点击某个节点，No重复的节点也会选择中
            let codeName =
                list.LandNo +
                '#' +
                list.RegionNo +
                '#' +
                list.SmallClass +
                '#' +
                list.SmallClassName;
            if (list.SmallClass && array.indexOf(codeName) === -1) {
                uniqueSmallClass.push({
                    Name: list.SmallClassName
                        ? list.SmallClassName + '小班'
                        : list.SmallClass + '小班',
                    No: codeName
                });
                array.push(codeName);
            } else {
                test.push({
                    SmallClassName: list.SmallClassName,
                    SmallClass: list.SmallClass
                });
            }
        });
        return uniqueSmallClass;
    }
    // 细班排列
    getThinClass (smallClass, list) {
        let thinClassList = [];
        let codeArray = [];
        let nameArray = [];
        list.map(rst => {
            let codeName = smallClass.No.split('#');
            let code = codeName[2];
            let name = codeName[3];
            if (name === 'null') {
                name = null;
            }
            // 暂时去掉重复的节点
            if (
                rst.ThinClass &&
                rst.SmallClass === code &&
                rst.SmallClassName === name
            ) {
                let noArr = rst.No.split('-');
                let No =
                    noArr[0] + '-' + noArr[1] + '-' + noArr[2] + '-' + noArr[3];
                if (codeArray.indexOf(No) === -1) {
                    thinClassList.push({
                        Name: rst.ThinClassName
                            ? rst.ThinClassName + '细班'
                            : rst.ThinClass + '细班',
                        No: No
                    });
                    codeArray.push(No);
                    nameArray.push(rst.ThinClassName);
                }
            }
        });
        return thinClassList;
    }
    // 获取树种数据
    async getTreeType () {
        const { getTreeTypeAction } = this.props.actions;
        try {
            let treeData = await getTreeTypeAction();
            let arrData = [];
            let treeTypes = [
                {
                    key: Math.random.toString(),
                    properties: {
                        name: '全部树种'
                    },
                    children: []
                }
            ];
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
            treeTypes[0].children = arrData;
            this.setState({
                treeTypes
            });
        } catch (e) {
            console.log('树种', e);
        }
    }
    /* 查询巡检路线 */
    getMapRouter () {
        let me = this;
        const { getMapRouter } = this.props.actions;
        getMapRouter().then(orgs => {
            let orgArr = [];
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
            me.setState({ users: orgArr });
        });
    }
    /* 获取区域数据 */
    getArea () {
        let me = this;
        const { getArea } = this.props.actions;
        // 获取区域数据
        getArea({}).then((rst = {}) => {
            let areaData = rst.children || [];
            var resAreas = me.loop(areaData, []);
            resAreas.forEach((v, index) => {
                v.key = index;
            });
            let areas = [
                {
                    key: 'ALL',
                    properties: {
                        name: '区域地块'
                    },
                    children: resAreas
                }
            ];
            me.setState({ areaJson: areas });
        });
    }
    /* 获取安全隐患点 */
    getRisk () {
        const { getRisk } = this.props.actions;
        let me = this;
        getRisk().then(data => {
            // 安全隐患数据处理
            let datas = data.content;
            let riskObj = {};
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
                    type: 'danger',
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
                        Supervisor: v.Supervisor
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    }
                });
            });
            let risks = [];
            for (let i in riskObj) {
                risks.push(riskObj[i]);
            }
            me.setState({ hazards: risks });
        });
    }
    // 解构得到的区域数据
    loop (data = [], resAreas = []) {
        let me = this;
        data.map(item => {
            if (item.children && item.children.length) {
                me.loop(item.children, resAreas);
            } else if (item.extra_params.coordinates) {
                let areaData = item.extra_params.coordinates;
                let coordinates = [];
                areaData.map(LatLng => {
                    let LngLat = [LatLng.Lng, LatLng.Lat];
                    coordinates.push(LngLat);
                });
                resAreas.push({
                    key: 0,
                    type: 'Feature',
                    properties: {
                        name: item.name,
                        type: 'area'
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [coordinates]
                    },
                    file_info: item.extra_params.file_info
                });
            }
        });
        return resAreas;
    }
    // 巡检路线多选树节点
    async handleTrackCheck (keys, featureName, info) {
        const { getMapList, getUserDetail } = this.props.actions;
        const { mapList } = this.state;
        let me = this;
        var content = this.getPanelData(featureName);
        // 获取所有key对应的数据对象
        this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
        let checkItems = this.checkMarkers[featureName];
        // 当前选中的节点
        let selectKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        if (checked) {
            try {
                let routes = await getMapList({ routeID: selectKey });
                // getMapList({ routeID: selectKey }).then(async routes => {
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
                content.map(data => {
                    if (data.key === selectKey) {
                        selectData = data;
                    }
                });
                if (
                    selectData &&
                    selectData.properties &&
                    selectData.properties.PK
                ) {
                    let user = await getUserDetail({
                        pk: selectData.properties.PK
                    });
                    let sectionName = '';
                    if (
                        user &&
                        user.account &&
                        user.account.sections &&
                        user.account.sections.length > 0
                    ) {
                        try {
                            let section = user.account.sections[0];
                            let arr = section.split('-');
                            if (arr && arr.length === 3) {
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
                            sectionName: sectionName
                        },
                        type: 'people'
                    };
                    checkItems[selectKey] = me.createMarker(
                        iconData,
                        checkItems[selectKey]
                    );
                }

                let polyline = L.polyline(latlngs, { color: 'blue' }).addTo(
                    this.map
                );
                mapList[selectKey] = polyline;
                this.map.fitBounds(polyline.getBounds());
                this.setState({
                    mapList
                });
            } catch (e) {
                console.log('e', e);
            }
        } else {
            // 如果取消选中 则将数据删除
            // 移除未选中的
            checkItems[selectKey]._icon.remove();
            delete checkItems[selectKey];
            this.map.removeLayer(mapList[selectKey]);
            // mapList[selectKey]._bounds.remove();
            delete mapList[selectKey];
        }
    }
    // 巡检路线点击树节点
    handleTrackSelect (keys, featureName) {
    }
    /* 安全隐患多选树节点 */
    handleRiskCheck (keys, featureName, info) {
        var content = this.getPanelData(featureName);
        // 获取所有key对应的数据对象
        this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
        let checkItems = this.checkMarkers[featureName];
        // 移除未选中的
        for (var c in checkItems) {
            let k = keys.find(k => k === c);
            if (!k && checkItems[c]) {
                checkItems[c]._icon.remove();
                delete checkItems[c];
            }
        }
        let me = this;
        content.forEach(c => {
            if (!c.children) {
                let kkkk = keys.find(k => k === c.key);
                if (kkkk) {
                    checkItems[kkkk] = me.createMarker(c, checkItems[kkkk]);
                }
            } else {
                c.children.forEach(cc => {
                    let kk = keys.find(k => k === cc.key);
                    if (kk) {
                        checkItems[kk] = me.createMarker(cc, checkItems[kk]);
                        if (featureName === 'geojsonFeature_hazard') {
                            this.map.panTo(cc.geometry.coordinates);
                        }
                    }
                });
            }
        });
        this.checkMarkers[featureName] = checkItems;
    }
    /* 安全隐患点击树节点 */
    handleRiskSelect (keys, featureName) {
    }
    /* 树种筛选多选树节点 */
    handleTreeTypeCheck (keys, featureName, info) {
        const {
            treeLayerList
        } = this.state;
        let me = this;
        var content = this.getPanelData(featureName);
        // 当前选中的节点
        let selectKey = info.node.props.eventKey;
        // 当前的选中状态
        let checked = info.checked;
        let allTreeKey = '';
        if (content && content.length > 0) {
            allTreeKey = content[0].key;
        }
        let queryData = '';
        for (let i = 0; i < keys.length; i++) {
            queryData = queryData + keys[i];
            if (i < keys.length - 1) {
                queryData = queryData + ',';
            }
        }
        console.log('keys', keys);
        console.log('info', info);
        console.log('selectKey', selectKey);

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
                if (this.tileLayer3) {
                    this.map.removeLayer(this.tileLayer3);
                    this.tileLayer3 = null;
                }
                // 去除掉选中某个节点所产生的图层
                for (let i in treeLayerList) {
                    console.log('treeLayerList[i]', treeLayerList[i]);
                    this.map.removeLayer(treeLayerList[i]);
                }
            } catch (e) {
                console.log('去除全部树种', e);
            }
        } else {
            if (checked) {
                // 不是选中全部，一定是选中某个节点，将这个节点添加就可以
                // 首先看之前选中过没有，选中过的话，直接添加该图层就好
                if (treeLayerList[selectKey]) {
                    treeLayerList[selectKey].addTo(this.map);
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
                    treeLayerList[selectKey] = checkedTreeLayer;
                    me.setState({
                        treeLayerList
                    });
                }
            } else {
                // 不是取消选中全部，首先看之前的列表中有没有点击过这个节点，点击过，取消，未点击过，就重新获取数据
                if (treeLayerList[selectKey]) {
                    this.map.removeLayer(treeLayerList[selectKey]);
                    // delete treeLayerList[selectKey];
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
    /* 树种筛选点击树节点 */
    handleTreeTypeSelect (keys, featureName) {}
    // 切换为2D
    toggleTileLayer (index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
    }
    // 图例的显示与否
    toggleIcon1 () {
        this.setState({
            seeVisible: !this.state.seeVisible
        });
    }

    /* 弹出信息框 */
    handleAreaSelect (keys, featureName) {
        const {
            actions: { getTreearea }
        } = this.props;
        const treeNodeName =
            featureName != null && featureName.selectedNodes.length > 0
                ? featureName.selectedNodes[0].props.title
                : '';
        if (this.checkMarkers.toString() !== '') {
            for (var i = 0; i <= this.checkMarkers.length - 1; i++) {
                this.map.removeLayer(this.checkMarkers[i]);
                delete this.checkMarkers[i];
            }
        }
        this.setState({
            leftkeycode: keys[0]
        });
        let treearea = [];
        getTreearea({}, { no: keys[0] }).then(rst => {
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
            let str = rst.content[0].coords;
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
            this.checkMarkers[0] = this.createMarker(
                message,
                this.checkMarkers[0]
            );
        });
    }

    render () {
        const { seedlingMess, treeMess, flowMess } = this.state;
        return (
            <div className='map-container'>
                <div
                    ref='appendBody'
                    className='l-map r-main'
                    onMouseUp={this.onEndResize.bind(this)}
                    onMouseMove={this.onResizingMenu.bind(this)}
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
                            <div style={{ height: '20px' }} />
                        </aside>
                        <div
                            className='resizeSenseArea'
                            onMouseDown={this.onStartResizeMenu.bind(this)}
                        />
                        {this.state.menuIsExtend ? (
                            <div
                                className='foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this.extendAndFold.bind(this)}
                            >
                                收起
                            </div>
                        ) : (
                            <div
                                className='foldBtn'
                                style={{ left: this.state.menuWidth }}
                                onClick={this.extendAndFold.bind(this)}
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
                    <div
                        style={this.state.isNotThree ? {} : { display: 'none' }}
                    >
                        <div
                            className='iconList'
                            style={
                                this.state.seeVisible
                                    ? { width: '290px' }
                                    : { width: '0' }
                            }
                        >
                            <Modal
                                visible={this.state.seeVisible}
                                onOk={this.toggleIcon1.bind(this)}
                                onCancel={this.toggleIcon1.bind(this)}
                            >
                                <Tabs
                                    defaultActiveKey='1'
                                    onChange={this.tabChange.bind(this)}
                                    size='large'
                                >
                                    <TabPane tab='苗木信息' key='1'>
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='顺序码'
                                            value={
                                                seedlingMess.sxm
                                                    ? seedlingMess.sxm
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='打包车牌'
                                            value={
                                                seedlingMess.car
                                                    ? seedlingMess.car
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='树种'
                                            value={
                                                seedlingMess.TreeTypeName
                                                    ? seedlingMess.TreeTypeName
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='产地'
                                            value={
                                                seedlingMess.TreePlace
                                                    ? seedlingMess.TreePlace
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='供应商'
                                            value={
                                                seedlingMess.Factory
                                                    ? seedlingMess.Factory
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='苗圃名称'
                                            value={
                                                seedlingMess.NurseryName
                                                    ? seedlingMess.NurseryName
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='起苗时间'
                                            value={
                                                seedlingMess.LifterTime
                                                    ? seedlingMess.LifterTime
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='起苗地点'
                                            value={
                                                seedlingMess.location
                                                    ? seedlingMess.location
                                                    : ''
                                            }
                                        />
                                        {seedlingMess.GD ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='高度(cm)'
                                                    value={seedlingMess.GD}
                                                />
                                                {seedlingMess.GDFJ
                                                    ? seedlingMess.GDFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {seedlingMess.GF ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='冠幅(cm)'
                                                    value={seedlingMess.GF}
                                                />
                                                {seedlingMess.GFFJ
                                                    ? seedlingMess.GFFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {seedlingMess.XJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='胸径(cm)'
                                                    value={seedlingMess.XJ}
                                                />
                                                {seedlingMess.XJFJ
                                                    ? seedlingMess.XJFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {seedlingMess.DJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='地径(cm)'
                                                    value={seedlingMess.DJ}
                                                />
                                                {seedlingMess.DJFJ
                                                    ? seedlingMess.DJFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {seedlingMess.TQHD ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='土球厚度(cm)'
                                                    value={seedlingMess.TQHD}
                                                />
                                                {seedlingMess.TQHDFJ
                                                    ? seedlingMess.TQHDFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {seedlingMess.TQZJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='土球直径(cm)'
                                                    value={seedlingMess.TQZJ}
                                                />
                                                {seedlingMess.TQZJFJ
                                                    ? seedlingMess.TQZJFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </TabPane>
                                    <TabPane tab='树木信息' key='2'>
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='顺序码'
                                            value={
                                                treeMess.sxm ? treeMess.sxm : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='地块'
                                            value={
                                                treeMess.landName
                                                    ? treeMess.landName
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='标段'
                                            value={
                                                treeMess.sectionName
                                                    ? treeMess.sectionName
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='小班'
                                            value={
                                                treeMess.SmallClass
                                                    ? treeMess.SmallClass
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='细班'
                                            value={
                                                treeMess.ThinClass
                                                    ? treeMess.ThinClass
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='树种'
                                            value={
                                                treeMess.TreeTypeName
                                                    ? treeMess.TreeTypeName
                                                    : ''
                                            }
                                        />
                                        <Input
                                            readOnly
                                            style={{ marginTop: '10px' }}
                                            size='large'
                                            addonBefore='位置'
                                            value={
                                                treeMess.Location
                                                    ? `${treeMess.LocationX},${
                                                        treeMess.LocationY
                                                    }`
                                                    : ''
                                            }
                                        />
                                        {treeMess.GD ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='高度(cm)'
                                                    value={treeMess.GD}
                                                />
                                                {treeMess.GDFJ
                                                    ? treeMess.GDFJ.map(src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width:
                                                                              '150px',
                                                                        height:
                                                                              '150px',
                                                                        display:
                                                                              'block',
                                                                        marginTop:
                                                                              '10px'
                                                                    }}
                                                                    src={src}
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.GF ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='冠幅(cm)'
                                                    value={treeMess.GF}
                                                />
                                                {treeMess.GFFJ
                                                    ? treeMess.GFFJ.map(src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width:
                                                                              '150px',
                                                                        height:
                                                                              '150px',
                                                                        display:
                                                                              'block',
                                                                        marginTop:
                                                                              '10px'
                                                                    }}
                                                                    src={src}
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.XJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='胸径(cm)'
                                                    value={treeMess.XJ}
                                                />
                                                {treeMess.XJFJ
                                                    ? treeMess.XJFJ.map(src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width:
                                                                              '150px',
                                                                        height:
                                                                              '150px',
                                                                        display:
                                                                              'block',
                                                                        marginTop:
                                                                              '10px'
                                                                    }}
                                                                    src={src}
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.DJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='地径(cm)'
                                                    value={treeMess.DJ}
                                                />
                                                {treeMess.DJFJ
                                                    ? treeMess.DJFJ.map(src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width:
                                                                              '150px',
                                                                        height:
                                                                              '150px',
                                                                        display:
                                                                              'block',
                                                                        marginTop:
                                                                              '10px'
                                                                    }}
                                                                    src={src}
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.MD ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='密度(棵/m^3)'
                                                    value={treeMess.MD}
                                                />
                                                {treeMess.MDFJ
                                                    ? treeMess.MDFJ.map(src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width:
                                                                              '150px',
                                                                        height:
                                                                              '150px',
                                                                        display:
                                                                              'block',
                                                                        marginTop:
                                                                              '10px'
                                                                    }}
                                                                    src={src}
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.MJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='面积(m^2)'
                                                    value={treeMess.MJ}
                                                />
                                                {treeMess.MJFJ
                                                    ? treeMess.MJFJ.map(src => {
                                                        return (
                                                            <div>
                                                                <img
                                                                    style={{
                                                                        width:
                                                                              '150px',
                                                                        height:
                                                                              '150px',
                                                                        display:
                                                                              'block',
                                                                        marginTop:
                                                                              '10px'
                                                                    }}
                                                                    src={src}
                                                                    alt='图片'
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.TQHD ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='土球厚度(cm)'
                                                    value={treeMess.TQHD}
                                                />
                                                {treeMess.TQHDFJ
                                                    ? treeMess.TQHDFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {treeMess.TQZJ ? (
                                            <div>
                                                <Input
                                                    readOnly
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                    size='large'
                                                    addonBefore='土球直径(cm)'
                                                    value={treeMess.TQZJ}
                                                />
                                                {treeMess.TQZJFJ
                                                    ? treeMess.TQZJFJ.map(
                                                        src => {
                                                            return (
                                                                <div>
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                  '150px',
                                                                            height:
                                                                                  '150px',
                                                                            display:
                                                                                  'block',
                                                                            marginTop:
                                                                                  '10px'
                                                                        }}
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt='图片'
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : ''}
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </TabPane>
                                    <TabPane tab='审批流程' key='3'>
                                        <div>
                                            {flowMess.length > 0
                                                ? flowMess.map(flow => {
                                                    let flowName = '';
                                                    if (flow.Node) {
                                                        if (
                                                            flow.Node ===
                                                              '种树'
                                                        ) {
                                                            flowName =
                                                                  '施工提交';
                                                        } else if (
                                                            flow.Node ===
                                                              '监理'
                                                        ) {
                                                            if (
                                                                flow.Status ===
                                                                  1
                                                            ) {
                                                                flowName =
                                                                      '监理通过';
                                                            } else {
                                                                flowName =
                                                                      '监理拒绝';
                                                            }
                                                        } else if (
                                                            flow.Node ===
                                                              '业主'
                                                        ) {
                                                            if (
                                                                flow.Status ===
                                                                  2
                                                            ) {
                                                                flowName =
                                                                      '业主抽查通过';
                                                            } else {
                                                                flowName =
                                                                      '业主抽查拒绝';
                                                            }
                                                        } else if (
                                                            flow.Node ===
                                                              '补种'
                                                        ) {
                                                            flowName =
                                                                  '施工补录扫码';
                                                        }
                                                    }
                                                    return (
                                                        <div>
                                                            <Row
                                                                style={{
                                                                    marginTop:
                                                                          '10px'
                                                                }}
                                                            >
                                                                <h3
                                                                    style={{
                                                                        float:
                                                                              'left'
                                                                    }}
                                                                >
                                                                    {`${flowName}:`}
                                                                </h3>
                                                                <div
                                                                    style={{
                                                                        float:
                                                                              'right'
                                                                    }}
                                                                >
                                                                    {flow.CreateTime
                                                                        ? flow.CreateTime
                                                                        : ''}
                                                                </div>
                                                            </Row>
                                                            <Row
                                                                style={{
                                                                    marginTop:
                                                                          '10px'
                                                                }}
                                                            >
                                                                {`${
                                                                    flow.FromUserObj
                                                                        ? flow
                                                                            .FromUserObj
                                                                            .Full_Name
                                                                        : ''
                                                                }:${
                                                                    flow.Info
                                                                        ? flow.Info
                                                                        : ''
                                                                }`}
                                                            </Row>
                                                            <hr
                                                                className='hrstyle'
                                                                style={{
                                                                    marginTop:
                                                                          '10px'
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })
                                                : ''}
                                            <div>
                                                <div
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                >
                                                    <h3>{'苗圃提交'}</h3>
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: '10px'
                                                    }}
                                                >
                                                    {`${
                                                        seedlingMess.InputerObj
                                                            ? seedlingMess
                                                                .InputerObj
                                                                .Full_Name
                                                            : ''
                                                    }:${
                                                        seedlingMess.Factory
                                                            ? seedlingMess.Factory
                                                            : ''
                                                    }`}
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </Modal>
                        </div>
                    </div>
                    <Modal
                        title='隐患详情'
                        width={800}
                        visible={this.state.isShowRisk}
                        onOk={this._handleOkVisible.bind(this)}
                        onCancel={this._handleCancelVisible.bind(this)}
                        footer={null}
                    >
                        <div>
                            {
                                <RiskDetail
                                    {...this.props}
                                    map={this.map}
                                    risk={this.state.risk}
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
    _handleOkVisible () {
        this.setState({
            isShowRisk: false
        });
    }
    _handleCancelVisible () {
        this.setState({
            isShowRisk: false
        });
    }

    fillAreaColor (index) {
        let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
        return colors[index % 5];
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
                        ? me.onImgClick(nurserysData.GDFJ)
                        : '',
                    GF: nurserysData.GF ? nurserysData.GF : '',
                    GFFJ: nurserysData.GFFJ
                        ? me.onImgClick(nurserysData.GFFJ)
                        : '',
                    TQZJ: nurserysData.TQZJ ? nurserysData.TQZJ : '',
                    TQZJFJ: nurserysData.TQZJFJ
                        ? me.onImgClick(nurserysData.TQZJFJ)
                        : '',
                    TQHD: nurserysData.TQHD ? nurserysData.TQHD : '',
                    TQHDFJ: nurserysData.TQHDFJ
                        ? me.onImgClick(nurserysData.TQHDFJ)
                        : '',
                    DJ: nurserysData.DJ ? nurserysData.DJ : '',
                    DJFJ: nurserysData.DJFJ
                        ? me.onImgClick(nurserysData.DJFJ)
                        : '',
                    XJ: nurserysData.XJ ? nurserysData.XJ : '',
                    XJFJ: nurserysData.XJFJ
                        ? me.onImgClick(nurserysData.XJFJ)
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
                        ? me.onImgClick(queryTreeData.DJFJ)
                        : '',
                    GD: queryTreeData.GD ? queryTreeData.GD : '',
                    GDFJ: queryTreeData.GDFJ
                        ? me.onImgClick(queryTreeData.GDFJ)
                        : '',
                    GF: queryTreeData.GF ? queryTreeData.GF : '',
                    GFFJ: queryTreeData.GFFJ
                        ? me.onImgClick(queryTreeData.GFFJ)
                        : '',
                    MD: queryTreeData.MD ? queryTreeData.MD : '',
                    MDFJ: queryTreeData.MDFJ
                        ? me.onImgClick(queryTreeData.MDFJ)
                        : '',
                    MJ: queryTreeData.MJ ? queryTreeData.MJ : '',
                    MJFJ: queryTreeData.MJFJ
                        ? me.onImgClick(queryTreeData.MJFJ)
                        : '',
                    TQHD: queryTreeData.TQHD ? queryTreeData.TQHD : '',
                    TQHDFJ: queryTreeData.TQHDFJ
                        ? me.onImgClick(queryTreeData.TQHDFJ)
                        : '',
                    TQZJ: queryTreeData.TQZJ ? queryTreeData.TQZJ : '',
                    TQZJFJ: queryTreeData.TQZJFJ
                        ? me.onImgClick(queryTreeData.TQZJFJ)
                        : '',
                    XJ: queryTreeData.XJ ? queryTreeData.XJ : '',
                    XJFJ: queryTreeData.XJFJ
                        ? me.onImgClick(queryTreeData.XJFJ)
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
    // 树节点信息查看图片时格式转换
    onImgClick (data) {
        let srcs = [];
        try {
            let arr = data.split(',');
            arr.map(rst => {
                let src = rst.replace(/\/\//g, '/');
                src = `${FOREST_API}/${src}`;
                srcs.push(src);
            });
        } catch (e) {
            console.log('处理图片', e);
        }
        return srcs;
    }
}
export default Form.create()(OnSite);
