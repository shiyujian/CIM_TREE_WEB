import React, {Component} from 'react';
import {Tree,Row,Col,Button} from 'antd';

const TreeNode = Tree.TreeNode;

export default class SubTree extends Component {

	onSelect(code) {
		if(code.length === 0){
			return
		}
		const {actions:{setSelectFieldAc}}=this.props;
		setSelectFieldAc(code[0]);
	}
	addField(){
		const {actions:{toggleModalAc}}=this.props;
		toggleModalAc({
			type:"ADD",
			visible:true
		})
	}
	render() {
		let {fieldList = [], selectField} = this.props;
		let newList = fieldList.filter(item => {
			return item.code.indexOf("_LOC") === -1 ? true : false;
		});
		fieldList = [...newList];
		return (
			<div>
				<Row>
					<Col span={24}>
						<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
							<Button onClick={this.addField.bind(this)}>新建标段</Button>
						</div>
					</Col>
				</Row>
				<Tree className='global-tree-list' showLine defaultExpandAll={true}
					  selectedKeys={[selectField]} onSelect={this.onSelect.bind(this)}>
					{
						SubTree.loop(fieldList)
					}
				</Tree>
			</div>

		);
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}`}
							  title={item.name}>
						{
							SubTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}`}
							 title={item.name}/>;
		});
	};
}
