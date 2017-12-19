import React, {Component} from 'react';
import {Modal, Form, Input, Row, Col, Select, message} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ItmToggleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coordinates: [],
			fileList: [],
			imagesList: [],
		}
	}

	componentDidMount() {
		const {
			toggleData: toggleData = {
				type: 'ADD',
				visible: false
			},
			form: {setFieldsValue},
			currentEditData = {}
		} = this.props;
		if (toggleData.type === 'EDIT') {
			setFieldsValue({
				'name': currentEditData.name,
				'code': currentEditData.code,
				'version': currentEditData.version,
				'desc': currentEditData.extra_params.desc,
				'alias': currentEditData.extra_params.alias,
				'purpose': currentEditData.extra_params.purpose,
				'major': currentEditData.extra_params.major,
			});
		}
	}


	closeModal() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: null,
			visible: false,
		});
	}

	//新增项目或编辑分部分项
	postUnitProject() {
		const {
			actions: {getWbsProjectAc, postWorkPackageAc, putWorkPackageAc, setCurrentEditDataAc,postLocationAc},
			form: {validateFields},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			tableList = [],
			currentEditData = {},
			itmTypes = [],
			createType
		} = this.props;
		validateFields((err, values) => {
			if (!err) {
				//新增分部分项
				if (toggleData.type === 'ADD') {
					let postData = {
						"name": itmTypes.filter(type => type.code === values["name"])[0]["name"],
						"code": values["code"],
						"description": values["desc"],
						"obj_type": createType,
						"status": "A",
						"version": values["version"] || "A",
						"extra_params": {
							"desc": values["desc"],
							"alias": values["alias"],
							"purpose": values["purpose"],
							"major": values["major"],
						},
						"parent": {
							"name": tableList[0]["name"],
							"code": tableList[0]["code"],
							"obj_type": tableList[0]["obj_type"]
						},
						"response_orgs": [],
					};
					// 新增分项
					postWorkPackageAc({}, postData)
						.then(rst => {
							if (rst && rst.code) {
								message.success('新增成功！');
								getWbsProjectAc();
								this.closeModal();
							} else {
								message.error("新增失败！")
							}
						})


				} else { //编辑
					let editData = {
						"status": "A",
						"description": values["desc"],
						"version": values["version"] || "A",
						"extra_params":
							{
								...currentEditData.extra_params,
								...{
									"desc": values["desc"],
									"alias": values["alias"],
									"purpose": values["purpose"],
									"major": values["major"],
								}
							},
						"response_orgs": currentEditData.response_orgs || [],
					};
					putWorkPackageAc({code: currentEditData.code}, editData)
						.then(rst => {
							if (rst && rst.code) {
								message.success('编辑成功！');
								getWbsProjectAc();
								this.closeModal();
								setCurrentEditDataAc({})
							}else{
								message.error("编辑失败！")
							}
						})
				}
			}
		});
	}

	_selectChange(value) {
		const {
			form: {setFieldsValue},
			tableList = []
		} = this.props;
		setFieldsValue({
			'code': tableList[0]["code"]+'-'+value,
		});
	}
	_getDisableStatue(code){
		let disable=false;
		const {
			tableList = []
		} = this.props;
		let find=tableList[0].children.filter(itm=>itm.code.split('-')[itm.code.split('-').length-1] === code)
		if(find.length > 0){
			disable=true;
		}
		return disable;
	}
	render() {
		const {
			form: {getFieldDecorator},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			professList = [],
			itmTypes = [],
		} = this.props;
		const formItemLayout = {
			labelCol: {span: 4},
			wrapperCol: {span: 18},
		};
		return (
			<Modal
				title={toggleData.type === 'ADD' ? '新增分项' : '编辑分项'}
				visible={toggleData.visible}
				width="80%"
				maskClosable={false}
				onOk={this.postUnitProject.bind(this)}
				onCancel={this.closeModal.bind(this)}
			>
				<div>
					<Form>
						<Row>
							<Col>
								<FormItem {...formItemLayout} label="分项名称">
									{getFieldDecorator('name', {
										rules: [{required: true, message: '请选择分项名称'}],
										initialValue: ''
									})(
										toggleData.type === "EDIT" ? (
											<Input disabled={true} type="text"/>) : (
											<Select
												placeholder="请选择分项名称"
												onChange={this._selectChange.bind(this)}
											>
												{
													itmTypes.map((itm) => {
														return <Option value={itm.code}
																	   disabled={this._getDisableStatue(itm.code)}
																	   key={itm.code}>{itm.name}</Option>
													})
												}
											</Select>
										)
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="编码值">
									{getFieldDecorator('code', {
										rules: [{required: true, message: '请选择分项名称'}],
										initialValue: ''
									})(
										<Input disabled={true} type="text" placeholder="请选择分项名称"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="编码别名">
									{getFieldDecorator('alias', {
                                        rules: [{required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合'	,pattern:/^[\w\d\_\-]+$/}],
										initialValue: ''
									})(
										<Input type="text" placeholder="请输入编码别名"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="描述">
									{getFieldDecorator('desc', {
										rules: [{required: true, message: '请输入描述'}],
										initialValue: ''
									})(
										<Input type="textarea" rows={4} placeholder="请输入描述"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="用途">
									{getFieldDecorator('purpose', {
										rules: [{required: true, message: '请输入用途'}],
										initialValue: ''
									})(
										<Input type="text" placeholder="请输入用途"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="专业">
									{getFieldDecorator('major', {
										rules: [{required: true, message: '请输入专业'}],
										initialValue: ''
									})(
										<Select
											placeholder="请选择专业"
										>
											{
												professList.map((profess) => {
													return <Option value={profess.name}
																   key={profess.code}>{profess.name}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="版本">
									{getFieldDecorator('version', {
										rules: [{required: true, message: '请输入版本'}],
										initialValue: ''
									})(
										<Input type="text" placeholder="请输入版本"/>
									)}
								</FormItem>
							</Col>
						</Row>
					</Form>
				</div>
			</Modal>
		);
	}
}

export default Form.create()(ItmToggleModal)