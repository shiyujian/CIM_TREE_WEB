import React, {Component} from 'react';
import {TableUnit, ToggleModal} from '../components/UnitData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/UnitData';
import {actions as action2} from '../store/quality';
import {actions as action3} from '../store/ProjectData';
import {getNextStates} from '_platform/components/Progress/util';
var moment = require('moment');
import {getUser} from '_platform/auth';
import {WORKFLOW_CODE} from '_platform/api'
@connect(
	state => {
		const {platform,datareport:{unitdata}} = state;
		return {platform,...unitdata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions,...action2,...action3}, dispatch),
	}),
)
export default class UnitData extends Component {
	static propTypes = {};
	setData(data,participants){
		console.log(data,participants)
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"单位工程信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"单位工程信息批量录入",
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
                    note:'发起单位工程填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
					attachment:null
				});
		});
		this.props.actions.ModalVisibleUnit(false);
	}
	render() {
		const {visible} = this.props;
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
