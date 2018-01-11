import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/danger';
import {Tablelevel,Tablecate,DangerAddition,Cateedit,LevelAddition,LevelEdit} from '../components/Danger'
export const WXcode = window.DeathCode.SYSTEM_WX;
export const WXlevel = window.DeathCode.SYSTEM_LEVEL;

@connect(
	state => {
		const {project:{danger = {}}, platform} = state || {};
		return {...danger, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Danger extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="危险源" {...this.props}/>
				<Tablecate {...this.props}/>
				<Tablelevel {...this.props}/>
				<DangerAddition {...this.props}/>
				<Cateedit {...this.props}/>
				<LevelAddition {...this.props}/>
				<LevelEdit {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getWxlist,getwxtype}} =this.props;
		getWxlist({code:WXcode}).then(rst =>{
			let newwxlists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newwxlists[index].on = index+1;
			});
			const {actions:{newwxlist}} = this.props;
			newwxlist(newwxlists);
		})
		getwxtype({code:WXlevel}).then(rst => {
			let newwxLevel = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newwxLevel[index].on = index+1;
			});
			const {actions:{newtypelist}} = this.props;
			newtypelist(newwxLevel);
		})
	}
}
