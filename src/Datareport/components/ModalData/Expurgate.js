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

	//下拉框选择人
	selectChecker(value) {
		let check = JSON.parse(value);
		this.setState({ check })
	}

	onok() {
		const { getall = [], actions: { changeAdditionField } } = this.props;
		let  dataSource  = getall;
		console.log('woshi:', getall)

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
		this.setDeleteData(dataSource, per)
	}

	setDeleteData = (data, participants) => {
		const { actions: { createWorkflow, logWorkflowEvent, clearExpurgateField } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "模型信息批量删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "模型信息批量删除",
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
					note: '发起删除',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					message.success("成功")
					clearExpurgateField()
				})
		})
	}

	render() {

		const { expurgate = {}, getall = [], actions: { changeExpurgateField } } = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'numbers',
			render: (text, record, index) => {
				return index + 1
			}
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
			title="模型信息删除表"
				width={1280}
				visible={expurgate.visible}
				onCancel={this.cancel.bind(this)}
				onOk={this.onok.bind(this)}
			>
				<Row>
					<Table
						bordered
						className='foresttable'
						columns={columns}
						dataSource={getall}
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
{/* 
				<Row style={{ marginTop: '20px' }}>
					<Col span={2} push={22}>
						<Button type="default">确认导入</Button>
					</Col>
				</Row> */}
				{/* <Row style={{ marginBottom: '20px' }}>
					<Col span={2}>
						<span>删除原因：</span>
					</Col>
				</Row>
				<Row style={{ margin: '20px 0' }}>
					<Col>
						<TextArea rows={2} />
					</Col>
				</Row> */}
			</Modal>
		)
	}

	 //删除
	 delete(index){
        const { getall=[],actions:{changeExpurgateField} } = this.props;
        
		let dataSource = getall;
		console.log('ads',{dataSource})
        dataSource.splice(index,1);
       
        changeExpurgateField('dataSource',dataSource)
    
    }

	

	onChange = (e) => {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value,
		});
	}

	cancel() {
		const {
			actions: { clearExpurgateField }
		} = this.props;
		clearExpurgateField();
	}
}
