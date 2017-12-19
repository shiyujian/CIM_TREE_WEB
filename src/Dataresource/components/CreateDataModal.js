import React, {Component} from 'react';
import {Form, Row, Col, Input, Upload, Button, Icon} from 'antd';

import './index.less'

const FormItem = Form.Item;

class CreateDataModal extends Component{

	componentDidMount(){
		const {form:{setFieldsValue},contentfield,iscreat} = this.props;
		if(!iscreat){
			try{
				setFieldsValue({name:contentfield.title});
			}catch(e){
				console.log("error",e);
			}
		}
		
	}

	render(){
		const {getFieldDecorator} = this.props.form;

		return(
			<Form onSubmit={this.handleSubmit} >
				<Row>
					<Col span={24}>
						<FormItem label="名称" labelCol={{span:4}} wrapperCol={{span:16}} >
							{
								getFieldDecorator('name',{
									rules:[{required:true,message:'请输入名称!'}]
								})
								(<Input/>)
							}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<FormItem label="样式图片" labelCol={{span:4}} wrapperCol={{span:20}} >
							{
								getFieldDecorator('upload',{
									valuePropName:'fileList',
									getValueFromEvent:this.normFile
								})
								(<Upload name='file' listType="picture" className='upload-list-inline' >
									<Button>
										<Icon type="upload" />点击上传
									</Button>
								</Upload>)
							}
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
		)
	}

	handleSubmit = (e) =>{
		e.preventDefault();
		const {form:{validateFields, resetFields}} = this.props;

		let fieldValues = [];
		validateFields({},(err,values)=>{
			if(err) return;
			fieldValues = values;
		})

		if(validateFields.length ==  0) return;
		resetFields();
		this.props.onOk(fieldValues);
	}

	normFile = (e) =>{
		console.log('Upload event:', e);
	    if (Array.isArray(e)) {
	      return e;
	    }
	    return e && e.fileList;
	}
}
export default Form.create({})(CreateDataModal)