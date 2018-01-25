import React, { Component, Children } from 'react';
import { Row, Col, Input, Form, Spin, Icon, Button, Table, Modal, DatePicker, Progress, Upload, Select, Checkbox, notification, Popconfirm } from 'antd';
// import {UPLOAD_API} from '_platform/api';
import moment from 'moment';
import { WORKFLOW_CODE } from '_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import PerSearch from './PerSearch';
import SearchInfo from './SearchInfo';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const FILE_API = "";
class Plan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [],
			dataSourceSelected: [],
			visible: false,
			isCopyMsg: false, //接收人员是否发短信
			treedataSource: [],
			treetype: [],//树种
			key: 6,
		};
	}

	componentDidMount() {
		const { actions: { gettreetype } } = this.props;
		let treedata = [{
			key: 1,
			project: '便道施工',
			units: 'm',
		}, {
			key: 2,
			project: '给排水沟槽开挖',
			units: 'm',
		}, {
			key: 3,
			project: '给排水管道安装',
			units: 'm',
		}, {
			key: 4,
			project: '给排水回填',
			units: 'm',
		}, {
			key: 5,
			project: '绿地平整',
			units: '亩',
		}, {
			key: 6,
			project: '种植穴工程',
			units: '个',
		},];
		this.setState({
			treedataSource: treedata
		})
		gettreetype({})
			.then(rst => {
				let treetype = rst.map((o, index) => {
					console.log(o.TreeTypeNo)
					return (
						<Option key={index} value={JSON.stringify(o)}>{o.TreeTypeNo}</Option>
					)
				})
				console.log('treetype', treetype)
				this.setState({ treetype });
			})
	}

	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
	}
	// 删除
	deleteClick = () => {
		const { selectedRowKeys } = this.state
		if (selectedRowKeys.length === 0) {
			notification.warning({
				message: '请先选择数据！',
				duration: 2
			});
			return
		} else {
			alert('还未做删除功能')
		}
	}

	// 新增按钮
	addClick = () => {
		this.setState({
			visible: true,
		})
		this.props.form.setFieldsValue({
			superunit: undefined,
			unit: undefined,
			dataReview: undefined,
			number: undefined,
			timedate: moment().format('YYYY-MM-DD')
		})

	}
	// 关闭弹框
	closeModal() {

		this.setState({
			visible: false,
		})
	}
	// 添加树列表
	addTreeClick() {
		const { treedataSource, key } = this.state;
		let num = key + 1;
		let project = [
			<Select style={{ width: '200px' }} placeholder='请选择树种' onSelect={this.handleSelect.bind(this, key, 'project')}>
				{
					this.state.treetype
				}
			</Select>
		]
		let addtree = {
			key: num,
			project: project,
			units: '棵'
		}
		treedataSource.push(addtree);
		console.log('treedataSource',treedataSource)
		this.setState({ treedataSource, key: num })
	}
	// 删除树列表
	delTreeClick(index) {
		alert('暂时无法删除')
	}
	//下拉框选择变化
	handleSelect(index, key, value) {
		const { treedataSource } = this.state;
		value = JSON.parse(value);
		treedataSource[index][key] = value.TreeTypeNo;
		this.setState({ treedataSource });
	}

	// 短信
	_cpoyMsgT(e) {
		this.setState({
			isCopyMsg: e.target.checked,
		})
	}
	//选择审核人员
	selectMember(memberInfo) {
		const {
            form: {
                setFieldsValue
            }
        } = this.props
		this.member = null;
		if (memberInfo) {
			let memberValue = memberInfo.toString().split('#');
			if (memberValue[0] === 'C_PER') {
				this.member = {
					"username": memberValue[4],
					"person_code": memberValue[1],
					"person_name": memberValue[2],
					"id": parseInt(memberValue[3])
				}
			}
		} else {
			this.member = null
		}

		setFieldsValue({
			dataReview: this.member
		});
	}
	render() {
		const { selectedRowKeys, } = this.state;
		const {
            form: { getFieldDecorator },
        } = this.props;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const FormItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		}
		return (
			<div>
				<SearchInfo {...this.props} />
				<Button onClick={this.addClick.bind(this)}>新增</Button>
				<Button onClick={this.deleteClick.bind(this)}>删除</Button>
				<Table
					columns={this.columns}
					rowSelection={rowSelection} />
				<Modal
					title="新增每日实际进度"
					width={800}
					visible={this.state.visible}
					maskClosable={false}
					onCancel={this.closeModal.bind(this)}
				// onOk={this.sendWork.bind(this)}
				>
					<div>
						<Form>
							<Row>
								<Col span={24}>
									<Row>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='单位工程'>
												{
													getFieldDecorator('unit', {
														rules: [
															{ required: true, message: '请选择单位工程' }
														]
													})
														(<Select placeholder='请选择区域' allowClear>
															<Option value='单位工程一'>单位工程一</Option>
															<Option value='单位工程二'>单位工程二</Option>
															<Option value='单位工程三'>单位工程三</Option>
														</Select>)
												}
											</FormItem>
										</Col>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='编号'>
												{
													getFieldDecorator('number', {
														rules: [
															{ required: true, message: '请输入编号' }
														]
													})
														(<Input placeholder='请输入编号' />)
												}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='监理单位'>
												{
													getFieldDecorator('superunit', {
														rules: [
															{ required: true, message: '请输入监理单位' }
														]
													})
														(<Input placeholder='请输入监理单位' />)
												}
											</FormItem>
										</Col>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='日期'>
												{
													getFieldDecorator('timedate', {
														rules: [
															{ required: true, message: '请输入监理单位' }
														]
													})
														(<Input placeholder='请输入监理单位' />)
												}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Table
											columns={this.columns1}
											dataSource={this.state.treedataSource}
										/>
										<Button onClick={this.addTreeClick.bind(this)} style={{ marginLeft: 20, marginRight: 10 }} type="primary" ghost>添加</Button>
									</Row>
									<Row>

										<Col span={8} offset={4}>
											<FormItem {...FormItemLayout} label='审核人'>
												{
													getFieldDecorator('dataReview', {
														rules: [
															{ required: true, message: '请选择审核人员' }
														]
													})
														(
														<PerSearch selectMember={this.selectMember.bind(this)} />
														)
												}
											</FormItem>
										</Col>
										<Col span={8} offset={4}>
											<Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
										</Col>
									</Row>
								</Col>
							</Row>

						</Form>
					</div>
				</Modal>
			</div>
		)
	}


	columns = [
		{
			title: '单位工程',
			dataIndex: 'unit',
			key: 'unit',
			width: '15%'
		}, {
			title: '进度类型',
			dataIndex: 'type',
			key: 'type',
			width: '10%'
		}, {
			title: '编号',
			dataIndex: 'number',
			key: 'number',
			width: '10%'
		}, {
			title: '备注',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '10%'
		}, {
			title: '提交人',
			dataIndex: 'submitperson',
			key: 'submitperson',
			width: '10%'
		}, {
			title: '提交时间',
			dataIndex: 'submittime',
			key: 'submittime',
			width: '10%',
			sorter: (a, b) => moment(a['submittime']).unix() - moment(b['submittime']).unix(),
			render: text => {
				return moment(text).format('YYYY-MM-DD')
			}
		}, {
			title: '流程状态',
			dataIndex: 'status',
			key: 'status',
			width: '15%',
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this.clickInfo.bind(this, record, 'VIEW')}>查看</a>
					</span>
				)
			}
		},
	];

	columns1 = [{
		title: '序号',
		dataIndex: 'key',
		key: 'key',
		width: '10%',
	}, {
		title: '项目',
		dataIndex: 'project',
		key: 'project',
	}, {
		title: '单位',
		dataIndex: 'units',
		key: 'units',
	}, {
		title: '数量',
		dataIndex: 'number',
		key: 'number',
		render: (text, record, index) => {
			return <Input value={record.number || ""} onChange={ele => {
				record.number = ele.target.value
				this.forceUpdate();
			}} />
		}
	}, {
		title: '操作',
		dataIndex: 'operation',
		key: 'operation',
		width: '10%',
		render: (text, record, index) => {
			if(index>=6){
				return <div>
				<Popconfirm
					placement="rightTop"
					title="确定删除吗？"
					onConfirm={this.delTreeClick.bind(this, record, index+1)}
					okText="确认"
					cancelText="取消">
					<a>删除</a>
				</Popconfirm>
			</div>
			}	
		}
	}
	];
}
export default Form.create()(Plan)
