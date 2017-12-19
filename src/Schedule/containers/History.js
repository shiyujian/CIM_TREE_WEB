import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {Row, Col} from 'antd';
import HistoryTable from '../components/HistoryTable';
import {actions as schedulerActions} from '../store/scheduler';


@connect(
	state => {
		const {schedule:{scheduler = {}},platform} = state;
		return {platform,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...schedulerActions}, dispatch)		
	})
)
export default class History extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			item : null
		}
	}

	componentDidMount(){
		const {getProjectTree} = this.props.actions;
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
		// 					}
		// 				})
		// 				return;
		// 			}
		// 		}
		// 	}
        // });
    }

	render() {
		return (
			<div>
				<DynamicTitle title="进度历史" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
					</div>
				</Sidebar>
				<Content>
					<HistoryTable {...this.props} {...this.state}/>
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
};
