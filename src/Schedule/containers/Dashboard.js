import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions as dashboardActions} from '../store/dashboard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ScheduleProjectTree from '../components/ScheduleProjectTree';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
// import {CompletionState, ExecutionState, InquiryState, Output} from '../components/Dashboard';
import {EngineeringCompletion, AccumulativeCompletion, TaskStatistics, ConstructionCompletion} from '../components/Dashboard';
import {Row, Col} from 'antd';

@connect(
	state => {
		const {platform,dashboard={}} = state;
		return {platform,dashboard};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...dashboardActions}, dispatch)
	})
)
export default class Dashboard extends Component {

	static propTypes = {};

	render() {
		return (
			<div style={{marginLeft:'160px'}}>
			<DynamicTitle title="统计分析" {...this.props}/>
			<Sidebar>
						<div style={{overflow:'hidden'}} className="project-tree">
							<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
						</div>
			</Sidebar>
			<Content>	
				<Row gutter={10} style={{margin: '10px 5px'}}>
					<Col span={12}>
						<EngineeringCompletion  {...this.props} {...this.state}/>
					</Col>
					<Col span={12}>
						<AccumulativeCompletion  {...this.props} {...this.state}/>
					</Col>
					{/* <Col span={12}>
						<CompletionState  {...this.props} {...this.state}/>
					</Col> */}
				</Row>
				<Row gutter={10} style={{margin: '10px 5px'}}>
					<Col span={12}>
						<TaskStatistics   {...this.props} {...this.state}/>
					</Col>
					<Col span={12}>
						 <ConstructionCompletion  {...this.props} {...this.state}/>
					</Col>
					{/* <Col span={12}>
						<Output  {...this.props} {...this.state}/>
					</Col>
					<Col span={12}>
						 <InquiryState {...this.props} {...this.state}/>
					</Col> */}
				</Row>
			</Content>	
		</div>);
	}

	onSelect = (project,unitProjecte)=>{
		console.log('project',project);
		console.log('unitProjecte',unitProjecte);
		let me = this;
		//选择最下级的工程
		if(unitProjecte){
			this.setState({
				item:{
					unitProjecte:unitProjecte,
					project:project
				}
			})
		}
    };
}
