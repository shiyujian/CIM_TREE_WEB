import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/distributionManagement';
import {Table,Addition,Edite,Filter} from '../components/DistributionManagement';

@connect(
	state => {
		const {receive:{distributionManagement = {}}, platform} = state || {};
		return {...distributionManagement, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class DistributionManagement extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="发放管理" {...this.props}/>
				<Filter {...this.props} />				
				<Table {...this.props} />
				<Addition {...this.props} />
				<Edite {...this.props} />
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getdocuemntlist}} =this.props;
		getdocuemntlist({code:'Documentlist'}).then(rst =>{
			let newdocumentlists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newdocumentlists[index].on = index+1;
			});
			const {actions:{setnewdocumentlist}} = this.props;
			setnewdocumentlist(newdocumentlists);
		});
	}
}
