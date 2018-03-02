import React, { Component } from 'react';
// import { Table, Tabs, Button, Row, Col, message, Modal, Popconfirm } from 'antd';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm, Form, Input, DatePicker, Icon, Select, TreeSelect } from 'antd';
import moment from 'moment';
import ToggleModal from './ToggleModal'
import { getUser } from '../../../_platform/auth';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import '../../../Datum/components/Datum/index.less'

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
class ReceivePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			showInfo: {},
			code_id:""
		}
	}

	//删除
	_deleteClick(_id) {
		const { actions: { deleteReceiveDocAc, getReceiveInfoAc } } = this.props;
		deleteReceiveDocAc({ id: _id, user: encodeURIComponent(getUser().org) })
			.then(() => {
				message.success("删除收文成功！");
				getReceiveInfoAc({
					user: encodeURIComponent(getUser().org)
				});
			})
	}

	//查看信息详情
	_viewClick(id) {
		this.setState({code_id:id})
		console.log(id)
		console.log(getUser().org)

		//	获取详情
		const { actions: { getReceiveDetailAc } } = this.props;
		this.setState({
			visible: true
		});
		getReceiveDetailAc({
			id: id,
			user: encodeURIComponent(getUser().org)
		})
			.then(rst => {
				this.setState({
					showInfo: rst
				});
			})
	}

	_handleCancel() {
		this.setState({
			visible: false,
			showInfo: {}
		})
	}

	_haveView(id) {
		const { actions: { patchReceiveDetailAc, getReceiveInfoAc } } = this.props;
		patchReceiveDetailAc({
			id: id,
			user: encodeURIComponent(getUser().org)
		}, {
				"is_read": true
			})
			.then((rst) => {
				if (rst._id) {
					message.success("已设置已阅！");
					getReceiveInfoAc({
						user: encodeURIComponent(getUser().org)
					});
					this._handleCancel();
				}
			})

	}

	//清除
	clear() {
		this.props.form.setFieldsValue({
			mold: undefined,
			title: undefined,
			orgList: undefined,
			orgLists: undefined,
			numbers: undefined,
			worktimes: undefined,
		});
	}
	//查找
	query() {

		const {
			actions: { getReceiveInfoAc },
			filter = {}
		} = this.props;
		// const user = getUser();
		this.props.form.validateFields(async (err, values) => {
			// console.log('values',values)
			console.log(values.title)
			let conditions = {
				
				// executor:user.id,
				user: values.title || "",
				// user: values.title || "",

			}
			// console.log(getUser().org)
			// console.log(this.state.code_id)
			await getReceiveInfoAc(conditions);

		})
	}

	handleCancel() {
		this.setState({
			visible: false,
			container: null,
		})
	}

	//回文弹出框
	_sentDoc() {
		const { actions: { toggleModalAc } } = this.props;
		toggleModalAc({
			type: 'NEWS',
			status: 'EDIT',
			visible: true,
			editData: null
		})
	}




	render() {
		const {
			actions: { getReceiveInfoAc },
			receiveInfo = {},
			form: { getFieldDecorator },
			toggleData: toggleData = {
				type: 'NEWS',
				visible: false,
			},
		} = this.props;
		console.log("receiveInfo", receiveInfo)
		const { showInfo = {} } = this.state;
		const { notification = {}, is_read = false, _id = '' } = showInfo;
		const { notifications = [] } = receiveInfo;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<Row>
				<Col span={22} offset={1}>
					<Row >
						{/* <Col span={2}>
							<Icon type='exception' style={{ fontSize: 32 }} />
						</Col> */}
						<Col span={18}>
							<Row>
								<Col span={8}>
									<FormItem {...formItemLayout} label="文件类型">
										{getFieldDecorator('mold', {
											rules: [{ required: false, message: '请输入文件标题' }],
											initialValue: ''
										})(<Select style={{ width: '100%' }}>
											<Option value="申请">申请</Option>
											<Option value="工作联系单">工作联系单</Option>
											<Option value="监理通知">监理通知</Option>
										</Select>)}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...formItemLayout} label="名称">
										{getFieldDecorator('title', {
											rules: [{ required: false, message: '请输入名称' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col>
								<Col span={8} >
									<FormItem {...formItemLayout} label="工程名称">
										{getFieldDecorator('orgList', {
											rules: [{ required: false, message: '请输入文件标题' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span={8} >
									<FormItem {...formItemLayout} label="来文单位">
										{getFieldDecorator('orgLists', {
											rules: [{ required: false, message: '请输入文件标题' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...formItemLayout} label="编号">
										{getFieldDecorator('numbers', {
											rules: [{ required: false, message: '请输入编号' }],
											initialValue: ''
										})(
											<Input type="text"
											/>
											)}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...formItemLayout} label="收文日期">
										{
											getFieldDecorator('worktimes', {
												rules: [
													{ required: false, message: '请选择日期' },
												]
											})
												(<RangePicker
													style={{ verticalAlign: "middle", width: '98%' }}
													// defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
													showTime={{ format: 'HH:mm:ss' }}
													format={'YYYY/MM/DD HH:mm:ss'}

												>
												</RangePicker>)
										}
									</FormItem>
								</Col>
							</Row>
						</Col>
						<Col span={4} offset={1}>
							<Row>
								<FormItem>
									<Button icon='search' onClick={this.query.bind(this)}>查找</Button>
								</FormItem>
							</Row>
							<Row>
								<FormItem>
									<Button icon='reload' onClick={this.clear.bind(this)}>清除</Button>
								</FormItem>
							</Row>
						</Col>
					</Row>
					{(toggleData.visible && toggleData.type === 'NEWS') && <ToggleModal {...this.props} />}
					<Table
						dataSource={this._getNewArrFunc(notifications)}
						columns={this.columns}
						title={() => '收文查询'}
						className="foresttables"
						bordered
					/>
				</Col>
				<Modal
					title="查看详情"
					width="70%"
					style={{ padding: "0 20px" }}
					visible={this.state.visible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					closable={false}
					maskClosable={false}
				// footer={null}
				>
					{
						notification.title &&
						<Row>
							<Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
								<h1>{notification.title}</h1>
							</Col>
							<Row style={{ marginBottom: '20px' }}>
								<Col span={24}>
									<h3>来文单位：{notification.from_whom}</h3>
									<h3>发送时间：{moment(notification.create_time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')}</h3>
								</Col>
							</Row>
							<Row style={{ marginBottom: '20px' }}>
								<Col span={2}>
									<h3>正文</h3>
								</Col>
								<Col span={22}>
									<div style={{
										maxHeight: '800px',
										overflow: 'auto',
										border: '1px solid #ccc',
										padding: '10px'
									}}
										dangerouslySetInnerHTML={{ __html: notification.body_rich }} />
								</Col>
							</Row>
							<Col span={24}>
								<h3>附件：</h3>
								{
									notification.fixed_external_attachments.length > 0 &&
									<a href={STATIC_DOWNLOAD_API + notification.fixed_external_attachments[0].file_partial_url}
										target="_bank">{notification.fixed_external_attachments[0].file_name}</a>
								}
							</Col>
							<Col span={6} offset={18}>
								{/*!is_read &&
								<Button type="primary" onClick={this._haveView.bind(this, _id)}>已阅</Button>*/}
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								<Button onClick={this._handleCancel.bind(this)}>退出</Button>
							</Col>
						</Row>
					}

				</Modal>
			</Row>
		);
	}
	_getNewArrFunc(list = []) {
		let arr = list;
		console.log("list",list)
		list.map((itm, index) => {
			itm.index = index + 1;
		});
		return arr;
	}
	columns = [
		{
			title: '序号',
			dataIndex: 'index',
			key: 'index'
		},{
			title: '文件类型',
			dataIndex: 'doc_type',
			key: 'doc_type'
		}, {
			title: '名称',
			dataIndex: 'title',
			key:'title'
		}, {
			title: '工程名称',
			dataIndex: 'project_name',
			key: 'project_name'
		},{
			title: '编号',
			dataIndex: 'number',
			key: 'number'
		},{
			title: '来文单位',
			dataIndex: 'come_unit',
			key: 'come_unit'
		},{
			title: '收文日期',
			dataIndex: 'come_date',
			key: 'come_date'
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this._viewClick.bind(this, record._id)}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this._sentDoc.bind(this)}>回文</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this._download.bind(this)}>下载</a>
						{/* <Popconfirm title="确定删除吗?" onConfirm={this._deleteClick.bind(this, record._id)} okText="确定"
							cancelText="取消">
							<a >删除</a>
						</Popconfirm> */}

					</span>
				)
			},
		}
	];
}
export default Form.create()(ReceivePage)