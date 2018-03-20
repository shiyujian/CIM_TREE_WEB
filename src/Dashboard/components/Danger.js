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
export default class Danger extends Component {
	constructor(props) {
		super(props);
		this.state = {
			TileLayerUrl: this.tileUrls[1],
			mapLayerBtnType:true,
			isNotThree: true,
			isNotDisplay: {
				display: ''
			},
			// leafletCenter: [39.004728, 116.244123],
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
				minlat: 38.468466,
				maxlat: 40.004728,
				minlng: 100.244123,
				maxlng: 117.244123
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
		this.initMap();
		this.getArea();
		this.getRisk();
		this.getVedio();
		this.getSafeMonitor();
	}

	componentWillUnmount() {
		clearInterval(this.timeInteval)
		/*三维切换卡顿*/

		if (this.state.iframe_key) {
			$('#showCityMarkerId')[0].contentWindow.terminateRender &&
			$('#showCityMarkerId')[0].contentWindow.terminateRender();
		}
	}

	/*解析组织树*/
	loopOrg(org = {}, root, leafs = []) {
		let me = this;
		var node = {
			key: org.code,
			properties: {
				name: org.name
			}
		}
		if (org.children && org.children.length) {
			node.children = [];
		} else {
			leafs.push(node);
		}
		if (root) {
			root.children.push(node);
		} else {
			root = node;
		}
		org.children && org.children.map(o => {
			me.loopOrg(o, node, leafs)
		});
		return {
			orgTrees: root,
			leafs
		};
	}

	/*获取区域数据*/
	getArea() {
		let me = this;
		const {getArea} = this.props.actions;
		//获取区域数据
		getArea({})
			.then((rst = {}) => {
				let areaData = rst.children || [];
				var resAreas = me.loop(areaData, []);
				resAreas.forEach((v, index) => {
					v.key = index;
				});
				let areas = [{
					key: 'ALL',
					'properties': {
						name: "区域地块",
					},
					children: resAreas
				}];
				me.setState({areaJson: areas});
			});
	}

	/*获取安全隐患点*/
	getRisk() {
		const {getRisk} = this.props.actions;
		let me = this;
		getRisk().then(data => {
			console.log('data',data)
			//安全隐患数据处理
			let datas = data.content;
			let riskObj = {}
			datas.forEach((v, index) => {
				// let levelNode = v["risk_level"];
				let level = v["EventType"];
				let name = v["ProblemType"];
				let response_org = v['ReorganizerObj'];
				// let measure = levelNode["风险控制措施"];
				let content = v["ProblemType"];
				//位置
				// let coordinates = ["39.004728", "116.244123"];
				let locationX = v["X"];
				let locationY = v["Y"];
				let coordinates = [locationY, locationX];
				riskObj[level] = riskObj[level] || {
					key: level,
					'properties': {
						name: level
					},
					children: []
				};
				riskObj[level].children.push({
					'type': 'danger',
					key: v.ID,
					'properties': {
						'content': content,
						'level': level,
						'measure': '',
						'name': name,
						'response_org':response_org?response_org.Full_Name:'',
						// beforeImgs: v['rectify_before'] ? v['rectify_before'].images : [],
						// afterImgs: v['rectify_after'] ? v['rectify_after'].images : []
					},
					'geometry': {
						'type': 'Point',
						'coordinates': coordinates
					}
				});
			});
			let risks = [];
			for (let i in riskObj) {
				risks.push(riskObj[i]);
			}
			me.setState({hazards: risks});
		});
	}

	/*获取视频点*/
	getVedio() {
		let me = this;
		const {getVedio} = this.props.actions;
		const { getCameraTree } = this.props.actions
        getCameraTree().then(res => {
			const treeData = res.children.map(project => {
				const engineerings = project.children;
                return engineerings ? {
					key: project.pk,
					'properties': {
						name:  project.name,
					},
					geometry:{'coordinates':[]},
                    children: engineerings.map(engineering => {
                        const cameras = engineering.extra_params.cameras
                        return cameras ? {
							key: engineering.pk,
							'properties': {
								name:  engineering.name,
							},
							geometry:{'coordinates':[]},
                            children: cameras ? cameras.map(camera => {
								let coord = [camera.lat, camera.lng];
								return {
									'type': 'monitor',
									key:camera.pk,
									'properties': {
										name: camera.name,
										// vType,
										pk: camera.pk,
										ip: camera.ip,
										port: camera.port,
										password: camera.password,
										username: camera.username,
										description: camera.desc
									},
									'geometry': {
										'type': 'Point',
										'coordinates': coord
									}
								}
                            }) : []
                        } : {
							key: engineering.pk,
							'properties': {
								name:  engineering.name,
							},
							geometry:{'coordinates':[]},
                        }
                    })
                } : {
                    title: project.name,
                    key: project.pk,
                }
			})
			//过滤没有摄像头的单位工程
			for(let i = treeData.length-1;i>=0;i--){
				let en = treeData[i];
				for(let j=en.children.length-1;j>=0;j--){
					let unit = en.children[j];
					if(!unit.children||!unit.children.length){
						//移除该项目
						en.children.splice(j,1);
					}
				}
				if(!en.children||!en.children.length){
					treeData.splice(i,1);
				}
			}
			me.setState({vedios: treeData});
		});
	}

	initCameraTree = () => {
        const { getCameraTree } = this.props.actions
        getCameraTree().then(res => {
            // const tmp = res.children
            // const treeData = tmp[0].children.map(project => {
                const treeData = res.children.map(project => {
                const engineerings = project.children
                return engineerings ? {
                    title: project.name,
                    key: project.pk,
                    children: engineerings.map(engineering => {
                        const cameras = engineering.extra_params.cameras
                        return cameras ? {
                            title: engineering.name,
                            key: engineering.pk,
                            children: cameras ? cameras.map(camera => {
                                return {
                                    title: camera.name,
                                    key: camera.pk,
                                    extra: camera
                                }
                            }) : []
                        } : {
                            title: engineering.name,
                            key: engineering.pk,
                        }
                    })
                } : {
                    title: project.name,
                    key: project.pk,
                }
            })
            this.setState({treeData: treeData})
        })
    }

	getSafeMonitor() {
		let me = this;
		const {getSafeMonitor} = this.props.actions;
		getSafeMonitor().then(data => {
			let mon = data.result;
			let name = mon.CodeName;
			let position = mon.CodeInstallPosition;
			let coord = [mon.lat, mon.lng];
			let monitors = [{
				'type': 'safety',
				key: 1,
				'properties': {
					'name': name,
					'loc': position
				},
				'geometry': {
					'type': 'Point',
					'coordinates': coord
				}
			}];
			me.setState({safetys: monitors});
		})
	}

	//解构得到的区域数据
	loop(data = [], resAreas = []) {
		let me = this;
		data.map((item) => {
			if (item.children && item.children.length) {
				me.loop(item.children, resAreas)
			} else if (item.extra_params.coordinates) {
				let areaData = item.extra_params.coordinates;
				let coordinates = [];
				areaData.map((LatLng) => {
					let LngLat = [LatLng.Lng, LatLng.Lat];
					coordinates.push(LngLat)
				});
				resAreas.push({
					key: 0,
					"type": "Feature",
					"properties": {
						"name": item.name,
						"type": "area"
					},
					"geometry": {
						"type": "Polygon",
						"coordinates": [coordinates]
					},
					"file_info": item.extra_params.file_info
				})
			}
		});
		return resAreas;
	};

	WMSTileLayerUrl = window.config.WMSTileLayerUrl;
	subDomains = ['7'];
	tileUrls = {
		1: window.config.IMG_W,
		2: window.config.VEC_W
	};

	/*初始化地图*/
	initMap() {
		this.map = L.map('mapid', window.config.initLeaflet);

		L.control.zoom({position: 'bottomright'}).addTo(this.map);

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

		document.querySelector('.leaflet-popup-pane').addEventListener('click', function (e) {
			let target = e.target;
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

	genPopUpContent(geo) {
		const {properties = {}} = geo;
		switch (geo.type) {
			case 'danger': {
				return (
					`<div>
						<h2><span>隐患内容：</span>${properties.content}</h2>
						<h2><span>风险级别：</span>${properties.level}</h2>
						<h2><span>整改状态：</span>未整改</h2>
						<h2><span>整改措施：</span>${properties.measure ? properties.measure : ''}</h2>
						<h2><span>责任单位：</span>${properties.response_org}</h2>
					</div>`
					//<a href="javascript:;" class="btnViewRisk" data-id=${geo.key}>查看详情</a>
				)
			}
			case 'monitor': {
				return (
					`<div>
						<h2><span>摄像头型号：</span>${properties.description}</h2>
						<h2><span>部位：</span>${properties.name}</h2>
					</div>`
				)
			}
			case 'safety': {
				return (
					`<div>
						<h2>仪器名称：${properties.name}</h2>
						<h2>所属部位：${properties.loc}</h2>
					</div>`
				)
			}
			case 'panorama':{
				return (
					`<div>
						<h2>360全景位置：${properties.name}</h2>
					</div>`
				)
			}
			default: {
				return null;
			}
		}
	}

	/*在地图上添加marker和polygan*/
	createMarker(geo, oldMarker) {
		var me = this;
		if (geo.properties.type != 'area') {
			if (!oldMarker) {
				if (!geo.geometry.coordinates[0] || !geo.geometry.coordinates[1]) {
					return;
				}
				let iconType = L.divIcon({className: this.getIconType(geo.type)});
				let marker = L.marker(geo.geometry.coordinates  , {icon: iconType, title: geo.properties.name});
				// console.log('marker',marker)
				marker.bindPopup(L.popup({maxWidth: 240}).setContent(this.genPopUpContent(geo)));
				marker.addTo(this.map);
				return marker;
			}
			return oldMarker;
		} else {//创建区域图形
			if (!oldMarker) {
				var area = L.geoJSON(geo, {
					style: {
						fillColor: this.fillAreaColor(geo.key),
						weight: 1,
						opacity: 1,
						color: '#201ffd',
						fillOpacity: 0.3
					},
					title: geo.properties.name,
				}).addTo(this.map);
				//地块标注
				let latlng = area.getBounds().getCenter();
				let label = L.marker([latlng.lat, latlng.lng], {
					icon: L.divIcon({
						className: 'label-text',
						html: geo.properties.name,
						iconSize: [48, 20]
					})
				});
				area.addLayer(label);
				//点击预览
				area.on({
					click: function (event) {
						me.previewFile(geo.file_info, geo.properties);
					}
				});
				return area;
			}
			return oldMarker;
		}
	}

	options = [
		// {label: '现场人员', value: 'geojsonFeature_people', IconUrl: require('./ImageIcon/people.png'), IconName: 'universal-access',},
		// {label: '安全监测', value: 'geojsonFeature_safety', IconUrl: require('./ImageIcon/camera.png'), IconName: 'shield',},
		{label: '安全隐患', value: 'geojsonFeature_hazard', IconUrl: require('./ImageIcon/danger.png'), IconName: 'warning',},
		// {label: '360全景', value: 'geojsonFeature_360',IconUrl: require('./ImageIcon/360.png'), IconName: 'icon360',},
		// {label: '视频监控', value: 'geojsonFeature_monitor', IconUrl: require('./ImageIcon/video.png'), IconName: 'video-camera',},
		// {label: '区域地块', value: 'geojsonFeature_area', IconName: 'square'}
	];
	options1 = [
		{label: '现场人员', value: 'geojsonFeature_people', IconUrl: require('./ImageIcon/people.png'), IconName: 'universal-access',},
		{label: '安全监测', value: 'geojsonFeature_safety', IconUrl: require('./ImageIcon/camera.png'), IconName: 'shield',},
		{label: '安全隐患', value: 'geojsonFeature_hazard', IconUrl: require('./ImageIcon/danger.png'), IconName: 'warning',},
		// {label: '360全景', value: 'geojsonFeature_360',IconUrl: require('./ImageIcon/360.png'), IconName: 'icon360',},
		{label: '视频监控', value: 'geojsonFeature_monitor', IconUrl: require('./ImageIcon/video.png'), IconName: 'video-camera',},
		// {label: '区域地块', value: 'geojsonFeature_area', IconName: 'square'}
	];
	//切换伟景行
	switchToDgn(){
		this.setState({
			isNotThree: true,
			isNotDisplay: {display: ''},
			selectedMenu: '3',
			isVisibleMapBtn: true
		});
		if(!this.state.iframe_dgn){
			this.setState({
				iframe_dgn: true
			});
		}
		if (this.state.iframe_key) {
			$("#appendBody").css("top", "100%");
			// $("#showCityMarkerId").css("width", "0");
			let cityMarkerDom = $('#showCityMarkerId')[0];
			cityMarkerDom.contentWindow.pauseRender &&
			cityMarkerDom.contentWindow.pauseRender();
		}
	}

	//切换为3D
	setTrueForThree() {
		this.setState({
			isNotThree: false,
			isNotDisplay: {display: 'none'},
			selectedMenu: '2',
			isVisibleMapBtn: false
		});
		if (!this.state.iframe_key) {
			this.setState({
				iframe_key: true
			});
		}
		if (this.state.iframe_key) {
			$("#appendBody").css("top", "0");
			// $("#showCityMarkerId").css("width", "100%");
			let cityMarkerDom = $('#showCityMarkerId')[0];
			cityMarkerDom.contentWindow.resumeRender &&
			cityMarkerDom.contentWindow.resumeRender();
		}
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
		this.setState({TileLayerUrl: this.tileUrls[index],mapLayerBtnType: !this.state.mapLayerBtnType});
		this.show2DMap();
	}

	//获取对应的ICON
	getIconType(type) {
		switch (type) {
			case 'people':
				return 'peopleIcon';
				break;
			case 'safety':
				return 'cameraIcon';
				break;
			case 'danger':
				return 'dangerIcon';
				break;
			case 'panorama':
				return 'allViewIcon';
				break;
			case 'monitor':
				return 'videoIcon';
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
				content = this.state.areaJson;
				break;
		// {label: '360全景', value: 'geojsonFeature_360'},
			case 'geojsonFeature_360':
				content = this.state.panorama;
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
	onPeopleCheck(keys,checkItems){
		let me  = this;
		let creatUserMakers = function () {
			keys.forEach(k => {
				let user = me.user.userList[k];
				if (user) {
					checkItems[k] = me.createMarker(user, checkItems[k]);
					//获取人员职务
					if (checkItems[k]) {
						const {getUserOrgInfo} = me.props.actions;
						checkItems[k].on('click', function () {
							!user.properties.job &&
							getUserOrgInfo({CODE: user.properties.personCode}).then(orgInfo => {
								user.properties.job = orgInfo.title;
								checkItems[k].setPopupContent(me.genPopUpContent(user));
							});
						});
					}
				}
			});
		}
		//检查是否是组织根节点,如果未加载用户数据,先加载
		let rootKey = keys.find(v => {
			return me.user.orgs[v] !== undefined;
		});
		if (rootKey) {
			me.getUsersByOrg(rootKey).then(uKeys => {
				if (uKeys)//返回的结果有值,说明请求了数据;为空,说明数据已加载过,不重复请求
					keys = uKeys;
				creatUserMakers();
			});
		} else {//未选中组织根节点
			creatUserMakers();
		}
		this.setState({userCheckedKeys:keys},()=>{
			// console.log(this.state.userCheckedKeys,'选中的key');
		});
	}

	/*显示隐藏地图marker*/
	onCheck(keys, featureName) {
		// console.log('keys',keys,featureName)
		var content = this.getPanelData(featureName);
		//获取所有key对应的数据对象
		this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
		let checkItems = this.checkMarkers[featureName];
		//移除未选中的
		for (var c in checkItems) {
			// console.log('checkItems[c]',checkItems[c])
			let k = keys.find(k => k == c);
			if (!k && checkItems[c]) {
				checkItems[c]._icon.remove();
				delete  checkItems[c];
			}
		}
		// debugger
		let me = this;
		if (featureName == 'geojsonFeature_people') {
			me.onPeopleCheck(keys,checkItems);
		} else {
			content.forEach(c => {
				if (!c.children) {
					let kkkk = keys.find(k => k == c.key);
					if (kkkk) {
						checkItems[kkkk] = me.createMarker(c, checkItems[kkkk]);
					}
				} else {
					c.children.forEach(cc => {
						let kk = keys.find(k => k == cc.key);
						if (featureName == 'geojsonFeature_360') {
							if (kk) {
								checkItems[kk] = me.createMarker(cc, checkItems[kk]);
								checkItems[kk]&&checkItems[kk].on('click', function () {
									me.setState({
										panoramaModalVisble: true,
										panoramalink: DashboardVideo360API + '/' + cc.properties.link
									});
								});
							}
						}
						// console.log(1111111,featureName)
						if (featureName == 'geojsonFeature_monitor') {
							//this.map.panTo(latlng);
							if(kk){
								checkItems[kk] = me.createMarker(cc, checkItems[kk]);
								checkItems[kk]&&checkItems[kk].on('click', function () {
									me.setState({checkedVedio: cc});
									me.showCamera();
								});
							}
							if(cc.children && cc.children.length){
								cc.children.forEach(ccc=>{
									let kkk = keys.find(k => k == ccc.key);
									if(kkk){
										checkItems[kkk] = me.createMarker(ccc, checkItems[kkk]);
										checkItems[kkk]&&checkItems[kkk].on('click', function () {
											// me.setState({checkedVedio: cc});
											me.setState({checkedVedio: ccc});
											me.showCamera();
										});
									}
								})
							}
							return ;
						}
						if (kk) {
							checkItems[kk] = me.createMarker(cc, checkItems[kk]);
							if (featureName == 'geojsonFeature_hazard') {
								// console.log(2222222,cc,checkItems[kk])
								this.map.panTo(cc.geometry.coordinates);
								checkItems[kk].on('click', function () {
									//获取隐患处理措施
									const {getRiskContactSheet} = me.props.actions;
									getRiskContactSheet({ID: kk}).then(contact => {
										if (contact.length) {
											let ct = contact[0];
											let measure = ct['rectify_measure'];
											let risk;
											me.state.hazards.forEach(v => {
												if (!risk)
													risk = v.children.find(v1 => v1.key == kk);
											});
											if (risk) {
												risk.properties.measure = measure;
												checkItems[kk].setPopupContent(me.genPopUpContent(risk));
												if (me.state.risk.detail) {//更新详情页隐患措施
													me.state.risk.detail.properties.measure = measure;
													me.setState({risk: me.state.risk});
												}
											}
										}
									});
								});
							}
						}
					})
				}
			});
		}
		this.checkMarkers[featureName] = checkItems;
	}

	/*弹出信息框*/
	onSelect(keys, featureName) {
		this.checkMarkers[featureName] = this.checkMarkers[featureName] || {};
		let checkItems = this.checkMarkers[featureName];
		let key = keys.length > 0 && keys[0];
		if (key) {
			let selItem = checkItems[key];
			if (selItem) {
				if (featureName != 'geojsonFeature_area')
					this.map.setView(selItem.getLatLng());
				else {
					this.map.fitBounds(selItem.getBounds(), {padding: [200, 200]});
				}
				selItem.openPopup();
			}
		}
	}

	/*退出轨迹查看*/
	exitTrack() {
		this.setState({isShowTrack: false});
	}

	/*菜单展开收起*/
	extendAndFold() {
		this.setState({menuIsExtend: !this.state.menuIsExtend});
	}

	/*显示视频*/
	showCamera() {
		this.setState({showCamera: true});
	}

	/*关闭视频*/
	closeCamera() {
		this.setState({showCamera: false});
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
			this.setState({menuWidth: menuWidth});
		}
	}

	onEndResize(e) {
		this.menu.isStart = false;
	}

	/*隐患详情*/
	closeRiskDetail() {
		let oldRisk = this.state.risk;
		oldRisk.showRiskDetail = false;
		this.setState({risk: oldRisk});
	}

	/*获取隐患处理过程*/
	getRiskProcess(id) {
		let me = this;
		const {getRiskProcess, getRiskProcessDetail} = this.props.actions;
		getRiskProcess({}, {code: 'TEMPLATE_011', 'subject_id': id}).then(data => {
			if (data.length) {
				let process = data[0];
				let processId = process.id;
				getRiskProcessDetail({ID: processId}).then(dd => {
					//处理history 显示处理过程
					let excuLogs = [];
					dd.history.forEach(h => {
						if (h.records && h.records.length) {
							let record = h.records[0];
							let personName = record.participant.executor['person_name'];
							let note = record.note;
							let time = new moment(record['log_on']);
							let excuText = `${personName} ${note}  ${time.format('YYYY-MM-DD HH:mm:ss')}`;
							excuLogs.push(excuText);
						} else {
							let participant = h.state.participants;
							let excuLog = '';
							participant.forEach(p => {
								excuLog += p.executor['person_name']||'' + ' ';
							});
							excuLog += '正在处理';
							excuLogs.push(excuLog);
						}
					});
					let oldRisk = me.state.risk;
					oldRisk.processHistory = excuLogs;
					me.setState({risk: {...oldRisk}});
				})
			}
		});
	}

	overallUsersTree=(users,usr)=>{
		let me = this;
		users.forEach(u=>{
			if(u.key == usr.properties.org_code){
				if(u.children){
					if(!u.children.find(uc=>uc.key == usr.key)){
						u.children.push(usr);
					}
				}else{
					u.children = [];
					u.children.push(usr);
				}
			}
			if(u.children && u.children.length){
				me.overallUsersTree(u.children,usr);
			}
		})
	};

	//现场人员搜索
	queryUser=(usr)=>{
		let {userCheckedKeys} = this.state;
		let me = this;
		let geoFeature = 'geojsonFeature_people';
		if(usr) {
			let mapUser = wrapperMapUser(usr);
			if(!this.user.userList[usr.id]){
				//不在目录树中,添加到目录
				this.user.userList[usr.id] = mapUser;
				this.overallUsersTree(this.state.users,mapUser);
				this.setState({users:this.state.users},()=>{
					if (!userCheckedKeys.find(v=>v == usr.id)) {
						userCheckedKeys.push(mapUser.key);
						this.onCheck(userCheckedKeys, geoFeature);
					}
					//居中 并弹出属性框
					me.onSelect([mapUser.key], geoFeature);
				});
			}else {
				if (!userCheckedKeys.find(v=>v == usr.id)) {
					userCheckedKeys.push(usr.id);
					this.onCheck(userCheckedKeys, geoFeature);
				}
				//居中 并弹出属性框
				me.onSelect([mapUser.key], geoFeature);
			}
		}
	};

	render() {
		let height = document.querySelector('html').clientHeight - 80 - 36 - 52;
		return (
			<div className="map-container">
				<div ref="appendBody" className="l-map r-main"
				     onMouseUp={this.onEndResize.bind(this)}
				     onMouseMove={this.onResizingMenu.bind(this)}>
					<div
						className={`menuPanel ${this.state.isNotThree ? '' : 'hide'} ${this.state.menuIsExtend ? 'animExtend' : 'animFold'}`}
						style={this.state.menuIsExtend ? {transform: 'translateX(0)', width: this.state.menuWidth} :
							{transform: `translateX(-${this.state.menuWidth}px)`, width: this.state.menuWidth}}>
						<aside className="aside" draggable="false">
							{/*<div>
								<UserSelect placeholder="查询人员" onChange={this.queryUser}></UserSelect>
							</div>*/}
							<Collapse defaultActiveKey={[this.options[0].value]} accordion>
								{
									this.options.map((option) => {
										// console.log('this.options',this.options)
										if(option.label === '现场人员'){
											return (
												<Panel key={option.value} header={option.label}>
													<Checkbox style={{marginLeft:6}} onChange={this.userOnlineState.bind(this)}>查看在线人员</Checkbox>
													{this.renderPanel(option)}
												</Panel>
											)
										}else /*if(option.label === '360全景'){
											return (
												<Panel key={option.value} header={option.label}>
													<div
														onClick={()=>{
															this.setState({panoramaModalVisble: true});
														}}
														style={{paddingLeft: 20}}
													>全景图</div>
												</Panel>
											)
										}else*/{
											return (
												<Panel key={option.value} header={option.label}>
													{this.renderPanel(option)}
												</Panel>
											)
										}
									})
								}
							</Collapse>
							<div style={{height:'20px'}}></div>
						</aside>
						<div className="resizeSenseArea" onMouseDown={this.onStartResizeMenu.bind(this)}/>
						{
							this.state.menuIsExtend ?
								<div className="foldBtn"
								     style={{left: this.state.menuWidth}}
								     onClick={this.extendAndFold.bind(this)}>收起</div> :
								<div className="foldBtn"
								     style={{left: this.state.menuWidth}}
								     onClick={this.extendAndFold.bind(this)}>展开</div>
						}
						{/*<div style={{
							position: 'absolute', bottom: 0, left: 0,
							width: '100%', lineHeight: '20px',
							textAlign: 'center', zIndex: 1000, background: '#fff'
						}}
						>当前在线人数:{this.state.userOnlineNumber}</div>*/}
					</div>
					{
						this.state.isVisibleMapBtn ?
							<div className="treeControl">
								{/*<iframe allowTransparency={true} className={styles.btnCtro}/>*/}
								<div>
									<Button type={this.state.mapLayerBtnType?"primary":"info"} onClick={this.toggleTileLayer.bind(this, 1)}>卫星图</Button>
									<Button type={this.state.mapLayerBtnType?"info":"primary"} onClick={this.toggleTileLayer.bind(this, 2)}>地图</Button>
									{/*<Button type="danger" onClick={this.setTrueForThree.bind(this)}>三维</Button>*/}
								</div>
							</div> : ''
					}
					<div style={(this.state.isNotThree == true) ? {} : {display: 'none'}}>
						<div className="iconList" style={this.state.toggle ? {width: '100px'} : {width: '0'}}>
							<img src={require('./ImageIcon/tuli.png')} className="imageControll"
							     onClick={this.toggleIcon.bind(this)}/>
							{
								this.options1.map((option, index) => {
									if (option.label !== '区域地块') {
										return (
											<div key={index} className="imgIcon">
												<img src={option.IconUrl}/>
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
					<Modal title={this.state.previewTitle} visible={this.state.previewVisible}
						   footer={false}
						   className="preview"
					       onOk={this.previewModal.bind(this)} onCancel={this.previewModal.bind(this)} width="90%" height="100%">
						{
							(this.state.previewType === 'office') ?
								<iframe src={`${previewWord_API}${this.state.previewUrl}`}
								        width="100%" height="100%" frameBorder="0" style={{minHeight:'480px'}}/>
								:
								<iframe className="file-pop-frame"
								        src={`/pdfjs/web/viewer.html?file=${this.state.previewUrl}`}
								        width="100%" height="100%" scrolling="no" frameBorder="0" style={{minHeight:'480px'}}/>
						}
					</Modal>
					<Modal
						title={this.state.checkedVedio.properties ? this.state.checkedVedio.properties.name : '视频监控'}
						visible={this.state.showCamera}
						width="90%" height="90%"
						onOk={this.closeCamera.bind(this)}
						onCancel={this.closeCamera.bind(this)} className="vedioModal">
						{
							this.state.showCamera ?
								<CameraVideo {...this.state.checkedVedio} /> : ''
						}
					</Modal>
					<Modal
						title="隐患详情"
						width={800} visible={this.state.risk.showRiskDetail}
						onOk={this.closeRiskDetail.bind(this)}
						onCancel={this.closeRiskDetail.bind(this)}
						className="riskDetail">
						{
							this.state.risk.detail ?
								(<RiskDetail risk={this.state.risk}  {...this.props}/>) : ''
						}
					</Modal>
					<Modal
						title="全景图" 
						width={1200}
						visible={this.state.panoramaModalVisble}
						footer={null}
						onCancel={() => {this.setState({panoramaModalVisble: false});}}
					>
						<div style={{width: '100%', height: '800px'}}>
							<iframe 
								title="全景图" 
								id="overall-view2" src={this.state.panoramalink}
								/* style={{position:'absolute', width:'100%', height: '100%'}} */
								style={{width:'100%', height: '100%'}}
							>
							</iframe>
						</div>
					</Modal> 	
				</div>
			</div>
		)
	}

	/*渲染菜单panel*/
	renderPanel(option) {
		let content = this.getPanelData(option.value);
		// console.log('content',content)
		return (
			<DashPanel onCheck={this.onCheck.bind(this)}
			           onSelect={this.onSelect.bind(this)}
			           content={content}
					   userCheckKeys={this.state.userCheckedKeys}
			           // loadData={this.loadUsersByOrg.bind(this)}
			           featureName={option.value}/>

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
