import React, { Component } from 'react';
import { Input, Form, Spin, message, Upload, Button, Icon } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

export default class AddInstitution extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileArray:[],
        };
    }

    coverPicFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        this.props.props.form.setFieldsValue({ attachment: e.filelist });
        return e && e.fileList;
    }
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

    beforeUploadPicFile = (file) => {
        const fileName = file.name;
        //debugger
        // 上传图片到静态服务器
        const { actions: { uploadStaticFile, deleteStaticFile } } = this.props.props;

        const formdata = new FormData();
        formdata.append('a_file', file);
        formdata.append('name', fileName);

        uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp);
            debugger
            //this.props.props.actions.setUploadFile(resp);
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                uid: file.uid,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
                thumbUrl: resp.a_file,
                a_file: resp.a_file,
				download_url: resp.download_url,
				mime_type: resp.mime_type
            };
            let fileArray = this.state.fileArray;
            fileArray.push(attachment);
            this.setState({
                fileArray:fileArray
            })
            // 删除 之前的文件
            /* if (this.state.currInitialData) {
                deleteStaticFile({ id: this.state.currInitialData.id })
            }
            this.setState({ currInitialData: filedata }) */
            //this.props.props.form.setFieldsValue({ attachment: resp.id ? attachment : null })
            this.props.props.form.setFieldsValue({attachment:this.state.fileArray});
            //？？子组件向父组件传值，将服务器返回的数据传给父组件，通过props form
            //给attachment赋值
        });
        return false;
        return false;
    }

    removePicFile = (file) => {
        // 上传图片到静态服务器
        const {
			actions: { deleteStaticFile }
		} = this.props.props;

        // 删除 之前的文件
        /* const picFile = this.state.currInitialData;
        if (picFile) {
            const currentPicId = picFile.id;
            deleteStaticFile({
                id: currentPicId
            }, {}, {
                    'Authorization': 'Basic aml4aTpqaXhp',
                }).then(resp => {
                    if (!resp) {
                        this.setState({ currInitialData: null })
                    }
                });
        } else { // 删除 coverPicFileInfo
            this.setState({ currInitialData: null })
        } */
        debugger
        const id = file.uid;
        deleteStaticFile({id:id},{},{'Authorization': 'Basic aml4aTpqaXhp'}).then(resp => {
            debugger
            if(!resp){
                // delete success
				let fileArray = this.state.fileArray;
				for(let i=0;i<fileArray.length;i++){
					if(fileArray[i].uid===file.uid){
						fileArray.splice(i,1);
						break;
					}
				}
				this.setState({fileArray:fileArray});
            }
        })
        return true;
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
			form: { getFieldDecorator }
		} = this.props.props;//获取 父组件传来的props 获取父组件的form  在下面进行调用
        return (
            <Form>
                {/* <FormItem
                    {...formItemLayout}
                    label={`管理制度名称`}
                    hasFeedback
                >
                    {
                        getFieldDecorator('institutionName', {
                            rules: [
                                { required: true, message: `请输入管理制度名称` }
                            ],
                        })(
                            <Input placeholder={`请输入管理制度名称`} />
                            )
                    }
                </FormItem> */}
                <FormItem
                    {...formItemLayout}
                    label={`工程名称`}
                    hasFeedback
                >
                    {
                        getFieldDecorator('projectName', { //父组件的form 获取数据 ，进行交互
                            initialValue: this.props.state.projectName,//获取 父组件state中的projectName
                            rules: [
                                { required: true, message: `请输入工程名称` }
                            ],
                        })(
                            <Input disabled placeholder="未获取到工程名称" />
                            )
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='安全管理制度'
                    hasFeedback
                >
                    {
                        getFieldDecorator('attachment', {
                            rules: [
                                { required: true, message: '请至少上传一个文件' }
                            ],
                            valuePropName: 'fileList',
                            getValueFromEvent: this.coverPicFile,
                        })(
                            <Upload beforeUpload={this.beforeUploadPicFile.bind(this)} onRemove={this.removePicFile.bind(this)}>
                                <Button>
                                    <Icon type="upload" />添加文件
                            </Button>
                            </Upload>
                            )
                    }
                </FormItem>
            </Form>
        )
    }
}