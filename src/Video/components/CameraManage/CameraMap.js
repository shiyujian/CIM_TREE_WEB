import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../store'
import {Modal, Button, message} from 'antd'
import { CUS_TILEMAP, WMSTILELAYERURL, TILEURLS} from '../../../_platform/api'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './CameraMap.css'
import CameraConfigModal from './CameraConfigModal'

const confirm = Modal.confirm
const NODE_TYPE = {
    PROJECT: 1,
    ENGINEERING: 2,
    CAMERA: 3
}
const $ = window.$

@connect(
	state => {
        const {video} = state;
        return {video};
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

export default class Lmap extends Component {
	constructor(props) {
		super(props)
		this.state = {
			TileLayerUrl: this.tileUrls[1],
			isNotThree: true,
			isNotDisplay: {
				display: ''
			},
			toggle: true,
			loading: false,
			areaJson: [],//区域地块
			video: {},
			showCamera: false,
            oldLayerGroup: [],
            // uploadModalvisible: false,
            // inspectRecords:[],
            // browserModalvisible: false,
            // browserFile: {},

            modalVisible: false,
            initialData: {},
            selectedNode: null,
            nodeType: NODE_TYPE.PROJECT,
		}
		this.checkMarkers = {}
		this.map = null
	}


	componentDidMount() {
		this.initMap()
	}

    componentWillReceiveProps(nextProps) {
        const { cameraData, engineeringPk = '', treeNodeData } = nextProps.video
        const { oldLayerGroup } = this.state
        const newLayerGroup = this.createMarker(cameraData, oldLayerGroup)
        // if (engineeringPk) {
        //     this.initInspectRecordData(engineeringPk)
        // }
        console.log('treeNodeData: ', treeNodeData)
        this.setState({
            oldLayerGroup: newLayerGroup,
            nodeType: treeNodeData.nodeType,
            selectedNode: treeNodeData.selectedNode,
        })
    }

	componentWillUnmount() {
		clearInterval(this.timeInteval)
		/*三维切换卡顿*/

		if (this.state.iframe_key) {
			$('#showCityMarkerId')[0].contentWindow.terminateRender &&
			$('#showCityMarkerId')[0].contentWindow.terminateRender()
		}
	}

	WMSTileLayerUrl = WMSTILELAYERURL;
	subDomains = ['7']

	tileUrls = TILEURLS;

	/*初始化地图*/
	initMap() {
		this.map = L.map('mapid', window.config.initLeaflet);

		L.control.zoom({position: 'bottomright'}).addTo(this.map)

		this.tileLayer = L.tileLayer(this.tileUrls[1], {
			attribution: '&copy;<a href="">ecidi</a>',
			id: 'tiandi-map',
			subdomains: this.subDomains
		}).addTo(this.map)
		//航拍影像
		if (CUS_TILEMAP)
			L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map)

		L.tileLayer.wms(this.WMSTileLayerUrl, {
			subdomains: this.subDomains
		}).addTo(this.map)

	}

	genPopUpContent = (camera) => {
        // 此处添加调用video控件的代码
		return (
			`<div>
				<h2><span>摄像头型号：</span>${camera.desc}</h2>
				<h2><span>部位：</span>${camera.name}</h2>
			</div>`
		)
	}

	/*在地图上添加marker和polygan*/
	createMarker = (cameraData, oldLayerGroup) => {
        if (oldLayerGroup.length)
            oldLayerGroup.map(layer => layer.remove())
        if (cameraData) {
            return  cameraData.map(camera => {
                const iconType = L.divIcon({className: 'videoIcon'})
                const coordinates = [camera.lat, camera.lng]
                const marker = L.marker(coordinates, {icon: iconType, title: camera.name})
				marker.bindPopup(L.popup({maxWidth: 240}).setContent(this.genPopUpContent(camera)))
				marker.addTo(this.map)
                return marker
            })
        }
        return []
	}

	render() {

		return (
			<div className="map-container" style={{position: 'relative'}}>
				<div ref="appendBody" className="l-map r-main">
					<div>
						<div>
							<div id="mapid" style={{
								"position": "relative",
                                "width": "100%",
                                "height": 720
							}}>
							</div>
						</div>
					</div>
                    <div style={{textAlign: 'left', margin: '20px 0 20px 20px'}}>
                        <Button type="primary" onClick={this.handleAddCamera} style={{marginRight: 20}}>添加摄像头</Button>
                        <Button type="primary" onClick={this.handleEditCamera} style={{marginRight: 20}}>编辑摄像头</Button>
                        <Button type="danger" onClick={this.handleRemoveCamera} style={{marginRight: 20}}>删除摄像头</Button>
                    </div>
    				{
    					this.state.modalVisible &&
    					<CameraConfigModal
    						key="1"
    						onOk={this.handleCameraOk}
    						onCancel={this.handleCancelModal}
    						initialData={this.state.initialData}
    						type={this.state.cameraModalType}
    					/>
    				}

				</div>
			</div>
		)
	}

    handleButtonVisible = () => {
        const { manageAreaVisible } = this.state
        this.setState({manageAreaVisible: !manageAreaVisible})
    }

    handleCameraManage = () => {
        const auth = true
        if (auth) {
            this.handleButtonVisible()
        }
    }

    handleCameraOk = (fieldValues) => {
        const { actions: {
            bindCameraToProject,
            getProjectDetail
        }} = this.props
		const {
            initialData,
            selectedNode,
        } = this.state
        const cameraData = {
            project: fieldValues.project,
            engineering: fieldValues.engineering,
            name: fieldValues.name,
            ip: fieldValues.ip,
            port: fieldValues.port,
            username: fieldValues.username,
            password: fieldValues.password,
            lng: fieldValues.lng,
            lat: fieldValues.lat,
            desc: fieldValues.desc,
        }

        getProjectDetail({pk: cameraData.engineering}).then(res => {
            const postData = {
                basic_params: res.basic_params,
                extra_params: res.extra_params,
                version: res.version,
                status: res.status,
                parent: res.parent,
                response_orgs: res.response_orgs
            }
            const extra = postData.extra_params
    		if(Object.keys(initialData).length === 0) {
                cameraData.pk = `${Date.now()}`
                if (!extra.cameras) {
                    extra.cameras = []
                }
                extra.cameras.push(cameraData)
                bindCameraToProject({pk: cameraData.engineering}, postData).then(res => {
                    this.initCameraTree()
                    this.handleCancelModal()
                })
    		} else {
                // initialData,
                // selectedNode,
                cameraData.pk = initialData.pk
                const cameras = extra.cameras
                const index = cameras.indexOf(cameras.find(item => item.pk === cameraData.pk))
                cameras.splice(index, 1, cameraData)
                extra.cameras = cameras
                bindCameraToProject({pk: cameraData.engineering}, postData).then(res => {
                    this.initCameraTree()
                    this.handleCancelModal()
                    selectedNode.title = cameraData.name
                    selectedNode.extra = cameraData
                    this.setState({selectedNode: selectedNode})
                })
            }
        })
    }

    handleCancelModal = () => {
		this.setState({
            modalVisible: false,
			initialData: {}
		})
    }

    handleAddCamera = () => {
		this.setState({
			modalVisible: true,
			cameraModalType: 1,
		})
    }

    handleEditCamera = () => {
        const {nodeType} = this.state
        if (nodeType !== NODE_TYPE.CAMERA) {
            message.error('请先选择一个摄像头')
            return
        }
        const {selectedNode} = this.state
		this.setState({
			modalVisible: true,
			initialData: selectedNode.extra,
			cameraModalType: 2,
		})
    }

    handleRemoveCamera = () => {
        const {nodeType} = this.state
        if (nodeType !== NODE_TYPE.CAMERA) {
            message.error('请先选择一个摄像头')
            return
        }
        const {selectedNode} = this.state
        confirm({
            title: `删除摄像头`,
            content: `你想删除${selectedNode.title}吗？`,
            onOk: () => {
                const cameraData = selectedNode.extra
                const {getProjectDetail, bindCameraToProject} = this.props.actions
                getProjectDetail({pk: cameraData.engineering}).then(res => {
                    const postData = {
                        basic_params: res.basic_params,
                        extra_params: res.extra_params,
                        version: res.version,
                        status: res.status,
                        parent: res.parent,
                        response_orgs: res.response_orgs
                    }
                    const extra = postData.extra_params
                    const cameras = extra.cameras
                    const index = cameras.indexOf(cameras.find(item => item.pk === cameraData.pk))
                    cameras.splice(index, 1)
                    extra.cameras = cameras
                    bindCameraToProject({pk: cameraData.engineering}, postData).then(res => {
                        this.initCameraTree()
                        this.handleCancelModal()
                        this.setState({selectedNode: {}})
                    })
                })
            },
            onCancel: () => {
                this.handleCancelModal()
            }
        })
    }

    initCameraTree = () => {
        const { setCameraTreeRefresh } = this.props.actions
        setCameraTreeRefresh({cameraTreeRefresh: true})
    }
}
