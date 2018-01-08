import React, {Component} from 'react';
import {Modal, Form, Input, Row, Col, Select, message} from 'antd';
import CodePicker from '_platform/components/panels/CodePicker';

const FormItem = Form.Item;
const Option = Select.Option;

class ToggleModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coordinates: [],
			fileList: [],
			imagesList: [],
			// buildCode:''
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
				'version': currentEditData.extra_params.version,
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

	//新增项目或编辑工程部位
	postUnitProject() {
		const {
			actions: {getLocationAc, postLocationAc, putWorkpackagesAc, setCurrentEditDataAc,putLocationsAc,getSectionAc,getLocationOne,setTableDataAc},
			form: {validateFields},
			toggleData: toggleData = {
				type: 'ADD',
				visible: false,
			},
			tableList = [],
			currentEditData = {},
			selectWbsProject = "",
		} = this.props;
		let oldSite = [...tableList];
		let parentCode = selectWbsProject.split("--")[0]
		validateFields((err, values) => {
			if (!err) {
				if (toggleData.type === 'ADD') {
					let postLoc = {
						"name": values["name"],
						"code": values["code"],
						"status": "A",
						"obj_type": "C_LOC_PJ",
						"extra_params":{
							"type":"site",
							"alias":values["alias"],
							"desc":values["desc"],
							"major":values["major"],
							"purpose":values["purpose"],
							"version":values["version"],
						},
					}
					postLocationAc({}, postLoc)
						.then(rst => {
							if (rst && rst.code) {
								oldSite.push({
									code:rst.code,
									pk:rst.pk,
									obj_type:"C_LOC_PJ"
								});
								putWorkpackagesAc({code:parentCode},{
									"locations":oldSite,
									"version":"A"
								}).then(rst => {
									if (rst.locations[0].code) {
										message.success('新增工程部位成功！');
										getLocationAc();
										this.closeModal();
									}else{
										message.error('新增工程部位失败！');
									}
								})
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
					putLocationsAc({code: currentEditData.code}, editData)
						.then(rst => {
							if (rst && rst.code) {
								message.success('编辑工程部位成功！');
								// 重新获取数据
								let tableList1 = [];
								getSectionAc({code:parentCode}).then(rst => {
									let promises = rst.locations.map(item => {
										return getLocationOne({code:item.code});
									});
									Promise.all(promises).then(rst=>{
										rst.map(ele=>{
											tableList1.push(ele);
										});
										setTableDataAc(tableList1)
									});
									
								})
								this.closeModal();
								setCurrentEditDataAc({})
							}else{
								message.error("编辑工程部位失败！")
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
			professList = [],
			tableList = [],
			buildName="",
		} = this.props;
		const formItemLayout = {
			labelCol: {span: 4},
			wrapperCol: {span: 18},
		};
		return (
			<Modal
				title={toggleData.type === 'ADD' ? '新增工程部位' : '编辑工程部位'}
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
								<FormItem {...formItemLayout} label="编码名称">
									{getFieldDecorator('name', {
										rules: [{required: true, message: '请输入编码名称'}],
										initialValue: ''
									})(
										<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="请输入编码名称"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="编码值">
									{getFieldDecorator('code', {
										rules: [{required: true, message: '请输入编码值'}],
										initialValue: ''
									})(
										<Input disabled={toggleData.type === 'EDIT'} type="text" placeholder="请输入编码值"/>
									)}
								</FormItem>
								<FormItem {...formItemLayout} label="编码别名">
									{getFieldDecorator('alias', {
										rules: [{required: true, message: '请输入编码别名'}],
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

export default Form.create()(ToggleModal)
// {
// 	onValuesChange: (props, values) => {
// 		const {actions: {setBuildNameAc}} = props;
// 		for (let key in values) {
// 			if (key === 'name') {
// 				setBuildNameAc(values['name'])
// 			}
// 		}
// 	}
// }