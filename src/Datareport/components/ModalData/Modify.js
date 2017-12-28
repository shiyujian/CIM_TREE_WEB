import React, { Component } from 'react';
import {
	Input, Form, Spin, Upload, Icon, Button, Modal,
	Cascader, Select, Popconfirm, message, Table, Row, Col, notification, Radio
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, WORKFLOW_CODE } from '_platform/api';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import moment from 'moment';
import '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
// const RadioGroup = Radio.Group;
// const { TextArea } = Input;

export default class Modify extends Component {

	constructor(props) {
		super(props);
		this.state = {
			checkers: [],//审核人下来框选项
			check: null,//审核人
			alldatas:[],
			dataSource: [],
			key: -1,
		};
	}

	componentDidMount() {
		const { actions: { getAllUsers } } = this.props;
		getAllUsers().then(rst => {
			let checkers = rst.map(o => {
				return (
					<Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
				)
			})
			this.setState({ checkers })
		})
	}

	componentWillReceiveProps(props){
        const {modify = {}} = props
        if(modify.key !== this.state.key) {
	        let item = modify.selectedDatas
	        let dataSource = [];
	        item&&item.forEach((single,index) => {
	    		let temp = {
	    			index:index+1,
	                code:single.code,
					coding: single.extra_params.coding,
					modelName: single.extra_params.filename,
					project: single.extra_params.project,
					unit: single.extra_params.unit,
					submittingUnit: single.extra_params.submittingUnit,
					modelDescription: single.extra_params.modelDescription,
					// file:single.basic_params.files[0],
					modeType: single.extra_params.modeType,
					fdbMode: single.basic_params.files[0],
					tdbxMode: single.basic_params.files[1],
					attributeTable: single.basic_params.files[2],
					reportingTime: single.extra_params.reportingTime,
					reportingName: single.extra_params.reportingName,
	            }
	            dataSource.push(temp);
	        }) 
	        this.setState({dataSource,key:modify.key})
    	}
   	}

	



	//下拉框选择人
	selectChecker(value) {
		let check = JSON.parse(value);
		this.setState({ check })
	}

	//table input 输入
    tableDataChange(index, key ,e ){
		let { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
	    this.setState({dataSource});
    }

	onok() {
		let {dataSource} = this.state;
		if (!this.state.check) {
			message.info("请选择审核人")
			return;
		}
		let { check } = this.state;
		let per = {
			id: check.id,
			username: check.username,
			person_name: check.account.person_name,
			person_code: check.account.person_code,
			organization: check.account.organization
		}
		this.setChangeData(dataSource, per)
		console.log('我是：',dataSource)
	}

	setChangeData = (data, participants) => {
		const {modify = {}, actions: { createWorkflow, logWorkflowEvent, clearModifyField } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "模型信息批量更改",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "模型信息批量更改",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
		}
		createWorkflow({}, postdata).then((rst) => {
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: '发起更改',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					message.success("成功")
					clearModifyField('visible',false)
				})
		})
	}


	render() {
		const {modify = {}, actions: {changeModifyField}} = this.props;
		
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			
		}, {
			title: '模型编码',
			dataIndex: 'coding'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'project'
		}, {
			title: '单位工程',
			dataIndex: 'unit'
		}, {
			title: '模型名称',
			dataIndex: 'modelName',
			render: (text, record, index) => (
				<Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'modelName')} defaultValue={record.modelName}/>
            ),

		}, {
			title: '提交单位',
			dataIndex: 'submittingUnit',
			render: (text, record, index) => (
				<Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'submittingUnit')} defaultValue={record.submittingUnit}/>
            ),

		}, {
			title: '模型描述',
			dataIndex: 'modelDescription',
			render: (text, record, index) => (
				<Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'modelDescription')} defaultValue={record.modelDescription}/>
            ),
		}, {
			title: '模型类型',
			dataIndex: 'modeType'
		}, {
			title: 'fdb模型',
			dataIndex: 'fdbMode',
			// render: (text, record, index) => {
			// 	return (<span>
			// 		<a onClick={this.handlePreview.bind(this, index)}>预览</a>
			// 		<span className="ant-divider" />
			// 		<a href={`${STATIC_DOWNLOAD_API}${record.fdbMode.a_file}`}>下载</a>
			// 	</span>)
			// }
		}, {
			title: 'tdbx模型',
			dataIndex: 'tdbxMode',
			// render: (text, record, index) => {
			// 	return (<span>
			// 		<a onClick={this.handlePreview.bind(this, index)}>预览</a>
			// 		<span className="ant-divider" />
			// 		<a href={`${STATIC_DOWNLOAD_API}${record.tdbxMode.a_file}`}>下载</a>
			// 	</span>)
			// }
		}, {
			title: '属性表',
			dataIndex: 'attributeTable',
			// render: (text, record, index) => {
			// 	return (<span>
			// 		<a onClick={this.handlePreview.bind(this, index)}>预览</a>
			// 		<span className="ant-divider" />
			// 		<a href={`${STATIC_DOWNLOAD_API}${record.attributeTable.a_file}`}>下载</a>
			// 	</span>)
			// }
		}, {
			title: '上报时间',
			dataIndex: 'reportingTime'
		}, {
			title: '上报人',
			dataIndex: 'reportingName'
		}, {
			title: '操作',
			render: (text, record, index) => {
				return (
					<Popconfirm
						placement="leftTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, index)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				)
			}
		}];

		return (
			<Modal
				title="模型信息更改表"
				key={modify.key}
				width={1280}
				visible={modify.visible}
				onCancel={this.cancel.bind(this)}
				onOk={this.onok.bind(this)}
			
			>

				<Row>
					<Table
						bordered
						className='foresttable'
						columns={columns}
						rowKey='index' 
						dataSource={this.state.dataSource}
					/>
				</Row>
				{/* <Row style={{ marginTop: '20px' }}>
					<Col span={2} push={22}>
						<Button type="default">确认变更</Button>
					</Col>
				</Row> */}
				<Row style={{ marginBottom: "30px" }} type="flex">
					<Col>
						<span>
							审核人：
                            <Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
								{
									this.state.checkers
								}
							</Select>
						</span>
					</Col>
				</Row>

			</Modal>
		)
	}

	delete() {

	}

	onChange = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value,
		});
	}

	cancel() {
		const {
			actions: { clearModifyField }
		} = this.props;
		clearModifyField('visible',false);
	}
}
