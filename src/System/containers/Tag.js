import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/tag';
import {Table,Addition,Edite,AllAddition} from '../components/Tag';

@connect(
	state => {
		const {system:{tag = {}}, platform} = state || {};
		return {...tag, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Tag extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="工程量项设置" {...this.props}/>
				<Table {...this.props}/>
				<Addition {...this.props}/>
				<Edite {...this.props}/>
				<AllAddition {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{gettaglist}} =this.props;
		gettaglist({code:'Taglist'}).then(rst =>{
			let newtaglists = rst.metalist;
			rst.metalist.map((wx,index) => {
				newtaglists[index].on = index+1;
			});
			const {actions:{setnewtaglist}} = this.props;
			setnewtaglist(newtaglists);
		})
	}
}
