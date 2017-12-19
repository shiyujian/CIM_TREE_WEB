import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select,Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring';
import {WORKFLOW_MAPS, SubItem_WordTemplate, previewWord_API,STATIC_UPLOAD_API,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => {
        const { cells = {} } = state.quality || {};
        return {...cells};
    },
    dispatch => ({
        cellActions: bindActionCreators({ ...actions2, ...actions3 }, dispatch)
    }),
)

class ImgFileUpload extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fileArray:[],
			previewVisible: false,
			previewImage: '',
		};
    }
    componentDidMount(){
		const {img} = this.props;
		this.setState({fileArray:img});
	}
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}


    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }


	beforeUploadPicFile = (file) => {
		const fileName = file.name;
		if(/.+?\.png/.test(fileName)|| /.+?\.jpg/.test(fileName)|| /.+?\.bmp/.test(fileName)|| /.+?\.gif/.test(fileName) || /.+?\.svg/.test(fileName)){
			
		}else{
			message.error('请上传常见格式的图片');
			return false;
		}
		// 上传图片到静态服务器
		const {uploadStaticFile} = this.props.cellActions;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            const livePhotos = {
				id:resp.id,
                uid: file.uid,
                name: resp.name,
                status: 'done',
				thumbUrl: SOURCE_API + resp.a_file,
				a_file:resp.a_file,
				download_url:resp.a_file,
				mime_type:resp.mime_type
            };
    		let fileArray = this.state.fileArray;
			fileArray.push(livePhotos);
			this.setState({fileArray:fileArray});
            this.props.form.setFieldsValue({img:this.state.fileArray})
		});
		return false;
	}
	//预览
	handlePreview = (file) => {
		this.setState({
		  previewImage: file.url || file.thumbUrl,
		  previewVisible: true,
		});
	  }
	  //删除
	handleRemove = (file) => {
		const {deleteStaticFile} = this.props.cellActions;
		deleteStaticFile({id:file.id});
		let {fileArray} = this.state;
		for(let i = fileArray.length-1; i > 0; i--){
			if(fileArray[i].id === file.id){
				fileArray.splice(i,1);
				break;
			}
		}
		this.setState({fileArray});
		this.props.form.setFieldsValue({img:this.state.fileArray})
	}
	render() {
		const formItemLayout = {
			labelCol: {span: 3},
			wrapperCol: {span: 21},
		};
		const {
			form: {getFieldDecorator}
		} = this.props;
		let {previewVisible,previewImage,fileArray} = this.state
		return (
			<Form>
                <FormItem {...formItemLayout} label="照片" hasFeedback>
					{getFieldDecorator('img', {
						initialValue: fileArray,
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: false, message: '请上传照片'},
						]
					}, {})(
						<Upload 
						 beforeUpload={this.beforeUploadPicFile.bind(this)} 
						 listType="picture-card"
						 onPreview={this.handlePreview}
						 onRemove={this.handleRemove}
						>
                            <div>
								<Icon type="plus"/>
								<div className="ant-upload-text">上传图片</div>
							</div>
                        </Upload>
					)}
					<Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible:false})}>
						<img alt="无法预览" style={{ width: '100%' }} src={previewImage} />
					</Modal>
				</FormItem>
			</Form>
		)
	}
}
export default Form.create({onFieldsChange(props, changedFields){props.onChange(changedFields)}})(ImgFileUpload);