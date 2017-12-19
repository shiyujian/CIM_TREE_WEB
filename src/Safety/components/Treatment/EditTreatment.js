import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class EditTreatment extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
    }
    
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}
   
	beforeUploadPicFile  = (file) => {
		const fileName = file.name;
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const attachment = [{
                uid: file.uid,
                name: resp.name,
                status: 'done',
                a_file:resp.a_file,
                thumbUrl: resp.a_file,
                mime_type:resp.mime_type,
            }];
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		const attr = [];
		if(this.props.state.record.survey_report){
			let obj = this.props.state.record.survey_report;
			obj.uid = 1;
			attr.push(obj);
		}
		return (
			<Form>
                <FormItem {...formItemLayout} label="处理报告" hasFeedback>
					{getFieldDecorator('attachment', {
						initialValue: attr,
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: true, message: '请上传事故处理报告'},
						]
					}, {})(
						<Upload beforeUpload={this.beforeUploadPicFile.bind(this)}>
                            <Button>
                                <Icon type="upload" />添加文件
							</Button>
                        </Upload>
					)}
				</FormItem>
			</Form>
		)
	}
}