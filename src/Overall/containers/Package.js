import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/package';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SubTree from '../components/Package/SubTree';
import HandleForm from '../components/Package/HandleForm';
import HandleInit from '../components/Package/HandleInit';
import PackagesTable from '../components/Package/PackagesTable';
import Info from '../components/Package/Info';
import TipRender from '../components/Package/TipRender';
import {Row, Col, Button, message, Card} from 'antd';
import {getUser} from '_platform/auth';

const ButtonGroup = Button.Group;

@connect(
	state => {
		const {overall: {dbms = {}}, platform} = state || {};
		return {...dbms, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)

export default class Package extends Component {

	static propTypes = {};

	componentDidMount() {
		//获取流程的ID
		const {id: instanceId} = this.props.match.params;
		if (instanceId !== undefined) {
			const {actions: {
				getInstance, setSelectedUnit, getPackages,setSelectedPtr,setPtrTree,setItmTree,setTables
			}} = this.props;
			getInstance({id: instanceId})
				.then(rst => {
					console.log('具体的流程数据=============', rst)
					//当前施工包划分不存在的时候
					if (rst.detail) {
						message.error('不存在当前施工包划分任务');
						this.props.history.replace('/overall');
						return
					}
					let unit = JSON.parse(rst.subject[0].unit);
					if (rst.workflow.states[0].participants[0].executor.id != getUser().id) {
						message.error('当前施工包划分不是您需要填写的！')
					} else {
						//设置当前选中的单位/子单位工程
						setSelectedUnit(unit.code + '--' + unit.obj_type + '--' + unit.name);
						/**
						 * 先判断是否在退回的流程中*/
						if(rst.history.length>2 && (rst.history[rst.history.length-2].status === '退回')){
							//如果当前装填是退回的状态，重新设置需要编辑的分部、子分部、分项、tables数据
							let selectPtr=JSON.parse(rst.subject[0].itmTreeData)[0].parent;
							setSelectedPtr(selectPtr['code']+ '--' + selectPtr['obj_type'] + '--' + selectPtr['name'])
							setPtrTree(JSON.parse(rst.subject[0].ptrTreeData));
							setItmTree(JSON.parse(rst.subject[0].itmTreeData));
							setTables(JSON.parse(rst.subject[0].tablesData));
						}
						getPackages({code: JSON.parse(rst.subject[0].unit).code})
							.then(rst => {
								if (rst.children.length > 0) {
									this.props.history.replace('/overall');
								}
							});
					}
				})
		}
	}

	render() {
		const {
			packagesData = {
				children: [],
				extra_params: {
					instance: undefined,
				}
			}, selectedUnit
		} = this.props;
		const {id: instanceId} = this.props.match.params
		console.log('packagesData.extra_params.instance', packagesData.extra_params.instance)
		//TODO 20是监理单位  110是施工单位
		let userID = getUser().id;
		//如果存在流程的ID说明是填报阶段
		return (
			<div>
				<DynamicTitle title="施工包划分" {...this.props}/>
				<Sidebar>
					<SubTree {...this.props}/>
				</Sidebar>
				<Content>
					{
						selectedUnit === undefined ? (
							<Card title="友情提示" style={{width: '100%'}}>
								<h3 style={{color: 'red'}}>请先选择单位工程或子单位工程</h3>
							</Card>
						) : (
							<Row>
								<Col>
									<Info {...this.props}/>
								</Col>
								<Col>
									{
										packagesData.children.length === 0 ? (
											<div>
												{
													userID == 20 ? (
														(packagesData.extra_params.instance === undefined || packagesData.extra_params.instance === 'INIT') ? (
															<HandleInit {...this.props}/>) : (
															packagesData.extra_params.instance === 'START' ? (
																<TipRender container="施工包已发起填报请求，请等待施工方填报施工包划分"/>
															) : <TipRender container="施工包审批中，请稍等"/>
														)
													) : (
														userID == 110 ? (
															(packagesData.extra_params.instance === undefined || packagesData.extra_params.instance === 'INIT') ?
																(
																	<HandleForm {...this.props}/>
																) : (
																	(packagesData.extra_params.instance === 'START' && instanceId !== undefined) ?
																		(
																			<HandleForm {...this.props}/>
																		) :
																		(
																			(packagesData.extra_params.instance === 'IN_REVIEW') ?
																				<TipRender container="施工包划分审批中，请稍等！"/>
																				:
																				(
																					(packagesData.extra_params.instance === 'EDIT' && instanceId !== undefined) ?
																						<HandleForm {...this.props}/>
																						:
																						<TipRender
																							container="监理单位已发起施工包划分，请相应人员完成施工包划分！"/>
																				)
																		)
																)
														) : null
													)
												}

											</div>
										) : <PackagesTable {...this.props}/>
									}
								</Col>
							</Row>
						)
					}
				</Content>
			</div>);
	}
}
