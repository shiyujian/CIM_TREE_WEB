import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/inventoryManagement';
import {Table,Addition,Edite} from '../components/InventoryManagement';

@connect(
	state => {
		const {receive:{inventoryManagement = {}}, platform} = state || {};
		return {...inventoryManagement, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class InventoryManagement extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="库存管理" {...this.props}/>
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
