import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
// import {getUser} from '_platform/auth';
import {actions} from '../store/plotSet';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SubTree,Info,ToggleModal} from '../components/PlotSet';

@connect(
	state => {
		const {platform, project: {plotSet = {}} = {}} = state;
		return {platform, ...plotSet};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)
export default class PlotSet extends Component {

	static propTypes = {};
	async componentDidMount() {
		const {actions: {getProjectAc,getDirRootAc,getExaminesAc,getLocationAc}} = this.props;
		// 获取项目管理里面的项目,将请求的数据存到state上的projectList节点上，同时将其父节点的信息存储到parentProject上面
		getProjectAc();
		// getExaminesAc({org:getUser().org});
		//获取根location
		getLocationAc();				
		// 获取到文档目录的根结构，将请求的数据存到state上的dirRootInfo节点上
		let dirroot = await getDirRootAc();
		if(!dirroot.pk){
			let { postDirAc } = this.props.actions;
			await postDirAc({},
				{
					"obj_type": "C_DIR",
					"code": "Q001D",
					"name": "工程文档"
				}
			);
			await postDirAc({},
				{
					"status": "A",
					"obj_type": "C_DIR",
					"code": "Q001",
					"name": "建设管理项目",
					"parent": {
						"obj_type": "C_DIR",
						"code": "Q001D"
					}
				}
			);
			getDirRootAc();
		}

	}
	render() {
		const {
			toggleData: toggleData = {
				type: null,
			},
		} = this.props;
		return (
			<div>
				<DynamicTitle title="地块设置" {...this.props}/>
				<Sidebar>
					<SubTree {...this.props}/>
				</Sidebar>
				<Content>
					<Info {...this.props}/>
				</Content>
				{
					toggleData.type === null ? null : <ToggleModal {...this.props}/>
				}
			</div>);
	}
}
