import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store';
import { Button, Modal, Spin, message, Collapse, Checkbox, DatePicker } from 'antd';
import { Icon } from 'react-fa'
import { panorama_360 } from './geojsonFeature';
import { PDF_FILE_API, previewWord_API, CUS_TILEMAP, Video360_API2, DashboardVideo360API } from '_platform/api';
// import './Plan.less';

import './OnSite.less';
import CityMarker from './CityMarker';
import CameraVideo from '../../Video/components/CameraVideo';
import DashPanel from "./DashPanel";
import TrackPlayBack from "./TrackPlayBack";
import moment from 'moment';
import RiskDetail from './riskDetail';
import UserSelect from '_platform/components/panels/UserSelect';
import { wrapperMapUser } from './util';
import DGN from '_platform/components/panels/DGN';
import DGNProjectInfo from './DGNProjectInfo';
import { CONSTRACTT } from '../../_platform/api';

const Panel = Collapse.Panel;
const $ = window.$;
const { RangePicker } = DatePicker;
window.config = window.config || {};
let model_name = window.config.dgn_model_name;
@connect(
    state => {
        const { map = {} } = state.dashboard || {};
        return map;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
    }),
)
export default class Plan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TileLayerUrl: this.tileUrls[1],
            mapLayerBtnType: true,
            isNotThree: true,
            isNotDisplay: {
                display: ''
            },
            // leafletCenter: [22.516818, 113.868495],
            leafletCenter: [38.92, 115.98], // 雄安
            toggle: true,
            previewUrl: '',
            previewType: '',
            previewVisible: false,
            previewTitle: '文件预览',
            loading: false,
            users: [],//人员树
            panorama: [],//全景图
            mapList: [],//轨迹列表
            mapRould: [],//坐标
            panoramalink: '',
            panoramaModalVisble: false,
            userCheckedKeys: [],//用户被选中键值
            trackState: false,
            isShowTrack: false,
            trackId: null,
            trackUser: null,
            menuIsExtend: true, /*菜单是否展开*/
            menuWidth: 200, /*菜单宽度*/
            showCamera: false,
            checkedVedio: {},
            iframe_key: false, //iframe首次进入不加载，点击三维后保留iframe
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
                maxlng: 113.931283
            }
        };
        this.OnlineState = false;
        this.checkMarkers = {};
        this.tileLayer = null;
        this.map = null;
        this.track = null;
        this.orgs = null;
        this.timeInteval = null;
        /*菜单宽度调整*/
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 200,
            maxWidth: 500
        }
        /*现场人员*/
        this.user = {
            orgs: {},
            userList: {}
        }
    }

    componentDidMount() {
        this.getMapRouter();
        this.initMap();
    }

    componentWillUnmount() {
        clearInterval(this.timeInteval)
    }

    /*查询巡检路线*/
    getMapRouter() {
        let me = this;
        const { getMapRouter } = this.props.actions;
        getMapRouter().then((orgs) => {
            let orgArr = orgs.map(or => {
                if(or.PatrolerUser!=undefined){
                    return {
                        key: or.ID,
                        properties: {
                            name: or.PatrolerUser.Full_Name
                        }
                    }
                }
            });
            me.setState({ users: orgArr });

        })
    }



    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];


    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };

    /*初始化地图*/
    initMap() {
        this.map = L.map('mapid', window.config.initLeaflet);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
			minZoom: 1, 
			maxZoom: 20, 
			storagetype: 0
        }).addTo(this.map)

        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3], 
			minZoom: 1, 
			maxZoom: 20, 
			storagetype: 0 
        }).addTo(this.map)

        //航拍影像
        // if (CUS_TILEMAP)
        //     L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map);

    }
    genPopUpContent(geo) {
        const { properties = {} } = geo;
        switch (geo.type) {
            case 'people': {
                return (
                    `<div class="popupBox">
						<h2><span>姓名：</span>${properties.name}</h2>
						<h2><span>所属单位：</span>${properties.org}</h2>
						<h2><span>联系方式：</span>${properties.phone}</h2>
						<h2><span>职务：</span>${properties.job}</h2>
						<h2 class="btnRow">
						<a href="javascript:;" class="btnViewTrack" data-id=${geo.key}>轨迹查看</a>
						</h2>
					</div>`
                )
            }
            default: {
                return null;
            }
        }
    }

    options = [
        { label: '巡检路线', value: 'geojsonFeature_people', IconUrl: require('./ImageIcon/people.png'), IconName: 'universal-access', },

    ];
    options1 = [
        { label: '现场人员', value: 'geojsonFeature_people', IconUrl: require('./ImageIcon/people.png'), IconName: 'universal-access', },
        { label: '安全监测', value: 'geojsonFeature_safety', IconUrl: require('./ImageIcon/camera.png'), IconName: 'shield', },
        { label: '安全隐患', value: 'geojsonFeature_hazard', IconUrl: require('./ImageIcon/danger.png'), IconName: 'warning', },
        { label: '视频监控', value: 'geojsonFeature_monitor', IconUrl: require('./ImageIcon/video.png'), IconName: 'video-camera', },
    ];

    //切换为2D
    toggleTileLayer(index) {
        this.tileLayer.setUrl(this.tileUrls[index]);
        this.setState({ TileLayerUrl: this.tileUrls[index], mapLayerBtnType: !this.state.mapLayerBtnType });
    }

    //获取对应的ICON
    getIconType(type) {
        switch (type) {
            case 'people':
                return 'peopleIcon';
                break;
            default:
                break;
        }
    }

    /* 获取对应图层数据 */
    getPanelData(featureName) {
        var content = {};
        switch (featureName) {
            case 'geojsonFeature_people':
                content = this.state.users;
                break;
        }
        return content;
    }

    //图例的显示与否
    toggleIcon() {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    //人员被选中写入地图
    onPeopleCheck(keys, checkItems) {

    }

    findrould(event) {

        var event = event || window.event
        var target = event.target || srcElement
        let arr = this.state.mapRould
        console.log('a', arr)
        let brr = []
        for (var k = 0; k < arr.length; k++) {
            for (var i = 0; i < arr[k].length; i++) {
                brr[i] = [arr[k][i].X, arr[k][i].Y];
            }
        }
        console.log("ccc", brr)


        let latlngs = [["22.52", "113.8937304"], ["22.523", "113.893730454"], ["22.5234", "113.893730454"], ["22.523456", "113.893730454"]]
        let polyline = L.polyline(latlngs, { color: 'red' }).addTo(this.map)
        // this.map.fitBounds(polyline.getBounds())
       

    }

    onCheck(keys, featureName) {
        console.log("keys1111111",keys)
        console.log("featureName111111",featureName)
        let me = this;
        this.setState({ userCheckedKeys: keys }, () => {
            const { getMapList } = this.props.actions;
            console.log("this.state.userCheckedKeys",this.state.userCheckedKeys)
            for (let i = 0; i < this.state.userCheckedKeys.length; i++) {
                const element = this.state.userCheckedKeys[i];
                getMapList({ routeID: element }).then((orgs) => {
                    console.log("orgs222222222",orgs)
                    
                        let set = {}
                        orgs.forEach(item => {
        
                            set[item.RouteID] = []
                        })
                        orgs.forEach(item => {
                            if (set[item.RouteID]) {
                                set[item.RouteID].push({
                                    'GPSTime': item.GPSTime, 'ID': item.ID,
                                    'Patroler': item.Patroler, 'X': item.X, 'Y': item.Y
                                })
                            }
                        })
                        let arr = []
                        for (var i in set) {
                            arr.push(i)
                        }
                        // console.log('arr', arr)
        
                        let arr1 = []
                        for (var i in set) {
                            arr1.push(set[i])
        
                        }
                        // console.log("arr1", arr1)
                        me.setState({ mapRould: arr1 })
                        me.setState({ mapList: arr });
                    })
            }
        
        });

    }


    onSelect(keys, featureName) {
        console.log("keys",keys)
        console.log("featureName",featureName)
        let me = this;
        console.log("me",me)
        this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
        let checkItems = this.checkMarkers[featureName];
        console.log("this.checkMarkers",this.checkMarkers)
        
        let key = keys.length > 0 && keys[0];
        if (key) {
            let selItem = checkItems[key];
            console.log("selItem",selItem)
            if (selItem) {
                if (featureName != 'geojsonFeature_area')
                    this.map.setView(selItem.getLatLng());
                else {
                    this.map.fitBounds(selItem.getBounds(), { padding: [200, 200] });
                }
                selItem.openPopup();
            }
        }
    }

    /*退出轨迹查看*/
    exitTrack() {
        this.setState({ isShowTrack: false });
    }

    /*菜单展开收起*/
    extendAndFold() {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }


    /*手动调整菜单宽度*/
    onStartResizeMenu(e) {
        e.preventDefault();
        this.menu.startPos = e.clientX;
        this.menu.isStart = true;
        this.menu.tempMenuWidth = this.state.menuWidth;
        this.menu.count = 0;
    }

    onResizingMenu(e) {
        if (this.menu.isStart) {
            e.preventDefault();
            this.menu.count++;
            let ys = this.menu.count % 5;
            if (ys == 0 || ys == 1 || ys == 3 || ys == 4) return;//降低事件执行频率
            let dx = e.clientX - this.menu.startPos;
            let menuWidth = this.menu.tempMenuWidth + dx;
            if (menuWidth > this.menu.maxWidth)
                menuWidth = this.menu.maxWidth;
            if (menuWidth < this.menu.minWidth)
                menuWidth = this.menu.minWidth;
            this.setState({ menuWidth: menuWidth });
        }
    }

    onEndResize(e) {
        this.menu.isStart = false;
    }

    render() {
        let height = document.querySelector('html').clientHeight - 80 - 36 - 52;
// console.log("this.state.mapList",this.state.mapList)
        return (
            <div className="map-container">
                <div ref="appendBody" className="l-map r-main"
                    onMouseUp={this.onEndResize.bind(this)}
                    onMouseMove={this.onResizingMenu.bind(this)}>
                    <div
                        className={`menuPanel ${this.state.isNotThree ? '' : 'hide'} ${this.state.menuIsExtend ? 'animExtend' : 'animFold'}`}
                        style={this.state.menuIsExtend ? { transform: 'translateX(0)', width: this.state.menuWidth } :
                            { transform: `translateX(-${this.state.menuWidth}px)`, width: this.state.menuWidth }}>
                        <aside className="aside" draggable="false">
                            <div>
                                <UserSelect placeholder="查询人员" onChange={this.queryUser}></UserSelect>
                            </div>
                            <Collapse defaultActiveKey={[this.options[0].value]} accordion>

                                {

                                    this.options.map((option) => {

                                        return (
                                            <Panel  key={option.value} header={option.label}>
                                                {this.renderPanel(option)}
                                                <div>
                                                    <RangePicker
                                                        style={{ verticalAlign: "middle", width: '100%' }}
                                                        showTime={{ format: 'HH:mm:ss' }}
                                                        format={'YYYY/MM/DD HH:mm:ss'}>
                                                    </RangePicker>
                                                    <ul>
                                                        {
                                                            this.state.mapList.map((item, index) => {
                                                                return <li onClick={this.findrould.bind(this)} key={index}>路线:{item}</li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </Panel>
                                        )
                                    })
                                }
                            </Collapse>
                            <div style={{ height: '20px' }}></div>
                        </aside>
                        <div className="resizeSenseArea" onMouseDown={this.onStartResizeMenu.bind(this)} />
                        {
                            this.state.menuIsExtend ?
                                <div className="foldBtn"
                                    style={{ left: this.state.menuWidth }}
                                    onClick={this.extendAndFold.bind(this)}>收起</div> :
                                <div className="foldBtn"
                                    style={{ left: this.state.menuWidth }}
                                    onClick={this.extendAndFold.bind(this)}>展开</div>
                        }
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0,
                            width: '100%', lineHeight: '20px',
                            textAlign: 'center', zIndex: 1000, background: '#fff'
                        }}
                        >当前在线人数:{this.state.userOnlineNumber}</div>
                    </div>
                    {
                        this.state.isVisibleMapBtn ?
                            <div className="treeControl">

                                <div>
                                    <Button type={this.state.mapLayerBtnType ? "primary" : "info"} onClick={this.toggleTileLayer.bind(this, 1)}>卫星图</Button>
                                    <Button type={this.state.mapLayerBtnType ? "info" : "primary"} onClick={this.toggleTileLayer.bind(this, 2)}>地图</Button>

                                </div>
                            </div> : ''
                    }
                    <div style={(this.state.isNotThree == true) ? {} : { display: 'none' }}>
                        <div className="iconList" style={this.state.toggle ? { width: '100px' } : { width: '0' }}>
                            <img src={require('./ImageIcon/tuli.png')} className="imageControll"
                                onClick={this.toggleIcon.bind(this)} />
                            {
                                this.options1.map((option, index) => {
                                    if (option.label !== '区域地块') {
                                        return (
                                            <div key={index} className="imgIcon">
                                                <img src={option.IconUrl} />
                                                <p>{option.label}</p>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    {
                        this.state.isShowTrack ?
                            <TrackPlayBack {...this.props} map={this.map} trackId={this.state.trackId}
                                trackUser={this.state.trackUser}
                                close={this.exitTrack.bind(this)} />
                            : ''
                    }
                    <div>
                        <div style={(this.state.selectedMenu == 1 && this.state.isNotThree == true) ? {} : { display: 'none' }}>
                            <div id="mapid" style={{
                                "position": "absolute",
                                "top": 0,
                                "bottom": 0,
                                "left": 0,
                                "right": 0,
                                "borderLeft": "1px solid #ccc"
                            }}>
                            </div>
                        </div>
                    </div>
                    <Modal title={this.state.previewTitle} visible={this.state.previewVisible}
                        footer={false}
                        className="preview"
                        onOk={this.previewModal.bind(this)} onCancel={this.previewModal.bind(this)} width="90%" height="100%">
                        {
                            (this.state.previewType === 'office') ?
                                <iframe src={`${previewWord_API}${this.state.previewUrl}`}
                                    width="100%" height="100%" frameBorder="0" style={{ minHeight: '480px' }} />
                                :
                                <iframe className="file-pop-frame"
                                    src={`/pdfjs/web/viewer.html?file=${this.state.previewUrl}`}
                                    width="100%" height="100%" scrolling="no" frameBorder="0" style={{ minHeight: '480px' }} />
                        }
                    </Modal>
                </div>
            </div>
        )
    }

    /*渲染菜单panel*/
    renderPanel(option) {
        let content = this.getPanelData(option.value);
        return (
            <DashPanel style={{height:'200px'}} 
                onCheck={this.onCheck.bind(this)}
                onSelect={this.onSelect.bind(this)}
                content={content}
                userCheckKeys={this.state.userCheckedKeys}
                featureName={option.value} />
        )
    }

    fillAreaColor(index) {
        let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
        return colors[index % 5];
    }

    previewFile(file, properties) {
        if (!file.a_file || /void\.pdf$/.test(file.a_file)) {
            message.warning('该区域暂时没有介绍文件！');
            return
        }
        if (file.a_file.indexOf('.pdf') > 0) {
            this.setState({
                previewUrl: PDF_FILE_API + file.a_file,
                previewVisible: true,
                loading: true,
                previewType: 'pdf',
                previewTitle: properties.name
            });
        } else {
            message.warning('暂不支持此类文件的预览！');
            return
        }
        setTimeout(() => {
            this.setState({
                loading: false,
            })
        }, 1000)
    }

    previewModal() {
        this.setState({
            previewVisible: false,
        });
    }
}
