import React, { Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table, DatePicker, Progress, Select,Spin
} from 'antd';
import moment from 'moment';
import { getUser } from '_platform/auth';
import { DeleteIpPort } from '../../../_platform/components/singleton/DeleteIpPort';
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const FormItem = Form.Item;
const Option = Select.Option;
moment.locale('zh-cn');
class Addition extends Component {
    state = {
        progress: 0,
        isUploading: false
    }
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
        }
		if (e.file.status === 'done' && !e.file.response.a_file) {
			return []
        }
        let array = [];
        let length = e.fileList.length - 1;
        if(e.file.status === 'done' && e.file.response.a_file){
            e.fileList[length].response.name = e.file.name;
        }
        array.push(e.fileList[length])
		return e && array;
	}
    componentDidUpdate(){
        let array = this.props.array;
        let nodeArray = array.filter(node => {
            return node.Type === '项目工程';
        })
        this.areaArray = [];
        nodeArray.map(item => {
            this.areaArray.push(<Option value={item.No+'--'+item.Name} key={item.No}>{item.Name}</Option>)
        })
    }
    onSelectChange(value){
        this.props.form.setFieldsValue({
            unitProject: undefined,
        })
        let temp = value.split('--')[0]
        this.unitArray = [];
        let array = this.props.array;
        let nodeArray = array.filter(node =>{
            return node.Type === '单位工程' && node.No.indexOf(temp) !== -1;
        })
        nodeArray.map(item => {
            this.unitArray.push(<Option value={item.No+'--'+item.Name}  key={item.No}>{item.Name}</Option>)
        })
    }

    render() {
        const {
            form: { getFieldDecorator },
            additionVisible = false,
            selectDoc,
			parent 
        } = this.props;
        let { 
            progress, 
            isUploading 
        } = this.state;
        //判断选中的是哪个节点下的文件夹
		let canSection = false
		if(selectDoc === '综合管理性文件' || parent === '综合管理性文件'){
			canSection = true
        }
        
        const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
        };
        
        //modal的底部
        
        let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
        let footer = isUploading ? null : arr;

        
        return (
            <div>
                {
                !additionVisible
                ? null
                :
                <Modal title="新增资料"
                    width={920} visible={additionVisible}
                    closable={false}
                    footer={footer}
                    maskClosable={false}>
                    <Spin spinning={isUploading}>
                        <Form>
                            <FormItem {...formItemLayout} label="项目">
                                {getFieldDecorator('area', {
                                    // initialValue: this.props.record.area,
                                    rules: [
                                        { required: true, message: '请选择项目' },
                                    ]
                                })(<Select placeholder='请选择项目'  onChange={this.onSelectChange.bind(this)}>
                                    {this.areaArray}
                                </Select>)
                                }
                            </FormItem>

                            {
                                canSection
                                ? ''
                                : <FormItem {...formItemLayout} label="标段">
                                    {getFieldDecorator('unitProject', {
                                        // initialValue: this.props.record.unitProject,
                                        rules: [
                                            { required: true, message: '请选择标段' },
                                        ]
                                    })(<Select placeholder='请选择标段'>
                                            {this.unitArray}
                                        </Select>)
                                    }
                                </FormItem>
                            }
                            <FormItem {...formItemLayout} label="名称">
                                {getFieldDecorator('name', {
                                    // initialValue: this.props.record.name,
                                    rules: [
                                        { required: true, message: '请输入名称' },
                                    ]
                                })(
                                    <Input type="text" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="编号">
                                {getFieldDecorator('number', {
                                    // initialValue: this.props.record.number,
                                    rules: [
                                        { required: true, message: '请输入编号' },
                                    ]
                                })(
                                    <Input type="text" />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="文档类型">
                                {getFieldDecorator('doc_type', {
                                    initialValue: this.props.doc_type,
                                    rules: [
                                        { required: true, message: '未获取到文档类型' },
                                    ]
                                })(
                                    <Input type="text" readOnly />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="上传文件">
                                {getFieldDecorator('attachment', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请至少上传一个文件！',
                                        }
                                    ],
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile,
                                }, {})(
                                    <Upload {...this.uploadProps}
                                    accept={fileTypes}
                                    onChange={this.changeDoc.bind(this)}
                                    // defaultFileList={this.state.fileArray || []}
                                    >
                                        <Button>
                                            <Icon type="upload" />添加文件
                                            </Button>
                                    </Upload>
                                    )}
                            </FormItem>
                        </Form>
                    </Spin>
                </Modal>}
            </div>
            
        );
    }

    cancel() {
        const {
            actions: { toggleAddition }
        } = this.props;
        toggleAddition(false);
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    }

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: true,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload:(file) => {
            this.setState({ 
                progress: 0,
                isUploading:true 
            });
            const valid = fileTypes.indexOf(file.type) >= 0;

            console.log('valid',valid);
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
                
                this.props.form.setFieldsValue({
                    attachment:undefined
                })
                return false
            }else{
                return valid;
            }
           
        },
    };

    changeDoc({file, fileList, event}) {
        const{
            form:{setFieldsValue}
        }=this.props
        if (file && file.status && file.status === 'done') {
            this.setState({
                isUploading:false
            })
        }else if(file && file.status && file.status === 'removed'){
            console.log('filefilefilefilefilefile')
            setFieldsValue({
                attachment:undefined
            })
        }
    }

    save() {
        const {
            currentcode = {},
            actions: { toggleAddition, postDocument,getdocument },
            selectDoc,
			parent 
        } = this.props;
        //判断选中的是哪个节点下的文件夹
		let canSection = false
		if(selectDoc === '综合管理性文件' || parent === '综合管理性文件'){
			canSection = true
        }
        this.props.form.validateFields((err, values) => {
            console.log('values',values)
            if(!err){
                
                let user = getUser();
                // debugger
                let resp = values.attachment[0].response;
                let postData = {
                    code: `${currentcode.code}_${resp.id}`,
                    name: values.name,
                    obj_type: 'C_DOC',
                    profess_folder: {
                        code: currentcode.code, obj_type: 'C_DIR',
                    },
                    basic_params: {
                        files: [{
                            "uid": resp.id,
                            "misc": resp.misc,
                            "download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            "a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            "create_time": resp.create_time,
                            "mime_type": resp.mime_type,
                            "name":resp.name
                        }]
                    },
                    extra_params: {
                        number: values.number,
                        area: values.area.split('--')[1],
                        unitProject: canSection ? '' : values.unitProject.split('--')[1],
                        people: user.name,
                        username: user.username,
                        unit:user.org,
                        doc_type: values.doc_type,
                        time: moment.utc().format('YYYY-MM-DD')
                    },
                }
                postDocument({},postData).then(rst => {
                    message.success('新增文件成功！');
                    toggleAddition(false);
                    getdocument({ code: currentcode.code });
                })
            }
        })
    }

}
export default Form.create()(Addition);