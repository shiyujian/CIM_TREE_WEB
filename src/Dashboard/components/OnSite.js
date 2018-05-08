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
 * @Last Modified time: 2018-05-08 15:03:20
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from '../store'
import { Button, Modal, Spin, message, Collapse, Checkbox, Form, Input, Tabs, Row, Col  } from 'antd'
import { Icon } from 'react-fa';
import { panorama_360, tracks } from './geojsonFeature'
import {
    PDF_FILE_API,
    previewWord_API,
    CUS_TILEMAP,
    Video360_API2,
    DashboardVideo360API,
    PROJECT_UNITS,
    FOREST_API
} from '_platform/api'
import './OnSite.less'
import CityMarker from './CityMarker'
import CameraVideo from '../../Video/components/CameraVideo'
import DashPanel from './DashPanel'
import TrackPlayBack from './TrackPlayBack'
import moment from 'moment'
import RiskDetail from './riskDetail'
import UserSelect from '_platform/components/panels/UserSelect'
import { wrapperMapUser } from './util'
import DGN from '_platform/components/panels/DGN'
import DGNProjectInfo from './DGNProjectInfo'
import PkCodeTree from './PkCodeTree'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const Panel = Collapse.Panel
const $ = window.$
window.config = window.config || {}
let model_name = window.config.dgn_model_name
@connect(
    state => {
        const { map = {} } = state.dashboard || {}
        return map
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
    }),
)
class Lmap extends Component {
    // export default class Lmap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            leftkeycode: '',
            tree: '',
            mapLayerBtnType: true,
            isNotThree: true,
            isNotDisplay: {
                display: '',
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
            areaJson: [], //区域地块
            users: [], //人员树
            safetys: [], //安全监测
            hazards: [], //安全隐患
            vedios: [], //视频监控
            panorama: [], //全景图
            panoramalink: '',
            panoramaModalVisble: false,
            userCheckedKeys: [], //用户被选中键值
            trackState: false,
            isShowTrack: false,
            trackId: null,
            trackUser: null,
            menuIsExtend: true /*菜单是否展开*/,
            menuWidth: 200 /*菜单宽度*/,
            showCamera: false,
            checkedVedio: {},
            iframe_key: false, //iframe首次进入不加载，点击三维后保留iframe
            iframe_dgn: false,
            risk: {
                showRiskDetail: false,
                detail: null,
                beforImgs: [],
                afterImgs: [],
                processHistory: [],
            },
            userOnlineNumber: 0,
            selectedMenu: '1',
            isVisibleMapBtn: true,
            userOnlineState: false,
            userOnline: [],
            nowShowModel: `${model_name}`,
            //测试选择人员功能是否好用
            // userOnline:[{
            // 	id:528,
            // 	username:'18867508296'
            // }]
            fullExtent: window.config.fullExtent || {
                minlat: 22.468466,
                maxlat: 22.564885,
                minlng: 113.827781,
                maxlng: 113.931283,
            },
            treeType:[],
            projectList:[],
            unitProjectList:[],
            seedlingMess:'',
            treeMess:'',
            flowMess:''
        }
        this.aa = {}
        this.OnlineState = false
        this.checkMarkers = []
        this.tileLayer = null
        this.tileLayer2 = null;
        this.map = null
        this.track = null
        this.orgs = null
        this.timeInteval = null
        /*菜单宽度调整*/
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 200,
            maxWidth: 500,
        }
        /*现场人员*/
        this.user = {
            orgs: {},
            userList: {},
        }
    }

    async gettreedata(rst) {
        const { actions: { getTree } } = this.props
        for (var i = 0; i < rst.length; ++i) {
            let children = await getTree({}, { parent: rst[i].No })
            if (children.length) {
                children = await this.gettreedata(children)
            }
            rst[i].children = children
        }
        return rst
    }

    async componentDidMount() {
        this.loadAreaData();
        this.initMap()
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl
    subDomains = ['7']

    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W,
    }

    //获取地块树数据
    async loadAreaData() {
        const { 
            actions: { 
                getTree,
                getTreeNodeList,
                getLittleBan
            } 
        } = this.props
        console.log('this.props',this.props)
        try {

            let rst = await getTreeNodeList()
            if (rst instanceof Array && rst.length > 0) {
                rst.forEach((item, index) => {
                    rst[index].children = []
                })
            }
            //项目级
            let projectList = [];
            //子项目级
            let unitProjectList = [];
            if (rst instanceof Array && rst.length > 0) {

                rst.map((node)=>{
                    if(node.Type === '项目工程'){
                        projectList.push({
                            Name:node.Name,
                            No:node.No
                        })
                    }else if(node.Type === '子项目工程') {
                        unitProjectList.push({
                            Name:node.Name,
                            No:node.No,
                            Parent:node.Parent
                        })
                    }
                })
                this.setState({
                    projectList,
                    unitProjectList
                })

                for (let i = 0; i<projectList.length; i++){
                    projectList[i].children = unitProjectList.filter(node => {
                        return node.Parent === projectList[i].No;
                    })
                }
                console.log('projectList',projectList)

            }

            unitProjectList.map( async (section)=>{
                let list = await getLittleBan({no:section.No})
                console.log('list',list)
                let smallClassList = this.getSmallClass(list)
                smallClassList.map((smallClass)=>{
                    let thinClassList = this.getThinClass(smallClass,list)
                    smallClass.children = thinClassList
                })
                section.children = smallClassList
                this.setState({ treeLists: projectList })
            })

            
            console.log('unitProjectList',unitProjectList)

            



            
            // this.setState({ treeLists: projectList })
                
        } catch (e) {
            console.log(e)
        }
    }

    getSmallClass(smallClassList){
        //将小班的code获取到，进行去重
        let uniqueSmallClass = [];
        //进行数组去重的数组
        let array = [];
        let smallClassSelect = ''
        smallClassList.map((list)=>{
            if(list.SmallClass && array.indexOf(list.SmallClass) === -1){
                let noArr = list.No.split('-')
                let No = noArr[0] + '-' + noArr[1] +'-' + noArr[2]
                uniqueSmallClass.push({
                    Name:list.SmallClassName?list.SmallClassName+'小班':list.SmallClass+'小班',
                    No:No,
                });
                array.push(list.SmallClass)
            }
        })
        
        console.log('uniqueSmallClass',uniqueSmallClass)
        return uniqueSmallClass
    }

    getThinClass(smallClass,list){
        let thinClassList = []
        let array = [];
        list.map((rst)=>{
            // if(rst.ThinClass && rst.No.indexOf(smallClass.No) != -1 &&  array.indexOf(rst.ThinClass) === -1){
            //     let noArr = rst.No.split('-')
            //     let No = noArr[0] + '-' + noArr[1] +'-' + noArr[2] + '-' + noArr[3]
            //     thinClassList.push({
            //         Name:rst.ThinClassName?rst.ThinClassName+'细班':rst.ThinClass+'细班',
            //         No:No,
            //     })
            //     array.push(list.ThinClass)
            // }

            //暂时去掉重复的节点
            if(rst.ThinClass && rst.No.indexOf(smallClass.No) != -1){
                let noArr = rst.No.split('-')
                let No = noArr[0] + '-' + noArr[1] +'-' + noArr[2] + '-' + noArr[3]
                if(array.indexOf(No) === -1){
                    thinClassList.push({
                        Name:rst.ThinClassName?rst.ThinClassName+'细班':rst.ThinClass+'细班',
                        No:No,
                    })
                    array.push(No)
                }
                
            }
        })
        console.log('thinClassList',thinClassList)
        return thinClassList
    }

    /*初始化地图*/
    initMap() {
        this.map = L.map('mapid', window.config.initLeaflet)

        L.control.zoom({ position: 'bottomright' }).addTo(this.map)

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map)

        this.tileLayer2 = L.tileLayer(window.config.DASHBOARD_ONSITE+"/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}", {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 11,
            maxZoom: 21,
            storagetype: 0,
            tiletype: "wtms"
        }).addTo(this.map);
        // this.tileLayer2 = L.tileLayer('http://47.104.107.55:8080/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&amp;style=&amp;tilematrixset=EPSG%3A4326&amp;Service=WMTS&amp;Request=GetTile&amp;Version=1.0.0&amp;Format=image%2Fpng&amp;TileMatrix=EPSG%3A4326%3A{z}&amp;TileCol={x}&amp;TileRow={y}', {
        //     opacity: 1.0,
        //     subdomains: [1, 2, 3],
        //     minZoom: 11, 
        //     maxZoom: 21,
        //     storagetype: 0,
        //      tiletype: 'wtms'
        // }).addTo(this.map);

        // L.tileLayer("http://47.104.107.55:8080/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}", { opacity:1.0,subdomains: [1, 2, 3], minZoom: 11, maxZoom: 21, storagetype: 0,tiletype:"wtms" });
        const that = this
        this.map.on('click', function (e) {
            //getThinClass(e.latlng.lng,e.latlng.lat);
            that.getTreeInfo(e.latlng.lng, e.latlng.lat, that)

        });
        //航拍影像
        // if (CUS_TILEMAP)
        //     L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map)

    }
    async getTreeInfo(x, y, that) {
        const { actions: { 
            getDimensional,
            getqueryTree,
            getSamplingstat,
            getTreeflows,
            getNurserys,
            getCarpackbysxm 
        } } = this.props
        let me = this
        var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];

        console.log(x, y, that)
        var zoom = that.map.getZoom();
        var resolution = resolutions[zoom];
        var col = (x + 180) / (resolution);
        var colp = col % 256;
        col = Math.floor(col / 256);
        var row = (90 - y) / (resolution);
        var rowp = row % 256;
        row = Math.floor(row / 256);
        var url = window.config.DASHBOARD_ONSITE+"/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:treelocation&STYLE=&TILEMATRIX=EPSG:4326:" + zoom + "&TILEMATRIXSET=EPSG:4326&SERVICE=WMTS&FORMAT=image/png&SERVICE=WMTS&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=" + col + "&TileRow=" + row + "&I=" + colp + "&J=" + rowp;
        debugger
        jQuery.getJSON(url, null,async  function (data) {
            console.log('data',data)
            if(data.features&&data.features.length){
                debugger
                let postdata = {
                    sxm:data.features[0].properties.SXM
                }

                let queryTreeDatas = await getqueryTree({},postdata)
                let samplingstatData = await getSamplingstat({},postdata)
                let treeflowDatas = await getTreeflows({},postdata)
                let nurserysDatas = await getNurserys({},postdata)
                let carData = await getCarpackbysxm(postdata)

                console.log('queryTreeDatas',queryTreeDatas)
                console.log('samplingstatData',samplingstatData)
                console.log('treeflowData',treeflowDatas)
                console.log('nurserysData',nurserysDatas)
                console.log('carData',carData)
                let queryTreeData = {}
                let treeflowData = {}
                let nurserysData = {}

                if(queryTreeDatas && queryTreeDatas.content && queryTreeDatas.content instanceof Array && queryTreeDatas.content.length>0){
                    queryTreeData =  queryTreeDatas.content[0]
                }
                if(treeflowDatas && treeflowDatas.content && treeflowDatas.content instanceof Array && treeflowDatas.content.length>0){
                    treeflowData =  treeflowDatas.content
                }
                if(nurserysDatas && nurserysDatas.content && nurserysDatas.content instanceof Array && nurserysDatas.content.length>0){
                    nurserysData =  nurserysDatas.content[0]
                }
                

                let seedlingMess = {
                    sxm:queryTreeData.ZZBM?queryTreeData.ZZBM:'',
                    car:carData.LicensePlate?carData.LicensePlate:'',
                    TreeTypeName:nurserysData.TreeTypeObj?nurserysData.TreeTypeObj.TreeTypeName:'',
                    TreePlace:nurserysData.TreePlace?nurserysData.TreePlace:'',
                    Factory:nurserysData.Factory?nurserysData.Factory:'',
                    NurseryName:nurserysData.NurseryName?nurserysData.NurseryName:'',
                    LifterTime:nurserysData.LifterTime?nurserysData.LifterTime:'',
                    location:nurserysData.location?nurserysData.location:'',
                    height:nurserysData.GD?nurserysData.GD:'',
                    heightImg:nurserysData.GDFJ?me.onImgClick(nurserysData.GDFJ):'',
                    crown:nurserysData.GF?nurserysData.GF:'',
                    crownImg:nurserysData.GFFJ?me.onImgClick(nurserysData.GFFJ):'',
                    diameter:nurserysData.TQZJ?nurserysData.TQZJ:'',
                    diameterImg:nurserysData.TQZJFJ?me.onImgClick(nurserysData.TQZJFJ):'',
                    thickness:nurserysData.TQHD?nurserysData.TQHD:'',
                    thicknessImg:nurserysData.TQHDFJ?me.onImgClick(nurserysData.TQHDFJ):'',
                    InputerObj:nurserysData.InputerObj?nurserysData.InputerObj:''
                }


                //项目code
                let land = queryTreeData.Land?queryTreeData.Land:''
                //项目名称
                let landName = ''
                //项目下的标段
                let sections = []
                //查到的标段code
                let Section = queryTreeData.Section?queryTreeData.Section:''
                //标段名称
                let sectionName = ''
                
                PROJECT_UNITS.map((unit)=>{
                    if(land === unit.code){
                        sections = unit.units
                        landName = unit.value
                    }
                })
                console.log('sections',sections)
                sections.map((section)=>{
                    if(section.code === Section){
                        sectionName = section.value
                    }
                })

                let treeMess = {
                    sxm:queryTreeData.ZZBM?queryTreeData.ZZBM:'',
                    landName:landName,
                    sectionName:sectionName,
                    SmallClass:queryTreeData.SmallClass?queryTreeData.SmallClass+'号小班':'',
                    ThinClass:queryTreeData.ThinClass?queryTreeData.ThinClass + '号细班':'',
                    TreeTypeName:nurserysData.TreeTypeObj?nurserysData.TreeTypeObj.TreeTypeName:'',
                    Location:queryTreeData.LocationTime ? '已定位' : '未定位',
                    XJ:queryTreeData.XJ?queryTreeData.XJ:'',
                    XJImg:queryTreeData.XJFJ?me.onImgClick(queryTreeData.XJFJ):'',
                }
                let flowMess = treeflowData
              
                that.setState({ 
                    seeVisible: true, 
                    seedlingMess,
                    treeMess,
                    flowMess
                })
                if(that.state.markers){
                    that.state.markers.remove();
                }
                that.createMarkers(data.features[0].geometry.coordinates)
            }
        }); 
    }

    onImgClick(data) {
       
        let src = ''
        try{
            let srcs = data.split(',')
            if(srcs && srcs instanceof Array && srcs.length>0){
                let len = srcs.length
                src = srcs[len-1]
            }else{
                src = data
            }
        }catch(e){
            console.log('处理图片',e)
        }
		src = src.replace(/\/\//g,'/')
		src =  `${FOREST_API}/${src}`
		return src
        
	}

    genPopUpContent(geo) {
        const { properties = {} } = geo
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
					</div>`
            }
            case 'danger': {
                return `<div>
						<h2><span>隐患内容：</span>${properties.content}</h2>
						<h2><span>风险级别：</span>${properties.level}</h2>
						<h2><span>整改状态：</span>未整改</h2>
						<h2><span>整改措施：</span>${properties.measure ? properties.measure : ''}</h2>
						<h2><span>责任单位：</span>${properties.response_org}</h2>
						<a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
					</div>`
            }
            case 'monitor': {
                return `<div>
						<h2><span>摄像头型号：</span>${properties.description}</h2>
						<h2><span>部位：</span>${properties.name}</h2>
					</div>`
            }
            case 'safety': {
                return `<div>
						<h2>仪器名称：${properties.name}</h2>
						<h2>所属部位：${properties.loc}</h2>
					</div>`
            }
            case 'panorama': {
                return `<div>
						<h2>360全景位置：${properties.name}</h2>
					</div>`
            }
            default: {
                return null
            }
        }
    }
    /*在地图上添加marker和polygan*/
    createMarkers(geo) {
        var me = this
        if (!geo[0] || !geo[1]) {
            return
        }
        let iconType = L.divIcon({ className: this.getIconType('tree') })
        console.log("iconType", iconType)
        let marker = L.marker([geo[1],geo[0]], {
            icon: iconType,
        })
        marker.addTo(this.map)
        this.setState({markers:marker})
        return marker

    }
    /*在地图上添加marker和polygan*/
    createMarker(geo, oldMarker) {
        // console.log('geo', geo)
        // console.log('oldMarker', oldMarker)
        // console.log('L.geoJSON',L.geoJson)
        var me = this
        if (geo.properties.type != 'area') {
            if (!oldMarker) {
                if (!geo.geometry.coordinates[0] || !geo.geometry.coordinates[1]) {
                    return
                }
                let iconType = L.divIcon({ className: this.getIconType(geo.type) })
                let marker = L.marker(geo.geometry.coordinates, {
                    icon: iconType,
                    title: geo.properties.name,
                })
                marker.bindPopup(L.popup({ maxWidth: 240 }).setContent(this.genPopUpContent(geo)))
                marker.addTo(this.map)
                return marker
            }
            return oldMarker
        } else {
            //创建区域图形
            // console.log(222222,L)
            if (!oldMarker) {
                let area = L.geoJson(geo, {
                    style: {
                        fillColor: this.fillAreaColor(geo.key),
                        weight: 1,
                        opacity: 1,
                        color: '#201ffd',
                        fillOpacity: 0.3,
                    },
                    title: geo.properties.name,
                }).addTo(this.map)
                //地块标注
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
                // console.log(3333333,area)
                // area.bindTooltip(geo.properties.name).openTooltip();
                this.map.fitBounds(area.getBounds());

                //this.map.panTo(latlng);
                console.log("area", area)

                return area
            }
            console.log("oldMarker", oldMarker)
            return oldMarker
        }
    }

    options = [{ label: '区域地块', value: 'geojsonFeature_area', IconName: 'square' }]

    options2 = [
        { label: '现场人员', value: 'geojsonFeature_people', IconUrl: require('./ImageIcon/people.png'), IconName: 'universal-access', },
        { label: '安全监测', value: 'geojsonFeature_safety', IconUrl: require('./ImageIcon/camera.png'), IconName: 'shield', },
        { label: '安全隐患', value: 'geojsonFeature_hazard', IconUrl: require('./ImageIcon/danger.png'), IconName: 'warning', },
        { label: '视频监控', value: 'geojsonFeature_monitor', IconUrl: require('./ImageIcon/video.png'), IconName: 'video-camera', },
    ];

    //切换为2D
    toggleTileLayer(index) {
        this.tileLayer.setUrl(this.tileUrls[index])
        this.setState({
            TileLayerUrl: this.tileUrls[index],
            mapLayerBtnType: !this.state.mapLayerBtnType,
        })
    }

    //获取对应的ICON
    getIconType(type) {
        switch (type) {
            case 'people':
                return 'peopleIcon'
                break
            case 'safety':
                return 'cameraIcon'
                break
            case 'danger':
                return 'dangerIcon'
                break
            case 'panorama':
                return 'allViewIcon'
                break
            case 'monitor':
                return 'videoIcon'
            case 'tree':
                return 'treeIcon'
                break
            default:
                break
                
        }
    }

    /* 获取对应图层数据 */
    getPanelData(featureName) {
        var content = {}
        switch (featureName) {
            case 'geojsonFeature_people':
                content = this.state.users
                break
            case 'geojsonFeature_safety':
                content = this.state.safetys
                break
            case 'geojsonFeature_hazard':
                content = this.state.hazard
                break
            case 'geojsonFeature_monitor':
                content = this.state.vedios
                break
            case 'geojsonFeature_area':
                content = this.state.treeLists
                break
            // {label: '360全景', value: 'geojsonFeature_360'},
            case 'geojsonFeature_360':
                content = this.state.panorama
                break
        }
        return content
    }

    //图例的显示与否
    toggleIcon() {
        this.setState({
            toggle: !this.state.toggle,
        })
    }
    toggleIcon1() {
        this.setState({
            seeVisible: !this.state.seeVisible,
        })
    }

    /*弹出信息框*/
    onSelect(keys, featureName) {
        console.log('keys',keys)
        console.log('featureName',featureName)
        const { actions: { getTreearea } } = this.props
        const treeNodeName = featureName != null && featureName.selectedNodes.length > 0 ? featureName.selectedNodes[0].props.title : '';

        if (this.checkMarkers.toString() != '') {
            for (var i = 0; i <= this.checkMarkers.length - 1; i++) {
                // console.log('checkMarkers',this.checkMarkers[i])
                this.map.removeLayer(this.checkMarkers[i])
                // this.checkMarkers[i]._leaflet_id.remove()
                delete this.checkMarkers[i]
            }
        }

        this.setState({
            leftkeycode: keys[0]
        });

        let treearea = []
        getTreearea({}, { no: keys[0] }).then(rst => {
            // console.log('rst',rst)
            let str = rst.content[0].coords;
            // console.log('str',str)
            var target1 = str
                .slice(str.indexOf('(') + 3, str.indexOf(')'))
                .split(',')
                .map(item => {
                    return item.split(' ').map(_item => _item - 0)
                })
            treearea.push(target1)

            let message = {
                key: 3,
                type: 'Feature',
                properties: { name: treeNodeName, type: 'area' },
                geometry: { type: 'Polygon', coordinates: treearea }
            }
            let oldMarker = undefined;

            this.checkMarkers[0] = this.createMarker(message, this.checkMarkers[0])
        })
        // let selItem = this.checkMarkers[0]
        // if (selItem) {
        //     selItem.openPopup()
        // }
    }

    /*菜单展开收起*/
    extendAndFold() {
        this.setState({ menuIsExtend: !this.state.menuIsExtend })
    }

    /*手动调整菜单宽度*/
    onStartResizeMenu(e) {
        e.preventDefault()
        this.menu.startPos = e.clientX
        this.menu.isStart = true
        this.menu.tempMenuWidth = this.state.menuWidth
        this.menu.count = 0
    }
    onEndResize(e) {
        this.menu.isStart = false
    }
    onResizingMenu(e) {
        if (this.menu.isStart) {
            e.preventDefault()
            this.menu.count++
            let ys = this.menu.count % 5
            if (ys == 0 || ys == 1 || ys == 3 || ys == 4) return //降低事件执行频率
            let dx = e.clientX - this.menu.startPos
            let menuWidth = this.menu.tempMenuWidth + dx
            if (menuWidth > this.menu.maxWidth) menuWidth = this.menu.maxWidth
            if (menuWidth < this.menu.minWidth) menuWidth = this.menu.minWidth
            this.setState({ menuWidth: menuWidth })
        }
    }

    render() {
        const{
            seedlingMess,
            treeMess,
            flowMess
        }=this.state

        let heightImgStyle = seedlingMess.height?'block':'none'
        let crownImgStyle = seedlingMess.crown?'block':'none'
        let diameterImgStyle = seedlingMess.diameter?'block':'none'
        let thicknessStyle = seedlingMess.thickness?'block':'none'
        let XJIStyle = treeMess.XJ?'block':'none'

        let height = document.querySelector('html').clientHeight - 80 - 36 - 52
        let treeLists = this.state.treeLists
        console.log('this.state',this.state)
        return (
            <div className="map-container">
                <div
                    ref="appendBody"
                    className="l-map r-main"
                    onMouseUp={this.onEndResize.bind(this)}
                    onMouseMove={this.onResizingMenu.bind(this)}
                >
                    <div
                        className={`menuPanel ${this.state.isNotThree ? '' : 'hide'} ${
                            this.state.menuIsExtend ? 'animExtend' : 'animFold'
                            }`}
                        style={
                            this.state.menuIsExtend
                                ? { transform: 'translateX(0)', width: this.state.menuWidth }
                                : {
                                    transform: `translateX(-${this.state.menuWidth}px)`,
                                    width: this.state.menuWidth,
                                }
                        }
                    >
                        <aside className="aside" draggable="false">
                            <Collapse defaultActiveKey={[this.options[0].value]} accordion>
                                {this.options.map(option => {
                                    return (
                                        <Panel key={option.value} header={option.label}>
                                            {this.renderPanel(option)}
                                        </Panel>
                                    )
                                })}
                            </Collapse>
                            <div style={{ height: '20px' }} />
                        </aside>
                        <div
                            className="resizeSenseArea"
                            onMouseDown={this.onStartResizeMenu.bind(this)}
                        />
                        {this.state.menuIsExtend ? (
                            <div
                                className="foldBtn"
                                style={{ left: this.state.menuWidth }}
                                onClick={this.extendAndFold.bind(this)}
                            >
                                收起
                            </div>
                        ) : (
                                <div
                                    className="foldBtn"
                                    style={{ left: this.state.menuWidth }}
                                    onClick={this.extendAndFold.bind(this)}
                                >
                                    展开
                            </div>
                            )}
                    </div>
                    {this.state.isVisibleMapBtn ? (
                        <div className="treeControl">
                            {/*<iframe allowTransparency={true} className={styles.btnCtro}/>*/}
                            <div>
                                <Button
                                    type={this.state.mapLayerBtnType ? 'primary' : 'info'}
                                    onClick={this.toggleTileLayer.bind(this, 1)}
                                >
                                    卫星图
                                </Button>
                                <Button
                                    type={this.state.mapLayerBtnType ? 'info' : 'primary'}
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
                    <div style={this.state.isNotThree == true ? {} : { display: 'none' }}>
                        <div
                            className="iconList"
                            style={this.state.seeVisible ? { width: '290px' } : { width: '0' }}
                         >
                            <Modal
                             visible={this.state.seeVisible}
                             onOk={this.toggleIcon1.bind(this)}
                             onCancel={this.toggleIcon1.bind(this)}
                                >
                                <Tabs defaultActiveKey="1" onChange={this.tabChange.bind(this)} size='large'>
                                    <TabPane tab="苗木信息" key="1">
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='顺序码'  value={seedlingMess.sxm?seedlingMess.sxm:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='打包车牌'  value={seedlingMess.car?seedlingMess.car:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='树种'  value={seedlingMess.TreeTypeName?seedlingMess.TreeTypeName:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='产地'  value={seedlingMess.TreePlace?seedlingMess.TreePlace:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='供应商'  value={seedlingMess.Factory?seedlingMess.Factory:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='苗圃名称'  value={seedlingMess.NurseryName?seedlingMess.NurseryName:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='起苗时间'  value={seedlingMess.LifterTime?seedlingMess.LifterTime:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='起苗地点'  value={seedlingMess.location?seedlingMess.location:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='高度(cm)'  value={seedlingMess.height?seedlingMess.height:''} />
                                        <div>
                                            <img style={{width:"150px",height:"150px",display: heightImgStyle,marginTop: '10px'}} src={seedlingMess.heightImg?seedlingMess.heightImg:''} alt="图片"/>
                                        </div>
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='冠幅(cm)'  value={seedlingMess.crown?seedlingMess.crown:''} />
                                        <div>
                                            <img style={{width:"150px",height:"150px",display: crownImgStyle,marginTop: '10px'}} src={seedlingMess.crownImg?seedlingMess.crownImg:''} alt="图片"/>
                                        </div>
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='土球直径(cm)'  value={seedlingMess.diameter?seedlingMess.diameter:''} />
                                        <div>
                                            <img style={{width:"150px",height:"150px",display: diameterImgStyle,marginTop: '10px'}} src={seedlingMess.diameterImg?seedlingMess.diameterImg:''} alt="图片"/>
                                        </div>
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='土球厚度(cm)'  value={seedlingMess.thickness?seedlingMess.thickness:''} />
                                        <div>
                                            <img style={{width:"150px",height:"150px",display: thicknessStyle,marginTop: '10px'}} src={seedlingMess.thicknessImg?seedlingMess.thicknessImg:''} alt="图片"/>
                                        </div>
                                    
                                    </TabPane>
                                    <TabPane tab="树木信息" key="2">
                                    <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='顺序码'  value={treeMess.sxm?treeMess.sxm:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='地块'  value={treeMess.landName?treeMess.landName:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='标段'  value={treeMess.sectionName?treeMess.sectionName:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='小班'  value={treeMess.SmallClass?treeMess.SmallClass:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='细班'  value={treeMess.ThinClass?treeMess.ThinClass:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='树种'  value={treeMess.TreeTypeName?treeMess.TreeTypeName:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='位置'  value={treeMess.Location?treeMess.Location:''} />
                                        <Input readOnly style={{  marginTop: '10px' }}  size="large" addonBefore='胸径(cm)'  value={treeMess.XJ?treeMess.XJ:''} />
                                        <div>
                                            <img style={{width:"150px",height:"150px",display: XJIStyle,marginTop: '10px'}} src={treeMess.XJImg?treeMess.XJImg:''} alt="图片"/>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="审批流程" key="3">
                                        <div>
                                            {
                                                flowMess.length>0
                                                ?
                                                flowMess.map((flow)=>{
                                                    let flowName = ''
                                                    console.log('flow',flow.Node)
                                                    if(flow.Node){
                                                        if(flow.Node === '种树'){
                                                            flowName = '施工提交'
                                                        }else if(flow.Node === '监理'){
                                                            if(flow.Status === 1){
                                                                flowName = '监理通过'
                                                            }else{
                                                                flowName = '监理拒绝'
                                                            }
                                                            
                                                        }else if(flow.Node === '业主'){
                                                            if(flow.Status === 2){
                                                                flowName = '业主抽查通过'
                                                            }else{
                                                                flowName = '业主抽查拒绝'
                                                            }
                                                        }else if(flow.Node === '补种'){
                                                            flowName = '施工补录扫码'
                                                        }
                                                    }
                                                    return <div>
                                                        <Row style={{marginTop: '10px'}}>
                                                            <h3 style={{float:'left'}}>
                                                                {`${flowName}:`}
                                                            </h3>
                                                            <div style={{float:'right'}}>
                                                                {flow.CreateTime?flow.CreateTime:''}
                                                            </div>
                                                        </Row>
                                                        <Row style={{marginTop: '10px'}}>
                                                            {`${flow.FromUserObj?flow.FromUserObj.Full_Name:''}:${flow.Info?flow.Info:''}`}
                                                        </Row>
                                                        <hr className='hrstyle' style={{marginTop: '10px'}}/>
                                                    </div>
                                                })
                                                :
                                                ''
                                            }
                                            <div>
                                                <div style={{marginTop: '10px'}}>
                                                    <h3 >
                                                        {'苗圃提交'}
                                                    </h3>
                                                </div>
                                                <div style={{marginTop: '10px'}}>
                                                    {`${seedlingMess.InputerObj?seedlingMess.InputerObj.Full_Name:''}:${seedlingMess.Factory?seedlingMess.Factory:''}`}
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
                                this.state.selectedMenu == 1 && this.state.isNotThree == true
                                    ? {}
                                    : { display: 'none' }
                            }
                        >
                            <div
                                id="mapid"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    borderLeft: '1px solid #ccc',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    //  切换标签页    
    tabChange(key){
        console.log(key);
    }

    /*渲染菜单panel*/
    renderPanel(option) {
        let content = this.getPanelData(option.value)

        return (
            <PkCodeTree
                treeData={content}
                selectedKeys={this.state.leftkeycode}
                onSelect={this.onSelect.bind(this)}
                // onExpand={this.onExpand.bind(this)}
                showIcon={false}
            />
        )
    }

    fillAreaColor(index) {
        let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5']
        return colors[index % 5]
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };
}
export default Form.create()(Lmap)
// getNewTreeData(rst3,rst3[i].No,rst4);
function getNewTreeData(treeData, curKey, child) {
    const loop = data => {
        data.forEach(item => {
            if (curKey == item.No) {
                item.children = child
            } else {
                if (item.children) loop(item.children)
            }
        })
    }
    try {
        loop(treeData)
    } catch (e) {
        console.log(e)
    }
}
