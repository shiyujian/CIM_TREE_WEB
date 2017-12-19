import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/project';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tree, Info, Participant, Addition,Table,Edite,ProjectTable,ProjectAddition,ProjectEdite} from '../components/Project';
export const designcode = window.DeathCode.SYSTEM_PROJECT;

@connect(
	state => {
		const {platform, system: {project = {}} = {}} = state;
		return {platform, ...project};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)
export default class Project extends Component {

	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="项目设置" {...this.props}/>
				<Table {...this.props}/>
				<Addition {...this.props}/>
				<Edite {...this.props}/>
				<ProjectTable {...this.props}/>
				<ProjectAddition {...this.props}/>
				<ProjectEdite {...this.props}/>
			</div>);
	}


	componentDidMount() {
		const {actions:{getstage,getProject}} =this.props;
		getstage({code:designcode}).then(rst =>{
			let newstagelists = rst.metalist;
			rst.metalist.map((wx,index) => {
				newstagelists[index].on = index+1;
			});
			const {actions:{setnewstagelist}} = this.props;
			setnewstagelist(newstagelists);
		});
		getProject({code:'Projectphase'}).then(rst =>{
			let newProjectphase = rst.metalist;
			rst.metalist.map((wx,index) => {
				newProjectphase[index].on = index+1;
			});
			const {actions:{setnewProject}} = this.props;
			setnewProject(newProjectphase);
		});
	}
}
