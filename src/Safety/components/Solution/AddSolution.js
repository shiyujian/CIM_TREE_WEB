import React, { Component } from 'react';

import { Input, Form, Spin, Upload, Icon, Button, Select, message, Cascader } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
export default class AddSolution extends Component {

	constructor(props) {
		super(props);
		this.state = {
			options: [],
			branch: {},
			subentry:{},

		};
	}

	componentDidMount() {
		console.log('vip-props', this.props);
		const {
            actions: {
                getPortions,
            }
        } = this.props.props;
		let code = this.props.state.project.code;
		let dataSet = [];
		debugger;
		getPortions({ code: code }).then((rep) => {
			console.log('vip-rep', rep);
			if (rep.children) {
				let projects = rep.children.map(item => {
					return (
						{
							value: JSON.stringify(item),
							label: item.obj_type_hum,
							isLeaf: false
						}
					)
				})
				this.setState({ options: projects });
			} else {
				//没有对应的信息，使用默认的 -- 需求查找不到返回空
				// let options= [
				// 	{
				// 		value: "rSction",
				// 		label: "研发部",
				// 		children: [
				// 			{
				// 				value: "A项目1",
				// 				label: "A项目1"
				// 			}
				// 			,
				// 			{
				// 				value: "A项目2",
				// 				label: "A项目2"
				// 			}
				// 			,
				// 		]
				// 	}
				// 	,
				// 	{
				// 		value: "infoSction",
				// 		label: "信息化部",
				// 		children: [
				// 			{
				// 				value: "B项目1",
				// 				label: "B项目1"
				// 			}
				// 			,
				// 			{
				// 				value: "B项目2",
				// 				label: "B项目2"
				// 			}
				// 			,
				// 		]
				// 	}
				// 	,
				// 	{
				// 		value: "applySction",
				// 		label: "应用部",
				// 		children: [
				// 			{
				// 				value: "C项目1",
				// 				label: "C项目1"
				// 			}
				// 			,
				// 			{
				// 				value: "C项目2",
				// 				label: "C项目2"
				// 			}
				// 			,
				// 		]
				// 	}
				// 	,
				// ];
				// this.setState({ options});
			}
		});
	}

	coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({ attachment: [e.file] });
		return e && e.fileList;
	}
	covertURLRelative = (originUrl) => {
		return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
	}

	beforeUploadPicFile = (file) => {
		const fileName = file.name;
		debugger
		// 上传图片到静态服务器
		const { actions: { uploadStaticFile, deleteStaticFile } } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
			console.log('uploadStaticFile: ', resp)
			if (!resp || !resp.id) {
				message.error('文件上传失败')
				return;
			};
			this.props.props.actions.setUploadFile(resp);
			const filedata = resp;
			filedata.a_file = this.covertURLRelative(filedata.a_file);
			filedata.download_url = this.covertURLRelative(filedata.a_file);
			const attachment = {
				size: resp.size,
				uid: filedata.id,
				name: resp.name,
				status: 'done',
				url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file: resp.a_file,
				download_url: resp.download_url,
				mime_type: resp.mime_type
			};
			this.props.props.form.setFieldsValue({ attachment: resp.id ? [attachment] : null })
		});
		return false;
	}

	render() {
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};
		const {
			form: { getFieldDecorator }
		} = this.props.props;
		return (
			<Form>
				<FormItem {...formItemLayout} label="专项方案">
					{getFieldDecorator('solution', {
						initialValue: this.props.state.solution,
						rules: [
							{ required: true, message: '请填写！' },
						]
					})(
						<Input type="text" />
						)}
				</FormItem>
				<FormItem {...formItemLayout} label="工程名称">
					{getFieldDecorator('projectName', {
						initialValue: this.props.state.unitProject.name,
						rules: [
							{ required: true, message: '未获取到工程名称！' },
						]
					})(
						<Input type="text" disabled />
						)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位" hasFeedback>
					{getFieldDecorator('constructionUnit', {
						initialValue: this.props.state.construct.name,
						rules: [
							{ required: true, message: '该单位工程无施工单位，请联系管理员！' },
						]
					})(
						<Input type="text" disabled placeholder="未获取到施工单位" />
						)}
				</FormItem>
				<FormItem {...formItemLayout} label="分部分项">
					{getFieldDecorator('portion', {
						rules: [
							{ required: true, message: '请选择分部分项！' },
						]
					}
						, {})
						(
						<Cascader
							// style={{ width: '300px' }}
							options={this.state.options}
							className='btn'
							loadData={this.loadData.bind(this)}
							onChange={this.onSelectProject.bind(this)}
							changeOnSelect
							placeholder="请选择分部分项！"
						/>
						)
					}
				</FormItem>
				<FormItem {...formItemLayout} label="上传文件">
					{getFieldDecorator('attachment', {
						rules: [
							{ required: true, message: '请上传一个文件！' },
						],
						valuePropName: 'fileList',
						getValueFromEvent: this.coverPicFile,
					}, {})(
						<Upload beforeUpload={this.beforeUploadPicFile.bind(this)}>
							<Button>
								<Icon type="upload" />添加文件
  							</Button>
						</Upload>
						)}
				</FormItem>
			</Form>
		)
	}
	onSelectProject(value, selectedOptions) {
		debugger;
		console.log('vip-value', value);
		console.log('vip-selectedOptions', selectedOptions);

		let branch = {}; //分部 外层Chilren
		let subentry = {}; // 分项 内层Chilren
		if (value.length === 2) {
			let temp1 = JSON.parse(value[0]);
			let temp2 = JSON.parse(value[1]);
			branch = {
				name: temp1.name,
				code: temp1.code,
				obj_type: temp1.obj_type,
				obj_type_hum: temp1.obj_type_hum,
			}
			subentry = {
				name: temp2.name,
				code: temp2.code,
				obj_type: temp1.obj_type,
				obj_type_hum: temp1.obj_type_hum,
			}
			this.setState({ branch, subentry });
			return;
		}
		this.setState({ branch: {}, subentry: {} });
	}

	loadData(selectedOptions) {
		debugger;
		const { actions: { getPortions } } = this.props.props;
		const targetOption = selectedOptions[selectedOptions.length - 1];
		targetOption.loading = true;

		let code = this.props.state.project.code;
		let dataSet = [];
		getPortions({ code: code }).then(rst => {
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
}
