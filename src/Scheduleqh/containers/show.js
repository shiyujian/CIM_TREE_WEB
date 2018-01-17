import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import {Tabs,Table,Row,Col,Card,Checkbox,Progress} from 'antd';
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
            item:null,
             progress:50,
             isUploading: false
		};
    }
    // state={
       
    // }
    
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
        let {progress,isUploading} = this.state;
	    
		return (
			<div>
                <DynamicTitle title="项目进度" {...this.props}/>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)} />
                    </div>
                </Sidebar>
                <Content>
                    <video src=" " controls="controls" width="600" height="600"></video>
                    <Row>
                    <Col span={3}>
                    <Checkbox>常绿乔木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                    <Row>
                     <Col span={3}>
                    <Checkbox>落叶乔木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                    <Row>
                     <Col span={3}>
                    <Checkbox>亚乔木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                    <Row>
                     <Col span={3}>
                    <Checkbox>灌木</Checkbox>
                    </Col>
                     <Col span={21}>
                    <Progress percent={progress} strokeWidth={5}/>
                    </Col>
                    </Row>
                </Content>
			</div>);
	}

};
