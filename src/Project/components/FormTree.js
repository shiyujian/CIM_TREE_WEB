import React, {Component} from 'react';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

export default class FormTree extends Component {

	static propTypes = {};

	static loop(data = [],loopnum = 1) {

		return data.map((item) => {
			if (item.children ) {
                if(item.children.length){
                    if(item.children[0].children){
                        return (
                            <TreeNode key={`${item.pk}--${item.code}--${loopnum}`} data={data}
                                      title={item.name}>
                                {
                                    FormTree.loop(item.children,loopnum+1)
                                }
                            </TreeNode>
                        );
                    }else{
                        return (
                            <TreeNode key={`${item.pk}--${item.code}--${loopnum}`} data={data}
                                      title={item.name}>
                                {
                                    FormTree.loop(item.children,loopnum+1)
                                }
                            </TreeNode>
                        );
                    }
                   
                }else{
                    return <TreeNode key={`${item.pk}--${item.code}--${loopnum}`} data={data}
			                 title={item.name}/>;
                }
				
			}
			return <TreeNode key={`${item.pk}--${item.code}--${loopnum}`} data={data}
			                 title={item.name}/>;
		});
	};

	render() {
		const {treeData = []} = this.props;
	    // console.log(this.props.onSelect)
		return (
            <div>
                {treeData.length?
        			<Tree showLine
        			      selectedKeys={[this.props.selectedKeys]}
                          defaultExpandAll={false}
        			      onSelect={this.props.onSelect}>
        				{
        					FormTree.loop(treeData)
        				}
        			</Tree>
                :''
                }
            </div>
		);
	}
}
