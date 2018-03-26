import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input,Button, Row, Col, Modal, Upload,DatePicker,Progress,
    Icon, message, Table,Select
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
const FormItem = Form.Item;
const Option = Select.Option;
moment.locale('zh-cn');
import { getUser } from '_platform/auth';
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';

class Updatemodal extends Component {

    static propTypes = {};
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
        }
		if (e.file.status === 'done' && !e.file.response.a_file) {
			return []
        }
        let array = [];
        let length = e.fileList.length - 1;
        array.push(e.fileList[length])
        this.name = e.file.name
		return e && array;
	}
    componentDidUpdate(){
        let array = this.props.array;
        let nodeArray = array.filter(node => {
            return node.Type === '项目工程';
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
        const {oldfile = {}}=this.props;
        const {
            form: { getFieldDecorator },
            additionVisible = false,
        } = this.props;
        const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};
        const{
            updatevisible = false
        } = this.props;
        // debugger
        let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
        let footer = arr;
        return (
            <Modal title="编辑资料"
                width={920} visible={updatevisible}
                closable={false}
                footer={footer}
                maskClosable={false}>
                <Form>
                    <FormItem {...formItemLayout} label="项目">
                        {getFieldDecorator('area1', {
                            initialValue: oldfile.area,
                            rules: [
                                { required: true, message: '请选择项目' },
                            ]
                        })(<Select placeholder='请选择项目'  onChange={this.onSelectChange.bind(this)}>
                            {this.areaArray}
                        </Select>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="标段">
                        {getFieldDecorator('unitProject1', {
                            initialValue: oldfile.unitProject,
                            rules: [
                                { required: true, message: '请选择标段' },
                            ]
                        })(<Select placeholder='请选择标段'>
                                {this.unitArray}
                            </Select>)
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称">
                        {getFieldDecorator('name1', {
                            initialValue: oldfile.name,
                            rules: [
                                { required: true, message: '请输入名称' },
                            ]
                        })(
                            <Input type="text" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="编号">
                        {getFieldDecorator('number1', {
                            initialValue: oldfile.extra_params ? oldfile.extra_params.number : '',
                            rules: [
                                { required: true, message: '请输入编号' },
                            ]
                        })(
                            <Input type="text" />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="文档类型">
                        {getFieldDecorator('doc_type1', {
                            initialValue: this.props.doc_type,
                            rules: [
                                { required: true, message: '未获取到文档类型' },
                            ]
                        })(
                            <Input type="text" readOnly />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="上传文件">
                        {getFieldDecorator('attachment1', {
                            initialValue: oldfile.basic_params ? oldfile.basic_params.files : [],
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
                            accept={fileTypes}
                            // defaultFileList={oldfile.basic_params ? oldfile.basic_params.files[0] : []}
                            >
                                <Button>
                                    <Icon type="upload" />添加文件
                                    </Button>
                            </Upload>
                            )}
                    </FormItem>
                </Form>
            </Modal>
        )}

    cancel() {
        const {
            actions: {updatevisible}
        } = this.props;
        updatevisible(false);
    }

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: true,
        data(file) {
            return {
                name: file.fileName,
                a_file: file
            };
        },
        beforeUpload(file) {
            const valid = fileTypes.indexOf(file.type) >= 0;
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
                this.props.form.setFieldsValue({
                    attachment1:undefined
                })
            }
            return valid;
        },
    };

    save() {
        const {
            currentcode = {},
            actions: { updatevisible, putdocument,getdocument }
        } = this.props;
        this.props.form.validateFields((err, values) => {
            if(!err){
                let user = getUser();
                // debugger
                let resp = values.attachment1[0].response ? values.attachment1[0].response : values.attachment1[0];
                let postData = {
                    name: values.name1,
                    basic_params: {
                        files: [{
                            "misc": resp.misc,
                            "download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            "a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            "create_time": resp.create_time,
                            "mime_type": resp.mime_type,
                            "name":resp.name
                        }]
                    },
                    extra_params: {
                        number: values.number1,
                        area: values.area1.split('--')[1],
                        unitProject: values.unitProject1.split('--')[1],
                        people: user.username,
                        unit:user.org,
                        doc_type: values.doc_type1,
                        time: moment.utc().format('YYYY-MM-DD')
                    },
                }
                putdocument({code:this.props.oldfile.code},postData).then(rst => {
                    message.success('修改文件成功！');
                    updatevisible(false);
                    getdocument({ code: currentcode.code });
                })
            }
        })
    }

}
export default Form.create()(Updatemodal);
