import React, {Component} from 'react';
import {TableUnit, ToggleModal} from '../components/UnitData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/unitdata';
var moment = require('moment');
@connect(
	state => {
		const {platform,datareport:{unitdata}} = state;
		return {platform,...unitdata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch),
	}),
)
export default class UnitData extends Component {
	static propTypes = {};
	setData(data,participants){
		// console.log(data,participants)
		// return;
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"项目信息批量录入",
			code:"TEMPLATE_032",
			description:"项目信息批量录入",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起项目填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
					attachment:null
				});
		});
	}
	render() {
		return (
			<div>
				<DynamicTitle title="单位工程" {...this.props} />
				<Content>
					<TableUnit {...this.props} />
					{
						visible && <ToggleModal {...this.props} setData = {this.setData.bind(this)}/>
					}
				</Content>
			</div>
			)
	}
};
