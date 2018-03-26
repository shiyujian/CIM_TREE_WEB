import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, message, Modal, Popconfirm } from 'antd';
// import SimpleText from './SimpleText';
import { getUser } from '../../../_platform/auth';
import moment from 'moment';
import ToggleModal from './ToggleModal'
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import '../../../Datum/components/Datum/index.less'

export default class SendPage1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			showInfo: {},
			viewClickinfo: {}
		}
	}

	componentDidMount() {
		// const {actions: {getTipsList, getDraftTipsList}} = this.props;
		// getTipsList();
		// getDraftTipsList({
		// 	user_id: user_id
		// })
	}


	_deleteClick(_id) {
		const { actions: { deleteSentDocAc, getSentInfoAc } } = this.props;
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));


		let orgCode = getUser().org_code

		let orgListCodes = orgCode.split("_");
		orgListCodes.pop()
		let codeu = orgListCodes.join()
		let ucode = codeu.replace(/,/g, '_')
		if (user.is_superuser == true) {
			deleteSentDocAc({ id: _id, user: encodeURIComponent('admin') })

				.then(() => {
					message.success("删除发文成功！");
					getSentInfoAc({
						user: encodeURIComponent('admin')
					});
				})
		} else {
			deleteSentDocAc({ id: _id, user: encodeURIComponent(ucode) })

				.then(() => {
					message.success("删除发文成功！");
					getSentInfoAc({
						user: encodeURIComponent(ucode)
					});
				})
		}



	}
	_sentDoc() {
		const { actions: { toggleModalAc } } = this.props;
		toggleModalAc({
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
	render() {
		const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const {
			sendInfo = {},
			toggleData: toggleData = {
				type: 'NEWS',
				visible: false,
			},
		} = this.props;
		const { notifications = [] } = sendInfo;

		const { showInfo = {} } = this.state;
		const { notification = {}, is_read = false, _id = '' } = showInfo;
		return (
			<Row>
				<Col span={22} offset={1}>
					<Row>
						<Col offset={22}>
							<Button type="primary" onClick={this._sentDoc.bind(this)}>发文</Button>
						</Col>
					</Row>
					<Table
						dataSource={this._getNewArrFunc(notifications)}
						rowSelection={rowSelection}
						columns={this.columns}
						title={() => '发文查询'}
						className="foresttables"
						bordered
						rowKey="_id"
					// style={{marginTop:10}}
					/>
				</Col>
				{(toggleData.visible && toggleData.type === 'NEWS') && <ToggleModal {...this.props} />}
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
						<Row style={{ padding: "0 80px", minHeight: "300px" }}>
							<Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
								<h1>{notification.title}</h1>
							</Col>
							<Row style={{ marginBottom: '20px' }}>
								<Col span={24}>
									<h3 style={{ marginTop: '20px' }}>接受单位：{this.state.viewClickinfo.to_whom_s}</h3>
									<h3 style={{ marginTop: '20px' }}>抄送单位：{this.state.viewClickinfo.cc_whom_s}</h3>
									<h3 style={{ marginTop: '20px' }}>发送时间：{moment(notification.create_time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')}</h3>
								</Col>
							</Row>
							<Row style={{ marginBottom: '20px' }}>
								<Col span={2}>
									<h3>正文</h3>
								</Col>
								<Col span={22}>
									<div style={{
										maxHeight: '800px',
										minHeight: '50px',
										overflow: 'auto',
										border: '1px solid #ccc',
										padding: '10px'
									}}
										dangerouslySetInnerHTML={{ __html: notification.body_rich }} />
								</Col>
							</Row>
							<Col span={24}>
								<Col span={4}>
									<h3 style={{ width: '100%' }}>附件：</h3>
								</Col>
								<Col span={20}>
									{
										notification.fixed_external_attachments.length > 0 &&
										<a href={STATIC_DOWNLOAD_API + notification.fixed_external_attachments[0].file_partial_url}
											target="_bank">{notification.fixed_external_attachments[0].file_name}</a>
									}
								</Col>
								{/* <h3>附件：</h3>
								{
									notification.fixed_external_attachments.length > 0 &&
									<a href={STATIC_DOWNLOAD_API + notification.fixed_external_attachments[0].file_partial_url}
										target="_bank">{notification.fixed_external_attachments[0].file_name}</a>
								} */}
							</Col>
							{/* <Col span={6} offset={18}>
								<Button onClick={this._handleCancel.bind(this)}>退出</Button>
							</Col> */}
						</Row>
					}

				</Modal>
			</Row>
		);
	}
	_getText(arr = []) {
		let text = '';
		arr.map(org => {
			text = text + org + '、'
		});
		if (text !== '') {
			text = text.slice(0, text.length - 1)
		}
		return text;
	}
	_getNewArrFunc(list = []) {
		let arr = list;
		list.map((itm, index) => {
			itm.index = index + 1;
		});
		return arr;
	}
	//查看信息详情
	_viewClick(id, record) {
		//	获取详情
		console.log("record", record)
		console.log("id", id)
		const { actions: { getSendDetailAc } } = this.props;
		this.setState({
			visible: true,
			viewClickinfo: record
		});
		let orgCode = getUser().org_code

		let orgListCodes = orgCode.split("_");
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));

		orgListCodes.pop()
		let codeu = orgListCodes.join()
		let ucode = codeu.replace(/,/g, '_')
		if (user.is_superuser == true) {
			getSendDetailAc({
				id: id,
				user: encodeURIComponent('admin')
			})
				.then(rst => {
					this.setState({
						showInfo: rst
					});
				})
		} else {
			getSendDetailAc({
				id: id,
				user: encodeURIComponent(ucode)
			})
				.then(rst => {
					this.setState({
						showInfo: rst
					});
				})
		}
	}
	_handleCancel() {
		this.setState({
			visible: false,
			showInfo: {}
		})
	}
	confirms() {
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		if (user.is_superuser == true) {
			return <a>删除</a>

		} else {
			return []
		}


	}
	columns = [
		// {
		// 	title: 'ID',
		// 	dataIndex: '_id',
		// },
		{
			title: 'ID',
			dataIndex: 'index',
		}, {
			title: '标题',
			dataIndex: 'notification_title',
		}, {
			title: '接收单位',
			dataIndex: 'to_whom_s',
		}, {
			title: '抄送单位',
			dataIndex: 'cc_whom_s',
		}, {
			title: '发送时间',
			dataIndex: 'create_time',
			render: create_time => {
				return moment(create_time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
			}
		}, {
			title: '操作',
			render: record => {
				return (
					<div>
						<a style={{ marginRight: '10px' }} onClick={this._viewClick.bind(this, record._id, record)}>查看</a>
						{/* <Popconfirm title="确定删除吗?" onConfirm={this._deleteClick.bind(this, record._id)} okText="确定" cancelText="取消">
							<a>删除</a>
						</Popconfirm> */}
						<Popconfirm title="确定删除吗?" onConfirm={this._deleteClick.bind(this, record._id)} okText="确定" cancelText="取消">
							{/* <a>删除</a> */}
							{
								this.confirms()
							}
						</Popconfirm>

					</div>
				)
			},
		}
	];
}