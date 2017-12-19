import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as dashboardActions} from '../store/dashboard';
import {Volatility, Delivery, Review, Modify, Change, ModifyLeft} from '../components/Dashboard';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import './style.less';
import {DeisgnDirCode} from '../components/util';

@connect(
	state => {
		const {platform,overall:{ dashboard={}}} = state;
		return {platform,dashboard};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...dashboardActions,}, dispatch),
	}),
)
export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			DeliveryValue : [],
			ReviewValue : [],
			DrawingReportValue:{}
		}
	}
	static propTypes = {};

	componentDidMount(){
		const {getProjectTree,getDoctimestats} = this.props.actions;
		//获取最初始的树节点
        /*  getProjectTree({},{depth:2}).then((rst)=>{
			console.log('rst',rst)
			if(rst.children.length>0){
				let system=rst.children
				for(var i=0;i<system.length;i++){
					if(system[i].children.length>0){
						let project = system[i].children;
						for(var t=0;t<project.length;t++){
							if(project[t].children.length>0){
								console.log('unitProjecte',project[t])
								let unitProjecte=project[t].children[0];
								let code = unitProjecte.code+'_'+DeisgnDirCode;
								let keyDelivery = {
									plan_key:'deliverTime',
									actual_key: 'actualDeliverTime',
								}
								let keyReview = {
									plan_key:'drawingApprovalTime',
									actual_key: 'modelApprovalTime',
									plan_key2: 'drawingActualApprovalTime',
									actual_key2: 'modelActualApprovalTime',
								}
								getDoctimestats({code:code},keyDelivery).then( (data)=>{
									console.log('data',data)
									let DeliveryValue = {
										data:data,
										code:code
									}
									this.setState({
										DeliveryValue:DeliveryValue
									})
								})
								getDoctimestats({code:code},keyReview).then( (rst)=>{
									console.log('rst',rst)
									let ReviewValue = {
										data:rst,
										code:code
									}
									this.setState({
										ReviewValue:ReviewValue
									})
								})
								this.getProjectDrawingNums(project[t]);
								break;
							}
						}
					}
				}
			}
		}); */

		this.setFirstUnit();
	}

	//获取第一个单位工程
	setFirstUnit=()=>{
        const {
            platform:{wp:{projectTree=[]}={}}
		} = this.props;
        let project =projectTree.length?projectTree[0]:null;
		let unitProject = project && project.children.length?project.children[0]:null;
        if(unitProject){
            this.onSelect(project,unitProject);        }
    };

	render() {
		const props = this.props;
		return (
			<div style={{marginLeft:'160px'}}>
				<DynamicTitle title="统计分析" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onLoad={()=>{
                                this.setFirstUnit();
                        }}
						onSelect={this.onSelect.bind(this)} />
					</div>
				</Sidebar>
				<Content>
					<Row gutter={10} style={{margin: '10px 5px'}}>
						{/* <Col span={8}>
							<Change {...this.state}/>
						</Col> */}
						<Col span={12}>
							<Delivery {...this.state}/>
						</Col>
						<Col span={12}>
							<Review {...this.state}/>
						</Col>
					</Row>
					<Row gutter={10} style={{margin: '10px 5px'}}>
						<Col span={8}>
							{ModifyLeft && <ModifyLeft {...props} DrawingReportValue={this.state.DrawingReportValue}/>}
						</Col>
						<Col span={16}>
							{Modify && <Modify {...props} DrawingReportValue={this.state.DrawingReportValue}/>}
						</Col>
					</Row>
				</Content>	
			</div>
		);
	}
	//获取项目下各个单位工程图纸交付统计
	getProjectDrawingNums=(project)=>{
		const { getProjects} = this.props.actions;
		getProjects({code:project.code},{depth:1}).then(rst=>{
			let units = [];
			let drawingNums = [];
			if(!rst.children) return;
			rst.children.forEach(rc=>{
				units.push(rc.name);
				drawingNums.push(rc.extra_params.drawingNum||0);
			});
			this.setState({DrawingReportValue:{units,drawingNums,name:rst.name}});
		});
	}

	onSelect = (project,unitProjecte)=>{
		const {
			getDoctimestats
		} =this.props.actions
		let me = this;

		if(project){
			this.getProjectDrawingNums(project);
		}

		if(unitProjecte){
			let code = unitProjecte.code+'_'+DeisgnDirCode;
			let keyDelivery = {
				plan_key:'deliverTime',
				actual_key: 'actualDeliverTime',
			}
			let keyReview = {
				plan_key:'drawingApprovalTime',
				actual_key: 'modelApprovalTime',
				plan_key2: 'drawingActualApprovalTime',
				actual_key2: 'modelActualApprovalTime',
			}
			getDoctimestats({code:code},keyDelivery).then( (data)=>{
				let DeliveryValue = {
					name:unitProjecte.name,
					data:data,
					code:code
				}
				me.setState({
					DeliveryValue:DeliveryValue
				})
			})
			getDoctimestats({code:code},keyReview).then( (rst)=>{
				let ReviewValue = {
					name:unitProjecte.name,
					data:rst,
					code:code
				}
				me.setState({
					ReviewValue:ReviewValue
				})
			})
		}
		
    };
}
