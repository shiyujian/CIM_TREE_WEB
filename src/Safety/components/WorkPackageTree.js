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
        treeLists: [],
        loading:false,
    }

    render() {
        const { treeLists } = this.state
        return (
            <Spin tip="加载中" spinning={this.state.loading}>
                <div>
                    {treeLists.length ?
                        <Tree showLine
                            defaultExpandAll={true}
                            onSelect={this.props.onSelect}>
                            {this.renderTreeNodes(this.state.treeLists)}
                        </Tree> : ''
                    }
                </div>
            </Spin>
        )
    }

    componentDidMount(){
        const {actions: {getProjectTree}} = this.props;
        //地块树
        try {
            getProjectTree({},{parent:'root'})
            .then(rst => {
                if(rst instanceof Array && rst.length > 0){
                    rst.forEach((item,index) => {
                        rst[index].children = []
                    })
                    getProjectTree({},{parent:rst[0].No})
                    .then(rst1 => {
                        if(rst1 instanceof Array && rst1.length > 0){
                            rst1.forEach((item,index) => {
                                rst1[index].children = []
                            })
                            getNewTreeData(rst,rst[0].No,rst1)
                            getProjectTree({},{parent:rst1[0].No})
                            .then(rst2 => {
                                if(rst2 instanceof Array && rst2.length > 0){
                                    getNewTreeData(rst,rst1[0].No,rst2)
                                    this.setState({treeLists:rst})
                                }
                            })
                        }else {
                            this.setState({treeLists:rst})
                        }
                    })
                }
            })
        } catch(e){
            console.log(e)
        }
    }

    renderTreeNodes = (data) => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.Name} key = {item.No} pk = {item.ID}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.No} title={item.Name} pk = {item.ID}/>
        })
    }
}
//连接树children
function getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey == item.No) {
                item.children = child;
            }else{
                if(item.children)
                    loop(item.children);
            }
        });
    };
    try {
       loop(treeData);
    } catch(e) {
        console.log(e)
    }
}