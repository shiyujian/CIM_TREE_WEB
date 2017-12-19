import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/quantities';
import {Table,Edite,AllAddition} from '../components/Quantities';

@connect(
	state => {
		const {system:{quantities = {}}, platform} = state || {};
		return {...quantities, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)

export default class Quantities extends Component {
	static propTypes = {};

	render() {
		return (
			<div style={{
				padding: 20, height: 'calc(100% - 37px)',
				minHeight: '505px', 'overflowY': 'auto'
			}}>
				<DynamicTitle title="分项工程量" {...this.props}/>
				<Table {...this.props}/>
				{/*<Addition {...this.props}/>*/}
				<Edite {...this.props}/>
				<AllAddition {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{getwplist,gettaglist}} =this.props;
		getwplist({code:'wpitemtypes'}).then(rst =>{
			let newwplists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newwplists[index].on = index+1;
			});
			const {actions:{setnewwplist}} = this.props;
			setnewwplist(newwplists);
		});
		gettaglist({code:'Taglist'})
	}
}
