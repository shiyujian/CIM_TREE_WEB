import React, { Component } from 'react';

import {
	Input, Form, Spin, Upload, Icon, Button, Modal,
	Cascader, Select, Popconfirm, message, Table, Row, Col, notification
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
export default class DesignDel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: this.props.dataSourceSelected,
			checkers: [],//审核人下来框选项
			check: null,//审核人
			project: {},
			unit: {},
			options: [],
			deleteInfo:"",
		};
	}
	componentWillMount() {
		let dataSource = this.props.dataSourceSelected;
		let newdataSource = [];
		dataSource.map((item, key) => {
			let newDatas = {
				key: key + 1,
				code: item.code,
				volume: item.volume,
				name: item.name,
				major: item.major,
				factovertime: item.factovertime,
				factquantity: item.factquantity,
				uploads: item.uploads,
				designunit: item.designunit,
				remarks:item.remarks,
				unit: item.unit,
				project: item.project,
				delcode: item.delcode,
			}
			newdataSource.push(newDatas);
		})
		this.setState({ dataSource: newdataSource });
	}
	componentDidMount() {
		const { actions: { getAllUsers } } = this.props;
		getAllUsers().then(rst => {
			let checkers = rst.map((o,index) => {
				return (
					<Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
				)
			})
			this.setState({ checkers })
		})
	}
	//下拉框选择人
	selectChecker(value) {
		let check = JSON.parse(value);
		this.setState({ check })
	}
	onChangeText(e) {
        this.setState({
            deleteInfo: e.target.value
        });
    }
	onok() {
		let {dataSource} = this.state;
		if (!this.state.check) {
			notification.warning({
				message: '请选择审核人！',
				duration: 2
			});
			return;
		}
		if (!this.state.deleteInfo.length) {
            notification.warning({
				message: '请填写删除原因！',
				duration: 2
			});
            return;
        }

        dataSource[0].deleteInfo = this.state.deleteInfo.trim();
		let { check } = this.state;
		let per = {
			id: check.id,
			username: check.username,
			person_name: check.account.person_name,
			person_code: check.account.person_code,
			organization: check.account.organization
		}
		this.props.onok(this.state.dataSource, per);
	}

	//删除
	delete(index) {
		let { dataSource } = this.state;
		dataSource.splice(index, 1);
		let newdataSource = [];
		dataSource.map((item, key) => {
			let newDatas = {
				key: key + 1,
				code: item.code,
				volume: item.volume,
				name: item.name,
				major: item.major,
				factovertime: item.factovertime,
				factquantity: item.factquantity,
				uploads: item.uploads,
				designunit: item.designunit,
				remarks:item.remarks,
				unit: item.unit,
				project: item.project,
				delcode: item.delcode,
			}
			newdataSource.push(newDatas)
		})
		this.setState({ dataSource: newdataSource })
	}
	render() {
		const columns = [{
			title: '序号',
			dataIndex: "key",
		}, {
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			dataIndex: 'volume',
		}, {
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '项目/子项目',
			dataIndex: 'project',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '专业',
			dataIndex: 'major',
		}, {
			title: '实际供图时间',
			dataIndex: 'factovertime',
		}, {
			title: '设计单位',
			dataIndex: 'designunit',
		}, {
			title: '上传人员',
			dataIndex: 'uploads',
		}, {
			title: '备注',
			dataIndex: 'remarks',
		}, {
			title: '操作',
			render: (text, record, index) => {
				return (
					<Popconfirm
						placement="leftTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, record.key - 1)}
						okText="确认"
						cancelText="取消">
						<a><Icon type = "delete"/></a>
					</Popconfirm>
				)
			}
		}];

		return (
			<Modal
				visible={true}
				width={1280}
				onOk={this.onok.bind(this)}
				maskClosable={false}
				onCancel={this.props.oncancel}
			>
				<h1 style={{ textAlign: "center", marginBottom: "20px" }}>申请删除</h1>
				<Table
					columns={columns}
					dataSource={this.state.dataSource}
					bordered
					pagination={{ pageSize: 10 }}
					rowKey="key"
				/>
				<Row style={{ marginBottom: "30px" }} type="flex">
					<Col>
						<span>
							审核人：
						<Select style={{ width: '200px' }} className="btn" onSelect={this.selectChecker.bind(this)}>
								{
									this.state.checkers
								}
							</Select>
						</span>
					</Col>
				</Row>
				<Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>删除原因：</span>
					</Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} style={{ resize: "none"}} onChange={this.onChangeText.bind(this)}/>
				    </Col>
			    </Row>
				<Preview />
			</Modal>
		)
	}
}
