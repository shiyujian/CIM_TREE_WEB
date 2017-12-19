import React, {Component} from 'react';
import {Row, Col,Form,Select,Upload,Input,Button,Icon} from 'antd';

import moment from 'moment';
import './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class ApiserviceModal extends Component {

	componentDidMount(){
		const { 
			form:{
				setFieldsValue
			},
			iscreat,
			contentfield
		} = this.props;
		if(!iscreat) {
			try {
				setFieldsValue({
					title: contentfield.title,
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
			          		{getFieldDecorator('title', {
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
export default Form.create({})(ApiserviceModal)