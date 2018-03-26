import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm, Form, Input, DatePicker, Icon, Select } from 'antd';
import RichText from './RichText';
import RichModal from './RichModal';
import { DEPARTMENT } from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '../../../_platform/auth';
import { base, SOURCE_API } from '../../../_platform/api';
// import { Icon } from './C:/Users/ecidi/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/react-fa';
import '../../../Datum/components/Datum/index.less'
import E from 'wangeditor'

let editor;
moment.locale('zh-cn');

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class NewsTable extends Component {
	array = [];
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
		this.array = [];
		DEPARTMENT.map(item =>{
			this.array.push(<Option value={item.code}>{item.name}</Option>)
		})
	}
	componentDidUpdate(){
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
				container: record.raw,
				title:record.title,
				source:record.source ? record.source.name : '无'
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
			theme: undefined,
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
		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				title:values.theme || "",
				org:values.workunit || "",
			}
			if (values && values.worktime ) {
				conditions.begin = moment(values.worktime [0]).format('YYYY-MM-DD');
				conditions.end = moment(values.worktime [1]).format('YYYY-MM-DD');
			}
			await getNewsList(conditions);
		})
	}
	publishNewsClick(record) {
		const { actions: { toggleModal } } = this.props;
		toggleModal({
			type: 'NEWS',
			status: 'ADD',
			visible: true,
			editData: record
		})
	}

	query1() {
		const {
			actions: { getDraftNewsList },
			filter = {}
		} = this.props;
		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				org:values.workunits || "",
				title: values.title1 || "",
			}
			if (values && values.worktimes ) {
				conditions.begin = moment(values.worktimes[0]).format('YYYY-MM-DD');
				conditions.end = moment(values.worktimes[1]).format('YYYY-MM-DD');
			}
			await getDraftNewsList(conditions);
		})
	}
	render() {
		const rowSelection = {
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
							(toggleData.visible && toggleData.type === 'NEWS') && <RichModal {...this.props}/>
						}
					</div>}
				<Col span={22} offset={1}>
					<Tabs activeKey={newsTabValue} onChange={this.subTabChange.bind(this)} tabBarExtraContent={
						<div style={{ marginBottom: '10px' }}>
							<Button type="primary" onClick={this.publishNewsClick.bind(this)}>新闻发布</Button>
							{
								(toggleData.visible && toggleData.type === 'NEWS') && <RichModal {...this.props}/>
							}
						</div>
					} >
						<TabPane tab="新闻查询" key="1">
							<Row >
								<Col span={18}>
									<Row>
										<Col span={8} >
											<FormItem {...formItemLayout} label="名称">
												{
													getFieldDecorator('theme', {
														rules: [
															{ required: false, message: '请输入名称' },
														]
													})
														(<Input placeholder="请输入名称" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="发布单位">
												{
													getFieldDecorator('workunit', {
													})
													(<Select allowClear style={{ width: '100%' }}>
														{
															this.array
														}
													</Select>)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="发布日期">
												{
													getFieldDecorator('worktime', {
														rules: [
															{ required: false, message: '请选择日期' },
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
								dataSource={newsList}
								columns={this.columns}
								className="foresttables"
								bordered
								rowKey="id" />
						</TabPane>
						<TabPane tab="暂存的新闻" key="2">
							<Row >
								<Col span={18}>
									<Row>
										<Col span={8} >
											<FormItem {...formItemLayout} label="名称">
												{
													getFieldDecorator('title1', {
														rules: [
															{ required: false, message: '请输入名称' },
														]
													})
														(<Input placeholder="请输入名称" />)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="发布单位">
												{
													getFieldDecorator('workunits', {
														rules: [
															{ required: false, message: '发布单位' },
														]
													})
													(<Select allowClear  style={{ width: '100%' }}>
														{
															this.array
														}
													</Select>)
												}
											</FormItem>
										</Col>
										<Col span={8} >
											<FormItem {...formItemLayout} label="修改日期">
												{
													getFieldDecorator('worktimes', {
														rules: [
															{ required: false, message: '请选择日期' },
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
							<Table dataSource={draftNewsLis}
								columns={this.draftColumns}
								className="foresttables"
								bordered
								rowKey="id" />
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
					<div>
						{
							this.state.source === '无' ? null : <p>{`来源 ：${this.state.source}`}</p>
						}
						<div style={{ maxHeight: '800px', overflow: 'auto' }}
							dangerouslySetInnerHTML={{ __html: this.state.container }} />
					</div>
					
				</Modal>
			</Row>
		);
	}

	columns = [
		{
			title: '新闻查询ID',
			dataIndex: 'id',
			key: 'id',
			width:'10%'
		}, {
			title: '名称',
			dataIndex: 'title',
			key: 'title',
			width:'50%'
		}, {
			title: '发布单位',
			dataIndex: 'abstract',
			key: 'abstract',
			width:'10%',
			render:(text,record)=>{
				if(record.abstract){
					return <p>{record.abstract}</p>
				}else{
					if(record.pub_unit && record.pub_unit.name){
						return <p>{record.pub_unit.name}</p>
					}else{
						return <p> / </p>
					}
				}
			}
		}, {
			title: '发布日期',
			dataIndex: 'pub_time',
			key: 'pub_time',
			width:'15%',
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
			width:'15%',
			render: record => {
				return (
					<span>
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
	draftColumns = [
		{
			title: '暂存新闻ID',
			dataIndex: 'id',
			key: 'id',
			width:'10%',
		}, {
			title: '名称',
			dataIndex: 'title',
			key: 'title',
			width:'50%',
		}, {
			title: '发布单位',
			dataIndex: 'abstract',
			key: 'abstract',
			width:'10%',
			render:(text,record)=>{
				if(record.abstract){
					return <p>{record.abstract}</p>
				}else{
					if(record.pub_unit && record.pub_unit.name){
						return <p>{record.pub_unit.name}</p>
					}else{
						return <p> / </p>
					}
				}
			}
		}, {
			title: '修改日期',
			dataIndex: 'pub_time',
			key: 'pub_time',
			width:'15%',
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
			width:'15%',
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
export default Form.create()(NewsTable)