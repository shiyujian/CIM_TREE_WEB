import React, { Component } from 'react';
import { Tree,Spin } from 'antd';
import {bindActionCreators} from 'redux'
import * as actions from '../store/commonTree';
import {connect} from 'react-redux'

const TreeNode = Tree.TreeNode;

@connect(
	state => {
		const {commonTree = {}} = state.safety || {}
		return commonTree
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

export default class WorkPackageTree extends Component {

    state = {
        treeData: [],
        loading:false,
    }

    render() {
        const { treeData } = this.state
        return (
            <Spin tip="加载中" spinning={this.state.loading}>
                <div style={{minHeight:1000}}>
                    {treeData.length ?
                        <Tree showLine
                            defaultExpandAll={true}
                            onSelect={this.props.onSelect}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree> : ''
                    }
                </div>
            </Spin>
        )
    }

    /* componentWillMount() {
        this.initTree();
    } */
    componentDidMount(){
        this.initTree();
    }

    initTree = () => {
        const { actions: {getProjectTree} } = this.props;
        this.setState({loading:true});
        //debugger
        getProjectTree().then(res => {
            console.log(res)
            //debugger
            const treeData = res.children.map(engineering => {
                console.log('')
                const projects = engineering.children
                return {
                    title: engineering.name,
                    key: engineering.code,
                    pk: engineering.pk,
                    children: projects.map(project => {
                        const pNames = project.children
                        return pNames ? {
                            title: project.name,
                            key: project.code,
                            pk: project.pk,
                            /* children: pNames ? pNames.map(pName => {
                                return {
                                    title: pName.name,
                                    key: pName.code,
                                    pk: pName.pk
                                }
                            }) : [] */
                        } : {
                            title: project.name,
                            key: project.code,
                            pk: project.pk,
                        }
                    })
                }
            })
            this.setState({treeData: treeData});
            //debugger
            this.setState({loading:false});
        });
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

}
