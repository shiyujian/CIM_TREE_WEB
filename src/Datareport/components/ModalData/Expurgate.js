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
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Expurgate extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			key: -1,
			checkers: [],//审核人下来框选项
			check: null,//审核人

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

	componentWillReceiveProps(props) {
		const { expurgate = {} } = props
		if (expurgate.key !== this.state.key) {
			let item = expurgate.selectedDatas

			let dataSource = [];
			item && item.forEach((single, index) => {

				let temp = {
					code: single.code,
					index: index + 1,
					coding: single.extra_params.coding,
					modelName: single.extra_params.filename,
					project: single.extra_params.project.name,
					unit: single.extra_params.unit.name,
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
			this.setState({ dataSource, key: expurgate.key })

		}
	}

	//下拉框选择人
	selectChecker(value) {
		let check = JSON.parse(value);
		this.setState({ check })
	}

	onok() {
		let { dataSource } = this.state;

		if (!this.state.check) {
			notification.info({ message: "请选择审核人!" })
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
		this.setDeleteData(dataSource, per)
	}

	setDeleteData = (data, participants) => {
		const { actions: { createWorkflow, logWorkflowEvent, changeExpurgateField } } = this.props
		const { description = '' } = this.state;
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "模型信息批量删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: description,
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
					note: description,
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					notification.success({ message: "成功" })
					changeExpurgateField('visible', false);
				})
		})
	}

	render() {

		const { expurgate = {} } = this.props;
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
			dataIndex: 'modelName'
		}, {
			title: '提交单位',
			dataIndex: 'submittingUnit'
		}, {
			title: '模型描述',
			dataIndex: 'modelDescription'
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
						onConfirm={this.delete.bind(this, record.index - 1)}
						okText="确认"
						cancelText="取消">
						<a><Icon type='delete' /></a>
					</Popconfirm>
				)
			}
		}];

		return (
			<Modal

				width={1280}
				visible={expurgate.visible}
				onCancel={this.cancel.bind(this)}
				onOk={this.onok.bind(this)}
			>
				<h1 style={{ textAlign: 'center', marginBottom: 20 }}>申请删除</h1>
				<Row>
					<Table
						bordered
						className='foresttable'
						columns={columns}
						rowKey='index'
						dataSource={this.state.dataSource}
					/>
				</Row>

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

				<Row style={{ marginBottom: 16 }}>
					<Input
						type="textarea"
						onChange={this.description.bind(this)}
						autosize={{ minRows: 5, maxRow: 6 }}
						placeholder="请填写删除原因"
						style={{ marginBottom: 40 }}
					/>
				</Row>

			</Modal>
		)
	}


	description(e) {
		this.setState({ description: e.target.value })
	}

	//删除
	delete(index) {
		let { dataSource } = this.state;
		dataSource.splice(index, 1);
		dataSource.map((item, index) => {
			item.index = index + 1
		})
		this.setState({ dataSource });
	}



	onChange = (e) => {

		this.setState({
			value: e.target.value,
		});
	}

	cancel() {
		const {
			actions: { changeExpurgateField }
		} = this.props;
		changeExpurgateField('visible', false);
	}
}
