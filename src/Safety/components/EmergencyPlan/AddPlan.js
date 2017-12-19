import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon,Progress} from 'antd';
import moment from 'moment';
import {FILE_API} from '../../../_platform/api';
const FormItem = Form.Item;

export default class AddPlan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			progress:0,
			isUploading: false,
		};
    }
    onFileChange = ({file,fileList,event}) =>{
    	this.setState({
            isUploading: file.status === 'done' ? false : true
        })
        if(file.status === 'done'){
        	const resp = file.response;
        	const attachment = [{
				size: resp.size,
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file: resp.a_file,
				download_url: resp.download_url,
				mime_type: resp.mime_type
            }];
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
        }
        if(event){
            let {percent} = event;
            if(percent!==undefined)
                this.setState({progress:parseFloat(percent.toFixed(1))});
        }
    }
    
    coverPicFile = (e) => {
    	debugger
    	let i = 0;
    	if(e.fileList.length>0){
    		i = e.fileList.length - 1;
    	}
		if (Array.isArray(e)) {
			return e;
		}
		if(e.fileList[0]){
			return e && [e.fileList[i]];
		}else{
			return e && e.fileList;
		}
	}
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

	uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            
        },
    };

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		const {progress,isUploading} = this.state;
		return (
			<Spin size="large" spinning={this.state.isUploading}>
				<Form>
				<FormItem {...formItemLayout} label="应急预案名称" hasFeedback>
					{getFieldDecorator('emergencyPlanName', {
						rules: [
							{required: true, message: '请输入应急预案名称'},
						]
					})(
						<Input type="text" placeholder="请输入应急预案名称"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="工程名称" hasFeedback>
					{getFieldDecorator('projectName', {
						initialValue: this.props.state.projectName,
						rules: [
							{required: true, message: '请输入工程名称'},
						]
					})(
						<Input disabled placeholder="未获取到工程名称"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="应急预案" hasFeedback>
					{getFieldDecorator('attachment', {
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: true, message: '请上传应急预案'},
						]
					}, {})(
						<Upload {...this.uploadProps} 
						 //onChange={this.onFileChange.bind(this)}
						 >
                            <Button>
                                <Icon type="upload" />添加文件
							</Button>
                        </Upload>
					)}
				</FormItem>
				{/*<Progress percent={progress} strokeWidth={5} />*/}
			</Form>
			</Spin>
		)
	}
}