import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions as scheduleWorkflowActions} from '../store/scheduleWorkflow';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {Row, Col, Spin} from 'antd';
import StartPlanForm from '../components/StartPlanForm';
import {WORKFLOW_CODE} from '_platform/api';
@connect(
	state => {
		const {platform,scheduleWorkflow={}} = state;
		return {platform,scheduleWorkflow};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...scheduleWorkflowActions}, dispatch)
	})
)
export default class StartPlan extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			item : null,
			loading:false,
			startDatasource:[],
			total:0
		}
	}

	componentDidMount(){
		// const {getProjectTree,getDoctimestats} = this.props.actions;
		//获取最初始的树节点
		// getProjectTree({},{depth:2}).then((rst)=>{
		// 	console.log('rst',rst)
		// 	if(rst && rst.children && rst.children.length>0){
		// 		let project=rst.children
		// 		for(var i=0;i<project.length;i++){
		// 			if(project[i].children.length>0){
		// 				let unitProjecte=project[i].children[0]
		// 				console.log('unitProjecte',unitProjecte)
		// 				this.setState({
		// 					item:{
		// 						unitProjecte:unitProjecte,
		// 						project:project[i]
		// 					},
		// 					loading:false,
		// 				})
		// 				return;
		// 			}
		// 		}
		// 	}
		// });
		

        // getProjectTree({},{depth:3}).then((rst)=>{
		// 	console.log('rst',rst)
		// 	if(rst && rst.children && rst.children.length>0){
		// 		let system=rst.children
		// 		for(var i=0;i<system.length;i++){
		// 			if(system[i].children.length>0){
		// 				let project = system[i].children;
		// 				for(var t=0;t<project.length;t++){
		// 					if(project[t].children.length>0){
		// 						let unitProjecte=project[t].children[0]
		// 						console.log('unitProjecte',unitProjecte)
		// 						this.setState({
		// 							item:{
		// 								unitProjecte:unitProjecte,
		// 								project:project[t]
		// 							}
		// 						})
		// 						return;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
        // });
    }

	render() {
		console.log('发起计划',this.props)
		return (
			<div>
				<Spin spinning={this.state.loading}>
					<DynamicTitle title="发起计划" {...this.props}/>
					<Sidebar>
						<div style={{overflow:'hidden'}} className="project-tree">
							<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
						</div>
					</Sidebar>
					<Content>
						<StartPlanForm {...this.props} {...this.state} />
					</Content>
				</Spin>
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
    }
};
