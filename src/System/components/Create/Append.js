import React, { Component } from 'react';
import { Form, Input, Button, Select, message, Upload, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Card from '_platform/components/panels/Card';
import { CODE_PROJECT } from '_platform/api';

const { TextArea } = Input;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const Dragger = Upload.Dragger;


export default class Append extends Component {

	render() {
		const { create: { addition = {}, isSave = false } = {}, actions: { changeAdditionField, clearAdditionField, saveFlag } } = this.props;
		
		return (
			<div style={{ marginTop: 20 }}>
				<Card title="填写编码类型信息">

					<FormItem {...Append.layout} label="编码类型名称" style={{marginTop:30,marginBottom:30}}>
						<Input placeholder="WBS编码类型" value={addition.name} onChange={changeAdditionField.bind(this, 'name')} style={{ width: 465 }} />
					</FormItem>
					<FormItem {...Append.layout} label="编码类型类别" >
						<Select style={{ width: 465 }} onSelect={this.onSelect.bind(this)} placeholder="独立类型 or 编码组类型"
							onChange={changeAdditionField.bind(this, 'is_independent')}>
							<Option key='1' value="true">独立类型</Option>
							<Option key="2" value="false">编码组类型</Option>
						</Select>
					</FormItem>

					<FormItem {...Append.layout} label="编码类型描述" style={{ marginTop: 40 }}>
						<TextArea placeholder="描述信息 , 必填" value={addition.description} onChange={changeAdditionField.bind(this, 'description')} autosize={{ minRows: 3, maxRow: 4 }} style={{ width: 1113 }} />
					</FormItem>

					{/* <FormItem {...Append.layout} label="适用系统对象">
						<Select style={{ width: 200 }} mode="multiple" disabled={!addition.is_independent}
							onChange={changeAdditionField.bind(this, 'domain')}>
							<Option value="document">文档</Option>
							<Option value="workPackage">施工包</Option>
						</Select>
					</FormItem> */}
					<FormItem {...Append.layout} label="说明文档上传" style={{ marginTop: 40 }}>
						<Dragger >
							<p className="ant-upload-drag-icon" >
								<Icon type="inbox" />
							</p>
						</Dragger>
					</FormItem>
				</Card>
				<div style={{
					textAlign: 'right', marginTop: 100, marginRight: 50
				}}>
					<Link to="/system/code"><Button>取消</Button></Link>
					<Button onClick={this.save.bind(this)} type="primary" style={{ marginLeft: 24 }}>下一步</Button>
				</div>

			</div>);
	}
	onSelect(value) {
		this.setState({
			value
		})

	}
	save() {
		const {
			create: { addition = {} } = {}, history,
			actions: { clearAdditionField, postCodeGroup, postCodeType, saveNameInde },
		} = this.props;
		const { name, description, is_independent } = addition;

		if (!name) {
			message.warn('请填写编码名称');
		} else if (!description) {
			message.warn('请填写编码备注');
		} else if (!is_independent) {
			message.warn('请选择编码类型');
		} else {
			postCodeGroup({}, {
				name,
				description,
				is_independent: this.state.value
			}).then(rst => {
				console.log('rst', rst)
				if (rst && rst._id) {
					clearAdditionField();
					history.replace(`/system/code/create?current=1&code_type=${rst.name}&independent=${is_independent ? 1 : 0}`);
				}
				//
				let nameInde = [];
				let inde = is_independent ? 1 : 0;
				nameInde.push(rst.name)
				nameInde.push(inde)
				saveNameInde(nameInde);
			})
		}

	}

	static layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
}
