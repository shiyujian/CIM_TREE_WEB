import React, {Component} from 'react';
import {Modal, Form, Input, Upload, Icon, Row, Col, Button, Select, message} from 'antd';
// import {getUser} from '../../../_platform/auth';
import {base, STATIC_DOWNLOAD_API, SOURCE_API, FILE_API} from '../../../_platform/api';
// import CodePicker from '_platform/components/panels/CodePicker';

const FormItem = Form.Item;
const Option = Select.Option;

class ToggleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coordinates: [],
			fileList: [],
			imagesList: [],
			buildCode:'',
		}
	}
	componentDidMount() {
		const {
			actions: {postUploadFilesAc},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false
			},
			form: {setFieldsValue},
			projectList = [],
			selectProject,
		} = this.props;
		console.log("this.props:",this.props);		
	}
	_setImages(images=[]) {
		let urls = [];
		images.map(image => {
			let newFile = {
				uid: image.id,
				name: image.name,
				status: 'done',
				url: SOURCE_API + image.a_file,
				image: image
			};
			urls.push(newFile)
		});
		return urls;
	}
	uploadProps = {
		name: 'a_file',
		multiple: true,
		showUploadList: false,
		action: `${FILE_API}/api/user/files/`,
		onChange: ({file}) => {
			const status = file.status;
			if (status === 'done') {
				const {actions: {postUploadFilesAc}} = this.props;
				let newFile = {
					download_url: '/media' + file.response.download_url.split('/media')[1],
					a_file: '/media' + file.response.a_file.split('/media')[1]
				};
				postUploadFilesAc([{...file.response, ...newFile}])
			}
		},
	};
	
	imagesProps = {
		name: 'a_file',
		multiple: true,
		listType: 'picture-card',
		action: base + "/service/fileserver/api/user/files/",
		onChange: ({fileList}) => {
			this.setState({
				imagesList: fileList
			})
		},
	};
	closeModal() {
		const {actions: {toggleModalAc, postUploadFilesAc}} = this.props;
		postUploadFilesAc([]);
		toggleModalAc({
			type: null,
			visible: false,
		});
	}

	//生成新的图片列表
	_getImagesUrl(files=[]) {
		let urls = [];
		files.map(file => {
			if (file.response) {
				let newFile = {
					download_url: '/media' + file.response.download_url.split('/media')[1],
					a_file: '/media' + file.response.a_file.split('/media')[1]
				};
				urls.push({...file.response, ...newFile})
			} else {
				urls.push(file.image)
			}
		});
		return urls;
	}

	//新增项目或编辑项目
	postProjectData() {
		const {
			actions: {postProjectAc, putProjectAc, getProjectAc, postDirAc, postInstance, postLogEvent, postLocationAc},
			form: {validateFields},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			selectProject,
			parentProject,
			projectList = [],
			// examines = [],
			fileList = [],
			dirRootInfo={},
			locRootInfo={}
		} = this.props;
		// 里面的values是表单中输入框的值
		validateFields((err, values) => {
			console.log(err)
			if (!err) {
				if (fileList.length === 0) {
					message.warning('请上传项目文件！')
					return
				}
				if (this.state.imagesList.length === 0) {
					message.warning('请上传相关图片！')
					return
				}
				//新增项目
				if (toggleData.type === 'ADD') {
					let postProject = {
						"name": values["name"],
						"code": values["code"],
						// "code": values["code"],
						"obj_type": "C_PJ",
						"status": "A",
						"version": "A",
						"extra_params": {
							"desc": values["desc"],
							"file_info": fileList[0],
							"images": this._getImagesUrl(this.state.imagesList)
						},
						"parent": {
							"pk": parentProject["pk"],
							"code": parentProject["code"],
							"obj_type": parentProject["obj_type"]
						},
						"response_orgs": [],
					};
					// 创建项目
					postProjectAc({}, postProject)
						.then(rst => {
							if (rst && rst.code) {
								message.success('新增项目成功！');
								getProjectAc();
								this.closeModal();
							}else{
								message.error("新增项目失败！")
							}
						})
				} else { //编辑项目
					let projectInfo = projectList.filter(project => project.code === (!selectProject ? '' : selectProject.split('--')[0]))[0] || {};
					let editData = {
						"status": "A",
						"version": "A",
						"extra_params":
							{
								...projectInfo.extra_params,
								...{
									"desc": values["desc"],
									"file_info": fileList[0],
									"images": this._getImagesUrl(this.state.imagesList)
								}
							},
						"response_orgs": projectInfo.response_orgs || [],
					};
					console.log(editData.extra_params.images)
					putProjectAc({code: projectInfo.code}, editData)
						.then(rst => {
							if (rst && rst.code) {
								message.success('编辑项目成功！');
								getProjectAc();
								this.closeModal();
							}else{
								message.error("编辑项目失败！")
							}
						})
				}
			}
		});
	}
	render() {
		const {
			form: {getFieldDecorator},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			fileList = [],
		} = this.props;
		const formItemLayout = {
			labelCol: {span: 4},
			wrapperCol: {span: 18},
		};
		return (
			<Modal
				title={toggleData.type === 'ADD' ? '新增项目' : '编辑项目'}
				visible={toggleData.visible}
				width="80%"
				maskClosable={false}
				onOk={this.postProjectData.bind(this)}
				onCancel={this.closeModal.bind(this)}
			>
				<div>
					<Form>
						<Row>
							<Col>
								<FormItem {...formItemLayout} label="项目名称">
									{getFieldDecorator('name', {
										rules: [{required: false, message: '请输入项目名称'}],
										initialValue: ''
									})(
										<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="项目名称"/>
									)}
								</FormItem>
							
                                    <FormItem {...formItemLayout} label="项目编码">
                                    {getFieldDecorator('code', {
                                        rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
                                        initialValue: ''
                                    })(
										<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="项目名称"/>
                                    )}
                                    </FormItem>

								<FormItem {...formItemLayout} label="项目简介">
									{getFieldDecorator('desc', {
										rules: [{required: true, message: '请输入项目简介'}],
										initialValue: ''
									})(
										<Input type="textarea" rows={4} placeholder="项目简介"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="相关图片">
									{getFieldDecorator('images', {
										rules: [{required: true, message: '请输入相关图片'}],
										initialValue: ''
									})(
										<Upload {...this.imagesProps} fileList={this.state.imagesList}>
											<div>
												<Icon type="plus"/>
												<div className="ant-upload-text">上传图片</div>
											</div>
										</Upload>
									)}
								</FormItem>
								<Row style={{marginBottom: '20px'}}>
									<Col span={4}>
										<div style={{ textAlign: 'right', paddingRight: '8px' }}><i
											style={{ color: 'red' }}>*</i>&nbsp;相关文档:
										</div>
									</Col>
									<Col span={18}>
										<Row>
											<Col span={6}>
												<Upload {...this.uploadProps}>
													<Button>
														<Icon type="upload"/>上传文档
													</Button>
												</Upload>
											</Col>
											<Col span={6}>
												{
													fileList.map((file, index) => {
														return <div key={index}>{file.name}</div>
													})
												}
											</Col>
										</Row>

									</Col>
								</Row>
								
							</Col>
						</Row>
					</Form>
				</div>
			</Modal>
		);
	}

	changeCode(code){
		this.setState({
			buildCode:code
		})
	}
}
export default Form.create()(ToggleModal)
