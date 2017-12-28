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
	componentWillMount(){
		let dataSource = this.props.dataSourceSelected;
		let newdataSource = [];
		console.log("123",dataSource)
		dataSource.map((item,key)=>{
			console.log(item);
			let newDatas = {
				key:key+1,
				code: item.code,
				name: item.name,
				project:item.project,
				unit: item.unit,
				construct_unit: item.construct_unit,
				quantity: item.quantity,
				factquantity: item.factquantity,
				planstarttime: item.planstarttime,
				planovertime: item.planovertime,
				factstarttime: item.factstarttime,
				factovertime: item.factovertime,
				uploads: item.uploads,
				delcode: item.delcode,
				wpcode: item.wpcode,
				obj_type: item.obj_type,
				pk: item.pk,
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
				name: item.name,
				project:item.project,
				unit: item.unit,
				construct_unit: item.construct_unit,
				quantity: item.quantity,
				factquantity: item.factquantity,
				planstarttime: item.planstarttime,
				planovertime: item.planovertime,
				factstarttime: item.factstarttime,
				factovertime: item.factovertime,
				uploads: item.uploads,
				delcode: item.delcode,
				wpcode: item.wpcode,
				obj_type: item.obj_type,
				pk: item.pk,
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


	render() {
		const columns = [{
			title: '序号',
			dataIndex:"key"
		}, {
			title: 'WBS编码',
			dataIndex: 'code',
		}, {
			title: '任务名称',
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
			title: '实施单位',
			render: (record) => {
                let checkVal = (value) => {
                    record.construct_unit = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.construct_unit}
                        checkVal={checkVal}
                        value={record.construct_unit} />
				)
			},
			key:"construct_unit"
		}, {
			title: '施工图工程量',
			render: (record) => {
                let checkVal = (value) => {
                    record.quantity = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.quantity}
                        checkVal={checkVal}
                        value={record.quantity} />
				)
			},
			key:"quantity"
		}, {
			title: '实际工程量',
			render: (record) => {
                let checkVal = (value) => {
                    record.factquantity = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.factquantity}
                        checkVal={checkVal}
                        value={record.factquantity} />
				)
			},
			key:"factquantity"
		}, {
			title: '计划开始时间',
			render: (record) => {
                let checkVal = (value) => {
                    record.planstarttime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.planstarttime}
                        checkVal={checkVal}
                        value={record.planstarttime} />
				)
			},
			key:"planstarttime"
		}, {
			title: '计划结束时间',
			render: (record) => {
                let checkVal = (value) => {
                    record.planovertime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.planovertime}
                        checkVal={checkVal}
                        value={record.planovertime} />
				)
			},
			key:"planovertime"
		}, {
			title: '实际开始时间',
			render: (record) => {
                let checkVal = (value) => {
                    record.factstarttime = value;
                    return value;
                }
                return (
                    <ECCB
                        initCheckedValue={record.factstarttime}
                        checkVal={checkVal}
                        value={record.factstarttime} />
				)
			},
			key:"factstarttime"
		}, {
			title: '实际结束时间',
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
			title: '变更人员',
			dataIndex:"uploads",
			render: (text, record, index) => {
				return <Input value={this.state.dataSource[index]['uploads'] = getUser().username} onChange={this.tableDataChange.bind(this, index, 'uploads')}/>
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
				title="施工进度变更表"
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
					rowkey='key'
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
