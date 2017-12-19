import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/accident';
import {LevelTable,Table,LevelAddition,Addition,LevelEdit,Edite} from '../components/Accident';
export const Acclevelcode = window.DeathCode.SYSTEM_ACCLEVEL;
export const Acccode = window.DeathCode.SYSTEM_ACC;
@connect(
	state => {
		const {setup:{accident = {}}, platform} = state || {};
		return {...accident, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Hazard extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="安全事故" {...this.props}/>
				<LevelTable {...this.props} />
				<Table {...this.props} />
				<LevelAddition {...this.props}/>
				<Addition {...this.props}/>
				<LevelEdit {...this.props}/>
				<Edite {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getaccidentlevellist,getaccidentlist}} =this.props;
		getaccidentlevellist({code:Acclevelcode}).then(rst =>{
			let newaccidentlevellists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newaccidentlevellists[index].on = index+1;
			});
			const {actions:{setnewaccidentlevellist}} = this.props;
			setnewaccidentlevellist(newaccidentlevellists);
		});
		getaccidentlist({code:Acccode}).then(rst =>{
			let newaccidentlists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newaccidentlists[index].on = index+1;
			});
			const {actions:{setnewaccidentlist}} = this.props;
			setnewaccidentlist(newaccidentlists);
		})
	}
}
