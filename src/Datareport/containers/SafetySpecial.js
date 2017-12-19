import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import {
	Table,
	Row,
	Col,
	Form,
	Modal,
	Button,
	Input,
	Popconfirm,
	notification
} from 'antd';
import { AddFile, ChangeFile, DeleteFile } from '../components/SafetySpecial';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/safetySpecial';
const Search = Input.Search;
@connect(
	state => {
		const { datareport: { safetySpecial }, platform } = state;
		return { ...safetySpecial, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)
class SafetySpecial extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: [],
			subDataSource: [],
			setEditVisiable: false,
			setChangeVisiable: false,
			setDeleteVisiable: false,
			newKey1: Math.random(),
			newKey2: Math.random(),
			newKey3: Math.random(),
			num: null,
			selectedRowKeys: [],

		}
	}
	goCancel() {
		this.setState({
			setEditVisiable: false,
			setChangeVisiable: false,
			setDeleteVisiable: false,
		});
	}

	// 发起填报
	BtnFillIn() {
		this.setState({
			newKey1: Math.random() + 1,
			setEditVisiable: true
		});
	}

	setEditData() {
		notification.success({
			message: '上传成功！',
			duration: 2
		});
		const { dataSource } = this.props;
		this.setState({
			setEditVisiable: false,
			dataSource,
			num: dataSource.length
		});
	}

	//变更
	BtnChange(e) {
		if (this.state.subDataSource.length <= 0) {
			notification.error({
				message: '请选择数据！',
				duration: 2
			})
			return;
		}
		this.setState({ newKey2: Math.random() + 2, setChangeVisiable: true });
	}
	setChangeData() {
		const { changeInfo } = this.props;
		console.log('vip-变更', changeInfo);
		if (!changeInfo) {
			notification.warning({
				message: '请填写变更原因！',
				duration: 2
			})
			return;
		}
		this.setState({
			setChangeVisiable: false,
			selectedRowKeys: [],
			subDataSource: [],
		});
		notification.success({
			message: '申请成功！',
			duration: 2
		})
		console.log('vip-this.props', this.props);
		
		const { actions: { ChangeRow } } = this.props;
        ChangeRow('');
	}
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	}

	//删除
	BtnDelete(e) {
		if (this.state.subDataSource.length <= 0) {
			notification.error({
				message: '请选择数据！',
				duration: 2
			})
			return;
		}
		this.setState({ newKey3: Math.random() + 4, setDeleteVisiable: true });
	}
	setDeleteData() {
		const { deleteInfo } = this.props;
		console.log('vip-删除', deleteInfo);
		if (!deleteInfo) {
			notification.warning({
				message: '请填写删除原因！',
				duration: 2
			})
			return;
		}
		this.setState({
			setDeleteVisiable: false,
			selectedRowKeys: [],
			subDataSource: [],
		});
		notification.success({
			message: '申请成功！',
			duration: 2
		})
		const { actions: { DeleteRow } } = this.props;
        DeleteRow('');
	}

	//导出
	BtnExport(e) {
		console.log('vip-导出', e);
	}
	paginationOnChange(e) {
		console.log('vip-分页', e);
	}

	onSelectChange(selectedRowKeys, selectedRows) {
		this.state.subDataSource = selectedRows;
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	}
	render() {
		const columns = [
			{
				title: '序号',
				dataIndex: 'index',
				width: '10%',
			},
			{
				title: '单位工程',
				dataIndex: 'unitProject',
				width: '10%',
			},
			{
				title: '项目/子项目名称',
				dataIndex: 'projectName',
				width: '10%',
			}, {
				title: '方案名称',
				dataIndex: 'scenarioName',
				width: '15%',
			}, {
				title: '编制单位',
				dataIndex: 'organizationUnit',
				width: '10%',
			}, {
				title: '评审时间',
				dataIndex: 'reviewTime',
				width: '10%',
			}, {
				title: '评审意见',
				dataIndex: 'reviewComments',
				width: '10%',

			}, {
				title: '评审人员',
				dataIndex: 'reviewPerson',
				width: '10%',
			}, {
				title: '备注',
				dataIndex: 'remark',
				width: '15%',
			}
		];

		const paginationInfo = {
			onChange: this.paginationOnChange.bind(this),
			showSizeChanger: true, // 
			pageSizeOptions: ['10', '20', '30', '40', '50'],
			showQuickJumper: true,
			style: { float: "left", marginLeft: 100 },
		}
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange.bind(this),
			// onChange: (selectedRowKeys, selectedRows) => {
			// 	console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			// 	this.state.subDataSource = selectedRows;
			// },
			getCheckboxProps: record => ({
				disabled: record.name === 'Disabled User', 
			}),
		};
		return (
			<Main>
				<DynamicTitle title="安全专项" {...this.props} />
				<Content>
					<Row style={{ marginBottom: "30px" }}>
						<Col span={15}>
							<Button
								style={{ marginRight: "30px" }}
								onClick={this.BtnFillIn.bind(this)}
							>发起填报</Button>
							<Button
								style={{ marginRight: "30px" }}
								onClick={this.BtnChange.bind(this)}
							>申请变更</Button>
							<Button
								style={{ marginRight: "30px" }}
								onClick={this.BtnDelete.bind(this)}
							>申请删除</Button>
							<Button
								style={{ marginRight: "30px" }}
								onClick={this.BtnExport.bind(this)}
							>导出表格</Button>
							<Search
								placeholder="请输入内容"
								style={{ width: 200, marginLeft: "20px" }}
							/>
						</Col>
					</Row>
					<Row>
						<Table
							columns={columns}
							dataSource={this.state.dataSource}
							bordered
							pagination={paginationInfo}
							rowSelection={rowSelection}
						/>
					</Row>
					<Row>
						{
							!this.state.num ? <p></p>
								:
								(
									<Col span={3} style={{ position: 'relative', top: -40, fontSize: 12 }}>
										[共：{this.state.num}行]
									</Col>
								)
						}
					</Row>

				</Content>
				<Modal
					width={1280}
					key={this.state.newKey1}
					visible={this.state.setEditVisiable}
					onOk={this.setEditData.bind(this)}
					onCancel={this.goCancel.bind(this)}
				>
					<AddFile props={this.props} state={this.state} />
				</Modal>
				<Modal
					width={1280}
					key={this.state.newKey2}
					visible={this.state.setChangeVisiable}
					onOk={this.setChangeData.bind(this)}
					onCancel={this.goCancel.bind(this)}
				>
					<ChangeFile props={this.props} state={this.state} />
				</Modal>
				<Modal
					width={1280}
					key={this.state.newKey3}
					visible={this.state.setDeleteVisiable}
					onOk={this.setDeleteData.bind(this)}
					onCancel={this.goCancel.bind(this)}
				>
					<DeleteFile props={this.props} state={this.state} />
				</Modal>
			</Main>)
	}
};
export default Form.create()(SafetySpecial);