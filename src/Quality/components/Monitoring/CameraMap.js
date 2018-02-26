import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../store/monitoring'
import {Modal, Table, Button, Input, Upload, Icon, Form, message} from 'antd'
import moment from 'moment'
import {FILE_API, CUS_TILEMAP, SOURCE_API, DOWNLOAD_FILE, WMSTILELAYERURL, TILEURLS} from '../../../_platform/api'
import {getUser} from '../../../_platform/auth';
import './CameraMap.css'
import Camera from './Camera'

const $ = window.$
const FormItem = Form.Item

@connect(
	state => {
		const {monitoring = {}} = state.quality || {}
		return monitoring
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
            uploadModalvisible: false,
            inspectRecords:[],
            browserModalvisible: false,
            browserFile: {},
		}
		this.checkMarkers = {}
		this.map = null
	}
    

	componentDidMount() {
		this.initMap()
	}

    componentWillReceiveProps(nextProps) {
        const { cameraData, engineeringPk = '' } = nextProps
        const { oldLayerGroup } = this.state
        const newLayerGroup = this.createMarker(cameraData, oldLayerGroup)
        if (engineeringPk) {
            this.initInspectRecordData(engineeringPk)
        }
        this.setState({oldLayerGroup: newLayerGroup})
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
	// 	1: "http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
	// 	2: "http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}"
	// }

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
        		marker.on('click', () => {
        			this.setState({video: camera})
        			this.showCamera()
                    camera && this.refs.camera.loadCamera(camera)
                })
                return marker
            })
        }
        return []
	}

	/*显示视频*/
	showCamera() {
		this.setState({showCamera: true})
	}

	/*关闭视频*/
	closeCamera() {
		this.setState({showCamera: false})
	}

    openUploadModal = () => {
        this.setState({uploadModalvisible: true})
    }

    closeUploadModal = () => {
        this.setState({uploadModalvisible: false})
    }

    handleUploadRecord = (fieldValues, fileData) => {
        const { video } = this.state
        const {
            getProjectDetail,
            bindCameraToProject ,
            setInspectRecordDocument,
        } = this.props.actions
        const recordData = {
            code: `inspect_record_${Date.now()}`,
            name: fieldValues.inspectContent,
            obj_type: "C_DOC",
            workpackages: [],
            profess_folder: {"code": "folder_code", "obj_type": "C_DIR"},
            extra_params: {
                inspectTime: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
                camera: video.pk,
                engineeringPk: video.engineering,
                cameraName: video.name,
                inspectPerson: {
					// inspect_user_id:cookie('check_userid')
                    name: getUser().name,
                    id: getUser().id
                }
            },
            basic_params: {
                files: fileData
            },
            status: "A",
            version: "A",
            ex_change_docs:[]
        }

        setInspectRecordDocument({}, recordData).then(doc => {
            if (doc.pk) {
                getProjectDetail({pk: video.engineering}).then(res => {
                    const postData = {
                        basic_params: res.basic_params,
                        extra_params: res.extra_params,
                        version: res.version,
                        status: res.status,
                        parent: res.parent,
                        response_orgs: res.response_orgs
                    }
                    const extra = postData.extra_params
                    if (!extra.recordFile) {
                        extra.recordFile = []
                    }
                    extra.recordFile.push(doc)
                    bindCameraToProject({pk: video.engineering}, postData).then(res => {
                        this.initInspectRecordData(video.engineering)
                    })
                })
            }
            this.closeUploadModal()
        })
    }

    initInspectRecordData = (engineeringPk) => {
        const { getProjectDetail } = this.props.actions
        getProjectDetail({pk: engineeringPk}).then(res => {
            const recordFile = res.extra_params.recordFile || []
            const inspectRecords = recordFile.map((record, index) => {
                debugger
                return {
                    key: record.pk,
                    order: index + 1,
                    inspectContent: record.name,
                    inspectPerson: record.extra_params.inspectPerson.name,
                    inspectTime: record.extra_params.inspectTime,
                    cameraName: record.extra_params.cameraName,
                    attachment: record.files.length ? record.files[0].name : '',
                    file: record.files[0],
                    engineeringPk: record.extra_params.engineeringPk,
                }
            })
            this.setState({inspectRecords: inspectRecords})
        })
    }

    handleDeleteInspectRecord = (record) => {
        const {
            getProjectDetail,
            bindCameraToProject,
            delInspectRecordDocument,
            deleteStaticFile,
        } = this.props.actions
        delInspectRecordDocument({pk: record.key}).then(resp => {
            getProjectDetail({pk: record.engineeringPk}).then(res => {
                const postData = {
                    basic_params: res.basic_params,
                    extra_params: res.extra_params,
                    version: res.version,
                    status: res.status,
                    parent: res.parent,
                    response_orgs: res.response_orgs
                }
                const extra = postData.extra_params
                const recordFile = extra.recordFile
                const index = recordFile.indexOf(recordFile.find(item => item.pk === record.key))
                extra.recordFile.splice(index, 1)
                bindCameraToProject({pk: record.engineeringPk}, postData).then(rst => {
                    deleteStaticFile({id: record.file.id}).then(rst => {
                        this.initInspectRecordData(record.engineeringPk)
                    })
                })
            })
        })
    }

    handleBrowseInspectRecord = (record) => {
        this.setState({
            browserFile: record.file,
            browserModalvisible: true
        })
    }

    handleDownloadInspectRecord = (record) => {
        document.querySelector('#root').insertAdjacentHTML('afterend', '<iframe src="'+`${DOWNLOAD_FILE}${record.file.download_url}`+'" style="display: none"></iframe>')
    }

    getBrowserModalContent = () => {
        const { browserFile } = this.state
        const file = browserFile.a_file
        const mediaType = file.substring(file.length - 3)
        return mediaType === 'jpg' ? (
            <div>
                <img style={{width: '100%', height: '100%'}} src={`${SOURCE_API}${file}`} alt="您的浏览器不支持浏览"/>
            </div>
        ) : mediaType === 'mp4' ? (
            <div>
                <video style={{width: '100%', height: '100%'}} src={`${SOURCE_API}${file}`} controls="controls">您的浏览器不支持浏览</video>
            </div>
        ) : (
            <div>
                <h1>无法预览！</h1>
            </div>
        )
    }

    openBrowserModal = () => {
        this.setState({browserModalvisible: true})
    }

    closeBrowserModal = () => {
        this.setState({browserModalvisible: false})
    }

	render() {
        const columns = [{
            title: '巡检记录序号',
            dataIndex: 'order',
            width: '7%'
        },{
            title: '巡检内容',
            dataIndex: 'inspectContent',
            width: '38%'
        },{
            title: '巡检人',
            dataIndex: 'inspectPerson',
            width: '10%'
        },{
            title: '巡检时间',
            dataIndex: 'inspectTime',
            width: '10%'
        },{
            title: '摄像头',
            dataIndex: 'cameraName',
            width: '10%'
        },{
            title: '附件',
            dataIndex: 'attachment',
            width: '15%'
        },{
            title: '操作',
            dataIndex: 'operation',
            width: '10%',
            render: (text, record, index) => (
                <span>
					<a onClick={() => {
						Modal.confirm({
							title: '删除巡检记录',
							content: `确定删除 ${record.inspectContent} ？`,
							okText: '确认',
							cancelText: '取消',
							onOk: () => this.handleDeleteInspectRecord(record),
						})
                    }}>删除</a>
                    <span className="ant-divider" />
                    <a onClick={() => this.handleBrowseInspectRecord(record)}>浏览</a>
                    <span className="ant-divider" />
                    <a onClick={() => this.handleDownloadInspectRecord(record)}>下载</a>
                </span>
            ),
        }]

        const {inspectRecords = [], browserFile = {}} = this.state
		return (
			<div className="map-container" style={{position: 'relative'}}>
				<div ref="appendBody" className="l-map r-main">
					<div>
						<div>
							<div id="mapid" style={{
								"position": "relative",
                                "width": "100%",
                                "height": 620
							}}>
							</div>
						</div>
					</div>
                    <div style={{padding: 10}}>
                        <Table
                            className="inspectRecordTbl"
                            bordered
                            columns={columns}
                            dataSource={inspectRecords}
                            pagination={{ pageSize: 4 }}
                        />
                    </div>
					<Modal
						title={this.state.video ? this.state.video.name : '视频监控'}
						visible={this.state.showCamera}
                        key={new Date().toString()}
                        maskClosable={false}
                        footer={null}
						width="60%"
                        height="80%"
						onOk={this.closeCamera.bind(this)}
						onCancel={this.closeCamera.bind(this)}
                    >
                        <Camera   
                            style={{display:this.state.showCamera ? '' : 'none'}}
                            {...this.state.video}
                            ref="camera"
                            closeCamera={this.closeCamera.bind(this)}
                            openUploadModal={this.openUploadModal}
                        />
					</Modal>
                    {
                        this.state.uploadModalvisible &&
                        <Modal
                            title="生成巡检记录"
                            visible={true}
                            maskClosable={false}
                            footer={null}
                            onCancel={this.closeUploadModal}
                        >
                            <UploadModal onOk={this.handleUploadRecord}></UploadModal>
                        </Modal>
                    }
                    {
                        this.state.browserModalvisible &&
                        <Modal
                            title={`${browserFile.name}`}
    						width="60%"
                            height="80%"
                            visible={true}
                            maskClosable={false}
                            footer={null}
                            onCancel={this.closeBrowserModal}
                        >
                            { this.getBrowserModalContent() }
                        </Modal>
                    }
				</div>
			</div>
		)
	}
}

@connect(
	state => {
		const {monitoring = {}} = state.quality || {}
		return monitoring
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)
class UploadModal extends Component {

    state = {
        currInitialData: null
    }
    // 去除 静态文件a_file 和 download_url 的服务地址
    covertURLRelative = (originUrl) => {
    	// const originUrl = "http://gitlab.ecidi.com:6514/media/documents/2016/11/P121C7J-HDY58DR-UAA04-0001.pdf";
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

    getUploadModalContent = () => {
    }

	// 上传课程 封面图片
	coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}

		this.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}

	beforeUploadPicFile  = (file) => {
		const fileName = file.name;
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return
            }
            const filedata = resp
            filedata.a_file = this.covertURLRelative(filedata.a_file)
            filedata.download_url = this.covertURLRelative(filedata.a_file)
            const attachment = [{
                uid: file.uid,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
                thumbUrl: resp.a_file
            }]
    		// 删除 之前的文件
    		if(this.state.currInitialData) {
    			deleteStaticFile({ id: this.state.currInitialData.id })
    		}
            this.setState({currInitialData: filedata})
            this.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}

	removePicFile = (file) => {
		// 上传图片到静态服务器
		const {
			actions:{deleteStaticFile}
		} = this.props;

		// 删除 之前的文件
		const picFile = this.state.currInitialData;
		if(picFile) {
			const currentPicId = picFile.id;
			deleteStaticFile({
				id: currentPicId
			},{}, {
				'Authorization': 'Basic aml4aTpqaXhp',
			}).then(resp => {
				if(!resp) {
			        this.setState({currInitialData: null})
				}
			});
		} else { // 删除 coverPicFileInfo
			this.setState({currInitialData: null})
		}
		return true;
	}

	handleOk = () => {
		const {
			form: {
				validateFields
			}
		} = this.props;
        const { currInitialData } = this.state

		let fieldValues = [];
		validateFields({},(err, values)=> {
			if(err) {
				return ;
			}
			fieldValues = values;
		});

		if(fieldValues.length == 0) return;

		this.props.onOk(fieldValues, currInitialData);
	}

    render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		}
		return (
            <div>
				<Form>
					<FormItem
						{...formItemLayout}
						label={`巡检内容`}
						hasFeedback
					>
						{
							getFieldDecorator('inspectContent',{
								rules: [
									{required: true, message: `请输入巡检内容`}
								],
							})(
								<Input placeholder={`请输入巡检内容`}/>
							)
						}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label='功能图标'
						hasFeedback
					>
						{
							getFieldDecorator('attachment',{
								rules: [
									{required: true, message: '请上传一个图片或视频'}
								],
								valuePropName: 'fileList',
								getValueFromEvent: this.coverPicFile,
							})(
								<Upload listType="text" beforeUpload={this.beforeUploadPicFile} onRemove={this.removePicFile}>
									<Button>
									  <Icon type="upload" />添加图片或视频
									</Button>
								</Upload>
							)
						}
					</FormItem>
				</Form>
                <div style={{textAlign: 'right'}}>
					<Button type="primary" style={{width: 80}} onClick={this.handleOk}>保存</Button>
                </div>
            </div>
		)
    }
}

UploadModal = Form.create({})(UploadModal);
