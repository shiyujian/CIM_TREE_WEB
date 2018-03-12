import React, { Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table, DatePicker, Progress, Select,
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
            return node.Type === '子项目工程';
        })
        this.areaArray = [];
        nodeArray.map(item => {
            this.areaArray.push(<Option value={item.No+'--'+item.Name}>{item.Name}</Option>)
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
            this.unitArray.push(<Option value={item.No+'--'+item.Name}>{item.Name}</Option>)
        })
    }
    render() {
        const {
            form: { getFieldDecorator },
            additionVisible = false,
		} = this.props;
        const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
        };
        // debugger
        let { progress, isUploading } = this.state;
        let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
        let footer = isUploading ? null : arr;
        return (
            <Modal title="新增资料"
                width={920} visible={additionVisible}
                closable={false}
                footer={footer}
                maskClosable={false}>
                <Form>
                    <FormItem {...formItemLayout} label="区域">
                        {getFieldDecorator('area', {
                            // initialValue: this.props.record.area,
                            rules: [
                                { required: true, message: '请选择区域' },
                            ]
                        })(<Select placeholder='请选择区域'  onChange={this.onSelectChange.bind(this)}>
                            {this.areaArray}
                        </Select>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="单位工程">
                        {getFieldDecorator('unitProject', {
                            // initialValue: this.props.record.unitProject,
                            rules: [
                                { required: true, message: '请选择单位工程' },
                            ]
                        })(<Select placeholder='请选择单位工程'>
                                {this.unitArray}
                            </Select>)
                        }
                    </FormItem>
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
                            getValueFromEvent: this.coverPicFile,
                        }, {})(
                            <Upload {...this.uploadProps}
                            // accept={fileTypes}
                            // defaultFileList={this.state.fileArray || []}
                            >
                                <Button>
                                    <Icon type="upload" />添加文件
                                    </Button>
                            </Upload>
                            )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }

    cancel() {
        const {
            actions: { toggleAddition }
        } = this.props;
        toggleAddition(false);
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
        beforeUpload(file) {
            const valid = fileTypes.indexOf(file.type) >= 0;
            //console.log(file);
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
            }
            return valid;
        },
    };

    save() {
        const {
            currentcode = {},
            actions: { toggleAddition, postDocument,getdocument }
        } = this.props;
        this.props.form.validateFields((err, values) => {
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
                        unitProject: values.unitProject.split('--')[1],
                        people: user.username,
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