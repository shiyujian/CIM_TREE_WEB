import React, { Component } from 'react';

import {
	Input, Form, Spin, Upload, Icon, Button, Modal,
	Cascader, Select, Popconfirm, message, Table, Row, Col, notification
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

export default class WorkChange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: this.props.dataSourceSelected,
			checkers: [],//审核人下来框选项
			check: null,//审核人
			project: {},
			unit: {},
			options: [],
		};
	}
	componentDidMount() {
		const { actions: { getAllUsers } } = this.props;
		getAllUsers().then(rst => {
			let checkers = rst.map(o => {
				return (
					<Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
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
	onok() {
		if (!this.state.check) {
			message.info("请选择审核人")
			return;
		}
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
		this.setState({ dataSource });
	}
	//table input 输入
	tableDataChange(index, key, e) {
		const { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
		this.setState({ dataSource });
	}
	//下拉框选择变化
    handleSelect(index, key, value) {
        const { dataSource } = this.state;
        dataSource[index][key] = value;
        this.setState({ dataSource });
    }


	render() {
		const columns = [{
			title: '序号',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			dataIndex: 'volume',
			render: (text, record, index) => {
				return <Input value={this.state.dataSource[index]['volume']} onChange={this.tableDataChange.bind(this, index, 'volume')} />
			}
		}, {
			title: '名称',
			dataIndex: 'name',
			render: (text, record, index) => {
				return <Input value={this.state.dataSource[index]['name']} onChange={this.tableDataChange.bind(this, index, 'name')} />
			}
		}, {
			title: '项目/子项目',
			dataIndex: 'project',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '专业',
			dataIndex: 'major',
			width: "140px",
			render: (text, record, index) => (
				<Select style={{ width: '120px' }} onSelect={this.handleSelect.bind(this, index, 'major')} value={this.state.dataSource[index]['major']}>
					<Option value="图纸">图纸</Option>
					<Option value="报告">报告</Option>
				</Select>
			),

		}, {
			title: '实际供图时间',
			dataIndex: 'factovertime',
			render: (text, record, index) => {
				return <Input value={this.state.dataSource[index]['factovertime']} onChange={this.tableDataChange.bind(this, index, 'factovertime')} />
			}
		}, {
			title: '设计单位',
			dataIndex: 'designunit',
			render: (text, record, index) => {
				return <Input value={this.state.dataSource[index]['designunit']} onChange={this.tableDataChange.bind(this, index, 'designunit')} />
			}
		}, {
			title: '变更人员',
			dataIndex: 'editors',
			render: (text, record, index) => {
				return <span>{getUser().username}</span>
			}
		}, {
			title: '操作',
			render: (text, record, index) => {
				return (
					<Popconfirm
						placement="leftTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, index)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				)
			}
		}];

		return (
			<Modal
				title="设计进度变更表"
				visible={true}
				width={1280}
				onOk={this.onok.bind(this)}
				maskClosable={false}
				onCancel={this.props.oncancel}>
				<Table
					columns={columns}
					dataSource={this.state.dataSource}
					bordered
					pagination={{ pageSize: 10 }}
					rowKey={(record) => {
						return record.index
					}}
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
				<Preview />
			</Modal>
		)
	}
}
