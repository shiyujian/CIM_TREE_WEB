import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/ModalData';
import {actions as platformActions} from '_platform/store/global';
import {Table, Addition, Check, Modify, Expurgate} from '../components/ModalData';
import {Row,Col} from 'antd';

import {getUser} from '_platform/auth'
import {getNextStates} from '_platform/components/Progress/util';
import {actions as action2} from '../store/quality';
import {WORKFLOW_CODE} from '_platform/api'

var moment = require('moment');
@connect(
	state => {
		const {datareport: {modaldata = {}} = {}, platform} = state;
		return {...modaldata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions,...action2}, dispatch)
	})
)
export default class ModalData extends Component {
	setData(data,participants){
		console.log("data:",data);
		console.log("participants:",participants);
		// return;
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"模型信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"模型信息批量录入",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			console.log("rst",rst);
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起模型信息填报',
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
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="模型信息" {...this.props}/>
				<Row >
					<Col >
						<Table {...this.props}/>
					</Col>
				</Row>
				<Addition {...this.props} setData = {this.setData.bind(this)}/>
				<Check {...this.props}/>
				<Modify {...this.props}/>
				<Expurgate {...this.props}/>
			</div>
		);
	}
}
