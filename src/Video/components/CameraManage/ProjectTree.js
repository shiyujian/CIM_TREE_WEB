import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../store'

import {Icon} from 'react-fa'
import {message, Tree, Button, Form, Modal} from 'antd'
import {Link} from 'react-router-dom'

// import CameraConfigModal from './CameraConfigModal'

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
        const {video} = state;
        return {video};
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
                <div >
                    {
                        this.state.treeData.length ?
                        <Tree onSelect={this.handleSelectTreeNode} defaultExpandAll={true}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree> : ''
                    }
                </div>

            </div>
		)
	}

    componentWillMount() {
        this.initCameraTree()
    }

    componentWillReceiveProps(nextProps) {
        const { cameraTreeRefresh = {} } = nextProps.video
        if (cameraTreeRefresh) {
            this.initCameraTree()
            const { setCameraTreeRefresh } = this.props.actions
            setCameraTreeRefresh({cameraTreeRefresh: false})
        }
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
        const { setCameraData, setEngineeringPk, setTreeNodeData } = this.props.actions
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
        // this.setState({
        //     nodeType: nodeType,
        //     selectedNode: nodeProps.dataRef
        // })
        const treeNodeData = {
            nodeType: nodeType,
            selectedNode: nodeProps.dataRef
        }
        setTreeNodeData({ treeNodeData: treeNodeData})
    }
}

export default Form.create({})(ProjectTree)
