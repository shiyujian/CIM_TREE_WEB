import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import {Tabs,Table,Row,Col,Card} from 'antd';
import ProceeTable from '../components/ProceeTable'
import LeftTop from '../components/Item/LeftTop'
import LeftBottom from '../components/Item/LeftBottom'
import RightBottom from '../components/Item/RightBottom'
import RightTop from '../components/Item/RightTop'
// var echarts = require('echarts');
// var myChart
// var myChart3
// var myChart2
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
export default class Proprogress extends Component {
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
                <DynamicTitle title="项目进度" {...this.props}/>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)} />
                    </div>
                </Sidebar>
                <Content>
                    <Row gutter={10} style={{margin: '10px 5px'}}>
					<Col span={12}>
					    <RightTop  {...this.props} {...this.state}/>
					</Col>
					<Col span={12}>
					    <LeftTop  {...this.props} {...this.state}/>
						
					</Col>
				</Row>
				<Row gutter={10} style={{margin: '10px 5px'}}>
					<Col span={12}>
						<LeftBottom   {...this.props} {...this.state}/>
					</Col>
					<Col span={12}>
						 <RightBottom  {...this.props} {...this.state}/>
					</Col>
				</Row>
                </Content>
			</div>);
	}

};
