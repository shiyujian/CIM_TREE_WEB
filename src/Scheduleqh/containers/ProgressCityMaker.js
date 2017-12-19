import React, {Component} from 'react';
import {DynamicTitle,Content,Sidebar} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions as scheduleWorkflowActions} from '../store/scheduleWorkflow';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button,Spin} from 'antd';

import ProjectUnitWrapper from '../components/ProjectUnitWrapper';

const $ = window.$;
@connect(
	state => {
		const {platform,scheduleWorkflow={}} = state;
		return {platform,scheduleWorkflow};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...scheduleWorkflowActions}, dispatch),
	}),
)
export default class ProcessCityMaker extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			item : null,
			loading:true,
		}
	}

	componentDidMount(){
		const {getProjectTree,getDoctimestats} = this.props.actions;
		//获取最初始的树节点
		getProjectTree({},{depth:2}).then((rst)=>{
			console.log('rst',rst)
			if(rst && rst.children && rst.children.length>0){
				let project=rst.children
				for(var i=0;i<project.length;i++){
					if(project[i].children.length>0){
						let unitProjecte=project[i].children[0]
						console.log('unitProjecte',unitProjecte)
						this.setState({
							item:{
								unitProjecte:unitProjecte,
								project:project[i]
							},
							loading:false
						})
						return;
					}
				}
			}
        });
    }

	render() {
		return (
			<div style={{marginLeft:'160px'}}>
				<Spin spinning={this.state.loading}>
					<DynamicTitle title="进度模拟" {...this.props}/>
					<Sidebar>
						<div style={{overflow:'hidden'}} className="project-tree">
							<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
						</div>
					</Sidebar>
					{this.renderCityMaker()}
				</Spin>
			</div>);
	}

	renderCityMaker() {
		const {
			item: item
		} = this.state;

		if(!item)
			return(
				<div style={{height: '400px', background: 'gray'}}>
					<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>模型预览</h2>
				</div>);
				
		const unitProjecte = item.unitProjecte;

		const {
			actions: {
				getDocument
			}
		} = this.props;

		if(unitProjecte && unitProjecte.pk){
			return (
				<div style={{overflow: 'hidden'}}>
					<iframe id="showCityMarkerId2" src={`/1108/index.html?code=schedule_${unitProjecte.code}`} frameBorder="0"
					style={{width: '100%', height: '999px'}}></iframe>
				</div>
			);
		}
		return(
			<div style={{height: '400px', background: 'gray'}}>
				<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>模型预览</h2>
			</div>);

		
	}

	onSelect = (project,unitProjecte)=>{
		console.log('project',project);
		console.log('unitProjecte',unitProjecte);
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


};
