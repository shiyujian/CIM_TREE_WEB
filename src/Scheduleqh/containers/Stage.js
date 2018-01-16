import React, {Component} from 'react';
import {DynamicTitle,Content,Sidebar} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {getUser} from '_platform/auth';
import {connect} from 'react-redux';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import EditData from '../components/Stage/EditData';
import moment from 'moment';
import {SERVICE_API} from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util';
import './Schedule.less';
import {Link} from 'react-router-dom';
import {WORKFLOW_CODE} from '_platform/api';
import {SMUrl_template11} from '_platform/api';
import EditableCell from '../components/EditableCell';
import EditableCheckbox from '../components/EditableCheckbox';
import queryString from 'query-string';
import Stagereporttab from '../components/stagereport/stagereporttab'


import {Row, Col,Spin, Card, DatePicker, Upload,Icon,notification,message,
	Input,Button,Modal,Table,Form,Select,Radio,Calendar,Checkbox,Popover,Tabs} from 'antd';
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const {Option} = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@connect(
	state => {
		const {schedule:{scheduler = {}},platform} = state;
		return {platform,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...schedulerActions}, dispatch)
	})
)

class Stage extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount(){
		}
	onSelect(){}

	render() {

		return (
			<div>
				<DynamicTitle title="进度填报" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
					</div>
				</Sidebar>
				<Content>
					<div>
					<Tabs>
					<TabPane tab="总计划进度" key="1">
					   <Stagereporttab{...this.props}/>
					</TabPane>
					<TabPane tab="每日计划进度" key="2">
						<Stagereporttab{...this.props}/>
					</TabPane>
					<TabPane tab="每日实际进度" key="3">
					    <Stagereporttab{...this.props}/>
					</TabPane>
				    </Tabs>
					</div>
				</Content>
			</div>);
	}
};


export default Form.create()(Stage);
