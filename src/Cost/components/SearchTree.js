/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import {actions} from '../store/dataMaintenance';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tree, Input, Spin, Select, Cascader} from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const Option = Select.Option;


@connect(
    state => {
        const {dataMaintenance = {},platform} = state;
        return {...dataMaintenance,platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions,...platformActions}, dispatch),
        dispatch
    }),
)

export default class SearchTree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            rootTreeNodes:[],//树节点
        };
    }

    componentDidMount() {
        const {actions:{getProjectTreeCost,getSubTree}} = this.props;
        getProjectTreeCost().then((rst) => {
            console.log(rst);
            let rootTreeNodes = [];
            if(!rst){
                rst = {};
                rst.children = [];
            }
            rst.children.map((item) => {
                rootTreeNodes.push(item);
            })
            let pk = rst.children[0].pk || '';
            getSubTree({pk:pk})
            this.setState({rootTreeNodes});
        });
    }

    componentDidUpdate() {

    }

    render() {
         const loop = data => data.map((item) => {
            if(!item.children){ // children字段能够便于显示下拉按钮
                item.children = [];
            }
            if (item.children.length > 0) {
                return <TreeNode title={item.name } key={item.pk} {...item}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={ item.name} key={item.pk} {...item}/>;
        });
        const { rootTreeNodes =[] } = this.state;
        const treeNodes = loop(rootTreeNodes);

        return(
            <div >
                <Spin tip="加载中..." spinning={this.state.loading}>
                    <Tree
                      onExpand={this.onExpand.bind(this)}
                      onSelect={this.onSelect.bind(this)}
                    >
                        {treeNodes}
                    </Tree>
                </Spin>
            </div>
        )
    }

    // 目录树数据加载
    onExpand(expandedKeys,info){
      /*let pk = info.node.props.pk;
      const {actions:{getProjectTreeCost}} = this.props;
      getProjectTreeCost({pk:pk}).then((rst) => {
        let rootTreeNodes = this.state.rootTreeNodes;
        getNewTreeData(rootTreeNodes,rst.pk,rst.children);
        this.setState({rootTreeNodes});
      });*/ 
    }

    // 目录树树节点点击
    onSelect(value,info) {
        let pk = info.node.props.pk;
        const {actions:{getSubTree}} = this.props;
        getSubTree({pk:pk}).then((rst) => {
            console.log(rst);
        })
    }
}

//得到目录下一层节点的数据，放到当前节点下
function getNewTreeData(treeData, curKey, child) {
	const loop = (data) => {
		data.forEach((item) => {
			if (curKey.indexOf(item.pk) === 0) {
				item.children = child;
			}else{
				loop(item.children);
			}
		});
	};
	loop(treeData);
}
