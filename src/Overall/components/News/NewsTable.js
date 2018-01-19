import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm, Form, Input, DatePicker, Icon, Select } from 'antd';
import RichText from './RichText';
import RichModal from './RichModal';

import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API } from '../../../_platform/api';
// import { Icon } from './C:/Users/ecidi/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/react-fa';
import E from 'wangeditor'

let editor;
moment.locale('zh-cn');

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class NewsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: "",
			visible: false,
			container: null,
			stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
		}
	}

	componentDidMount() {

		const { actions: { getNewsList, getDraftNewsList } } = this.props;
		getNewsList({
			user_id: user_id
		});
		getDraftNewsList({
			user_id: user_id
		})

	}

	//新闻操作按钮
	clickNews(record, type) {
		const {
			actions: { deleteData, getNewsList, getDraftNewsList, toggleModal, patchData },
			newsTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({ pk: record.id })
				.then(() => {
					message.success('删除新闻成功！');
					if (newsTabValue === '1') {
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

	// //发布新闻
	// publishNewsClick() {
	// 	const { actions: { toggleModal } } = this.props;
	// 	toggleModal({
	// 		type: 'NEWS',
	// 		status: 'ADD',
	// 		visible: true,
	// 		editData: null
	// 	})
	// }

	handleCancel() {
		this.setState({
			visible: false,
			container: null,
		})
	}



	//新闻列表和暂存的新闻列表切换
	subTabChange(newsTabValue) {

		const { actions: { setNewsTabActive } } = this.props;
		setNewsTabActive(newsTabValue);
	}

	clear() {
		const {
			newsTabValue = '1'
		} = this.props;
		this.props.form.setFieldsValue({

			title: undefined,
			worktime: undefined,
			workunit: undefined,

		});
	}

	clear1() {

		this.props.form.setFieldsValue({
			title1: undefined,
			worktimes: undefined,
			workunits: undefined,

		});
	}
	query() {
		const {
			actions: { getNewsList },
			filter = {}
		} = this.props;
		const user = getUser();
		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				// task: filter.type || "processing",
				executor:user.id,
				title: values.title || "",
				// workflow:values.workflow || "",
				// creator:values.creator || "",
				// status:values.status || "",
				// real_start_time_begin:"",
				// real_start_time_end:"",
			}
			// if (values && values.startTime && values.startTime.length > 0) {
			// 	conditions.real_start_time_begin = moment(values.startTime[0]).format('YYYY-MM-DD 00:00:00');
			// 	conditions.real_start_time_end = moment(values.startTime[1]).format('YYYY-MM-DD 23:59:59');
			// }
			// for (const key in conditions) {
			// 	if (!conditions[key] || conditions[key] == "") {
			// 		delete conditions[key];
			// 	}
			// }
			// setLoadingStatus(true);
			await getNewsList({}, conditions);
			// setLoadingStatus(false);
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
				title: values.title1 || "",
			}
			await getDraftNewsList({}, conditions);
		})
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
			newsTabValue = '1'
		} = this.props;

		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};



		return (
			<Row>
				{
					<div style={{ marginBottom: '10px' }}>
						{
							(toggleData.visible && toggleData.type === 'NEWS') && <RichModal {...this.props} />
						}
					</div>}
				<Col span={22} offset={1}>
					<Tabs activeKey={newsTabValue} onChange={this.subTabChange.bind(this)} >

						<TabPane tab="新闻查询" key="1">
							<Row >
								<Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col>
								<Col span={16}>
									<Row>
										<Col span={12} >
											<FormItem {...formItemLayout} label="主题">
												{
													getFieldDecorator('title', {
														rules: [
															{ required: false, message: '请输入主题' },
														]
													})
														(<Input placeholder="请输入主题" />)
												}
											</FormItem>
										</Col>
										<Col span={12} >
											<FormItem {...formItemLayout} label="发布日期">

												{
													getFieldDecorator('worktime', {
														rules: [
															{ required: false, message: '请选择日期' },
														]
													})
														(<RangePicker
															style={{ verticalAlign: "middle", width: '70%' }}
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
										<Col span={12} style={{ marginTop: 20 }}>
											<FormItem {...formItemLayout} label="发布单位">
												{
													getFieldDecorator('workunit', {
														rules: [
															{ required: false, message: '发布单位' },
														]
													})
														(<Select style={{ width: '100%' }}
														>
															<Option value="0">编辑中</Option>
															<Option value="1">已提交</Option>
															<Option value="2">执行中</Option>
															<Option value="3">已完成</Option>
															<Option value="4">已废止</Option>
															<Option value="5">异常</Option>
														</Select>)
												}


											</FormItem>

										</Col>
									</Row>
								</Col>
								<Col span={2} offset={1}>
									<Button icon='search' onClick={this.query.bind(this)}>查找</Button>
									<Button style={{ marginTop: 20 }} icon='reload' onClick={this.clear.bind(this)}>清除</Button>
								</Col>
							</Row>

							<Table
								style={{ marginTop: 20 }}
								rowSelection={rowSelection}
								dataSource={newsList}
								columns={this.columns}
								title={() => '新闻查询'}
								bordered
								rowKey="id" />
						</TabPane>
						<TabPane tab="暂存的新闻" key="2">
							<Row >
								<Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col>
								<Col span={16}>
									<Row>
										<Col span={12} >
											<FormItem {...formItemLayout} label="主题">
												{
													getFieldDecorator('title1', {
														rules: [
															{ required: false, message: '请输入主题' },
														]
													})
														(<Input placeholder="请输入主题" />)
												}
											</FormItem>
										</Col>
										<Col span={12} >
											<FormItem {...formItemLayout} label="发布日期">

												{
													getFieldDecorator('worktimes', {
														rules: [
															{ required: false, message: '请选择日期' },
														]
													})
														(<RangePicker
															style={{ verticalAlign: "middle", width: '70%' }}
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
										<Col span={12} style={{ marginTop: 20 }}>
											<FormItem {...formItemLayout} label="发布单位">
												{
													getFieldDecorator('workunits', {
														rules: [
															{ required: false, message: '发布单位' },
														]
													})
														(<Select style={{ width: '100%' }}
														>
															<Option value="0">编辑中</Option>
															<Option value="1">已提交</Option>
															<Option value="2">执行中</Option>
															<Option value="3">已完成</Option>
															<Option value="4">已废止</Option>
															<Option value="5">异常</Option>
														</Select>)
												}


											</FormItem>

										</Col>
									</Row>
								</Col>
								<Col span={2} offset={1}>
									<Button icon='search'  onClick={this.query1.bind(this)}>查找</Button>
									<Button style={{ marginTop: 20 }} icon='reload' onClick={this.clear1.bind(this)}>清除</Button>
								</Col>
							</Row>
							<Table dataSource={draftNewsLis}
								style={{ marginTop: 20 }}
								rowSelection={rowSelection}
								title={() => '新闻查询'}
								columns={this.draftColumns}
								bordered
								rowKey="id" />
						</TabPane>

						<TabPane tab="新闻发布" key="3">
							<RichText {...this.props} />
						</TabPane>

					</Tabs>

				</Col>
				<Modal
					title="新闻预览"
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
			title: '序号',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '主题',
			dataIndex: 'title',
			key: 'title',
		}, {
			title: '发布单位',
			dataIndex: 'abstract',
			key: 'abstract',
		}, {
			title: '发布日期',
			dataIndex: 'pub_time',
			key: 'pub_time',
			render: pub_time => {
				return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
			// }, {
			// 	title: '更新时间',
			// 	dataIndex: 'update_time',
			// 	key: 'update_time',
			// 	render: update_time => {
			// 		return moment(update_time).utc().format('YYYY-MM-DD HH:mm:ss');
			// 	}
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this.clickNews.bind(this, record, 'VIEW')}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickNews.bind(this, record, 'EDIT')}>修改</a>


						{/* <a onClick={this.clickNews.bind(this, record, 'BACK')}>撤回</a>
						&nbsp;&nbsp;|&nbsp;&nbsp; */}
						{/* <Popconfirm title="确定删除吗?" onConfirm={this.clickNews.bind(this, record, 'DELETE')} okText="确定"
							cancelText="取消">
							<a>删除</a>
						</Popconfirm> */}
					</span>
				)
			},
		}
	];
	draftColumns = [
		{
			title: '序号',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '主题',
			dataIndex: 'title',
			key: 'title',
		}, {
			title: '发布单位',
			dataIndex: 'abstract',
			key: 'abstract',
		}, {
			title: '修改时间',
			dataIndex: 'pub_time',
			key: 'pub_time',
			render: pub_time => {
				return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
			}
			// }, {
			// 	title: '撤回时间',
			// 	dataIndex: 'update_time',
			// 	key: 'update_time',
			// 	render: update_time => {
			// 		return moment(update_time).utc().format('YYYY-MM-DD HH:mm:ss');
			// 	}
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						{/* <a onClick={this.clickNews.bind(this, record, 'PUBLISH')}>发布</a>
						&nbsp;&nbsp;|&nbsp;&nbsp; */}
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
export default Form.create()(NewsTable)