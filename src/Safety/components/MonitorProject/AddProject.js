import React, {Component} from 'react';

import {Input, Form, Spin,Row,Col,Icon,Button,Select,Radio,Checkbox,DatePicker  } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const InputGroup = Input.Group;

export default class AddProject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			item:[],
		};
	}
	dynItem = (value) =>{
		this.setState({item:value});
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		const options = [
		  { label: '变化量阈值', value: '变化量阈值' },
		  { label: '阈值', value: '阈值' },
		  { label: '累计变化量阈值', value: '累计变化量阈值' },
		  { label: '变化率阈值', value: '变化率阈值' }
		];
		
		const {item} = this.state;
		let one = '';
		let two = '';
		let three = '';
		let four = '';
		if(item.indexOf("变化量阈值")!==-1){
			one = "one";
		}
		if(item.indexOf("阈值")!==-1){
			two = "two";
		}
		if(item.indexOf("累计变化量阈值")!==-1){
			three = "three";
		}
		if(item.indexOf("变化率阈值")!==-1){
			four = "four";
		}

		return (
			<Form>
				<FormItem {...formItemLayout} label="项目类型">
					{getFieldDecorator('type', {
						initialValue: this.props.state.record.type,
						rules: [
							{required: true, message: '请选择项目类型！'},
						],
					})(
						<RadioGroup >
					        <Radio value={1}>一般监测项目</Radio>
					        <Radio value={2}>测斜项目</Radio>
					    </RadioGroup>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="监测项目名称">
					{getFieldDecorator('monitorName', {
						initialValue: this.props.state.record.monitorName,
						rules: [
							{required: true, message: '请填写项目名称！'},
						],
					}, {})(
						<Input />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="单位">
					{getFieldDecorator('unit', {
						initialValue: this.props.state.record.unit,
						rules: [
							{required: true, message: '请填写项目名称！'},
						],
					}, {})(
						<Input />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="范围">
					{getFieldDecorator('range', {
						initialValue: this.props.state.record.range,
						rules: [
							{required: true, message: '请至少选择一个范围！'},
						],
					}, {})(
						<CheckboxGroup 
						 options={options}
						 onChange={this.dynItem} />
					)}
				</FormItem>
				{
					one === "one" ? 
					<Row>
						<Col span={5}></Col>
						<Col span={3} style={{height:32}}><p style={{marginTop:4}}>变化量阈值</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('varthreshold1', {
									rules: [
										{validator:this.checkNull1.bind(this)}
									],
								}, {})(
										<Input placeholder="选填"  style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
						<Col span={1}><p>~</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('varthreshold2', {
									initialValue: this.props.state.record.varthreshold2,
									rules: [
										{validator:this.checkNull2.bind(this)}
									],
								}, {})(
										<Input placeholder="选填" style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
					</Row>
					: null
				}
				{
					two === "two" ? 
					<Row>
						<Col span={5}></Col>
						<Col span={3} style={{height:32}}><p style={{marginTop:4}}>阈值</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('threshold1', {
									initialValue: this.props.state.record.threshold1,
									rules: [
										{validator:this.checkNull3.bind(this)}
									],
								}, {})(
										<Input placeholder="选填"  style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
						<Col span={1}><p>~</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('threshold2', {
									initialValue: this.props.state.record.threshold2,
									rules: [
										{validator:this.checkNull4.bind(this)}
									],
								}, {})(
										<Input placeholder="选填" style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
					</Row>
					: null
				}
				{
					three === "three" ? 
					<Row>
						<Col span={5}></Col>
						<Col span={3} style={{height:32}}><p style={{marginTop:4}}>累计变化量阈值</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('lvarthreshold1', {
									initialValue: this.props.state.record.lvarthreshold1,
									rules: [
										{validator:this.checkNull5.bind(this)}
									],
								}, {})(
										<Input placeholder="选填"  style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
						<Col span={1}><p>~</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('lvarthreshold2', {
									initialValue: this.props.state.record.lvarthreshold2,
									rules: [
										{validator:this.checkNull6.bind(this)}
									],
								}, {})(
										<Input placeholder="选填" style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
					</Row>
					: null
				}
				{
					four === "four" ? 
					<Row>
						<Col span={5}></Col>
						<Col span={3} style={{height:32}}><p style={{marginTop:4}}>变化率阈值</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('gradient1', {
									initialValue: this.props.state.record.gradient1,
									rules: [
										{validator:this.checkNull7.bind(this)}
									],
								}, {})(
										<Input placeholder="选填"  style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
						<Col span={1}><p>~</p></Col>
						<Col span={5}>
							<FormItem {...formItemLayout} label="">
								{getFieldDecorator('gradient2', {
									initialValue: this.props.state.record.gradient2,
									rules: [
										{validator:this.checkNull8.bind(this)}
									],
								}, {})(
										<Input placeholder="选填" style={{width:135}}/>
								)}
							</FormItem> 
						</Col>
					</Row>
					: null
				}
				<FormItem {...formItemLayout} label="备注">
					{getFieldDecorator('remark', {
						initialValue: this.props.state.record.remark,
					}, {})(
							<Input placeholder="选填"  style={{width:135}}/>
					)}
				</FormItem> 
			</Form>
		)
	}
	checkNull1 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('varthreshold2')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({varthreshold2:form.getFieldValue('varthreshold2')?form.getFieldValue('varthreshold2'):"正无穷"});
			callback();
		}
	}
	checkNull2 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('varthreshold1')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({varthreshold1:form.getFieldValue('varthreshold1')?form.getFieldValue('varthreshold1'):"负无穷"});
			callback();
		}
	}
	checkNull3 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('threshold2')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({threshold2:form.getFieldValue('threshold2')?form.getFieldValue('threshold2'):"正无穷"});
			callback();
		}
	}
	checkNull4 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('threshold1')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({threshold1:form.getFieldValue('threshold1')?form.getFieldValue('threshold1'):"负无穷"});
			callback();
		}
	}
	checkNull5 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('lvarthreshold2')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({lvarthreshold2:form.getFieldValue('lvarthreshold2')?form.getFieldValue('lvarthreshold2'):"正无穷"});
			callback();
		}
	}
	checkNull6 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('lvarthreshold1')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({lvarthreshold1:form.getFieldValue('lvarthreshold1')?form.getFieldValue('lvarthreshold1'):"负无穷"});
			callback();
		}
	}
	checkNull7 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('gradient2')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({gradient2:form.getFieldValue('gradient2')?form.getFieldValue('gradient2'):"正无穷"});
			callback();
		}
	}
	checkNull8 = (rule,value,callback) =>{
		const form = this.props.props.form;
		if(!value&&!form.getFieldValue('gradient1')){
			callback('请至少输入一个选项！');
		}else{
			form.setFieldsValue({gradient1:form.getFieldValue('gradient1')?form.getFieldValue('gradient1'):"负无穷"});
			callback();
		}
	}
}
