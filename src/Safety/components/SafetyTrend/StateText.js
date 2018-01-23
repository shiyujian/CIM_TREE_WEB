import React, {Component} from 'react';
import {Modal, Form, Input, Row, Col, Button, message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {getUser} from '../../../_platform/auth';
import {base, SOURCE_API} from '../../../_platform/api';
import E from 'wangeditor'

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;

class StateText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: "",
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
		editor.customConfig.customAlert = function(info){
			alert(info + ' \n\n如果粘贴无效，请使用图片上传功能进行上传');
		}
		editor.create();

		const {
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
				editData: null
			},
			form: {setFieldsValue}
		} = this.props;
		if (toggleData.type === 'NEWS' && toggleData.status === 'EDIT') {
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

	//modal显示与影藏
	modalClick() {
		const {actions: {toggleModal}} = this.props;
		toggleModal({
			type: null,
			status: null,
			visible: false,
		})
	}

	//发布新闻
	postData() {
		const {
			actions: {postData, getNewsList, patchData, getDraftNewsList},
			form: {validateFields},
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
				editData: null
			}
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
						"attachment": {},
						"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"tags": [1],
						"categories": [2],
						"publisher": getUser().id,
						"is_draft": false
					};
					postData({}, newData)
						.then(rst => {
							if (rst.id) {
								this.modalClick();
								message.success('发布新闻成功');
								//更新新闻列表数据
								getNewsList({
									user_id: getUser().id
								});
							}
						})
				} else if (toggleData.status === 'EDIT') {
					let newData = {
						"title": values['title'],
						"abstract": values['abstract'] || '',
						"raw": this.state.content,
						"categories": [2],
						"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"is_draft": false
					};
					patchData({pk: toggleData.editData.id}, newData)
						.then(rst => {
							if (rst.id) {
								this.modalClick();
								message.success('编辑新闻成功');
								//更新新闻列表数据
								getNewsList({
									user_id: getUser().id
								});
								getDraftNewsList({
									user_id: getUser().id
								});
							}
						})
				}
			}
		});
	}

	//暂存新闻
	draftDataFunc() {
		const {
			actions: {postData, patchData, getNewsList, getDraftNewsList},
			form: {validateFields},
			toggleData: toggleData = {
				status: 'ADD',
				editData: null,
			}
		} = this.props;
		//判断暂存的是新增的还是编辑的暂存
		//编辑暂存的
		if (toggleData.status === 'EDIT') {
			validateFields((err, values) => {
				let newData = {
					"title": values['title'],
					"abstract": values['abstract'] || '',
					"raw": this.state.content,
					"categories": [2],
					"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"is_draft": true
				};
				patchData({pk: toggleData.editData.id}, newData)
					.then(rst => {
						if (rst.id) {
							this.modalClick();
							message.success('暂存成功');
							//更新暂存的新闻列表数据
							getNewsList({
								user_id: getUser().id
							});
							getDraftNewsList({
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
					"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"tags": [1],
					"categories": [2],
					"publisher": getUser().id,
					"is_draft": true
				};
				postData({}, newData)
					.then(rst => {
						if (rst.id) {
							this.modalClick();
							message.success('暂存成功！');
							//更新暂存的新闻列表数据
							getDraftNewsList({
								user_id: getUser().id
							});
						}
					})
			})
		}
	}

	render() {
		const {
			form: {getFieldDecorator},
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
			}
		} = this.props;

		const formItemLayout = {
			labelCol: {span: 8},
			wrapperCol: {span: 16},
		};

		return (
			<Modal
				title={toggleData.type === 'NEWS' ? (
					toggleData.status === 'ADD' ? '发布国内安全动态' : '编辑国内安全动态'
				) : '发布国内安全动态'}
				wrapClassName='edit-box'
				visible={toggleData.visible}
				width="70%"
				footer={null}
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
										rules: [{required: true, message: '请输入新闻标题'}],
										initialValue: ''
									})(
										<Input type="text" placeholder="新闻标题"/>
									)}
								</FormItem>
							</Col>
							<Col span={5} offset={1}>
								<FormItem {...formItemLayout} label="关键字">
									{getFieldDecorator('abstract', {})(
										<Input type="text" placeholder="请输入关键字"/>
									)}
								</FormItem>
							</Col>
							<Col span={5} offset={1}>
								<Button onClick={this.draftDataFunc.bind(this)}>暂存</Button>
								<Button onClick={this.postData.bind(this)}>发布</Button>
								<Button onClick={this.modalClick.bind(this)}>取消</Button>
							</Col>
						</Row>
					</Form>
					<Row>
						<Col span={22} offset={1}>
							<div ref="editorElem"></div>
						</Col>
					</Row>
				</div>
			</Modal>
		);
	}
}

export default Form.create()(StateText)