import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, Row, Col, Button, Table, message, Progress } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '../../../_platform/auth';
import { base, STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import E from 'wangeditor'
let fileTypes = 'application/mp4,application/3gpp,application/wmv,video/mp4,video/ogg,video/webm';

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const { TextArea } = Input;

class VideoText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: "",
			progress: 0,
		}
	}

	componentDidMount() {
		const elem = this.refs.editorElem;
		editor = new E(elem);
		// 使用 onchange 函数监听内容的变化，并实时更新到 state 中
		editor.customConfig.onchange = html => {
			this.setState({
				content: html
			})
		};
		editor.customConfig.zIndex = 900;
		editor.customConfig.uploadImgTimeout = 15000;
		editor.customConfig.uploadImgServer = base + "/service/fileserver/api/user/files/";
		editor.customConfig.uploadFileName = 'a_file';
		editor.customConfig.uploadImgMaxLength = 1;
		editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
		editor.customConfig.menus = [
			'head',  // 标题
			'bold',  // 粗体
			'italic',  // 斜体
			'underline',  // 下划线
			'strikeThrough',  // 删除线
			'foreColor',  // 文字颜色
			'backColor',  // 背景颜色
			'link',  // 插入链接
			'list',  // 列表
			'justify',  // 对齐方式
			// 'quote',  // 引用
			// 'emoticon',  // 表情
			'image',  // 插入图片
			'table',  // 表格
			'video',  // 插入视频
			// 'code',  // 插入代码
			'undo',  // 撤销
			'redo'  // 重复
		]
		editor.customConfig.uploadImgHooks = {
			before: function (xhr, editor, files) {
			},
			success: function (xhr, editor, result) {
			},
			fail: function (xhr, editor, result) {
			},
			error: function (xhr, editor) {
			},
			timeout: function (xhr, editor) {
			},
			customInsert: function (insertImg, result, editor) {
				let url = SOURCE_API + "/media/" + result.a_file.split('/media/')[1]
				insertImg(url)
			}
		};
		editor.customConfig.customAlert = function (info) {
			alert(info + ' \n\n如果粘贴无效，请使用图片上传功能进行上传');
		}
		editor.create();

		const {
			actions: { postUploadFiles },
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
				editData: null
			},
			form: { setFieldsValue }
		} = this.props;
		if (toggleData.type === 'NEWS' && toggleData.status === 'EDIT') {
			postUploadFiles(toggleData.editData.attachment.fileList)
			this.setState({
				content: toggleData.editData.raw
			});
			editor.txt.html(toggleData.editData.raw)
			setFieldsValue({
				'title': toggleData.editData.title,
				'abstract': toggleData.editData.abstract
			})
		}
	}
	uploadProps = {
		name: 'a_file',
		multiple: true,
		showUploadList: false,
		action: base + "/service/fileserver/api/user/files/",
		beforeUpload: () => {
			this.setState({ progress: 0 });
		},
		onChange: ({ file, event }) => {
			const status = file.status;
			if (status === 'done') {
				const { actions: { postUploadFiles }, fileList = [] } = this.props;
				let newFileList = fileList;
				let newFile = {
					name: file.name,
					down_file: STATIC_DOWNLOAD_API + "/media" + file.response.download_url.split('/media')[1]
				};
				newFileList = newFileList.concat(newFile);
				console.log(newFileList)
				// postUploadVideo(newFileList)
				postUploadFiles(newFileList)
			}
			if (event) {
				let { percent } = event;
				if (percent !== undefined)
					this.setState({ progress: parseFloat(percent.toFixed(1)) });
			}
		},
	};

	//modal显示与影藏
	modalClick() {
		const { actions: { toggleModal, postUploadFiles } } = this.props;
		postUploadFiles([]);
		toggleModal({
			type: null,
			status: null,
			visible: false,
		})
	}

	//发布新闻
	postData() {
		const {
			actions: { postData, getVideoList, patchData, getVideosList, postUploadFiles },
			form: { validateFields },
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
				editData: null
			},
			fileList = []
		} = this.props;
		validateFields((err, values) => {
			if (!err) {
				//判断是发布新闻还是更新新闻
				if (toggleData.status === 'ADD') {
					let newData = {
						"title": values['title'],
						"abstract": values['abstract'] || '',
						"raw": this.state.content,
						"content": "",
						"attachment": {
							"fileList": fileList || [],
						},
						"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"tags": [2],
						"categories": [5],
						"publisher": getUser().id,
						"is_draft": false
					};
					postData({}, newData)
						.then(rst => {
							if (rst.id) {
								this.modalClick();
								message.success('发布新闻成功');
								//更新新闻列表数据
								getVideoList({
									user_id: getUser().id
								});
								postUploadFiles([]);
							}
						})
				} else if (toggleData.status === 'EDIT') {
					let newData = {
						"title": values['title'],
						"abstract": values['abstract'] || '',
						"raw": this.state.content,
						"categories": [5],
						"attachment": {
							"fileList": fileList || [],
						},
						"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"is_draft": false
					};
					patchData({ pk: toggleData.editData.id }, newData)
						.then(rst => {
							if (rst.id) {
								this.modalClick();
								message.success('编辑新闻成功');
								//更新新闻列表数据
								getVideoList({
									user_id: getUser().id
								});
								getVideosList({
									user_id: getUser().id
								});
								postUploadFiles([]);
							}
						})
				}
			}
		});
	}

	//暂存新闻
	draftDataFunc() {
		const {
			actions: { postData, patchData, getVideoList, getVideosList },
			form: { validateFields },
			toggleData: toggleData = {
				status: 'ADD',
				editData: null,
			},
			fileList = []
		} = this.props;
		//判断暂存的是新增的还是编辑的暂存
		//编辑暂存的
		if (toggleData.status === 'EDIT') {
			validateFields((err, values) => {
				let newData = {
					"title": values['title'],
					"abstract": values['abstract'] || '',
					"raw": this.state.content,
					"categories": [5],
					"attachment": {
						"fileList": fileList || [],
					},
					"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"is_draft": true
				};
				patchData({ pk: toggleData.editData.id }, newData)
					.then(rst => {
						if (rst.id) {
							this.modalClick();
							message.success('暂存成功');
							//更新暂存的新闻列表数据
							getVideoList({
								user_id: getUser().id
							});
							getVideosList({
								user_id: getUser().id
							});
						}
					})
			})
		} else if (toggleData.status === 'ADD') {
			validateFields((err, values) => {
				let newData = {
					"title": values['title'] || '',
					"abstract": values['abstract'] || '',
					"raw": this.state.content || '',
					"categories": [5],
					"attachment": {
						"fileList": fileList || [],
					},
					"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"tags": [2],
					"publisher": getUser().id,
					"is_draft": true
				};
				postData({}, newData)
					.then(rst => {
						if (rst.id) {
							this.modalClick();
							message.success('暂存成功！');
							//更新暂存的新闻列表数据
							getVideosList({
								user_id: getUser().id
							});
						}
					})
			})
		}
	}

	render() {
		// fileTypes = judgeFile.indexOf('照片') == -1 ? 'application/mp4,application/3gpp,video/3gpp,video/mp4' : 'video/mp4,video/3gpp,';		
		// const {
		// 	form: {getFieldDecorator},
		// 	toggleData: toggleData = {
		// 		type: 'NEWS',
		// 		status: 'ADD',
		// 		visible: false,
		// 	}
		// } = this.props;
		const {
			form: { getFieldDecorator },
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
			},
			fileList = []
		} = this.props;
		// console.log(this.props.fileList)

		const { progress } = this.state;

		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};

		return (
			<Modal
				title={toggleData.type === 'TIPS' ? (
					toggleData.status === 'ADD' ? '发布公告' : '编辑公告'
				) : '发布公告'}
				visible={toggleData.visible}
				footer={null}
				width="80%"
				maskClosable={false}
				onOk={this.modalClick.bind(this)}
				onCancel={this.modalClick.bind(this)}
			>
				<div>
					<Form>
						<Row>
							<Col span={5} offset={1}>
								<FormItem {...formItemLayout} label="新闻标题">
									{getFieldDecorator('title', {
										rules: [{ required: true, message: '请输入新闻标题' }],
										initialValue: ''
									})(
										<Input type="text" placeholder="新闻标题" />
										)}
								</FormItem>
							</Col>
							<Col span={5} offset={1}>
								<FormItem {...formItemLayout} label="关键字">
									{getFieldDecorator('abstract', {})(
										<Input type="text" placeholder="请输入关键字" />
									)}
								</FormItem>
							</Col>
							<Col span={5} offset={1}>
								<Button onClick={this.draftDataFunc.bind(this)}>暂存</Button>
								<Button onClick={this.postData.bind(this)}>发布</Button>
								<Button onClick={this.modalClick.bind(this)}>取消</Button>
							</Col>
						</Row>
						<Row>
							<Col span={12} offset={1}>
								<div ref="editorElem"></div>
							</Col>
							<Col span={10} offset={1}>
								<Row>
									<Col>
										<Dragger {...this.uploadProps}
											accept={fileTypes}
										>
											<p className="ant-upload-drag-icon">
												<Icon type="inbox" />
											</p>
											<p className="ant-upload-text">
												点击或者拖拽开始上传</p>
											<p className="ant-upload-hint">
												支持mp4、ogg、webm视频</p>
										</Dragger>
									</Col>
									<Col>
										<Progress percent={progress} />
									</Col>
									<Col>
										<Table columns={this.columns}
											dataSource={fileList}
											pagination={false}
											bordered rowKey="down_file" />
									</Col>
								</Row>
							</Col>
						</Row>
					</Form>
				</div>
			</Modal>
		);
	}
	columns = [
		{
			title: '文件名称',
			dataIndex: 'name',
		}, {
			title: '操作',
			render: (file) => {
				return (
					<a onClick={this.removeFile.bind(this, file)}>删除</a>
				);
			},
		}
	];
	removeFile(file) {
		const { actions: { postUploadFiles }, fileList = [] } = this.props;
		let newFileList = fileList.filter(f => f.down_file !== file.down_file);
		postUploadFiles(newFileList)
	}
}

export default Form.create()(VideoText)