import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store';
import { Radio } from 'antd';
// import { CUS_TILEMAP } from '_platform/api';
import './OnSite.less';
// import './Project.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const $ = window.$;
window.config = window.config || {};
let model_name = window.config.dgn_model_name;
@connect(
    state => {
        const { map = {} } = state.dashboard || {};
        return map;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class Project extends Component {
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
            isTwoScreenShow: 1,
            userOnlineState: false,
            userOnline: [],
            nowShowModel: `${model_name}`,
            fullExtent: window.config.fullExtent || {
                minlat: 22.468466,
                maxlat: 22.564885,
                minlng: 113.827781,
                maxlng: 113.931283
            }
        };
        this.aa = {};
        this.OnlineState = false;
        this.checkMarkers = [];
        this.tileLayer = null;
        this.tileLayer2 = null;
        this.imgTileLayer = null;
        this.cvaTileLayer = null;
        this.map = null;
        this.map2 = null;
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

    async componentDidMount () {
        this.initMap();
        this.initMap2();
        // 地图联动
        const maps = [this.map, this.map2];
        // 事件
        function maplink (e) {
            let _this = this;
            maps.map(function (t) {
                t.setView(_this.getCenter(), _this.getZoom());
            });
        }
        // 绑定
        maps.map(function (t) {
            // t.on({moveend:maplink,zoomend:maplink})
            t.on({ drag: maplink, zoom: maplink });
        });
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];
    tileUrls = {
        // 1: window.config.IMG_W,
        // 2: window.config.VEC_W,
        1: window.config.IMG_1,
        2: window.config.IMG_2,
        3: window.config.IMG_3,
        4: window.config.IMG_4,
        5: window.config.IMG_5,
        6: window.config.IMG_6,
        7: window.config.IMG_7
    };
    /* 初始化地图 */
    initMap () {
        this.map = L.map('mapid', window.config.initLeaflet);

        L.control.zoom({ position: 'topleft' }).addTo(this.map);

        this.imgTileLayer = L.tileLayer(window.config.IMG_W, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map);

        this.cvaTileLayer = L.tileLayer(`${window.config.WMSTileLayerUrl}`, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map);

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 12,
            maxZoom: 20,
            storagetype: 0,
            tiletype: 'arcgis'
        }).addTo(this.map);

        // 航拍影像
        // L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map);
        // document.querySelector('#mapid').addEventListener('animationend', function(){
        //     this.map.invalidateSize();
        //     console.log('test');
        // });
    }
    initMap2 () {
        this.map2 = L.map('mapid2', window.config.initLeaflet);

        L.control.zoom({ position: 'topleft' }).addTo(this.map2);

        this.imgTileLayer = L.tileLayer(window.config.IMG_W, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map2);

        this.cvaTileLayer = L.tileLayer(`${window.config.WMSTileLayerUrl}`, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map2);

        this.tileLayer2 = L.tileLayer(this.tileUrls[1], {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 12,
            maxZoom: 20,
            storagetype: 0,
            tiletype: 'arcgis'
        }).addTo(this.map2);

        // 航拍影像
        // L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map);
    }
    // 切换
    toggleTileLayer (e) {
        const index = e.target.value;
        console.log('index', index);
        this.tileLayer.setUrl(this.tileUrls[index]);
    }
    toggleTileLayer2 (e) {
        const index = e.target.value;
        console.log('index', index);
        this.tileLayer2.setUrl(this.tileUrls[index]);
    }
    // 切换单双屏幕
    toggleOneOrTwoScreen (e) {
        const index = e.target.value;
        console.log('index', index);
        this.setState({
            isTwoScreenShow: index
        });
        // 设置范围
        if (index == 1) return;
        setTimeout(function () {
            this.map.invalidateSize();
        }, 2000);
    }
    // 图例的显示与否
    toggleIcon () {
        this.setState({
            toggle: !this.state.toggle
        });
    }
    /* 显示隐藏地图marker */
    onEndResize (e) {
        this.menu.isStart = false;
    }
    onResizingMenu (e) {
        if (this.menu.isStart) {
            e.preventDefault();
            this.menu.count++;
            let ys = this.menu.count % 5;
            if (ys == 0 || ys == 1 || ys == 3 || ys == 4) return; // 降低事件执行频率
            let dx = e.clientX - this.menu.startPos;
            let menuWidth = this.menu.tempMenuWidth + dx;
            if (menuWidth > this.menu.maxWidth) menuWidth = this.menu.maxWidth;
            if (menuWidth < this.menu.minWidth) menuWidth = this.menu.minWidth;
            this.setState({ menuWidth: menuWidth });
        }
    }
    render () {
        // let height = document.querySelector('html').clientHeight - 80 - 36 - 52;
        // let treeLists = this.state.treeLists;
        // let display1 =
        //     this.state.isTwoScreenShow == 2 ? 'treeControl3' : 'treeControl2';
        return (
            <div className='map-container'>
                <div
                    ref='appendBody'
                    className='l-map r-main'
                    onMouseUp={this.onEndResize.bind(this)}
                    onMouseMove={this.onResizingMenu.bind(this)}
                >
                    {
                        // <div className="treeControl" style={{"zIndex":999}}>
                        // 	<div>
                        // 		<RadioGroup defaultValue={1} onChange={this.toggleOneOrTwoScreen.bind(this)} size="large">
                        // 			<RadioButton value={1}>单屏</RadioButton>
                        // 			<RadioButton value={2}>双屏</RadioButton>
                        // 		</RadioGroup>
                        // 	</div>
                        // </div>
                    }
                    {
                        <div className='treeControl3' style={{ zIndex: 888 }}>
                            <div>
                                <RadioGroup
                                    defaultValue={1}
                                    onChange={this.toggleTileLayer.bind(this)}
                                    size='small'
                                >
                                    <RadioButton value={1}>
                                        2017年11月15日
                                    </RadioButton>
                                    <RadioButton value={2}>
                                        2017年11月24日
                                    </RadioButton>
                                    <RadioButton value={3}>
                                        2017年12月01日
                                    </RadioButton>
                                    <RadioButton value={4}>
                                        2017年12月10日
                                    </RadioButton>
                                    <RadioButton value={5}>
                                        2017年12月13日
                                    </RadioButton>
                                    <RadioButton value={6}>
                                        2018年3月23日
                                    </RadioButton>
                                    <RadioButton value={7}>
                                        2018年5月4日
                                    </RadioButton>
                                </RadioGroup>
                            </div>
                        </div>
                    }
                    {
                        <div className='treeControl2' style={{ zIndex: 888 }}>
                            <div>
                                <RadioGroup
                                    defaultValue={1}
                                    onChange={this.toggleTileLayer2.bind(this)}
                                    size='small'
                                >
                                    <RadioButton value={1}>
                                        2017年11月15日
                                    </RadioButton>
                                    <RadioButton value={2}>
                                        2017年11月24日
                                    </RadioButton>
                                    <RadioButton value={3}>
                                        2017年12月01日
                                    </RadioButton>
                                    <RadioButton value={4}>
                                        2017年12月10日
                                    </RadioButton>
                                    <RadioButton value={5}>
                                        2017年12月13日
                                    </RadioButton>
                                    <RadioButton value={6}>
                                        2018年3月23日
                                    </RadioButton>
                                    <RadioButton value={7}>
                                        2018年5月4日
                                    </RadioButton>
                                </RadioGroup>
                            </div>
                        </div>
                        // this.state.isTwoScreenShow == 2 ?
                        // <div className="treeControl2" style={{"zIndex":888}}>
                        // 	<div>
                        // 		<RadioGroup defaultValue={1} onChange={this.toggleTileLayer2.bind(this)} size="small">
                        // 			<RadioButton value={1}>2017年11月15日</RadioButton>
                        // 			<RadioButton value={2}>2017年11月24日</RadioButton>
                        // 			<RadioButton value={3}>2017年12月01日</RadioButton>
                        // 			<RadioButton value={4}>2017年12月10日</RadioButton>
                        // 			<RadioButton value={5}>2017年12月13日</RadioButton>
                        // 		</RadioGroup>
                        // 	</div>
                        // </div> : null
                    }
                    {
                        // this.state.isTwoScreenShow == 2 ?
                        // <div id="mapid" style={{
                        // 	"position": "absolute",
                        // 	"top": 0,
                        // 	"bottom": 0,
                        // 	"left": 0,
                        // 	"right": 0,
                        // 	"borderLeft": "1px solid #ccc",
                        // 	"float": "left",
                        // 	"width": "50%"
                        // }}/> :
                        // <div id="mapid" style={{
                        // 	"position": "absolute",
                        // 	"top": 0,
                        // 	"bottom": 0,
                        // 	"left": 0,
                        // 	"right": 0,
                        // 	"borderLeft": "1px solid #ccc",
                        // 	"zIndex":777
                        // }}/>
                    }
                    {
                        <div>
                            <div
                                id='mapid'
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    borderLeft: '1px solid #ccc',
                                    float: 'left',
                                    width: '50%'
                                }}
                            />
                            <div
                                id='mapid2'
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: '50%',
                                    right: 0,
                                    borderLeft: '1px solid #ccc',
                                    float: 'right',
                                    width: '50%'
                                }}
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }
}
