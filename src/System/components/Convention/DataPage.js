import React, {Component} from 'react';
import {Tree} from 'antd';
import { MODULES} from '_platform/api';
const TreeNode = Tree.TreeNode;
export default class DataPage extends Component {
	componentDidMount() {
		
			}
	render() {
		return <div style={{margin:'0 auto',boxShadow:' 0 -2px 3px rgba(0, 0, 0, .1)',padding:'10px',minHeight:"300px"}}>
				<Tree
					selectedKeys={[this.props.selectedKeys]}
					onSelect={this.props.onSelect}>
					{
						DataPage.loop(MODULES)
					}
				</Tree>
		</div>
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={item.id}
					          title={item.name}>
						{
							DataPage.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={item.id}
			                 title={item.name}/>;
		});
	};

}
