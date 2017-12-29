import React, { Component } from 'react';

import {
	Input, Form, Spin, Upload, Icon, Button, Modal,
	Cascader, Select, Popconfirm, message, Table, Row, Col, notification
} from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
import Preview from '../../../_platform/components/layout/Preview';
import { getUser } from '_platform/auth';
import ECCB from '../EditCellWithCallBack';
const FormItem = Form.Item;
const Option = Select.Option;

export default class DesignChange extends Component {
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
	componentWillMount(){
		let dataSource = this.props.dataSourceSelected;
		let newdataSource = [];
		dataSource.map((item,key)=>{
			let newDatas = {
				key:key+1,
				code: item.code,
				volume:item.volume,
				name: item.name,
				major: item.major,
				factovertime: item.factovertime,
				factquantity: item.factquantity,
				uploads: item.uploads,
				designunit: item.designunit,
				unit: item.unit,
				project: item.project,
				delcode: item.delcode,
			}
			newdataSource.push(newDatas);
		})
		this.setState({dataSource:newdataSource});
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
		let newdataSource = [];
        dataSource.map((item,key)=>{
            let newDatas = {
				key:key+1,
				code: item.code,
				volume:item.volume,
				name: item.name,
				major: item.major,
				factovertime: item.factovertime,
				factquantity: item.factquantity,
				uploads: item.uploads,
				designunit: item.designunit,
				unit: item.unit,
				project: item.project,
				delcode: item.delcode,
			}
            newdataSource.push(newDatas)
        })
      this.setState({dataSource:newdataSource})  
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
			dataIndex:"key",
			key: "key",
		}, {
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			render: (record) => {
                let checkVal = (value) => {
                    record.volume = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.volume}
                        checkVal={checkVal}
                        value={record.volume} />
				)
			},
			key:"volume"
		}, {
			title: '名称',
			render: (record) => {
                let checkVal = (value) => {
                    record.name = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.name}
                        checkVal={checkVal}
                        value={record.name} />
				)
			},
			key:"Name"
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
			render: (record) => {
                let checkVal = (value) => {
                    record.factovertime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.factovertime}
                        checkVal={checkVal}
                        value={record.factovertime} />
				)
			},
			key:"factovertime"
		}, {
			title: '设计单位',
			dataIndex:"designunit",
		}, {
			title: '变更人员',
			dataIndex: 'uploads',
			render: (text, record, index) => {
				return <Input value={this.state.dataSource[index]['uploads'] = getUser().username} onChange={this.tableDataChange.bind(this, index, 'uploads')} />
			}
		}, {
			title: '操作',
			render: (text, record, index) => {
				return (
					<Popconfirm
						placement="leftTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, record.key-1)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				)
			}
		}];
		console.log("145",this.state.dataSource);
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
				<Preview />
			</Modal>
		)
	}
}
