import React, {Component} from 'react';
import {Row, Col,Form,Select,Upload,Input,Button,Icon} from 'antd';

import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class DatamenuModal extends Component {

	componentDidMount(){
		const { 
			form:{
				setFieldsValue
			},
			iscreat,
			contentfield,
		} = this.props;
		if(!iscreat) {
			try {
				setFieldsValue({
					name: contentfield.detail.name,
					datafield: contentfield.detail.datafield,
					datadense: contentfield.detail.datadense,
					dataprecision: contentfield.detail.dataprecision,
					abstract: contentfield.detail.abstract,
					dataoffer: contentfield.detail.dataoffer,
					datapreserver: contentfield.detail.datapreserver,
					zuobiao: '无',
				})
			} catch(e){
				console.log(e)
			}
		}
	}
	render() {
		let {data = {},selected} = this.props;

		const { getFieldDecorator } = this.props.form;
	    const formItemLayout = {
	      labelCol: { span: 4 },
	      wrapperCol: { span: 16 },
	    };
	    const formItemLayout2 = {
	      labelCol: { span: 8 },
	      wrapperCol: { span: 16 },
	    };
	    const formItemLayout3 = {
	      labelCol: { span: 4 },
	      wrapperCol: { span: 20 },
	    };
	    const up = {
		  name: 'file',
		  action: '',
		}
		return (
			<Form onSubmit={this.handleSubmit}>
				<Row>
					<Col span={24}>
						<FormItem
				          {...formItemLayout}
				          label="名称"
				        >
			          		{getFieldDecorator('name', {
					            rules: [
					              { required: true, message: '请输入名称!' },
					            ],
					          })(
					            <Input />
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={12}>
						<FormItem
				          {...formItemLayout2}
				          label="数据领域"
				        >
			          		{getFieldDecorator('datafield', {
					            rules: [
					              { required: true, message: '请选择数据领域!' },
					            ],
					          })(
					            <Select 
					            	placeholder="请选择数据领域"
					            >
					            <Option value="测绘">测绘</Option>
					            </Select>
					          )}
			        	</FormItem>
		        	</Col>
		        	<Col span={12}>
						<FormItem
				          {...formItemLayout2}
				          label="数据密级"
				        >
			          		{getFieldDecorator('datadense', {
					            rules: [
					              { required: true, message: '请选择数据密级!' },
					            ],
					          })(
					            <Select 
					            	placeholder="请选择数据密级"
					            >
					            <Option value="绝密">绝密</Option>
					            </Select>
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={24}>
						<FormItem
				          {...formItemLayout}
				          label="数据精度"
				        >
			          		{getFieldDecorator('dataprecision', {
					            rules: [
					              { required: true, message: '请输入数据精度!' },
					            ],
					          })(
					            <Input type="textarea" rows={2}/>
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={24}>
						<FormItem
				          {...formItemLayout}
				          label="摘要"
				        >
			          		{getFieldDecorator('abstract', {
					            rules: [
					              { required: true, message: '请输入摘要!' },
					            ],
					          })(
					            <Input type="textarea" rows={2}/>
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={12}>
						<FormItem
				          {...formItemLayout2}
				          label="提供方单位"
				        >
			          		{getFieldDecorator('dataoffer', {
					            rules: [
					              { required: true, message: '请选择提供方单位!' },
					            ],
					          })(
					            <Select 
					            	placeholder="请选择提供方单位"
					            >
					            <Option value="中国电建集团华东勘测设计研究院有限公司">中国电建集团华东勘测设计研究院有限公司</Option>
					            </Select>
					          )}
			        	</FormItem>
		        	</Col>
		        	<Col span={12}>
						<FormItem
				          {...formItemLayout2}
				          label="维护方单位"
				        >
			          		{getFieldDecorator('datapreserver', {
					            rules: [
					              { required: true, message: '请选择维护方单位!' },
					            ],
					          })(
					            <Select 
					            	placeholder="请选择维护方单位"
					            >
					            <Option value="中国电建集团华东勘测设计研究院有限公司">中国电建集团华东勘测设计研究院有限公司</Option>
					            </Select>
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={24}>
						<FormItem
				          {...formItemLayout}
				          label="范围坐标"
				        >
			          		{getFieldDecorator('zuobiao', {
					            rules: [
					              { required: true, message: '请输入范围坐标!' },
					            ],
					          })(
					            <Input type="textarea" rows={2}/>
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={24}>
						<FormItem
				          {...formItemLayout3}
				          label="样例图片"
				        >
			          		{getFieldDecorator('upload', {
					            valuePropName: 'fileList',
					            getValueFromEvent: this.normFile,
					          })(
					            <Upload {...up} listType="picture" className='upload-list-inline'>
					            	<Button>
					            		<Icon type="upload" /> 点击上传
					            	</Button>
					            </Upload>
					          )}
			        	</FormItem>
		        	</Col>
	        	</Row>
	        	<Row>
					<Col span={24}>
						<FormItem
				          wrapperCol={{ span: 12, offset: 6 }}
				          className="contcenter"
				        >
				          <Button type="primary" htmlType="submit">提交</Button>
				        </FormItem>
		        	</Col>
	        	</Row>
        	</Form>
		);
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const {
			form: {
				validateFields,
				resetFields
			}
		} = this.props
		let fieldValues = []
		validateFields({},(err, values)=> {
			if (err) {
				return
			}
			fieldValues = values
		})

		if (fieldValues.length == 0) {
            return
        }
        resetFields();
		this.props.onOk(fieldValues)
	}
	normFile = (e) => {
	    console.log('Upload event:', e);
	    if (Array.isArray(e)) {
	      return e;
	    }
	    return e && e.fileList;
	 }
}
export default Form.create({})(DatamenuModal)