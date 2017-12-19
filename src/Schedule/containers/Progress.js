import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import {Tabs,Table} from 'antd';
import ProceeTable from '../components/ProceeTable'
const TabPane = Tabs.TabPane;
@connect(
	state => {
		const {schedule:{scheduler = {}},platform} = state;
		return {platform,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...schedulerActions}, dispatch)
	})
)
export default class Progress extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
            item:null
		};
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

	render() {
		return (
			<div>
                <DynamicTitle title="进度预警" {...this.props}/>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)} />
                    </div>
                </Sidebar>
                <Content>
                    <ProceeTable {...this.props} {...this.state} />
                </Content>
			</div>);
	}
};
