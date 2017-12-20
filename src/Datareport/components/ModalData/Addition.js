import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API } from '_platform/api';
const Option = Select.Option;


export default class Addition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			users: [],
			projects: [],
			checkers:[]
		};
	}
	render() {
		const { addition = {}, actions: { changeAdditionField } } = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'numbers',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '编码',
			dataIndex: 'coding'
		}, {
			title: '项目/子项目',
			dataIndex: 'project',
			render:(record) => {
				return (
					<Select style={{ width: '120px' }}  onSelect={ele => {
						this.setState({ pro: ele })
					}}>
						{this.state.projects}
					</Select>
				)
			}

		}, {
			title: '单位工程',
			dataIndex: 'unitEngineering'
		}, {
			title: '模型名称',
			dataIndex: 'modelName'
		}, {
			title: '提交单位',
			dataIndex: 'submittingUnit'
		}, {
			title: '模型描述',
			dataIndex: 'modelDescription'
		}, {
			title: '模型类型',
			dataIndex: 'modeType',
			render: (text, record, index) => (
				<Select style={{ width: '120px' }} onSelect={this.handleSelect.bind(this, index, 'modeType')} value={this.state.dataSource[index]['modeType']}>
					<Option value="设计模型">设计模型</Option>
					<Option value="施工模型">施工模型</Option>
					<Option value="竣工模型">竣工模型</Option>
				</Select>
			),
		}, {
			title: 'fdb模型文件',
			dataIndex: 'fdbMode',

			render: (text, record, index) => {
				return (
					<span>
						<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index)}>
							<Button>
								<Icon type="upload" />上传附件
                            </Button>
						</Upload>
					</span>
				)
			}

		}, {
			title: 'tdbx模型文件',
			dataIndex: 'tdbxMode',
			render: (text, record, index) => {

				return (
					<span>
						<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index)}>
							<Button>
								<Icon type="upload" />上传附件
                            </Button>
						</Upload>
					</span>
				)
			}

		}, {
			title: '属性表',
			dataIndex: 'attributeTable',
			render: (text, record, index) => {

				return (
					<span>
						<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index)}>
							<Button>
								<Icon type="upload" />上传附件
                            </Button>
						</Upload>
					</span>
				)
			}
		}, {
			title: '上报时间',
			dataIndex: 'reportingTime'
		}, {
			title: '上报人',
			dataIndex: 'reportingName'
		}, {
			title: '操作',
			render: (text, record, index) => {
				return <span>
					<a className="fa fa-edit" style={{ fontSize: "20px", margin: '0 5px' }} onClick={this.edit.bind(this, record)}></a>
					<Popconfirm
						title={`确定删除?`}
						// onConfirm={this.handleDeleteRow.bind(this, record.value)}
						okText="是"
						cancelText="否"
					>
						<a className="fa fa-trash" style={{ fontSize: "20px", margin: '0 5px' }} ></a>
					</Popconfirm>
				</span>
			}
		}];
		//上传excel表格
		let jthis = this
		const props = {
			action: `${SERVICE_API}/excel/upload-api/` /*+ '?t_code=zjt-05'*/,
			headers: {
			},
			showUploadList: false,
			onChange(info) {
				if (info.file.status !== 'uploading') {
					// console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					let importData = info.file.response.Sheet1;
					let { dataSource } = jthis.state
					dataSource = jthis.handleExcelData(importData)
					jthis.setState({ dataSource })
					message.success(`${info.file.name} 上传成功`);
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name}解析失败，请检查输入`);
				}
			},
		};
		return (
			<Modal
				key={addition.key}
				title="模型信息上传表"
				width={1280}
				visible={addition.visible}
				maskClosable={false}
				onCancel={this.cancel.bind(this)}
				onOk={this.save.bind(this)}>
				<Button style={{ margin: '10px 10px 10px 0px' }} type="primary">模板下载</Button>
				<Row style={{ marginBottom: "10px",marginTop:'10px' }}>
					<Table
						bordered 
						columns={columns}
						dataSource={this.state.dataSource}
						/>
				</Row>
				<Row style={{ marginBottom: "30px" }} type="flex">
					<Col>
						<Upload {...props}>
							<Button style={{ marginRight: 30 }}>
								<Icon type="upload" />上传附件
							</Button>
						</Upload>
					</Col>
					<span>
						审核人：
                        <Select style={{ width: '200px' }} onSelect={ele => {
							this.setState({ passer: ele })
						}} >
							{
								this.state.checkers
							}
						</Select>
					</span>
					<Button type="primary" style={{ marginLeft: 20 }} onClick={this.onok.bind(this)}>提交</Button>
				</Row>
				<Row style={{ marginBottom: "30px" }}>
					<p><span>注：</span>1、请不要随意修改模板的列头、工作薄名称（sheet1）、列验证等内容。如某列数据有下拉列表，请按数据格式填写；</p>
					<p style={{ paddingLeft: "25px" }}>2、数值用半角阿拉伯数字，如：1.2</p>
					<p style={{ paddingLeft: "25px" }}>3、日期必须带年月日，如2017年1月1日</p>
					<p style={{ paddingLeft: "25px" }}>4、部分浏览器由于缓存原因未能在导入后正常显示导入数据，请尝试重新点击菜单打开页面并刷新。最佳浏览器为IE11.</p>
				</Row>
			</Modal>
		);
	}

	beforeUploadPicFile() {

	}

	edit() {

	}

	save() {

	}

	cancel() {
		const {
			actions: { clearAdditionField }
		} = this.props;
		clearAdditionField();
	}
	//解析excel表格数据
	handleExcelData(data) {
		data.shift()
		let res = data.map(item => {
			console.log('woshi', item)
			return {
				coding: item[1],
				
				modelName: item[4],
				modelDescription: item[6],
				modeType: item[7],
				reportingName: item[12],
			}
		})
		return res
	}
	//下拉框选择
	handleSelect(index, key, value) {
		const { dataSource } = this.state;

		dataSource[index][key] = value;
		// console.log('value', value)
		this.setState({ dataSource });
	}


	onok() {

		let ok = this.state.dataSource.some(ele => {
			return !ele.file;
		});
		// if (ok) {
		//     message.error('有附件未上传');
		//     return;
		// };
		if(this.state.dataSource.length === 0){
            message.info("请上传excel")
            return
        }
		if (!this.state.passer) {
			message.error('审批人未选择');
			return;
		}
		// if (!this.state.projects) {
		// 	message.error('项目/子项目未选择');
		// 	return;
		// }
		this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
		// message.info('发起流程成功')
	}


	componentDidMount() {
		const { actions: { getAllUsers, getProjects } } = this.props;
		getAllUsers().then(rst => {
			let users = [];
			if (rst.length) {
				let checkers = rst.map(o => {
					return (
						<Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
					)
				})
				this.setState({ checkers })
			}
		});
		getProjects().then(rst => {
            if (rst.children.length) {
                let projects = rst.children.map(item => {
                    return (
                        <Option value={JSON.stringify(item)}>{item.name}</Option>
                    )
                })
                this.setState({projects})
            }
        })
		
	}



	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
