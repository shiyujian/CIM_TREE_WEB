import React, {Component} from 'react';
import {Table, Tabs, Button, Row, Col, message, Modal, Popconfirm} from 'antd';
import BulletinText from './BulletinText';
import moment from 'moment';
import {getUser} from '../../../_platform/auth';

const TabPane = Tabs.TabPane;
const user_id = getUser().id;


export default class BulletinTable extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
		const {actions: {getTrenList, getTrendsList}} = this.props;
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
			actions: {deleteData, getTrenList, getTrendsList, toggleModal, patchData},
			videoTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({pk: record.id})
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
							<div style={{maxHeight: '600px', overflow: 'auto',border:'1px solid #ccc'}}
								 dangerouslySetInnerHTML={{__html: record.raw}}/>
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
			patchData({pk: record.id}, newData)
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
			patchData({pk: record.id}, newData)
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

	//发布公告
	publishTipsClick() {
		const {actions: {toggleModal}} = this.props;
		toggleModal({
			type: 'TIPS',
			status: 'ADD',
			visible: true,
			editData: null
		})
	}

	//公告列表和暂存的公告列表切换
	subTabChange(videoTabValue) {
		const {actions: {setVideoTabActive}} = this.props;
		setVideoTabActive(videoTabValue);
	}

	render() {
		const {
			trenList = [],
			trendsList = [],
			toggleData: toggleData = {
				type: 'TIPS',
				visible: false,
			},
			videoTabValue = '1'
		} = this.props;
		return (
			<Row>
				<Col span={22} offset={1}>
					<Tabs activeKey={videoTabValue} onChange={this.subTabChange.bind(this)} tabBarExtraContent={
						<div style={{marginBottom: '10px'}}>
							<Button type="primary" onClick={this.publishTipsClick.bind(this)}>发布安全事故快报</Button>
							{
								(toggleData.visible && toggleData.type === 'TIPS') && (<BulletinText {...this.props}/>)
							}
						</div>}>
						<TabPane tab="发布的安全事故快报" key="1">
							<Table dataSource={trenList}
							       columns={this.columns}
							       rowKey="id"
							/>
						</TabPane>
						<TabPane tab="暂存的安全事故快报" key="2">
							<Table dataSource={trendsList}
							       columns={this.draftColumns}
							       rowKey="id"
							/>
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