import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, Form,Input, message, Popconfirm, DatePicker, Select } from 'antd';
import StateText from './StateText';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import '../../../Datum/components/Datum/index.less'

const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class StateTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null,
		}
	}

	componentDidMount() {
		const { actions: { getNewsList, getDraftNewsList } } = this.props;
		getNewsList({
			user_id: user_id
		})
		getDraftNewsList({
			user_id: user_id
		})
	}

	//新闻操作按钮
	clickNews(record, type) {
		const {
			actions: { deleteData, getNewsList, getDraftNewsList, toggleModal, patchData },
			stateTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({ pk: record.id })
				.then(() => {
					message.success('删除新闻成功！');
					if (stateTabValue === '1') {
						getNewsList({
							user_id: user_id
						});
					} else {
						getDraftNewsList({
							user_id: user_id
						});
					}
				})
		} else if (type === 'EDIT') {
			toggleModal({
				type: 'NEWS',
				status: 'EDIT',
				visible: true,
				editData: record,
			})
		} else if (type === 'VIEW') {
			this.setState({
				visible: true,
				container: record.raw
			})
		} else if (type === 'BACK') {
			let newData = {
				"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
				"is_draft": true
			};
			patchData({ pk: record.id }, newData)
				.then(rst => {
					if (rst.id) {
						message.success('撤回成功，撤回的新闻在暂存的新闻中可查看');
						//更新暂存的新闻列表数据
						getNewsList({
							user_id: user_id
						});
						getDraftNewsList({
							user_id: user_id
						});
					}
				})
		} else if (type === 'PUBLISH') {
			let newData = {
				"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
				"is_draft": false
			};
			patchData({ pk: record.id }, newData)
				.then(rst => {
					if (rst.id) {
						message.success('重新发布新闻成功！');
						//更新暂存的新闻列表数据
						getNewsList({
							user_id: user_id
						});
						getDraftNewsList({
							user_id: user_id
						});
					}
				})
		}

	}

	query() {
		const {
			actions: { getNewsList },
			filter = {}
		} = this.props;
		// const user = getUser();
		console.log(this.props)
		this.props.form.validateFields(async (err, values) => {
			console.log(values.keyzi)
			let conditions = {

				title: values.dynamic || "",
				pub_time_begin: "",
				pub_time_end: "",
				abstract:values.keyzi || ""
			}
			if (values && values.releasetime && values.releasetime.length > 0) {
				conditions.pub_time_begin = moment(values.releasetime[0]).format('YYYY-MM-DD 00:00:00');
				conditions.pub_time_end = moment(values.releasetime[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}

			await getNewsList({}, conditions);
		})
	}
	query1() {

		const {
					actions: { getDraftNewsList },
			filter = {}
				} = this.props;

		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				// task: filter.type || "processing",
				title: values.dynamic1 || "",
				pub_time_begin: "",
				pub_time_end: "",
				abstract:values.keyzi1 || "",
			}
			if (values && values.releasetime1 && values.releasetime1.length > 0) {
				conditions.pub_time_begin = moment(values.releasetime1[0]).format('YYYY-MM-DD 00:00:00');
				conditions.pub_time_end = moment(values.releasetime1[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}
			await getDraftNewsList({}, conditions);
		})
	}
	clear() {
		const {
			noticeTabValue = '1'
		} = this.props;
		this.props.form.setFieldsValue({

			dynamic: undefined,
			releasetime: undefined,
			workunit: undefined,
			keyzi:undefined,

		});
	}
	clear1() {

		this.props.form.setFieldsValue({
			dynamic1: undefined,
			releasetime1: undefined,
			workunits: undefined,
			keyzi1:undefined,

		});
	}

	//发布新闻
	publishNewsClick() {
		const { actions: { toggleModal } } = this.props;
		toggleModal({
			type: 'NEWS',
			status: 'ADD',
			visible: true,
			editData: null
		})
	}

	handleCancel() {
		this.setState({
			visible: false,
			container: null,
		})
	}

	//新闻列表和暂存的新闻列表切换
	subTabChange(stateTabValue) {
		const { actions: { setStateTabActive } } = this.props;
		setStateTabActive(stateTabValue);
	}

	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};

		const {
			newsList = [],
			draftNewsLis = [],
			form: { getFieldDecorator },
			toggleData: toggleData = {
				type: 'NEWS',
				visible: false,
			},
			stateTabValue = '1'
		} = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<Row>
				<Col span={22} offset={1}>
					<Tabs activeKey={stateTabValue} onChange={this.subTabChange.bind(this)} tabBarExtraContent={
						<div style={{ marginBottom: '10px' }}>
							<Button type="primary" onClick={this.publishNewsClick.bind(this)}>发布国内安全动态</Button>
							{
								(toggleData.visible && toggleData.type === 'NEWS') && <StateText {...this.props} />
							}
						</div>}>
						<TabPane tab="发布的国内安全动态" key="1">
							<Row >
								{/* <Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col> */}
								<Col span={18}>
									<Row>
										<Col span={8} >
											<FormItem {...formItemLayout} label="动态标题">
												{
													getFieldDecorator('dynamic', {
														rules: [
															{ required: false, message: '请输入动态标题' },
														]
													})
														(<Input placeholder="请输入动态标题" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="关键字">
												{
													getFieldDecorator('keyzi', {
														rules: [
															{ required: false, message: '请输入关键字' },
														]
													})
														(<Input placeholder="请输入关键字" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="发布时间">

												{
													getFieldDecorator('releasetime', {
														rules: [
															{ required: false, message: '请选择发布时间' },
														]
													})
														(<RangePicker
															style={{ verticalAlign: "middle", width: '100%' }}
															// defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
															showTime={{ format: 'HH:mm:ss' }}
															format={'YYYY/MM/DD HH:mm:ss'}

														>
														</RangePicker>)
												}

											</FormItem>

										</Col>
									</Row>
									<Row>

									</Row>
								</Col>
								<Col span={2} offset={1}>
									<Button icon='search' onClick={this.query.bind(this)}>查找</Button>
								</Col>
								<Col span={2} >
									<Button icon='reload' onClick={this.clear.bind(this)}>清空</Button>
								</Col>
							</Row>
							<Table
								rowSelection={rowSelection}
								className="foresttables"
								bordered
								dataSource={newsList}
								columns={this.columns}
								rowKey="id" />
						</TabPane>
						<TabPane tab="暂存的国内安全动态" key="2">
							<Row >
								{/* <Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col> */}
								<Col span={18}>
									<Row>
										<Col span={8} >
											<FormItem {...formItemLayout} label="公告标题">
												{
													getFieldDecorator('dynamic1', {
														rules: [
															{ required: false, message: '请输入公告标题' },
														]
													})
														(<Input placeholder="请输入公告标题" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="关键字">
												{
													getFieldDecorator('keyzi1', {
														rules: [
															{ required: false, message: '请输入关键字' },
														]
													})
														(<Input placeholder="请输入关键字" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="暂存时间">

												{
													getFieldDecorator('releasetime1', {
														rules: [
															{ required: false, message: '请选择暂存时间' },
														]
													})
														(<RangePicker
															style={{ verticalAlign: "middle", width: '100%' }}
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
								<Col span={2} offset={1}>
									<Button icon='search' onClick={this.query1.bind(this)}>查找</Button>
								</Col>
								<Col span={2}>
									<Button icon='reload' onClick={this.clear1.bind(this)}>清空</Button>
								</Col>
							</Row>
							<Table
								rowSelection={rowSelection}
								className="foresttables"
								bordered
								dataSource={draftNewsLis}
								columns={this.draftColumns}
								rowKey="id" />
						</TabPane>
					</Tabs>

				</Col>
				<Modal
					title="国内安全动态预览"
					width="800px"
					visible={this.state.visible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
					footer={null}>
					<div style={{ maxHeight: '800px', overflow: 'auto' }}
						dangerouslySetInnerHTML={{ __html: this.state.container }} />
				</Modal>
			</Row>
		);
	}

	columns = [
		{
			title: '发布动态ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '动态标题',
			dataIndex: 'title',
			key: 'title',
		}, {
			title: '关键字',
			dataIndex: 'abstract',
			key: 'abstract',
		}, {
			title: '发布时间',
			dataIndex: 'pub_time',
			key: 'pub_time',
			render: pub_time => {
				return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '更新时间',
			dataIndex: 'update_time',
			key: 'update_time',
			render: update_time => {
				return moment(update_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this.clickNews.bind(this, record, 'VIEW')}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickNews.bind(this, record, 'EDIT')}>修改</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickNews.bind(this, record, 'BACK')}>撤回</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<Popconfirm title="确定删除吗?" onConfirm={this.clickNews.bind(this, record, 'DELETE')} okText="确定"
							cancelText="取消">
							<a>删除</a>
						</Popconfirm>
					</span>
				)
			},
		}
	];
	draftColumns = [
		{
			title: '暂存动态ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '动态标题',
			dataIndex: 'title',
			key: 'title',
		}, {
			title: '关键字',
			dataIndex: 'abstract',
			key: 'abstract',
		}, {
			title: '暂存时间',
			dataIndex: 'pub_time',
			key: 'pub_time',
			render: pub_time => {
				return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '撤回时间',
			dataIndex: 'update_time',
			key: 'update_time',
			render: update_time => {
				return moment(update_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this.clickNews.bind(this, record, 'PUBLISH')}>发布</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickNews.bind(this, record, 'VIEW')}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickNews.bind(this, record, 'EDIT')}>修改</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<Popconfirm title="确定删除吗?" onConfirm={this.clickNews.bind(this, record, 'DELETE')} okText="确定"
							cancelText="取消">
							<a>删除</a>
						</Popconfirm>
					</span>
				)
			},
		}
	];
}
export default Form.create()(StateTable)
