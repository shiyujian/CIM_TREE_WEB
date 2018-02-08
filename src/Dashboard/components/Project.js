import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../store';
import {Button, Modal, Spin, message, Collapse, Checkbox} from 'antd';
import {Icon} from 'react-fa'
// import {Icon} from 'react-fa';
// import {users, safetys, hazards, vedios} from './geojsonFeature';
import {panorama_360} from './geojsonFeature';
import {PDF_FILE_API, previewWord_API, CUS_TILEMAP, Video360_API2,DashboardVideo360API} from '_platform/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './OnSite.less';
import CityMarker from './CityMarker';
import CameraVideo from '../../Video/components/CameraVideo';
import DashPanel from "./DashPanel";
import TrackPlayBack from "./TrackPlayBack";
import moment from 'moment';
import RiskDetail from './riskDetail';
import UserSelect from '_platform/components/panels/UserSelect';
import {wrapperMapUser} from './util';
import DGN from '_platform/components/panels/DGN';
import DGNProjectInfo from './DGNProjectInfo';
import PkCodeTree from './PkCodeTree'

const Panel = Collapse.Panel;
const $ = window.$;
window.config = window.config || {};
let model_name = window.config.dgn_model_name;
@connect(
	state => {
		const {map = {}} = state.dashboard || {};
		return map;
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)
export default class Lmap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeLists: [],
			leftkeycode: '',
			tree:'',
			mapLayerBtnType:true,
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
			areaJson: [],//区域地块
			users: [],//人员树
			safetys: [],//安全监测
			hazards: [],//安全隐患
			vedios: [],//视频监控
			panorama: [],//全景图
			panoramalink:'',
			panoramaModalVisble: false,
			userCheckedKeys:[],//用户被选中键值
			trackState: false,
			isShowTrack: false,
			trackId: null,
			trackUser: null,
			menuIsExtend: true, /*菜单是否展开*/
			menuWidth: 200, /*菜单宽度*/
			showCamera: false,
			checkedVedio: {},
			iframe_key: false, //iframe首次进入不加载，点击三维后保留iframe
			iframe_dgn:false,
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
			userOnline:[],
			nowShowModel:`${model_name}`,
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
		this.aa={};
		this.OnlineState = false;
		this.checkMarkers = [];
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
	

	 async componentDidMount() {
		this.initMap();
	}

	componentWillUnmount() {
		if (this.state.iframe_key) {
			$('#showCityMarkerId')[0].contentWindow.terminateRender &&
			$('#showCityMarkerId')[0].contentWindow.terminateRender();
		}
	}

	
	
	WMSTileLayerUrl = window.config.WMSTileLayerUrl;
	subDomains = ['7'];

	tileUrls = {
		1: window.config.IMG_W,
		2: window.config.VEC_W,
		3: window.config.IMG_1,
		4: window.config.IMG_2,
		5: window.config.IMG_3,
		6: window.config.IMG_4,
		7: window.config.IMG_5,
		

	};
	
	/*初始化地图*/
	initMap() {
		this.map = L.map('mapid', window.config.initLeaflet);

		L.control.zoom({position: 'bottomright'}).addTo(this.map);

		this.tileLayer = L.tileLayer(this.tileUrls[3], {
			attribution: '&copy;<a href="">ecidi</a>',
			id: 'tiandi-map',
			subdomains: this.subDomains
		}).addTo(this.map);
		//航拍影像
		if (CUS_TILEMAP)
			L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map);

		L.tileLayer.wms(this.WMSTileLayerUrl, {
			subdomains: this.subDomains
		}).addTo(this.map);
		let me = this;

		document.querySelector('.leaflet-popup-pane').addEventListener('click', function (e) {
			let target = e.target;
			//绑定轨迹查看点击事件
			if (target.getAttribute('class') == 'btnViewTrack') {
				let id = target.getAttribute('data-id');
				//拿到人员信息
				let user = me.user.userList[id];
				let name = user.properties.name;

				//开始显示轨迹
				me.setState({isShowTrack: false});
				me.setState({isShowTrack: true, trackId: id, trackUser: name});
			}
			//绑定隐患详情点击事件
			if (target.getAttribute('class') == 'btnViewRisk') {
				let idRisk = target.getAttribute('data-id');
				let risk = null;
				me.state.hazards.forEach(v => {
					if (!risk)
						risk = v.children.find(v1 => v1.key == parseInt(idRisk));
				});
				if (risk) {
					let oldRisk = me.state.risk;
					oldRisk.showRiskDetail = true;
					oldRisk.processHistory = [];
					oldRisk.detail = risk;
					me.setState({risk: oldRisk});
					me.getRiskProcess(idRisk);
				}
			}
		})
	}


	show2DMap() {
		this.setState({
			isNotThree: true,
			isNotDisplay: {display: ''},
			selectedMenu: '1',
			isVisibleMapBtn: true
		});
		if (this.state.iframe_key) {
			$("#appendBody").css("top", "100%");
			// $("#showCityMarkerId").css("width", "0");
			let cityMarkerDom = $('#showCityMarkerId')[0];
			cityMarkerDom.contentWindow.pauseRender &&
			cityMarkerDom.contentWindow.pauseRender();
		}
	}

	//切换为2D
	toggleTileLayer(index) {

				
		this.tileLayer.setUrl(this.tileUrls[index]);
		this.setState({TileLayerUrl: this.tileUrls[index]});
		this.show2DMap();

		
	}

	

	

	//图例的显示与否
	toggleIcon() {
		this.setState({
			toggle: !this.state.toggle
		})
	}


	
	/*显示隐藏地图marker*/
	
	onEndResize(e) {
		this.menu.isStart = false;
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
			this.setState({menuWidth: menuWidth});
		}
	}

	
	render() {
		let height = document.querySelector('html').clientHeight - 80 - 36 - 52;
		let treeLists = this.state.treeLists;
		return (
			<div className="map-container">
				<div ref="appendBody" className="l-map r-main"
				     onMouseUp={this.onEndResize.bind(this)}
				     onMouseMove={this.onResizingMenu.bind(this)}>
					{
						this.state.isVisibleMapBtn ?
							<div className="treeControl">
								<div>
									<Button onClick={this.toggleTileLayer.bind(this, 1)}>2月1日</Button>
									<Button onClick={this.toggleTileLayer.bind(this, 2)}>2月2日</Button>
									<Button onClick={this.toggleTileLayer.bind(this, 3)}>2月3日</Button>
									<Button onClick={this.toggleTileLayer.bind(this, 4)}>2月4日</Button>
									<Button onClick={this.toggleTileLayer.bind(this, 5)}>2月5日</Button>
									
								</div>
							</div> : ''
					}
					{
						this.state.isShowTrack ?
							<TrackPlayBack {...this.props} map={this.map} trackId={this.state.trackId}
							               trackUser={this.state.trackUser}
							               close={this.exitTrack.bind(this)}/>
						: ''
					}
					<div>
						<div style={(this.state.selectedMenu ==1 && this.state.isNotThree == true) ? {} : {display: 'none'}}>
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
						<div style={ this.state.selectedMenu ==2 ? {} :{display:'none'}}>
						{
							(this.state.iframe_key === true) ? <CityMarker/> : null
						}
						</div>
						<div style={ this.state.selectedMenu ==3 ? {} :{display:'none'}}>
							{
							(this.state.iframe_dgn === true ) ? 	
								<DGNProjectInfo {...this.props}></DGNProjectInfo>
								 : null
							}
						</div>
					</div>

				</div>
			</div>
		)
	}

	
  

	

	}


	
