import React, { Component } from 'react';
import { Table, Tabs, Button,Form,Input, Row, Col, Modal, message, Popconfirm, DatePicker, Select } from 'antd';
import VideoText from './VideoText';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import '../../../Datum/components/Datum/index.less'

const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class VideoTables extends Component {
	
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
	query() {
		const {
			actions: { getVideoList },
			filter = {}
		} = this.props;
		// const user = getUser();
		console.log(this.props)
		this.props.form.validateFields(async (err, values) => {
			console.log(values.keyzi)
			let conditions = {

				title: values.dynamictitle || "",
				pub_time_begin: "",
				pub_time_end: "",
				abstract:values.keyzis || ""
			}
			if (values && values.releasetimes && values.releasetimes.length > 0) {
				conditions.pub_time_begin = moment(values.releasetimes[0]).format('YYYY-MM-DD 00:00:00');
				conditions.pub_time_end = moment(values.releasetimes[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}

			await getVideoList({}, conditions);
		})
	}
	query1() {

		const {
					actions: { getVideosList },
			filter = {}
				} = this.props;

		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				// task: filter.type || "processing",
				title: values.dynamictitles || "",
				pub_time_begin: "",
				pub_time_end: "",
				abstract:values.keyzis1 || "",
			}
			if (values && values.releasetimes1 && values.releasetimes1.length > 0) {
				conditions.pub_time_begin = moment(values.releasetimes1[0]).format('YYYY-MM-DD 00:00:00');
				conditions.pub_time_end = moment(values.releasetimes1[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}
			await getVideosList({}, conditions);
		})
	}
	clear() {
		const {
			noticeTabValue = '1'
		} = this.props;
		this.props.form.setFieldsValue({

			dynamictitle: undefined,
			releasetimes: undefined,
			workunit: undefined,
			keyzis:undefined,

		});
	}
	clear1() {

		this.props.form.setFieldsValue({
			dynamictitles: undefined,
			releasetimes1: undefined,
			workunits: undefined,
			keyzis1:undefined,

		});
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
			form: { getFieldDecorator },			
			toggleData: toggleData = {
				type: 'NEWS',
				visible: false,
			},
			bulletinTabValue = '1'
		} = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
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
						<Row >
								{/* <Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col> */}
								<Col span={18}>
									<Row>
										<Col span={8} >
											<FormItem {...formItemLayout} label="视频名称">
												{
													getFieldDecorator('dynamictitle', {
														rules: [
															{ required: false, message: '请输入视频名称' },
														]
													})
														(<Input placeholder="请输入视频名称" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="关键字">
												{
													getFieldDecorator('keyzis', {
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
													getFieldDecorator('releasetimes', {
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
							<Table dataSource={videoList}
								columns={this.columns}
								rowKey="id"
								className="foresttables"
								// rowSelection={rowSelection}
								bordered
							/>
						</TabPane>
						<TabPane tab="暂存的安全生产视频" key="2">
						<Row >
								{/* <Col span={4}>
									<Icon type='exception' style={{ fontSize: 32 }} />
								</Col> */}
								<Col span={18}>
									<Row>
										<Col span={8} >
											<FormItem {...formItemLayout} label="视频名称">
												{
													getFieldDecorator('dynamictitles', {
														rules: [
															{ required: false, message: '请输入视频名称' },
														]
													})
														(<Input placeholder="请输入视频名称" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="关键字">
												{
													getFieldDecorator('keyzis1', {
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
													getFieldDecorator('releasetimes1', {
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
							<Table dataSource={videosList}
								columns={this.draftColumns}
								rowKey="id"
								className="foresttables"
								// rowSelection={rowSelection}
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
				if(update_time){
					return moment(update_time).utc().format('YYYY-MM-DD HH:mm:ss');
				}else{
					return <span>未撤回</span>
				}
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
export default Form.create()(VideoTables)
