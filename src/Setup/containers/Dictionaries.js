import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/dictionaries';
import {Table,Addition,Edite} from '../components/Dictionaries';
export const Keyword = window.DeathCode.SETUP_KEYWORD;

@connect(
	state => {
		const {setup:{dictionaries = {} = {}}, platform} = state || {};
		return {...dictionaries, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Dictionaries extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="工程文档字典" {...this.props}/>
				<Table {...this.props}/>
				<Addition {...this.props}/>
				<Edite {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getdictionlist}} =this.props;
		getdictionlist({code:Keyword}).then(rst =>{
			let newdiclists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newdiclists[index].on = index+1;
			});
			const {actions:{setnewdiclist}} = this.props;
			setnewdiclist(newdiclists);
		})
	}
}
