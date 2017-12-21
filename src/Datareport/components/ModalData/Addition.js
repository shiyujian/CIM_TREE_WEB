import React, { Component } from 'react';
import { Input, Form, Spin, Upload, Icon, Button, Modal, Cascader, Select, Popconfirm, message, Table, Row, Col, notification } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import '../../containers/quality.less';
const Option = Select.Option;
const FormItem = Form.Item;
var moment = require('moment');

export default class Addition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			checkers: [],//审核人下来框选项
			check: null,//审核人
			project: {},
			unit: {},
			options: [],
		};
	}

	componentDidMount() {
		const { actions: { getAllUsers, getProjectTree } } = this.props;
		getAllUsers().then(rst => {
			let checkers = rst.map(o => {
				return (
					<Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
				)
			})
			this.setState({ checkers })
		})
		getProjectTree({ depth: 1 }).then(rst => {
			if (rst.status) {
				let projects = rst.children.map(item => {
					return (
						{
							value: JSON.stringify(item),
							label: item.name,
							isLeaf: false
						}
					)
				})
				this.setState({ options: projects });
			} else {
				//获取项目信息失败
			}
		});
	}

	beforeUpload = (info) => {
		if (info.name.indexOf("xls") !== -1 || info.name.indexOf("xlsx") !== -1) {
			return true;
		} else {
			notification.warning({
				message: '只能上传Excel文件！',
				duration: 2
			});
			return false;
		}
	}

	uplodachange = (info) => {
		//info.file.status/response
		if (info && info.file && info.file.status === 'done') {
			notification.success({
				message: '上传成功！',
				duration: 2
			});
			let name = Object.keys(info.file.response);
			let dataList = info.file.response[name[0]];
			let dataSource = [];
			for (let i = 1; i < dataList.length; i++) {
				dataSource.push({
					code: dataList[i][1] ? dataList[i][1] : '',
					modelName: dataList[i][2] ? dataList[i][2] : '',
					submittingUnit: dataList[i][3] ? dataList[i][3] : '',
					modelDescription: dataList[i][4] ? dataList[i][4] : '',
					modeType: dataList[i][5] ? dataList[i][5] : '',
					fdbMode: dataList[i][6] ? dataList[i][6] : '',
					tdbxMode: dataList[i][7] ? dataList[i][7] : '',
					attributeTable: dataList[i][8] ? dataList[i][8] : '',
					reportingTime: dataList[i][9] ? dataList[i][9] : '',
					reportingName: dataList[i][10] ? dataList[i][10] : '',

					project: {
						code: "",
						name: "",
						obj_type: ""
					},
					unit: {
						code: "",
						name: "",
						obj_type: ""
					},
					file: {

					}

				})
			}
			this.setState({ dataSource });
		}
	}

	//下拉框选择人
	selectChecker(value) {
		let check = JSON.parse(value)
		this.setState({ check })
	}

	onSelectProject = (value, selectedOptions) => {
		let project = {};
		let unit = {};
		if (value.length === 2) {
			let temp1 = JSON.parse(value[0]);
			let temp2 = JSON.parse(value[1]);
			project = {
				name: temp1.name,
				code: temp1.code,
				obj_type: temp1.obj_type
			}
			unit = {
				name: temp2.name,
				code: temp2.code,
				obj_type: temp2.obj_type
			}
			this.setState({ project, unit });
			return;
		}
		//must choose all,otherwise make it null
		this.setState({ project: {}, unit: {} });
	}

	loadData = (selectedOptions) => {
		const { actions: { getProjectTree } } = this.props;
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;
		getProjectTree({ depth: 2 }).then(rst => {
			if (rst.status) {
				let units = [];
				rst.children.map(item => {
					if (item.code === JSON.parse(targetOption.value).code) {  //当前选中项目
						units = item.children.map(unit => {
							return (
								{
									value: JSON.stringify(unit),
									label: unit.name
								}
							)
						})
					}
				})
				targetOption.loading = false;
				targetOption.children = units;
				this.setState({ options: [...this.state.options] })
			} else {
				//获取项目信息失败
			}
		});
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
			title: '模型编码',
			dataIndex: 'code'
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
			title: 'fdb模型',
			dataIndex: 'fdbMode',

			render: (text, record, index) => {
				if (record.file.id) {
					return (<span>
						<a onClick={this.handlePreview.bind(this, index)}>预览</a>
						<span className="ant-divider" />
						<Popconfirm
							placement="leftTop"
							title="确定删除吗？"
							onConfirm={this.remove.bind(this, index)}
							okText="确认"
							cancelText="取消">
							<a>删除</a>
						</Popconfirm>
					</span>)
				} else {
					return (
						<span>
							<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, record)}>

								<Button>
									<Icon type="upload" />上传附件
                            </Button>
							</Upload>
						</span>
					)
				}
			}

		}, {
			title: 'tdbx模型',
			dataIndex: 'tdbxMode',

		}, {
			title: '属性表',
			dataIndex: 'attributeTable',

		}, {
			title: '上报时间',
			dataIndex: 'reportingTime'
		}, {
			title: '上报人',
			dataIndex: 'reportingName'
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
				onOk={this.onok.bind(this)}>
				<Button style={{ margin: '10px 10px 10px 0px' }} type="primary">模板下载</Button>
				<Row style={{ marginBottom: "10px", marginTop: '10px' }}>
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource}
					/>
				</Row>
				<Row style={{ marginBottom: "30px" }} type="flex">
					<Col>
						<Upload {...props} onChange={this.uplodachange.bind(this)}>
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
					<Col>
						<span>
							项目-单位工程：
                        <Cascader
								options={this.state.options}
								className='btn'
								loadData={this.loadData.bind(this)}
								onChange={this.onSelectProject.bind(this)}
								changeOnSelect
							/>
						</span>
					</Col>

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

	ProSelect(eye) {
		this.setState({ pro: JSON.parse(eye).name, units: JSON.parse(eye).children })
	}
	//点击取消返回
	cancel() {
		const {
			actions: { clearAdditionField }
		} = this.props;
		clearAdditionField();
	}
	//解析excel表格数据
	handleExcelData(data) {
		data.splice(0, 1);
		let res = data.map(item => {
			console.log('woshi', item)
			return {
				code: item[1],
				// unitEngineering: item[3],
				modelName: item[2],
				submittingUnit: item[3],
				modelDescription: item[4],
				modeType: item[5],
				tdbxMode: item[7],
				attributeTable: item[8],
				reportingName: item[10],
				file: {

				}
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
		const { actions: { changeAdditionField } } = this.props;
		let ok = this.state.dataSource.some(ele => {
			return !ele.file;
		});
		// if (ok) {
		//     message.error('有附件未上传');
		//     return;
		// };
		let temp = this.state.dataSource.some((o, index) => {
			return !o.file.id
		})
		if (temp) {
			message.info(`有数据未上传附件`)
			return
		}
		if (this.state.dataSource.length === 0) {
			message.info("请上传excel")
			return
		}
		if (!this.state.passer) {
			message.error('审批人未选择');
			return;
		}

		this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
		changeAdditionField('visible', false);
	}
	//预览
	handlePreview(index) {
		const { actions: { openPreview } } = this.props;
		let f = this.state.dataSource[index].file
		let filed = {}
		filed.misc = f.misc;
		filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.name = f.name;
		filed.mime_type = f.mime_type;
		openPreview(filed);
	}
	covertURLRelative = (originUrl) => {
		return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
	}

	//删除
	delete(index) {
		let { dataSource } = this.state
		dataSource.splice(index, 1)
		this.setState({ dataSource })
	}

	//附件删除
	remove(index) {
		const { actions: { deleteStaticFile, changeAdditionField } } = this.props
		let { dataSource } = this.state
		let id = dataSource[index]['file'].id
		deleteStaticFile({ id: id })

		dataSource[index].file = ''
		changeAdditionField('dataSource', dataSource)

		this.setState({ dataSource })
	}

	//附件上传
	beforeUploadPicFile(record, file) {
		// console.log(record, file);
		const fileName = file.name;
		// 上传到静态服务器
		const { actions: { uploadStaticFile } } = this.props;
		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);
		let myHeaders = new Headers();
		let myInit = {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		};
		//uploadStaticFile({}, formdata)
		fetch(`${FILE_API}/api/user/files/`, myInit).then(async resp => {
			let loadedFile = await resp.json();
			loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
			loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
			record.file = loadedFile;
			record.code = file.name.substring(0, file.name.lastIndexOf('.'));
			this.forceUpdate();
		});
		return false;
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
