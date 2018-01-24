import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm } from 'antd';
import VideoText from './VideoText';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import '../../../Datum/components/Datum/index.less'

const TabPane = Tabs.TabPane;
const user_id = getUser().id;

export default class VideoTables extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null,
			video: [],
			file: {},
			down_file: ''
		}
	}

	componentDidMount() {
		const { actions: { getVideoList, getVideosList } } = this.props;
		getVideoList({
			user_id: user_id
		})
		getVideosList({
			user_id: user_id
		})
		const newsLists = this.props.tipsList || []
		for (var i = 0; i < newsLists.length; i++) {

			if (newsLists[i].attachment.fileList != undefined) {
				if (newsLists[i].attachment.fileList[0] != undefined) {
					this.state.file = newsLists[i].attachment.fileList[0]
					this.state.video.push(this.state.file)

				}
			}
		}
	}

	//新闻操作按钮
	clickNews(record, type) {
		console.log(record)
		this.setState({ down_file: record.attachment.fileList[0].down_file })
		const {
			actions: { deleteData, getVideoList, getVideosList, toggleModal, patchData },
			bulletinTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({ pk: record.id })
				.then(() => {
					message.success('删除新闻成功！');

					if (bulletinTabValue === '1') {
						getVideoList({
							user_id: user_id
						});
					} else {
						getVideosList({
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
						getVideoList({
							user_id: user_id
						});
						getVideosList({
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
						getVideoList({
							user_id: user_id
						});
						getVideosList({
							user_id: user_id
						});
					}
				})
		}

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
	subTabChange(bulletinTabValue) {
		const { actions: { setBulletinTabActive } } = this.props;
		setBulletinTabActive(bulletinTabValue);
	}

	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const {
			videoList = [],
			videosList = [],
			toggleData: toggleData = {
				type: 'NEWS',
				visible: false,
			},
			bulletinTabValue = '1'
		} = this.props;
		return (
			<Row>
				<Col span={22} offset={1}>
					<Tabs activeKey={bulletinTabValue} onChange={this.subTabChange.bind(this)} tabBarExtraContent={
						<div style={{ marginBottom: '10px' }}>
							<Button type="primary" onClick={this.publishNewsClick.bind(this)}>发布安全生产视频</Button>
							{
								(toggleData.visible && toggleData.type === 'NEWS') && <VideoText {...this.props} />
							}
						</div>}>
						<TabPane tab="发布的安全生产视频" key="1">
							<Table dataSource={videoList}
								columns={this.columns}
								rowKey="id"
								className="foresttables"
								rowSelection={rowSelection}
								bordered
							/>
						</TabPane>
						<TabPane tab="暂存的安全生产视频" key="2">
							<Table dataSource={videosList}
								columns={this.draftColumns}
								rowKey="id"
								className="foresttables"
								rowSelection={rowSelection}
								bordered
							/>
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
					<video
						controls
						preload="auto"
						width="100%"
						height="500px"
						src={this.state.down_file}
					>
						<source src="this.state.video" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
						<source src="this.state.video" type='video/ogg; codecs="theora, vorbis"' />
						<source src="this.state.video" type='video/webm; codecs="vp8, vorbis"' />
					</video>
				</Modal>
			</Row>
		);

	}
	columns = [
		{
			title: '发布视频ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '视频名称',
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
			title: '暂存视频ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '视频名称',
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