import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload } from 'antd';
import Card from '_platform/components/panels/Card';
import { UPLOAD_API, SERVICE_API, FILE_API } from '_platform/api';
const Option = Select.Option;


export default class Addition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
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
			dataIndex: 'project'
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
			
			render:(text,record,index) => {
				
                    return (
                        <span>
                        <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this,index)}>
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
			render:(text,record,index) => {
				
                    return (
                        <span>
                        <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this,index)}>
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
			render:(text,record,index) => {
				
                    return (
                        <span>
                        <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this,index)}>
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
				key={this.props.akey}
				width={1280}
				visible={addition.visible}
				onCancel={this.cancel.bind(this)}
				onOk={this.save.bind(this)}>


				<Row style={{ marginBottom: "30px" }}>
					<h3 style={{ textAlign: "center" }}>结果审核</h3>
				</Row>
				<Row style={{ marginBottom: "30px" }}>
					<Table bordered columns={columns} dataSource={this.state.dataSource} />
				</Row>
				<Row style={{ marginBottom: "30px" }} type="flex">
					<Col><Button style={{ marginRight: "30px" }}>模板下载</Button></Col>
					<Col>
						<Select style={{ marginRight: "30px" }} defaultValue="项目1">
							<Option value="项目1">项目1</Option>
							<Option value="项目2">项目2</Option>
						</Select>
					</Col>
					<Col>
						<Upload {...props}>
							<Button style={{ marginRight: 30 }}>
								<Icon type="upload" />上传附件
							</Button>
						</Upload>
					</Col>
					<Col><Input placeholder="文件路径" style={{ width: "200px", marginRight: "30px" }} /></Col>
					<Col><Button style={{ marginRight: "50px" }}>上传并预览</Button></Col>
					<Col>导入方式:&emsp;</Col>
					<Col>
						<Select style={{ marginRight: "30px" }} defaultValue="1">
							<Option value="1">不导入重复的数据</Option>
							<Option value="2">项导入重复的数据</Option>
						</Select>
					</Col>
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

	save() {

	}

	edit() {

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
				coding:item[1],
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
		console.log('value',value)
		this.setState({ dataSource });
	}
	//上传之前检查
	beforeUploadPicFile() {

	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
