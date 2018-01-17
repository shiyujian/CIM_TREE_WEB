import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm, Form, Input, DatePicker, Icon, Select } from 'antd';
import SimpleText from './SimpleText';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';

const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class TipsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
		}
	}

	componentDidMount() {
		const { actions: { getTipsList, getDraftTipsList } } = this.props;
		getTipsList({
			user_id: user_id
		});
		getDraftTipsList({
			user_id: user_id
		})
	}

	//公告操作按钮
	clickTips(record, type) {
		const {
			actions: { deleteData, getTipsList, getDraftTipsList, toggleModal, patchData },
			tipsTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({ pk: record.id })
				.then(() => {
					message.success('删除公告成功！');
					if (tipsTabValue === '1') {
						getTipsList({
							user_id: user_id
						});
					} else {
						getDraftTipsList({
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
						getTipsList({
							user_id: user_id
						});
						getDraftTipsList({
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
						getTipsList({
							user_id: user_id
						});
						getDraftTipsList({
							user_id: user_id
						});
					}
				})
		}

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
	subTabChange(tipsTabValue) {
		const { actions: { setTipsTabActive } } = this.props;
		setTipsTabActive(tipsTabValue);
	}

	render() {
		const {
			tipsList = [],
			draftTipsList = [],
			toggleData: toggleData = {
				type: 'TIPS',
				visible: false,
			},
			tipsTabValue = '1'
		} = this.props;
		return (
			// tabBarExtraContent={
			// 	<div style={{marginBottom: '10px'}}>
			// 		<Button type="primary" onClick={this.publishTipsClick.bind(this)}>发布公告</Button>
			// 		{
			// 			(toggleData.visible && toggleData.type === 'TIPS') && (<SimpleText {...this.props}/>)
			// 		}
			// 	</div>}
			<Row>
				<Col span={22} offset={1}>
					<Tabs activeKey={tipsTabValue} onChange={this.subTabChange.bind(this)} >
						<TabPane tab="通知查询" key="1">
						<Row >
								<Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col>
								<Col span={16}>
									<Row>
										<Col span={12} >
											<Row>
												<Col span={3}>
													<span >主题</span>
												</Col>
												<Col >
													<Input style={{ width: '70%' }} />
												</Col>
											</Row>
										</Col>
										<Col span={12} >
											<Row>
												<Col span={3}>
													<span>发布日期</span>
												</Col>
												<Col >
													<RangePicker
														style={{ verticalAlign: "middle", width: '70%' }}
														defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
														showTime={{ format: 'HH:mm:ss' }}
														format={'YYYY/MM/DD HH:mm:ss'}

													>
													</RangePicker>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row>
										<Col span={12} style={{ marginTop: 20 }}>
											<Row>
												<Col span={3}>
													<span >发布单位</span>
												</Col>
												<Col>
													<Select style={{ width: '70%' }} >
														<Option value="0">编辑中</Option>
														<Option value="1">已提交</Option>
														<Option value="2">执行中</Option>
														<Option value="3">已完成</Option>
														<Option value="4">已废止</Option>
														<Option value="5">异常</Option>
													</Select>
												</Col>
											</Row>
										</Col>
										<Col span={12} style={{ marginTop: 20 }}>
											<Row>
												<Col span={3}>
													<span >紧急程度</span>
												</Col>
												<Col>
													<Select style={{ width: '70%' }} >
														<Option value="0">编辑中</Option>
														<Option value="1">已提交</Option>
														<Option value="2">执行中</Option>
														<Option value="3">已完成</Option>
														<Option value="4">已废止</Option>
														<Option value="5">异常</Option>
													</Select>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={2} offset={1}>
									<Button icon='search'>查找</Button>
									<Button style={{ marginTop: 20 }} icon='reload'>清除</Button>
								</Col>
							</Row>
							<Table dataSource={tipsList}
								columns={this.columns}
								rowKey="id"
								style={{marginTop:20}}
							/>
						</TabPane>
						<TabPane tab="暂存的通知" key="2">
							<Row >
								<Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col>
								<Col span={16}>
									<Row>
										<Col span={12} >
											<Row>
												<Col span={3}>
													<span >主题</span>
												</Col>
												<Col >
													<Input style={{ width: '70%' }} />
												</Col>
											</Row>
										</Col>
										<Col span={12} >
											<Row>
												<Col span={3}>
													<span>发布日期</span>
												</Col>
												<Col >
													<RangePicker
														style={{ verticalAlign: "middle", width: '70%' }}
														defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]}
														showTime={{ format: 'HH:mm:ss' }}
														format={'YYYY/MM/DD HH:mm:ss'}

													>
													</RangePicker>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row>
										<Col span={12} style={{ marginTop: 20 }}>
											<Row>
												<Col span={3}>
													<span >发布单位</span>
												</Col>
												<Col>
													<Select style={{ width: '70%' }} >
														<Option value="0">编辑中</Option>
														<Option value="1">已提交</Option>
														<Option value="2">执行中</Option>
														<Option value="3">已完成</Option>
														<Option value="4">已废止</Option>
														<Option value="5">异常</Option>
													</Select>
												</Col>
											</Row>
										</Col>
										<Col span={12} style={{ marginTop: 20 }}>
											<Row>
												<Col span={3}>
													<span >紧急程度</span>
												</Col>
												<Col>
													<Select style={{ width: '70%' }} >
														<Option value="0">编辑中</Option>
														<Option value="1">已提交</Option>
														<Option value="2">执行中</Option>
														<Option value="3">已完成</Option>
														<Option value="4">已废止</Option>
														<Option value="5">异常</Option>
													</Select>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={2} offset={1}>
									<Button icon='search'>查找</Button>
									<Button style={{ marginTop: 20 }} icon='reload'>清除</Button>
								</Col>
							</Row>
							<Table dataSource={draftTipsList}
								columns={this.draftColumns}
								rowKey="id"
								style={{marginTop:20}}
							/>
						</TabPane>
						<TabPane tab="通知发布" key="3">
							<SimpleText {...this.props} />
						</TabPane>
					</Tabs>
				</Col>
			</Row>
		);
	}

	columns = [
		{
			title: '公告ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '公告标题',
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
			title: '公告ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '公告标题',
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