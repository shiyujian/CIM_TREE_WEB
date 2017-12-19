import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/hazard';
import {Table,Addition,Edite} from '../components/Hazard';
export const hiddencode = window.DeathCode.SYSTEM_HIDDEN;
@connect(
	state => {
		const {system:{hazard = {}}, platform} = state || {};
		return {...hazard, platform};
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
				<DynamicTitle title="安全隐患" {...this.props}/>
				    <Table {...this.props}/>
					<Addition {...this.props}/>
					<Edite {...this.props}/>
			</div>
		);
	}

	componentDidMount() {
		const {actions:{gethiddenlist}} =this.props;
		gethiddenlist({code:hiddencode}).then(rst =>{
			let newhiddenlists = rst.metalist;
			if(rst.metalist === undefined){
				return
			}
			rst.metalist.map((wx,index) => {
				newhiddenlists[index].on = index+1;
			});
			const {actions:{setnewhiddenlist}} = this.props;
			setnewhiddenlist(newhiddenlists);
		})
	}
}
