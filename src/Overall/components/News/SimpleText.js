import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, Row, Col, Button, Table, message, Progress, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '../../../_platform/auth';
import { base, STATIC_DOWNLOAD_API, SOURCE_API } from '../../../_platform/api';
import E from 'wangeditor'

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const { TextArea } = Input;
const Option = Select.Option;

class SimpleText extends Component {
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
		this.setState({
			editor
		})
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
		editor.create();
		const {
			actions: { postUploadFiles },
			toggleData: toggleData = {
				type: 'TIPS',
				status: 'ADD',
				visible: false,
				editData: null
			},
			form: { setFieldsValue }
		} = this.props;
		if (toggleData.type === 'TIPS' && toggleData.status === 'EDIT') {
			postUploadFiles(toggleData.editData.attachment.fileList)
			this.setState({
				content: toggleData.editData.raw
			});
			editor.txt.html(toggleData.editData.raw)
			setFieldsValue({
				'title': toggleData.editData.title,
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

	//发布公告
	postData() {
		const {
			actions: { postData, getTipsList, patchData, getDraftTipsList, postUploadFiles },
			form: { validateFields },
			toggleData: toggleData = {
				type: 'TIPS',
				status: 'ADD',
				visible: false,
				editData: null
			},
			fileList = []
		} = this.props;
		validateFields((err, values) => {
			if (toggleData.status === 'ADD') {
				let newData = {
					"title": values['title'],
					"abstract": '',
					"raw": this.state.content,
					"content": "",
					"attachment": {
						"fileList": fileList || [],
					},
					"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"tags": [2],
					"categories": [],
					"publisher": getUser().id,
					"is_draft": false
				};
				postData({}, newData)
					.then(rst => {
						if (rst.id) {
							this.props.form.setFieldsValue({
								title: undefined,
								abstract: undefined,
								dagree: undefined
							});
							this.state.editor.txt.html('')
							message.success('发布公告成功');
							//更新公告列表数据

							getTipsList({
								user_id: getUser().id
							});
							postUploadFiles([]);
						}
					})
			}

		});
	}

	//暂存公告
	draftDataFunc() {
		const {
			actions: { postData, patchData, getTipsList, getDraftTipsList },
			form: { validateFields },
			toggleData: toggleData = {
				status: 'ADD',
				editData: null,
			},
			fileList = []
		} = this.props;
		//判断暂存的是新增的还是编辑的暂存
		//编辑暂存的
		if (toggleData.status === 'ADD') {
			validateFields((err, values) => {
				let newData = {
					"title": values['title'] || '',
					"abstract": '',
					"raw": this.state.content,
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
							this.props.form.setFieldsValue({
								title: undefined,
								abstract: undefined,
								dagree: undefined
							});
							this.state.editor.txt.html('')
							message.success('暂存成功！');
							//更新暂存的公告列表数据
							getDraftTipsList({
								user_id: getUser().id
							});
						}
					})
			})
		}
	}

	render() {
		const {
			form: { getFieldDecorator },
			toggleData: toggleData = {
				type: 'TIPS',
				status: 'ADD',
				visible: false,
			},
			fileList = []
		} = this.props;

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
						<Row span={22}>
							<Col span={8} offset={1}>
								<FormItem {...formItemLayout} label="主题">
									{getFieldDecorator('title', {
										rules: [{ required: true, message: '请输入公告标题' }],
										initialValue: ''
									})(
										<Input type="text" />
										)}
								</FormItem>
							</Col>
							{/*<Col span={6} offset={1}>
								<FormItem {...formItemLayout} label="发布单位">
									{getFieldDecorator('abstract', {})(
										(<Select allowClear style={{ width: '100%' }}>
											<Option value="0">雄安新区植树造林指挥部办公室</Option>
											<Option value="1">河北远大工程咨询有限公司雄安新区九号地块一区造林项目监理部</Option>
										</Select>)
									)}
								</FormItem>
								</Col>*/}
							<Col span={4} offset={1}>
								<FormItem {...formItemLayout} label="紧急程度">
									{
										getFieldDecorator('degree', {
											rules: [
												{ required: false, message: '紧急程度' },
											]
										})
											(<Select style={{ width: '100%' }}
											>
												<Option value="0">编辑中</Option>
												<Option value="1">已提交</Option>
												<Option value="2">执行中</Option>
												<Option value="3">已完成</Option>
												<Option value="4">已废止</Option>
												<Option value="5">异常</Option>
											</Select>)
									}


								</FormItem>

							</Col>
							{/* <Col span={2}>
							<Dragger {...this.uploadProps}>
								<Button >
									<Icon type='upload' />上传
								</Button>
							</Dragger>
						</Col> */}


						</Row>
						<Row>
							<Col span={22} offset={1}>
								<div ref="editorElem"></div>
							</Col>
							{/* <Col span={10} offset={1}>
							<Row>
								<Col>
									<Dragger {...this.uploadProps}>
										<p className="ant-upload-drag-icon">
											<Icon type="inbox" />
										</p>
										<p className="ant-upload-text">
											点击或者拖拽开始上传</p>
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
						</Col> */}
						</Row>
						<Row style={{ marginTop: 20 }}>
							<Col span={24} offset={10}>
								<Button onClick={this.modalClick.bind(this)}>取消</Button>
								<Button type='primary' style={{ marginLeft: 20 }} onClick={this.postData.bind(this)}>发布</Button>
								<Button style={{ marginLeft: 20 }} onClick={this.draftDataFunc.bind(this)}>暂存</Button>

							</Col>
						</Row>
					</Form>
				</div>
			</Modal >

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

export default Form.create()(SimpleText)