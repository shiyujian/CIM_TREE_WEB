import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/unit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SubTree,Info,ToggleModal} from '../components/Unit';
import './Unit.css';
@connect(
	state => {
		const {platform, setup: {unit = {}} = {}} = state;
		return {platform, ...unit};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)

export default class Unit extends Component {

	static propTypes = {};
	componentDidMount() {
		const {actions: {getUnitAc,getUnitAcT,getOrgListAc,getDirTreeAc,getDirListAc}} = this.props;
		// 获取所有的单元数据，接口和获取项目时一样，只不过取了3层，将数据挂到state上的unitList节点上
		getUnitAc();
		// 获取所有的单元数据，接口和获取项目时一样，只不过取了2层，将数据挂到state上的unitListT节点上
		getUnitAcT();
		// getExaminesAc({org:getUser().org});
		// 获取所有的组织信息，放到state的orgList里面
		getOrgListAc();
		// 获取目录信息
		getDirTreeAc();
		getDirListAc();
	}

	render() {
		const {
			toggleData: toggleData = {
				type: null,
			},
			selectUnit=''
		} = this.props;
		let chooseType=selectUnit.split('--')[2];
		return (
			<div>
				<DynamicTitle title="单位工程" {...this.props}/>
				<Sidebar>
					<SubTree {...this.props}/>
				</Sidebar>
				<Content>
					{
						(chooseType === 'C_PJ' || chooseType === undefined||chooseType==='C_WP_PTR') ? (
							<div>请选择单位工程或子单位工程！</div>
						) : (<Info {...this.props}/>)
					}
				</Content>
				{
					toggleData.type === null ? null : <ToggleModal {...this.props}/>
				}
			</div>);
	}
}
