import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, Modal, message, Popconfirm, Form, Input, DatePicker, Icon, Select } from 'antd';
import SimpleText from './SimpleText';
import Modals from './SimpModal';
import { DEPARTMENT } from '_platform/api';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import '../../../Datum/components/Datum/index.less'

const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class TipsTable extends Component {
	array = [];
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
		this.array = [];
		DEPARTMENT.map(item => {
			this.array.push(<Option value={item.code}>{item.name}</Option>)
		})
	}
	componentDidUpdate() {

	}

	//通知操作按钮
	clickTips(record, type) {
		const {
			actions: { deleteData, getTipsList, getDraftTipsList, toggleModal, patchData },
			tipsTabValue = '1'
		} = this.props;
		if (type === 'DELETE') {
			deleteData({ pk: record.id })
				.then(() => {
					message.success('删除通知成功！');
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
				title: <h1 style={{marginLeft:42}}>{record.title}</h1>,
				okText: '知道了',
				width: '800px',
				iconType:'none',
				content: (
					<div>
						{
							record.source && record.source.name && <p>{`来源 ：${record.source.name}`}</p>
						}
						<div style={{ maxHeight: '600px', overflow: 'auto', border: '1px solid #ccc',marginBottom:10,marginTop:10}}
							dangerouslySetInnerHTML={{ __html: record.raw }} />
						<h4>
							通知附件：{
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
						</h4>
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
						message.success('撤回成功，撤回的通知在暂存的通知中可查看');
						//更新暂存的通知列表数据
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
						message.success('重新发布通知成功！');
						//更新暂存的通知列表数据
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

	//发布通知
	publishTipsClick() {
		const { actions: { toggleModal } } = this.props;
		toggleModal({
			type: 'TIPS',
			status: 'ADD',
			visible: true,
			editData: null
		})
	}

	//通知列表和暂存的通知列表切换
	subTabChange(tipsTabValue) {
		const { actions: { setTipsTabActive } } = this.props;
		setTipsTabActive(tipsTabValue);
	}
	//查找
	query() {
		const {
			actions: { getTipsList },
			filter = {}
		} = this.props;
		const user = getUser();
		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				executor: user.id,
				title: values.theme || "",
				org: values.workunit || "",
				degree:values.degree || ""
			}
			if (values && values.worktime) {
				conditions.begin = moment(values.worktime[0]).format('YYYY-MM-DD');
				conditions.end = moment(values.worktime[1]).format('YYYY-MM-DD');
			}
			await getTipsList(conditions);
		})
	}

	query1() {
		const {
			actions: { getDraftTipsList },
			filter = {}
		} = this.props;
		const user = getUser();
		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				executor: user.id,
				title: values.titles || "",
				org: values.workunits || "",
				degree:values.degree || ""
			}
			if (values && values.worktimes) {
				conditions.begin = moment(values.worktimes[0]).format('YYYY-MM-DD');
				conditions.end = moment(values.worktimes[1]).format('YYYY-MM-DD');
			}
			await getDraftTipsList(conditions);
		})
	}

	//清除
	clear() {

		this.props.form.setFieldsValue({
			theme: undefined,
			worktime: undefined,
			workunit: undefined,
			degree: undefined
		});
	}

	clear1() {

		this.props.form.setFieldsValue({
			titles: undefined,
			worktimes: undefined,
			workunits: undefined,
			degrees: undefined
		});
	}

	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const {
			tipsList = [],
			draftTipsList = [],
			form: { getFieldDecorator },
			toggleData: toggleData = {
				type: 'TIPS',
				visible: false,
			},
			tipsTabValue = '1'
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
							(toggleData.visible && toggleData.type === 'TIPS') && (<Modals {...this.props} />)
						}
					</div>}
				<Col span={22} offset={1}>
					<Tabs activeKey={tipsTabValue} onChange={this.subTabChange.bind(this)} tabBarExtraContent={
						<div style={{ marginBottom: '10px' }}>
							<Button type="primary" onClick={this.publishTipsClick.bind(this)}>通知发布</Button>
							{
								(toggleData.visible && toggleData.type === 'TIPS') && (<Modals {...this.props} />)
							}
						</div>} >
						<TabPane tab="通知查询" key="1">
							<Row gutter={50}>
								<Col span={10} >
									<FormItem {...formItemLayout} label="名称">
										{
											getFieldDecorator('theme', {
												rules: [
													{ required: false, message: '请输入主题' },
												]
											})
												(<Input placeholder="请输入主题" />)
										}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...formItemLayout} label="发布单位">
										{
											getFieldDecorator('workunit', {
												rules: [
													{ required: false, message: '发布单位' },
												]
											})
												(<Select allowClear style={{ width: '100%' }}>
													{
														this.array
													}
												</Select>)
										}
									</FormItem>
								</Col>
								<Col span={2}>
									<Button icon='search' onClick={this.query.bind(this)}>查找</Button>
								</Col>
							</Row>
							<Row gutter={50}>
								<Col span={10} >
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
								<Col span={8}>
									<FormItem {...formItemLayout} label="紧急程度">
										{
											getFieldDecorator('degree', {
												rules: [
													{ required: false, message: '紧急程度' },
												]
											})
												(<Select allowClear style={{ width: '100%' }}
												>
													<Option value="0">平件</Option>
													<Option value="1">加急</Option>
													<Option value="2">特急</Option>
												</Select>)
										}
									</FormItem>
								</Col>
								<Col span={2} >
									<Button icon='reload' onClick={this.clear.bind(this)}>清除</Button>
								</Col>
							</Row>


							<Table
								//rowSelection={rowSelection}
								dataSource={tipsList}
								//title={() => '通知查询'}
								className="foresttables"
								columns={this.columns}
								bordered
								rowKey="id"

							/>
						</TabPane>
						<TabPane tab="暂存的通知" key="2">
							<Row gutter={50}>
								<Col span={10} >
									<FormItem {...formItemLayout} label="名称">
										{
											getFieldDecorator('titles', {
												rules: [
													{ required: false, message: '请输入主题' },
												]
											})
												(<Input placeholder="请输入主题" />)
										}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...formItemLayout} label="发布单位">
										{
											getFieldDecorator('workunits', {
												rules: [
													{ required: false, message: '发布单位' },
												]
											})
												(<Select allowClear style={{ width: '100%' }}>
													{
														this.array
													}
												</Select>)
										}
									</FormItem>
								</Col>
								<Col span={2} >
									<Button icon='search' onClick={this.query1.bind(this)}>查找</Button>
								</Col>
							</Row>
							<Row gutter={50}>
								<Col span={10} >
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
								<Col span={8}>
									<FormItem {...formItemLayout} label="紧急程度">
										{
											getFieldDecorator('degrees', {
												rules: [
													{ required: false, message: '紧急程度' },
												]
											})
												(<Select style={{ width: '100%' }}
												>
													<Option value="0">平件</Option>
													<Option value="1">加急</Option>
													<Option value="2">特急</Option>
												</Select>)
										}
									</FormItem>
								</Col>
								<Col span={2}>
									<Button icon='reload' onClick={this.clear1.bind(this)}>清除</Button>
								</Col>
							</Row>
							<Table
								//rowSelection={rowSelection}
								dataSource={draftTipsList}
								columns={this.draftColumns}
								//title={() => '暂存的通知'}
								className="foresttables"
								bordered
								rowKey="id"

							/>


						</TabPane>
						{/* <TabPane tab="通知发布" key="3">
							<SimpleText {...this.props} />
						</TabPane> */}
					</Tabs>
				</Col>
			</Row>
		);
	}

	columns = [
		{
			title: '通知查询ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '名称',
			dataIndex: 'title',
			key: 'title',
		}, {
			title:'发布单位',
			render:(text ,record) => {
				if(record.pub_unit){
					return <p>{record.pub_unit.name}</p>
				}else{
					return <p> / </p>
				}
			}
		},{
			title: '发布时间',
			key: 'pub_time',
			render: (text,record) => {
				if(record.update_time){
					return moment(record.update_time).utc().format('YYYY-MM-DD HH:mm:ss');
				}else{
					return moment(record.pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
				}
			}
		}, {
			title: '紧急程度',
			dataIndex: 'degree',
			key: 'degree',
			render: (text) => {
				if(text === 0){
					return <p>平件</p>
				}else if(text === 1){
					return <p>加急</p>
				}else if(text === 2){
					return <p>特急</p>
				}else{
					return <p> / </p>
				}
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
			title: '暂存通知ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '主题',
			dataIndex: 'title',
			key: 'title',
		}, {
			title:'发布单位',
			render:(text ,record) => {
				if(record.pub_unit){
					return <p>{record.pub_unit.name}</p>
				}else{
					return <p> / </p>
				}
			}
		}, {
			title: '紧急程度',
			dataIndex: 'degree',
			key: 'degree',
			render: (text) => {
				if(text === 0){
					return <p>平件</p>
				}else if(text === 1){
					return <p>加急</p>
				}else if(text === 2){
					return <p>特急</p>
				}else{
					return <p> / </p>
				}
			}
		}, {
			title: '修改时间',
			dataIndex: 'pub_time',
			key: 'pub_time',
			render: pub_time => {
				return moment(pub_time).utc().format('YYYY-MM-DD HH:mm:ss');
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

export default Form.create()(TipsTable)