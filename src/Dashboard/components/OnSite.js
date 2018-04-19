import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from '../store'
import { Button, Modal, Spin, message, Collapse, Checkbox } from 'antd'
import { Icon } from 'react-fa';
import { panorama_360 } from './geojsonFeature'
import {
    PDF_FILE_API,
    previewWord_API,
    CUS_TILEMAP,
    Video360_API2,
    DashboardVideo360API,
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
export default class Lmap extends Component {
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
        }
        this.aa = {}
        this.OnlineState = false
        this.checkMarkers = []
        this.tileLayer = null
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
	loadAreaData(){
		const { actions: { getTree } } = this.props
		try {
			getTree({}, { parent: 'root' }).then(rst => {
				if (rst instanceof Array && rst.length > 0) {
					rst.forEach((item, index) => {
						rst[index].children = []
					})
					getTree({}, { parent: rst[0].No }).then(rst1 => {
						if (rst1 instanceof Array && rst1.length > 0) {
							rst1.forEach((item, index) => {
								rst1[index].children = []
							})
							getNewTreeData(rst, rst[0].No, rst1)
							getTree({}, { parent: rst1[0].No }).then(rst2 => {
								if (rst2 instanceof Array && rst2.length > 0) {
									getNewTreeData(rst1, rst1[0].No, rst2)
									this.setState({ treeLists: rst }, () => {
										// this.onSelect([rst2[0].No])
									})
									// getNewTreeData(rst1,rst1[0].No,rst2)
									getTree({}, { parent: rst2[0].No }).then(rst3 => {
										if (rst3 instanceof Array && rst3.length > 0) {
											getNewTreeData(rst2, rst2[0].No, rst3)
											this.setState({ treeLists: rst }, () => {
												// this.onSelect([rst3[0].No])
											})
											for (let i = 0; i <= rst3.length - 1; i++) {
												getTree({}, { parent: rst3[i].No }).then(rst4 => {
													getNewTreeData(rst3, rst3[i].No, rst4)
													this.setState({ treeLists: rst })
													// this.setState({treeLists:rst},() => {
													//     this.onSelect([rst4[0].No])
													// })
												})
											}
										} else {
											this.setState({ treeLists: rst })
										}
									})
								} else {
									this.setState({ treeLists: rst })
								}
							})
						} else {
							this.setState({ treeLists: rst })
						}
					})
				}
			})
		} catch (e) {
			console.log(e)
		}
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

        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3], 
			minZoom: 1, 
			maxZoom: 17, 
			storagetype: 0 
        }).addTo(this.map)

        //航拍影像
        // if (CUS_TILEMAP)
        //     L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map)
        
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
    createMarker(geo, oldMarker) {
        // console.log('geo',geo)
        // console.log('oldMarker',oldMarker)
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
                return area
            }
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

    /*弹出信息框*/
    onSelect(keys, featureName) {
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
        let height = document.querySelector('html').clientHeight - 80 - 36 - 52
        let treeLists = this.state.treeLists
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
                    <div style={this.state.isNotThree == true ? {} : { display: 'none' }}>
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
}

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
