import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../store/treatment'

import {Icon} from 'react-fa'
import {Tree, Button} from 'antd'
import {Link} from 'react-router-dom'

const $ = window.$

const TreeNode = Tree.TreeNode

@connect(
	state => {
		const {treatment = {}} = state.safety || {}
		return treatment
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

export default class ProjectTree extends Component {

    state = {
        treeData: [],
    }

	render() {
		// const {code: {codeTypes = [], sidebar = {}, fields} = {}} = this.props
		// const {type = 1} = sidebar
		// let data = fields
		// if (type === 2) {
		// 	data = codeTypes
		// }
        const {treeData = []} = this.state
		return (
            <div>
                <div >
                    {treeData.length?
                        <Tree defaultExpandAll={true} onSelect={this.handleSelectTreeNode}>
                            {this.renderTreeNodes(treeData)}
                        </Tree>
                    :''}
                </div>
            </div>
		)
	}

    componentWillMount() {
        this.initTree();
    }

    initTree = () => {
        const { getTree } = this.props.actions
        getTree().then(res => {
            const treeData = res.children.map(engineering => {
                const projects = engineering.children
                return {
                    title: engineering.name,
                    key: engineering.code,
                    children: projects.map(project => {
                        const pNames = project.children
                        return pNames ? {
                            title: project.name,
                            key: project.code,
                            children: pNames ? pNames.map(pName => {
                                return {
                                    title: pName.name,
                                    key: pName.code,
                                    pk: pName.pk
                                }
                            }) : []
                        } : {
                            title: project.name,
                            key: project.code,
                        }
                    })
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
        //selectedKeys, e:{selected: bool, selectedNodes, node, event}
        console.log('treeNode: ', e)
    }
}
