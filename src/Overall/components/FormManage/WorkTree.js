import React, { Component } from 'react';
import { Tree, Spin} from 'antd';
const TreeNode = Tree.TreeNode;
import {dataTree} from './worktree.json'

export default class WorkTree extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            selectedUnit:[],
            dataTree:[],
            loading:true,
        }
    }
    componentDidMount(){

        this.setState({
            dataTree,
            loading:false
        })
    }
    static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode
					          title={item.name}>
						{
							WorkTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode 
			                 title={item.name}/>;
		});
	};

	render() {
		const {dataTree = [],loading} = this.state;
		return (
            <Spin tip="加载中" spinning={loading}>
                <div>
                    {dataTree.length ?
                        <Tree showLine  
                            defaultExpandAll={false}>
                            {
                                WorkTree.loop(dataTree)
                            }
                        </Tree>
                        : ''
                    }
                </div>
            </Spin>
		);
	}
}