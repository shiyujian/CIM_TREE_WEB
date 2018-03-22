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
			showInfo: {}
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
		deleteSentDocAc({ id: _id, user: encodeURIComponent(getUser().org) })
			.then(() => {
				message.success("删除发文成功！");
				getSentInfoAc({
					user: encodeURIComponent(getUser().org)
				});
			})

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
					width="90%"
					style={{ padding: "0 20px" }}
					visible={this.state.visible}
					closable={false}
					maskClosable={false}
					footer={null}
				>
					{
						notification.title &&
						<Row>
							<Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
								<h1>{notification.title}</h1>
							</Col>
							<Row style={{ marginBottom: '20px' }}>
								<Col span={24}>
									<h3>接受单位：{this._getText(notification.to_whom)}</h3>
									<h3>抄送单位：{this._getText(notification.cc)}</h3>
									<h3>发送时间：{moment(notification.create_time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')}</h3>
								</Col>
							</Row>
							<Row style={{ marginBottom: '20px' }}>
								<Col span={2}>
									<h3>正文</h3>
								</Col>
								<Col span={22}>
									<div style={{
										maxHeight: '800px',
										overflow: 'auto',
										border: '1px solid #ccc',
										padding: '10px'
									}}
										dangerouslySetInnerHTML={{ __html: notification.body_rich }} />
								</Col>
							</Row>
							<Col span={24}>
								<h3>附件：</h3>
								{
									notification.fixed_external_attachments.length > 0 &&
									<a href={STATIC_DOWNLOAD_API + notification.fixed_external_attachments[0].file_partial_url}
										target="_bank">{notification.fixed_external_attachments[0].file_name}</a>
								}
							</Col>
							<Col span={6} offset={18}>
								<Button onClick={this._handleCancel.bind(this)}>退出</Button>
							</Col>
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
		// console.log(list)
		let arr = list;
		list.map((itm, index) => {
			itm.index = index + 1;
		});
		return arr;
	}
	//查看信息详情
	_viewClick(id) {
		//	获取详情
		const { actions: { getSendDetailAc } } = this.props;
		console.log(this.props)
		this.setState({
			visible: true
		});
		getSendDetailAc({
			id: id,
			user: encodeURIComponent(getUser().org)
		})
			.then(rst => {
				this.setState({
					showInfo: rst
				});
			})
	}
	_handleCancel() {
		this.setState({
			visible: false,
			showInfo: {}
		})
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
			dataIndex: 'extend_to_whom_list',
			render: extend_to_whom_list => {
				let orgListName = this._getText(extend_to_whom_list);
				console.log("orgListName", orgListName)
				return orgListName;
			}
			// render: (text,record,index) => {
			// 	const { actions: {getOrgName} } = this.props;
				
			// 	let orgListName = this._getText(record.extend_to_whom_list);
			// 	let orgCode=record.extend_info || {}
			// 	let names=''		
			// 	if(orgCode.to_whomCode){
			// 		let orgListCodes=orgCode.to_whomCode.split("_");
			// 		orgListCodes.pop()
			// 		let codeu=orgListCodes.join()
			// 		let ucode=codeu.replace(/,/g,'_')
			// 		 getOrgName({ code: ucode}).then(rst=>{
			// 			 names= `${rst.name}-${orgListName}`
			// 			 console.log("111111",names)
			// 		})
					
			// 		return names;
			// 	}else{
			// 		return orgListName;
			// 	}
			// }
		}, {
			title: '抄送单位',
			dataIndex: 'extend_cc_list',
			render: extend_cc_list => {
				let orgListName = this._getText(extend_cc_list);
				return orgListName;
			}
			// render: (text,record,index) => {
			// 	const { actions: {getOrgName} } = this.props;
			// 	let orgListName = this._getText(record.extend_cc_list);
			// 	let orgCode=record.extend_info || {}	
			// 	let namea=''						
			// 	if(orgCode.cc_Code){
			// 		let orgListCodes=orgCode.cc_Code.split("_");
			// 		orgListCodes.pop()
			// 		let codeu=orgListCodes.join()
			// 		let ucode=codeu.replace(/,/g,'_')
			// 		 getOrgName({ code: ucode}).then(rst=>{
			// 			namea= `${rst.name}-${orgListName}`
			// 			console.log("222222",namea)
						
			// 		})
			// 		return namea;
			// 	}else{
			// 		return orgListName;
			// 	}
			// }
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
						<a onClick={this._viewClick.bind(this, record._id)}>查看</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<Popconfirm title="确定删除吗?" onConfirm={this._deleteClick.bind(this, record._id)} okText="确定" cancelText="取消">
							<a>删除</a>
						</Popconfirm>
					</div>
				)
			},
		}
	];
}