import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../store/monitoring'

import {Icon} from 'react-fa'
import {message, Tree, Button, Form, Modal} from 'antd'
import {Link} from 'react-router-dom'

import CameraConfigModal from './CameraConfigModal'

const $ = window.$

const confirm = Modal.confirm
const TreeNode = Tree.TreeNode
const NODE_TYPE = {
    PROJECT: 1,
    ENGINEERING: 2,
    CAMERA: 3
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

class ProjectTree extends Component {

    state = {
        treeData: [],
        manageAreaVisible: true,
        modalVisible: false,
        cameraModalType: 1,
        initialData: {},
        selectedNode: null,
        nodeType: NODE_TYPE.PROJECT,
    }

	render() {
		return (
            <div style={{height: '100%'}}>
                {/* <div style={this.state.manageAreaVisible ? {textAlign: 'center'} : {display: 'none'}}>
                    <Button onClick={this.handleCameraManage}>管理摄像头</Button>
                </div>
                <div style={!this.state.manageAreaVisible ? {textAlign: 'center'} : {display: 'none'}}>
                    <div style={{textAlign: 'center'}}>
                        <div style={{textAlign: 'left', display: 'inline-block'}}>
                            <div style={{marginBottom: 5}}>
                                <Button onClick={this.handleAddCamera} style={{marginRight: 5}}>添加摄像头</Button>
                                <Button onClick={this.handleRemoveCamera}>删除摄像头</Button>
                            </div>
                            <div style={{marginBottom: 5}}>
                                <Button onClick={this.handleEditCamera}>编辑摄像头</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr style={{marginTop: 15}}/> */}
                <div >
                    {
                        this.state.treeData.length ?
                        <Tree onSelect={this.handleSelectTreeNode} className='global-tree-list' showLine defaultExpandAll={true}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree> : ''
                    }
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
		)
	}

    componentWillMount() {
        this.initCameraTree()
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

    renderTreeNodes = (data) => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key = {item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode {...item} dataRef={item} />
        })
    }

    handleSelectTreeNode = (selectedKeys, e) => {
        const nodeProps = e.node.props
		const indexArr = nodeProps.pos.split('-')
        let nodeType
        const { setCameraData, setEngineeringPk } = this.props.actions
        const cameraData = []
        switch (indexArr.length) {
            case 2:
                nodeType = NODE_TYPE.PROJECT
                const engineerings = nodeProps.dataRef.children
                if (engineerings) {
                    engineerings.map(engineering => {
                        if (engineering.children) {
                            engineering.children.map(camera => {
                                cameraData.push(camera.extra)
                            })
                        }
                    })
                }
                break
            case 3:
                nodeType = NODE_TYPE.ENGINEERING
                const cameras = nodeProps.dataRef.children
                if (cameras) {
                    cameras.map(camera => {
                        cameraData.push(camera.extra)
                    })
                }
                setEngineeringPk({engineeringPk: selectedKeys})
                break
            case 4:
                nodeType = NODE_TYPE.CAMERA
                cameraData.push(nodeProps.dataRef.extra)
                setEngineeringPk({engineeringPk: nodeProps.dataRef.extra.engineering})
                break
            default:
                nodeType = NODE_TYPE.PROJECT
        }
        setCameraData({cameraData: cameraData})
        this.setState({
            nodeType: nodeType,
            selectedNode: nodeProps.dataRef
        })
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
}

export default Form.create({})(ProjectTree)
