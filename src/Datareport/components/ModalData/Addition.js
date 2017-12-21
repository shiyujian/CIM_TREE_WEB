import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, WORKFLOW_CODE } from '_platform/api';
const Option = Select.Option;
var moment = require('moment');

export default class Addition extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			users: [],
			projects: [],
			units:[]
		};
	}
	componentDidMount() {
		const { actions: { getAllUsers, getProjectTree } } = this.props;
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
		getProjectTree().then(rst => {
            if (rst.children.length) {
                let projects = rst.children.map(item => {
                    return (
                        <Option value={JSON.stringify(item)}>{item.name}</Option>
                    )
                })
                this.setState({
                    projects
                })
            }
        })


	}

	 //下拉框选择人
	 selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
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
			dataIndex: 'coding'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'project',
			render:(record) => {
                return (
                    <Select style={{width:"90%"}} onSelect={this.ProSelect.bind(this)}>
                        {this.state.projects}
                    </Select>
                )
            }


		}, {
			title: '单位工程',
			dataIndex: 'unit',
			render:(record) => {
                return (
                   
                    <Select style={{width:"90%"}}  onSelect={ele => {
                            
                            console.log('this.state',this.state);
                        }}>
                        {this.state.units.map(r=>{
                            return(
                                <Option value={r.code} key={r.code}>
                                    {r.name}
                                </Option>
                            )
                        })}
                    </Select>
                )

			}

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
			// render: (text, record, index) => {

			// 	return (
			// 		<span>
			// 			<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index)}>
			// 				<Button>
			// 					<Icon type="upload" />上传附件
			//                 </Button>
			// 			</Upload>
			// 		</span>
			// 	)
			// }

		}, {
			title: '属性表',
			dataIndex: 'attributeTable',
			// render: (text, record, index) => {

			// 	return (
			// 		<span>
			// 			<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, index)}>
			// 				<Button>
			// 					<Icon type="upload" />上传附件
			//                 </Button>
			// 			</Upload>
			// 		</span>
			// 	)
			// }
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

	ProSelect(eye){
        this.setState({ pro: JSON.parse(eye).name ,units:JSON.parse(eye).children})
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
		data.splice(0, 1);
		let res = data.map(item => {
			console.log('woshi', item)
			return {
				coding: item[1],
				unitEngineering: item[3],
				modelName: item[4],
				submittingUnit: item[5],
				modelDescription: item[6],
				modeType: item[7],
				tdbxMode: item[9],
				attributeTable: item[10],
				reportingName: item[12],
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
		// let rate = dataSource[index].rate
		// let level = dataSource[index].level
		// dataSource[index] = {


		// 	modelName: modelName,
		// 	modelDescription: modelDescription,
		// 	modeType: modeType,
		// 	reportingName:reportingName,
		// 	file: {
		// 	}
		// }

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
	// //根据附件名称 也就是wbs编码获取其他信息
	// async getInfo(code) {
	// 	console.log(this.props)
	// 	let res = {};
	// 	const { actions: { getWorkPackageDetail } } = this.props
	// 	let jianyanpi = await getWorkPackageDetail({ code: code })
	// 	res.name = jianyanpi.name
	// 	res.code = jianyanpi.code
	// 	res.pk = jianyanpi.pk
	// 	res.obj_type = jianyanpi.obj_type
	// 	res.related_documents = jianyanpi.related_documents
	// 	let fenxiang = await getWorkPackageDetail({ code: jianyanpi.parent.code })
	// 	if (fenxiang.parent.obj_type_hum === "子分部工程") {
	// 		let zifenbu = await getWorkPackageDetail({ code: fenxiang.parent.code })
	// 		let fenbu = await getWorkPackageDetail({ code: zifenbu.parent.code })
	// 		let zidanwei = {}, danwei = {};
	// 		if (fenbu.parent.obj_type_hum === "子单位工程") {
	// 			zidanwei = await getWorkPackageDetail({ code: fenbu.parent.code })
	// 			danwei = await getWorkPackageDetail({ code: zidanwei.parent.code })

	// 		} else {
	// 			danwei = await getWorkPackageDetail({ code: fenbu.parent.code })
	// 		}
	// 		let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
	// 		res.construct_unit = construct_unit
	// 		res.unit = {
	// 			name: danwei.name,
	// 			code: danwei.code,
	// 			obj_type: danwei.obj_type
	// 		}
	// 		res.project = danwei.parent
	// 	} else {
	// 		let fenbu = await getWorkPackageDetail({ code: fenxiang.parent.code })
	// 		let zidanwei = {}, danwei = {};
	// 		if (fenbu.parent.obj_type_hum === "子单位工程") {
	// 			zidanwei = await getWorkPackageDetail({ code: fenbu.parent.code })
	// 			danwei = await getWorkPackageDetail({ code: zidanwei.parent.code })

	// 		} else {
	// 			danwei = await getWorkPackageDetail({ code: fenbu.parent.code })
	// 		}
	// 		let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
	// 		res.construct_unit = construct_unit
	// 		res.unit = {
	// 			name: danwei.name,
	// 			code: danwei.code,
	// 			obj_type: danwei.obj_type
	// 		}
	// 		res.project = danwei.parent
	// 	}
	// 	return res
	// }


	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
