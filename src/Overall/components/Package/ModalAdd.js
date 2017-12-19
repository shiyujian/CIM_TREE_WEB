import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input, message} from 'antd';

const FormItem = Form.Item;

class ModalAdd extends Component {

	static propTypes = {};

	constructor(props) {
		super(props)
	}

	handleOk() {
		const {
			form: {validateFields},
			toggleData: toggleData = {
				type: ''
			},
			actions: {setPtrTree, setItmTree, setTables, checkCodeIsActive,},
			selectedUnit,
			ptrTreeData = [],
			selectedPtr,
			itmTreeData = [],
			tablesData = [],
		} = this.props;
		validateFields((['name','code']),(err, values) => {
			if (!err) {
				//分部工程
				if (toggleData.type === 'C_WP_PTR') {
					let parent = selectedUnit.split('--');
					let havePtr = ptrTreeData.filter((f => f.code === parent[0] + values['code']));
					//判断当分部下前新增的分部工程是否已存在
					if(havePtr.length>0){
						message.warning('当前新增的分部编码在新增列表中已存在');
						return
					}
					checkCodeIsActive({code: parent[0] + values['code']})
						.then(rst => {
							if (typeof rst === 'string') {
								ptrTreeData.push(
									{
										name: values['name'],
										code: parent[0] + values['code'],
										obj_type: "C_WP_PTR",  //分部工程
										version: "A",
										status: "A",
										parent: {"code": parent[0], "name": parent[2], "obj_type": parent[1]},
										children: []
									}
								);
								setPtrTree(ptrTreeData)
								this.handleCancel();
							} else {
								message.warning('当前CODE已存在，请更改CODE')
							}
						});
				}
				//子分部工程
				else if (toggleData.type === 'C_WP_PTR_S') {
					let parent = selectedPtr.split('--');
					let havePtr_s = [];
					ptrTreeData.map((ptr)=>{
						havePtr_s=havePtr_s.concat(ptr.children.filter(f => f.code === parent[0] + values['code']))
					});
					//判断当分部下前新增的子分部工程是否已存在
					if(havePtr_s.length>0){
						message.warning('当前新增的子分部编码在新增列表中已存在');
						return
					}
					checkCodeIsActive({code: parent[0] + values['code']})
						.then(rst => {
							if (typeof rst === 'string') {
								ptrTreeData.map((ptr, index) => {
									if (parent[0] === ptr.code) {
										ptrTreeData[index].children.push({
											name: values['name'],
											code: parent[0] + values['code'],
											obj_type: "C_WP_PTR_S",  //子分部工程
											version: "A",
											status: "A",
											parent: {"code": parent[0], "name": parent[2], "obj_type": parent[1]},
											children: []
										})
									}
								});
								setPtrTree(ptrTreeData);
								this.handleCancel();
							} else {
								message.warning('当前CODE已存在，请更改CODE')
							}
						});
				}
				//分项工程
				else if (toggleData.type === 'C_WP_ITM') {
					let parent = selectedPtr.split('--');
					let haveItm = itmTreeData.filter((f => f.code === parent[0] + values['code']));
					//判断当分部下前新增的分项工程是否已存在
					if(haveItm.length>0){
						message.warning('当前新增的分项编码在新增列表中已存在');
						return
					}
					checkCodeIsActive({code: parent[0] + values['code']})
						.then(rst => {
							if (typeof rst === 'string') {
								itmTreeData.push(
									{
										name: values['name'],
										code: parent[0] + values['code'],
										obj_type: "C_WP_ITM",  //分项工程
										version: "A",
										status: "A",
										parent: {"code": parent[0], "name": parent[2], "obj_type": parent[1]},
										children: []
									}
								);
								//设置分项的值
								setItmTree(itmTreeData)
								let newTablesData = tablesData;
								//分部下建分项
								if (parent[1] === 'C_WP_PTR') {
									newTablesData.push({
										code: parent[0] + values['code'],
										ptr: parent[2],
										ptr_s: '',
										itm: values['name'],
									})
								}
								//子分部下建分项
								else if (parent[1] === 'C_WP_PTR_S') {
									newTablesData.push({
										code: parent[0] + values['code'],
										ptr: this.getPtrName(parent[0]),
										ptr_s: parent[2],
										itm: values['name'],
									})
								}
								//设置表格的值
								setTables(newTablesData)
								this.handleCancel();
							} else {
								message.warning('当前CODE已存在，请更改CODE')
							}
						});
				}
			}
		})
	}

	handleCancel() {
		const {
			actions: {toggleModal},
		} = this.props;
		toggleModal({
			visible: false,
		})
	}
	getPtrName(code) {
		const {ptrTreeData = []} = this.props;
		let name = '';
		ptrTreeData.map((ptr) => {
			ptr.children.map((ptr_s) => {
				if (ptr_s.code === code) {
					name = ptr_s.parent.name;
				}
			})
		});
		return name;
	}

	render() {
		const {
			form: {getFieldDecorator},
			toggleData: toggleData = {
				visible: false
			},
		} = this.props;

		const formItemLayout = {
			labelCol: {span: 4},
			wrapperCol: {span: 16},
		};
		return (
			<Modal
				title="新增"
				visible={toggleData.visible}
				maskClosable={false}
				onOk={this.handleOk.bind(this)}
				onCancel={this.handleCancel.bind(this)}
			>
				<Form>
					<Row>
						<Col>
							<FormItem {...formItemLayout} label="名称">
								{getFieldDecorator('name', {
									rules: [{required: true, message: '请输入名称'}],
									initialValue: ''
								})(
									<Input type="text" placeholder="请输入名称"/>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormItem  {...formItemLayout} label="CODE编码">
								{getFieldDecorator('code', {
									rules: [{required: true, message: '请输入CODE编码'}],
									initialValue: ''
								})(
									<Input rows={10} placeholder="请输入CODE编码"/>
								)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(ModalAdd)