import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { Tree, Spin} from 'antd';

const TreeNode = Tree.TreeNode;

class ProjectTree extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			selectedUnit: [],
			loading:true
		}
	}

	componentDidMount() {
		const { actions: { getUnitTree } } = this.props;
		let urlHash = window.location.hash.substring(1).split("&");
		getUnitTree().then(()=>{
			this.setState({loading:false});
			if(urlHash.length == 2 && urlHash[0].split("--").length ==3 ){
				this.onSelectUnit([urlHash[0]]);
			}
		});
	}

	onSelectUnit(value) {
		const { 
			actions: { 
				setSelectedUnit, 
				getBlockIndex,
				//toggleBlockInfo,toggleMakePlan,
				setSelectedBlock,
				getCurrentWp, 
			}
		} = this.props;

		setSelectedBlock('');
		// toggleBlockInfo('close');
		// toggleMakePlan('close');

		const code = value[0] && value[0].split('--')[0];
		const type = value[0] && value[0].split('--')[1];

		getCurrentWp({code});

		if (type === 'C_WP_UNT') {
			getBlockIndex({ code });
		}
		setSelectedUnit(value);
	}

	render() {
		const {
			unitTree = [], 
			selectedUnit=[]
		} = this.props;
		const {loading} = this.state;
		return (
			<div>
				{/*<Tree*/}
					{/*className = 'global-tree-list'*/}
					{/*showLine defaultExpandAll = {true}*/}
					{/*selectedKeys = {selectedUnit}*/}
					{/*onSelect = { this.onSelectUnit.bind(this) }>*/}

					{/*{*/}
						{/*unitTree.map(*/}
							{/*(item)=>{*/}
								{/*return <TreeNode key={`${item.code}--${item.obj_type}--${item.name}`} title={item.name}>*/}
									{/*{item.children.map(*/}
										{/*(child)=>{*/}
											{/*return <TreeNode key={`${child.code}--${child.obj_type}--${child.name}`} title={child.name} ></TreeNode>*/}
										{/*}*/}
									{/*)}*/}
								{/*</TreeNode>*/}
							{/*}*/}
						{/*)*/}
					{/*}*/}

					{/*/!* ProjectTree.loop(unitTree) *!/*/}
				{/*</Tree>*/}
				<Spin spinning={loading} >
				<Tree className = 'global-tree-list' showLine
					  defaultExpandAll={false}
					  selectedKeys={selectedUnit} onSelect={this.onSelectUnit.bind(this)}>
					{
						ProjectTree.loop(unitTree)
					}
				</Tree>
				</Spin>
			</div>
		);
	};

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							  title={`${item.name}`}>
						{
							ProjectTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							 title={`${item.name}`}/>;
		});
	};

}

export default ProjectTree;
