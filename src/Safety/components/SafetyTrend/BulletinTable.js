import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, message,Form, Modal, Popconfirm ,Input, DatePicker, Select } from 'antd';
import BulletinText from './BulletinText';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import '../../../Datum/components/Datum/index.less'

const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class BulletinTable extends Component {
	
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
		const { actions: { getTrenList, getTrendsList } } = this.props;
		getTrenList({
			user_id: user_id
		});
		getTrendsList({
			user_id: user_id
		})
	}

	//公告操作按钮
	clickTips(record, type) {
		const {
			actions: { deleteData, getTrenList, getTrendsList, toggleModal, patchData },
			videoTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({ pk: record.id })
				.then(() => {
					message.success('删除公告成功！');
					if (videoTabValue === '1') {
						getTrenList({
							user_id: user_id
						});
					} else {
						getTrendsList({
							user_id: user_id
						});
					}
				})
		} else if (type === 'EDIT') {
			toggleModal({
				type: 'TIPS',
				status: 'EDIT',
				visible: true,
				editData: record,
			})
		} else if (type === 'VIEW') {
			Modal.info({
				title: <h1>公告标题：{record.title}</h1>,
				okText: '知道了',
				width: '800px',
				content: (
					<div>
						<h2>公告正文：
							<div style={{ maxHeight: '600px', overflow: 'auto', border: '1px solid #ccc' }}
								dangerouslySetInnerHTML={{ __html: record.raw }} />
						</h2>
						<h2>
							公告附件：{
								record.attachment.fileList.length > 0 ? (
									record.attachment.fileList.map((file, index) => {
										return (
											<div key={index}>
												<a target="_bank" href={file.down_file}>附件{index + 1}、{file.name}</a>
											</div>
										)
									})
								) : '暂无附件'
							}
						</h2>
					</div>
				),
				onOk() {
				},
			});
		} else if (type === 'BACK') {
			let newData = {
				"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
				"is_draft": true
			};
			patchData({ pk: record.id }, newData)
				.then(rst => {
					if (rst.id) {
						message.success('撤回成功，撤回的公告在暂存的公告中可查看');
						//更新暂存的公告列表数据
						getTrenList({
							user_id: user_id
						});
						getTrendsList({
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
						message.success('重新发布公告成功！');
						//更新暂存的公告列表数据
						getTrenList({
							user_id: user_id
						});
						getTrendsList({
							user_id: user_id
						});
					}
				})
		}

	}
	query() {
		const {
			actions: { getTrenList },
			filter = {}
		} = this.props;
		// const user = getUser();
		this.props.form.validateFields(async (err, values) => {
			let conditions = {

				title: values.theme1 || "",
				pub_time_begin:"",
				pub_time_end:"",
			}
			if (values && values.worktime1 && values.worktime1.length > 0) {
				conditions.pub_time_begin = moment(values.worktime1[0]).format('YYYY-MM-DD 00:00:00');
				conditions.pub_time_end = moment(values.worktime1[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}

			await getTrenList({}, conditions);
		})
	}
	query1() {

		const {
					actions: { getTrendsList },
			filter = {}
				} = this.props;

		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				// task: filter.type || "processing",
				title: values.title2 || "",
				pub_time_begin:"",
				pub_time_end:"",
			}
			if (values && values.worktimes2 && values.worktimes2.length > 0) {
				conditions.pub_time_begin = moment(values.worktimes2[0]).format('YYYY-MM-DD 00:00:00');
				conditions.pub_time_end = moment(values.worktimes2[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}
			await getTrendsList({}, conditions);
		})
	}
	clear() {
		const {
			noticeTabValue = '1'
		} = this.props;
		this.props.form.setFieldsValue({

			theme1: undefined,
			worktime1: undefined,
			workunit: undefined,

		});
	}
	clear1() {

		this.props.form.setFieldsValue({
			title2: undefined,
			worktimes2: undefined,
			workunits: undefined,

		});
	}

	//发布公告
	publishTipsClick() {
		const { actions: { toggleModal } } = this.props;
		toggleModal({
			type: 'TIPS',
			status: 'ADD',
			visible: true,
			editData: null
		})
	}

	//公告列表和暂存的公告列表切换
	subTabChange(videoTabValue) {
		const { actions: { setVideoTabActive } } = this.props;
		setVideoTabActive(videoTabValue);
	}

	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const {
			trenList = [],
			trendsList = [],
			form: { getFieldDecorator },
			toggleData: toggleData = {
				type: 'TIPS',
				visible: false,
			},
			videoTabValue = '1'
		} = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<Row>
				<Col span={22} offset={1}>
					<Tabs activeKey={videoTabValue} onChange={this.subTabChange.bind(this)} tabBarExtraContent={
						<div style={{ marginBottom: '10px' }}>
							<Button type="primary" onClick={this.publishTipsClick.bind(this)}>发布安全事故快报</Button>
							{
								(toggleData.visible && toggleData.type === 'TIPS') && (<BulletinText {...this.props} />)
							}
						</div>}>
						<TabPane tab="发布的安全事故快报" key="1">
						<Row >
								{/* <Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col> */}
								<Col span={18}>
									<Row>
										<Col span={12} >
											<FormItem {...formItemLayout} label="快报标题">
												{
													getFieldDecorator('theme1', {
														rules: [
															{ required: false, message: '请输入快报标题' },
														]
													})
														(<Input placeholder="请输入快报标题" />)
												}
											</FormItem>
										</Col>
										<Col span={12} >
											<FormItem {...formItemLayout} label="发布时间">

												{
													getFieldDecorator('worktime1', {
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
							<Table dataSource={trenList}
								columns={this.columns}
								rowKey="id"
								className="foresttables"
								rowSelection={rowSelection}
								bordered
							/>
						</TabPane>
						<TabPane tab="暂存的安全事故快报" key="2">
						<Row >
								{/* <Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col> */}
								<Col span={18}>
									<Row>
										<Col span={12} >
											<FormItem {...formItemLayout} label="快报标题">
												{
													getFieldDecorator('title2', {
														rules: [
															{ required: false, message: '请输入快报标题' },
														]
													})
														(<Input placeholder="请输入快报标题" />)
												}
											</FormItem>
										</Col>
										<Col span={12} >
											<FormItem {...formItemLayout} label="暂存时间">

												{
													getFieldDecorator('worktimes2', {
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
							<Table dataSource={trendsList}
								columns={this.draftColumns}
								rowKey="id"
								className="foresttables"
								rowSelection={rowSelection}
								bordered
							/>
						</TabPane>
					</Tabs>
				</Col>
			</Row>
		);
	}

	columns = [
		{
			title: '发布快报ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '快报标题',
			dataIndex: 'title',
			key: 'title',
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
						<a onClick={this.clickTips.bind(this, record, 'VIEW')}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickTips.bind(this, record, 'EDIT')}>修改</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickTips.bind(this, record, 'BACK')}>撤回</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<Popconfirm title="确定删除吗?" onConfirm={this.clickTips.bind(this, record, 'DELETE')} okText="确定"
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
			title: '暂存快报ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '快报标题',
			dataIndex: 'title',
			key: 'title',
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
						<a onClick={this.clickTips.bind(this, record, 'VIEW')}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickTips.bind(this, record, 'PUBLISH')}>发布</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a onClick={this.clickTips.bind(this, record, 'EDIT')}>修改</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<Popconfirm title="确定删除吗?" onConfirm={this.clickTips.bind(this, record, 'DELETE')} okText="确定"
							cancelText="取消">
							<a>删除</a>
						</Popconfirm>
					</span>
				)
			},
		}
	];
}
export default Form.create()(BulletinTable)
