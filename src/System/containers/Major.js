import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/major';
import {Table,Addition,Edite} from '../components/Major';
export const Majorcode = window.DeathCode.SYSTEM_MAJOR;
@connect(
	state => {
		const {system:{major = {}}, platform} = state || {};
		return {...major, platform};
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
				<DynamicTitle title="专业设置" {...this.props}/>
				<Table {...this.props}/>
				<Addition {...this.props}/>
				<Edite {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getmajorlist}} =this.props;
		getmajorlist({code:Majorcode}).then(rst =>{
			console.log("rst",rst);
			let newprofessionlists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			// 加上序号
			rst.metalist.map((wx,index) => {
				newprofessionlists[index].on = index+1;
			});
			const {actions:{setnewprofessionlist}} = this.props;
			// 将专业信息存储到store里面
			setnewprofessionlist(newprofessionlists);
		})
	}
}
