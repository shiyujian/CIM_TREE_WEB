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
 * @Last Modified time: 2018-06-27 15:18:49
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
import {
    PROJECT_UNITS,
    FOREST_API
} from '_platform/api';
import './OnSite.less';
import DashPanel from './DashPanel';
import TrackPlayBack from './TrackPlayBack';
import moment from 'moment';
import PkCodeTree from './PkCodeTree';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const Panel = Collapse.Panel;

window.config = window.config || {};
let ModelName = window.config.dgn_model_name;
@connect(
    state => {
        const { map = {} } = state.dashboard || {};
        return map;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
class Lmap extends Component {
    // export default class Lmap extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            leftkeycode: '',
            tree: '',
            mapLayerBtnType: true,
            isNotThree: true,
            isNotDisplay: {
                display: ''
            },
            seeVisible: false,
            nums: 0,
            markers: null,
            // leafletCenter: [22.516818, 113.868495],
            leafletCenter: [38.92, 115.98], // 雄安
            toggle: true,
            previewUrl: '',
            previewType: '',
            previewVisible: false,
            previewTitle: '文件预览',
            loading: false,
            areaJson: [], // 区域地块
            users: [], // 人员树
            safetys: [], // 安全监测
            hazards: [], // 安全隐患
            vedios: [], // 视频监控
            panorama: [], // 全景图
            panoramalink: '',
            panoramaModalVisble: false,
            userCheckedKeys: [], // 用户被选中键值
            trackState: false,
            isShowTrack: false,
            trackId: null,
            trackUser: null,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 200 /* 菜单宽度 */,
            showCamera: false,
            checkedVedio: {},
            iframe_key: false, // iframe首次进入不加载，点击三维后保留iframe
            iframe_dgn: false,
            risk: {
                showRiskDetail: false,
                detail: null,
                beforImgs: [],
                afterImgs: [],
                processHistory: []
            },
            userOnlineNumber: 0,
            selectedMenu: '1',
            isVisibleMapBtn: true,
            userOnlineState: false,
            userOnline: [],
            nowShowModel: `${ModelName}`,
            // 测试选择人员功能是否好用
            // userOnline:[{
            // 	id:528,
            // 	username:'18867508296'
            // }]
            fullExtent: window.config.fullExtent || {
                minlat: 22.468466,
                maxlat: 22.564885,
                minlng: 113.827781,
                maxlng: 113.931283
            },
            treeType: [],
            projectList: [],
            unitProjectList: [],
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            mapList: [], // 轨迹列表
            mapRould: [] // 坐标
        };
        this.aa = {};
        this.OnlineState = false;
        this.checkMarkers = [];
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.map = null;
        this.track = null;
        this.orgs = null;
        this.timeInteval = null;
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

    async gettreedata (rst) {
        const {
            actions: { getTree }
        } = this.props;
        for (var i = 0; i < rst.length; ++i) {
            let children = await getTree({}, { parent: rst[i].No });
            if (children.length) {
                children = await this.gettreedata(children);
            }
            rst[i].children = children;
        }
        return rst;
    }

    async componentDidMount () {
        this.loadAreaData();
        this.initMap();
        // 巡检路线
        this.getMapRouter();
        // 安全隐患
        this.getArea();
        this.getRisk();
        // this.getVedio();
        // this.getSafeMonitor();
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };

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
            // this.setState({ treeLists: projectList })
        } catch (e) {
            console.log(e);
        }
    }

    getSmallClass (smallClassList) {
        // 将小班的code获取到，进行去重
        let uniqueSmallClass = [];
        // 进行数组去重的数组
        let array = [];

        let test = [];
        smallClassList.map(list => {
            // if (!list.SmallClassName) {
            //     console.log('list', list);
            // }
            // 加入项目，地块的code，使No不重复，如果重复，点击某个节点，No重复的节点也会选择中
            let codeName = list.LandNo + '#' + list.RegionNo + '#' + list.SmallClass + '#' + list.SmallClassName;
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

    getThinClass (smallClass, list) {
        let thinClassList = [];
        let codeArray = [];
        let nameArray = [];
        list.map(rst => {
            // if(rst.ThinClass && rst.No.indexOf(smallClass.No) != -1 &&  array.indexOf(rst.ThinClass) === -1){
            //     let noArr = rst.No.split('-')
            //     let No = noArr[0] + '-' + noArr[1] +'-' + noArr[2] + '-' + noArr[3]
            //     thinClassList.push({
            //         Name:rst.ThinClassName?rst.ThinClassName+'细班':rst.ThinClass+'细班',
            //         No:No,
            //     })
            //     array.push(list.ThinClass)
            // }

            let codeName = smallClass.No.split('#');
            let code = codeName[2];
            let name = codeName[3];
            if (name === 'null') {
                name = null;
            }
            // 暂时去掉重复的节点
            // debugger
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

    // 巡检路线代码

    /* 查询巡检路线 */
    getMapRouter () {
        let me = this;
        const { getMapRouter } = this.props.actions;
        getMapRouter().then(orgs => {
            let orgArr = orgs.map(or => {
                if (or.PatrolerUser !== undefined && or.PatrolerUser !== null) {
                    return {
                        key: or.ID,
                        properties: {
                            name: or.PatrolerUser.Full_Name
                        }
                    };
                }
            });
            me.setState({ users: orgArr });
        });
    }

    // 巡检路线多选树节点
    onCheckPlan (keys, featureName) {
        let me = this;
        this.setState({ userCheckedKeys: keys }, () => {
            const { getMapList } = this.props.actions;
            for (let i = 0; i < this.state.userCheckedKeys.length; i++) {
                const element = this.state.userCheckedKeys[i];
                getMapList({ routeID: element }).then(orgs => {
                    let set = {};
                    orgs.forEach(item => {
                        set[item.RouteID] = [];
                    });
                    orgs.forEach(item => {
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
                    let arr = [];
                    for (var i in set) {
                        arr.push(i);
                    }
                    let arr1 = [];
                    for (var t in set) {
                        arr1.push(set[t]);
                    }
                    me.setState({ mapRould: arr1 });
                    me.setState({ mapList: arr });
                    let latlngs = [];
                    if (arr1 && arr1 instanceof Array && arr1.length > 0) {
                        arr1[0].map(rst => {
                            if (rst && rst.X && rst.Y) {
                                latlngs.push([rst.X, rst.Y]);
                            }
                        });
                    }
                    let polyline = L.polyline(latlngs, { color: 'blue' }).addTo(
                        this.map
                    );
                    this.map.fitBounds(polyline.getBounds());
                });
            }
        });
    }
    // 巡检路线选择树节点
    onSelectPlan (keys, featureName) {
        this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
        let checkItems = this.checkMarkers[featureName];

        let key = keys.length > 0 && keys[0];
        if (key) {
            let selItem = checkItems[key];
            if (selItem) {
                if (featureName !== 'geojsonFeature_area') { this.map.setView(selItem.getLatLng()); } else {
                    this.map.fitBounds(selItem.getBounds(), {
                        padding: [200, 200]
                    });
                }
                selItem.openPopup();
            }
        }
    }

    // 巡检路线代码

    /**
     * 安全隐患代码
     */

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
                // let levelNode = v["risk_level"];
                let level = v['EventType'];
                let name = v['ProblemType'];
                let ResponseOrg = v['ReorganizerObj'];
                // let measure = levelNode["风险控制措施"];
                let content = v['ProblemType'];
                // 位置
                // let coordinates = ["39.004728", "116.244123"];
                let locationX = v['X'];
                let locationY = v['Y'];
                let coordinates = [locationY, locationX];
                riskObj[level] = riskObj[level] || {
                    key: 'Level' + ' ' + level,
                    properties: {
                        name: 'Level' + ' ' + level
                    },
                    children: []
                };
                riskObj[level].children.push({
                    type: 'danger',
                    key: v.ID,
                    properties: {
                        content: content,
                        level: level,
                        measure: '',
                        name: name,
                        response_org: ResponseOrg ? ResponseOrg.Full_Name : ''
                        // beforeImgs: v['rectify_before'] ? v['rectify_before'].images : [],
                        // afterImgs: v['rectify_after'] ? v['rectify_after'].images : []
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
            console.log('risks', risks);
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

    /* 获取隐患处理过程 */
    getRiskProcess (id) {
        let me = this;
        const { getRiskProcess, getRiskProcessDetail } = this.props.actions;
        getRiskProcess({}, { code: 'TEMPLATE_011', subject_id: id }).then(
            data => {
                if (data.length) {
                    let process = data[0];
                    let processId = process.id;
                    getRiskProcessDetail({ ID: processId }).then(dd => {
                        // 处理history 显示处理过程
                        let excuLogs = [];
                        dd.history.forEach(h => {
                            if (h.records && h.records.length) {
                                let record = h.records[0];
                                let personName =
                                    record.participant.executor['person_name'];
                                let note = record.note;
                                let time = new moment(record['log_on']);
                                let excuText = `${personName} ${note}  ${time.format(
                                    'YYYY-MM-DD HH:mm:ss'
                                )}`;
                                excuLogs.push(excuText);
                            } else {
                                let participant = h.state.participants;
                                let excuLog = '';
                                participant.forEach(p => {
                                    excuLog +=
                                        p.executor['person_name'] || '' + ' ';
                                });
                                excuLog += '正在处理';
                                excuLogs.push(excuLog);
                            }
                        });
                        let oldRisk = me.state.risk;
                        oldRisk.processHistory = excuLogs;
                        me.setState({ risk: { ...oldRisk } });
                    });
                }
            }
        );
    }

    /* 显示隐藏地图marker */
    onCheckDanger (keys, featureName) {
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
                            checkItems[kk].on('click', function () {
                                // 获取隐患处理措施
                                const {
                                    getRiskContactSheet
                                } = me.props.actions;
                                getRiskContactSheet({ ID: kk }).then(
                                    contact => {
                                        if (contact.length) {
                                            let ct = contact[0];
                                            let measure = ct['rectify_measure'];
                                            let risk;
                                            me.state.hazards.forEach(v => {
                                                if (!risk) {
                                                    risk = v.children.find(
                                                        v1 => v1.key === kk
                                                    );
                                                }
                                            });
                                            if (risk) {
                                                risk.properties.measure = measure;
                                                checkItems[kk].setPopupContent(
                                                    me.genPopUpContent(risk)
                                                );
                                                if (me.state.risk.detail) {
                                                    // 更新详情页隐患措施
                                                    me.state.risk.detail.properties.measure = measure;
                                                    me.setState({
                                                        risk: me.state.risk
                                                    });
                                                }
                                            }
                                        }
                                    }
                                );
                            });
                        }
                    }
                });
            }
        });

        this.checkMarkers[featureName] = checkItems;
    }

    /* 弹出信息框 */
    onSelectDanger (keys, featureName) {
        this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
        let checkItems = this.checkMarkers[featureName];
        let key = keys.length > 0 && keys[0];
        if (key) {
            let selItem = checkItems[key];
            if (selItem) {
                if (featureName !== 'geojsonFeature_area') { this.map.setView(selItem.getLatLng()); } else {
                    this.map.fitBounds(selItem.getBounds(), {
                        padding: [200, 200]
                    });
                }
                selItem.openPopup();
            }
        }
    }

    /**
     * 安全隐患代码
     */

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
            .addEventListener('click', function (e) {
                let target = e.target;
                // 绑定隐患详情点击事件
                if (target.getAttribute('class') === 'btnViewRisk') {
                    let idRisk = target.getAttribute('data-id');
                    let risk = null;
                    me.state.hazards.forEach(v => {
                        if (!risk) {
                            risk = v.children.find(
                                v1 => v1.key === parseInt(idRisk)
                            );
                        }
                    });
                    if (risk) {
                        let oldRisk = me.state.risk;
                        oldRisk.showRiskDetail = true;
                        oldRisk.processHistory = [];
                        oldRisk.detail = risk;
                        me.setState({ risk: oldRisk });
                        me.getRiskProcess(idRisk);
                    }
                }
            });

        const that = this;
        this.map.on('click', function (e) {
            // getThinClass(e.latlng.lng,e.latlng.lat);
            that.getTreeInfo(e.latlng.lng, e.latlng.lat, that);
        });
    }
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
        // debugger
        jQuery.getJSON(url, null, async function (data) {
            if (data.features && data.features.length) {
                // debugger
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
                that.createMarkers(data.features[0].geometry.coordinates);
            }
        });
    }

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

    genPopUpContent (geo) {
        const { properties = {} } = geo;
        switch (geo.type) {
            case 'people': {
                return `<div class="popupBox">
						<h2><span>姓名：</span>${properties.name}</h2>
						<h2><span>所属单位：</span>${properties.org}</h2>
						<h2><span>联系方式：</span>${properties.phone}</h2>
						<h2><span>职务：</span>${properties.job}</h2>
						<h2 class="btnRow">
						<a href="javascript:;" class="btnViewTrack" data-id=${geo.key}>轨迹查看</a>
						</h2>
					</div>`;
            }
            case 'danger': {
                return `<div>
						<h2><span>隐患内容：</span>${properties.content}</h2>
						<h2><span>风险级别：</span>${properties.level}</h2>
						<h2><span>整改状态：</span>未整改</h2>
						<h2><span>整改措施：</span>${properties.measure ? properties.measure : ''}</h2>
						<h2><span>责任单位：</span>${properties.response_org}</h2>
						<a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
					</div>`;
            }
            case 'monitor': {
                return `<div>
						<h2><span>摄像头型号：</span>${properties.description}</h2>
						<h2><span>部位：</span>${properties.name}</h2>
					</div>`;
            }
            case 'safety': {
                return `<div>
						<h2>仪器名称：${properties.name}</h2>
						<h2>所属部位：${properties.loc}</h2>
					</div>`;
            }
            case 'panorama': {
                return `<div>
						<h2>360全景位置：${properties.name}</h2>
					</div>`;
            }
            default: {
                return null;
            }
        }
    }
    /* 在地图上添加marker和polygan */
    createMarkers (geo) {
        if (!geo[0] || !geo[1]) {
            return;
        }
        let iconType = L.divIcon({ className: this.getIconType('tree') });
        let marker = L.marker([geo[1], geo[0]], {
            icon: iconType
        });
        marker.addTo(this.map);
        this.setState({ markers: marker });
        return marker;
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
            /**
             * 增加安全隐患前代码
             */

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

                // this.map.panTo(latlng);

                return area;
            }
            return oldMarker;

            /**
             * 增加安全隐患后代码
             */
            // if (!oldMarker) {
            // 	var area = L.geoJSON(geo, {
            // 		style: {
            // 			fillColor: this.fillAreaColor(geo.key),
            // 			weight: 1,
            // 			opacity: 1,
            // 			color: '#201ffd',
            // 			fillOpacity: 0.3
            // 		},
            // 		title: geo.properties.name,
            // 	}).addTo(this.map);
            // 	//地块标注
            // 	let latlng = area.getBounds().getCenter();
            // 	let label = L.marker([latlng.lat, latlng.lng], {
            // 		icon: L.divIcon({
            // 			className: 'label-text',
            // 			html: geo.properties.name,
            // 			iconSize: [48, 20]
            // 		})
            // 	});
            // 	area.addLayer(label);
            // 	//点击预览
            // 	area.on({
            // 		click: function (event) {
            // 			me.previewFile(geo.file_info, geo.properties);
            // 		}
            // 	});
            // 	return area;
            // }
        }
    }

    options = [
        { label: '区域地块', value: 'geojsonFeature_area', IconName: 'square' },
        { label: '巡检路线', value: 'geojsonFeature_people', IconUrl: require('./ImageIcon/people.png'), IconName: 'universal-access' },
        { label: '安全隐患', value: 'geojsonFeature_hazard', IconUrl: require('./ImageIcon/danger.png'), IconName: 'warning' }
    ];

    options2 = [
        {
            label: '现场人员',
            value: 'geojsonFeature_people',
            IconUrl: require('./ImageIcon/people.png'),
            IconName: 'universal-access'
        },
        {
            label: '安全监测',
            value: 'geojsonFeature_safety',
            IconUrl: require('./ImageIcon/camera.png'),
            IconName: 'shield'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_hazard',
            IconUrl: require('./ImageIcon/danger.png'),
            IconName: 'warning'
        },
        {
            label: '视频监控',
            value: 'geojsonFeature_monitor',
            IconUrl: require('./ImageIcon/video.png'),
            IconName: 'video-camera'
        }
    ];

    // 切换为2D
    toggleTileLayer (index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType
        });
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
            case 'panorama':
                return 'allViewIcon';
            case 'monitor':
                return 'videoIcon';
            case 'tree':
                return 'treeIcon';
            default:
                break;
        }
    }

    /* 获取对应图层数据 */
    getPanelData (featureName) {
        var content = {};
        switch (featureName) {
            case 'geojsonFeature_people':
                content = this.state.users;
                break;
            case 'geojsonFeature_safety':
                content = this.state.safetys;
                break;
            case 'geojsonFeature_hazard':
                content = this.state.hazards;
                break;
            case 'geojsonFeature_monitor':
                content = this.state.vedios;
                break;
            case 'geojsonFeature_area':
                content = this.state.treeLists;
                break;
            // {label: '360全景', value: 'geojsonFeature_360'},
            case 'geojsonFeature_360':
                content = this.state.panorama;
                break;
        }
        return content;
    }

    // 图例的显示与否
    toggleIcon () {
        this.setState({
            toggle: !this.state.toggle
        });
    }
    toggleIcon1 () {
        this.setState({
            seeVisible: !this.state.seeVisible
        });
    }

    /* 弹出信息框 */
    onSelect (keys, featureName) {
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
                // this.checkMarkers[i]._leaflet_id.remove()
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
            ) { return; }

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
        // let selItem = this.checkMarkers[0]
        // if (selItem) {
        //     selItem.openPopup()
        // }
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

    render () {
        const { seedlingMess, treeMess, flowMess } = this.state;
        // let heightImgStyle = seedlingMess.height?'block':'none'
        // let crownImgStyle = seedlingMess.crown?'block':'none'
        // let diameterImgStyle = seedlingMess.diameter?'block':'none'
        // let thicknessStyle = seedlingMess.thickness?'block':'none'
        // let XJIStyle = treeMess.XJ?'block':'none'
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
                    {/* <div style={this.state.isNotThree == true ? {} : { display: 'none' }}>
                        <div
                            className="iconList"
                            style={this.state.toggle ? { width: '100px' } : { width: '0' }}
                        >
                            <img
                                src={require('./ImageIcon/tuli.png')}
                                className="imageControll"
                                onClick={this.toggleIcon.bind(this)}
                            />
                            {this.options2.map((option, index) => {
                                if (option.label !== '区域地块') {
                                    return (
                                        <div key={index} className="imgIcon">
                                            <img src={option.IconUrl} />
                                            <p>{option.label}</p>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div> */}
                    <div
                        style={
                            this.state.isNotThree
                                ? {}
                                : { display: 'none' }
                        }
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
                    {this.state.isShowTrack ? (
                        <TrackPlayBack
                            {...this.props}
                            map={this.map}
                            trackId={this.state.trackId}
                            trackUser={this.state.trackUser}
                            close={this.exitTrack.bind(this)}
                        />
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
            </div>
        );
    }
    //  切换标签页
    tabChange (key) {
        console.log(key);
    }

    /* 渲染菜单panel */
    renderPanel (option) {
        // console.log('this.state.userCheckedKeys', this.state.userCheckedKeys);
        let content = this.getPanelData(option.value);
        if (option && option.value) {
            switch (option.value) {
                case 'geojsonFeature_people':
                    return (
                        <div>
                            <DashPanel
                                style={{ height: '200px' }}
                                onCheck={this.onCheckPlan.bind(this)}
                                onSelect={this.onSelectPlan.bind(this)}
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
                // case 'geojsonFeature_safety':
                //     content = this.state.safetys
                //     break
                case 'geojsonFeature_hazard':
                    return (
                        <DashPanel
                            onCheck={this.onCheckDanger.bind(this)}
                            onSelect={this.onSelectDanger.bind(this)}
                            content={content}
                            userCheckKeys={this.state.userCheckedKeys}
                            // loadData={this.loadUsersByOrg.bind(this)}
                            featureName={option.value}
                        />
                    );
                // case 'geojsonFeature_monitor':
                //     content = this.state.vedios
                //     break
                case 'geojsonFeature_area':
                    return (
                        <PkCodeTree
                            treeData={content}
                            selectedKeys={this.state.leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)}
                            showIcon={false}
                        />
                    );
                // {label: '360全景', value: 'geojsonFeature_360'},
                case 'geojsonFeature_360':
                    content = this.state.panorama;
                    break;
            }
        }
    }

    fillAreaColor (index) {
        let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
        return colors[index % 5];
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
}
export default Form.create()(Lmap);
