import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree, message} from 'antd';

const TreeNode = Tree.TreeNode;

export default class SubTree extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};

	componentDidMount() {
		const {actions: {getUnitTree}} = this.props;
		getUnitTree()
	}

	//选择单位
	onSelect(code_type) {
		if(code_type.length === 0){
			return
		}
		//如果当前是填报施工包，点击其他不给跳转
		const {id: instanceId} = this.props.match.params;
		const {
			packagesData = {
				extra_params: {
					instance: undefined,
				}
			}
		} = this.props;
		if(instanceId !== undefined && packagesData.extra_params.instance === 'START'){
			return
		}else{
			this.props.history.replace('/overall');
		}
		/**
		 * 判断选择的是子单位工程还是单位工程
		 * 如果选择的是子单位工程不做判断
		 * 如果选择的是单位工程，判断其下面是否有子单位工程，如果有子单位工程必须选择子单位工程
		 * 2017年08月23日
		 */
		//先判断是否选择了单位工程或者子单位工程
		let currentCode=code_type[0].split('--')[0];
		let codeType=code_type[0].split('--')[1];
		if (codeType.indexOf('C_WP_UNT') < 0) {
			message.warning('请选择单位工程或子单位工程');
			return
		}
		const {actions:{setPtrTree,setItmTree,setTables,setSelectedProject,getBuilders,getExamines}}=this.props
		setPtrTree([]);
		setItmTree([]);
		setTables([]);
		const {unitTree = []} = this.props;
		let node=SubTree.checkLoop(unitTree,currentCode);

		let projectNode=SubTree.checkLoop(unitTree,currentCode.split('_')[0]);
		if(node.children && node.children.length > 0){
			message.warning('请选择子单位工程')
		}else{
			const {actions: {setSelectedUnit,getPackages}} = this.props;
			// console.log('========',projectNode)
			setSelectedProject(projectNode);
			setSelectedUnit(code_type[0]);
			getPackages({code:currentCode});
			//获取当前项目的施工单位 TODO 施工单位的关键字需明确
			getBuilders({},{organization:"深圳市市政设计研究院"})
			//TODO 获取全部的人员列表
			getExamines({})
		}
	}

	static checkLoop = (list, checkCode) => {
		let rst = null;
		list.find((item = {}) => {
			const {code, children = []} = item;
			if (code === checkCode) {
				rst = item;
			} else {
				const tmp = SubTree.checkLoop(children, checkCode);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};

	render() {
		const {unitTree = [], selectedUnit} = this.props;
		return (
			<Tree className='global-tree-list' showLine defaultExpandAll={true}
				  selectedKeys={[selectedUnit]} onSelect={this.onSelect.bind(this)}>
				{
					SubTree.loop(unitTree)
				}
			</Tree>
		);
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							  title={item.name}>
						{
							SubTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.obj_type}--${item.name}`}
							 title={item.name}/>;
		});
	};
}
