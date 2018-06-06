import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input,Button, Row, Col, Modal, Upload,DatePicker,Progress,
    Icon, message, Table,Spin,Select
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option
const fileTypes = 'video/mp4,.mp4,';
export const Datumcode = window.DeathCode.DATUM_VIDEO;

class Updatemodal extends Component {

    static propTypes = {};

    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    state={
        progress:0,
        isUploading: false
    }

    componentDidUpdate(prevProps,prevState){
        const{
            oldfile,
            form: {
                setFieldsValue
            },
            updatevisible
        }=this.props
        if(oldfile != prevProps.oldfile || updatevisible != prevProps.updatevisible){
            setFieldsValue(
                {
                    name1:oldfile.name?oldfile.name:'',
                    type1:oldfile.extra_params.type?oldfile.extra_params.type:'',
                    remark1:oldfile.extra_params.remark?oldfile.extra_params.remark:'',
                    attachment1:oldfile.basic_params.files?oldfile.basic_params.files:[],
                }
            )
        }
    }

    render() {
        const{
            form: { getFieldDecorator },
            updatevisible = false,
            docs = [],
            oldfile = {}
        } = this.props;

        const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};

        let {progress,isUploading} = this.state;
        let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
        let footer = isUploading ? null : arr;
        return (
            <div>
                {
                    !updatevisible?
                    null:
                    <Modal title="编辑资料"
                        width={920} visible={updatevisible}
                        closable={false}
                        footer={footer}
                        maskClosable={false}>
                        <Spin spinning={isUploading}>
                            <Form>
                                <FormItem {...formItemLayout} label="更新名称">
                                    {getFieldDecorator('name1', {
                                        // initialValue:oldfile && oldfile.name ,
                                        rules: [
                                            { required: true, message: '请输入更新名称' },
                                        ]
                                    })(<Input type="text" readOnly/>)
                                    }
                                </FormItem>
                                
                                <FormItem {...formItemLayout} label="视频类型">
                                    {getFieldDecorator('type1', {
                                        // initialValue:oldfile && oldfile.extra_params &&  oldfile.extra_params.number,
                                        rules: [
                                            { required: true, message: '请选择视频类型' },
                                        ]
                                    })(<Select placeholder='请选择视频类型' >
                                            <Option key={'宣传片'} value={'宣传片'}>宣传片</Option>
                                            <Option key={'操作视频'} value={'操作视频'}>操作视频</Option>
                                        </Select>)
                                    }
                                </FormItem>
                                <FormItem {...formItemLayout} label="备注">
                                    {getFieldDecorator('remark1', {
                                        // initialValue: oldfile && oldfile.extra_params &&  oldfile.extra_params.remark,
                                        rules: [
                                            { required: false, message: '请输入备注' },
                                        ]
                                    })(
                                        <Input type="text"  />
                                        )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="上传文件">
                                    {getFieldDecorator('attachment1', {
                                        // initialValue: oldfile.basic_params ? oldfile.basic_params.files : [],
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
                                        // defaultFileList={oldfile.basic_params ? oldfile.basic_params.files[0] : []}
                                        >
                                            <Button>
                                                <Icon type="upload" />添加文件
                                                </Button>
                                        </Upload>
                                        )}
                                </FormItem>
                            </Form>
                        </Spin>
                    </Modal>
                }
            </div>
        );
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        let len = e.fileList.length
        if(len>0){
            return e && [e.fileList[len-1]];
        }else{
            return e && e.fileList;
        }
        
    }

    cancel() {
        const {
            actions: {updatevisible,changeDocs}
        } = this.props;
        updatevisible(false);
	    changeDocs();
        this.setState({
            progress:0
        })
    }

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: true,
        data:(file)=> {
            return {
                name: file.fileName,
                a_file: file
            };
        },
        beforeUpload:(file) => {
            this.setState({ 
                progress: 0,
                isUploading:true 
            })
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

    changeDoc({file, fileList, event}) {
        const{
            form:{setFieldsValue}
        }=this.props
        if (file && file.status && file.status === 'done') {
            setFieldsValue(
                {
                    name1:file.name?file.name:'',
                }
            )
            this.setState({
                isUploading:false
            })
        }else if(file && file.status && file.status === 'removed'){
            setFieldsValue({
                attachment1:undefined
            })
        }
    }



    save() {
        const {
            docs = [],
            actions: {updatevisible, postDocument, getdocument,changeDocs,PatchDocument,putdocument}
        } = this.props;


        this.props.form.validateFields((err, values) => {
            console.log('values',values)
            if(!err){
                // debugger
                console.log('values.attachment1',values.attachment1)
                let resp = values.attachment1[0].response ? values.attachment1[0].response : values.attachment1[0];
                let name = values.attachment1[0]?(values.attachment1[0].name?values.attachment1[0].name:''):''
                console.log('resp',resp)
                let postData = {
                    name: values.name1,
                    basic_params: {
                        files: [{
                            "uid": resp.id?resp.id:resp.uid,
                            "misc": resp.misc,
                            "download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            "a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            "create_time": resp.create_time,
                            "mime_type": resp.mime_type,
                            "name": name
                        }]
                    },
                    extra_params: {
                        type:values.type1,
                        time: moment.utc().format('YYYY-MM-DD'),
                        remark: values.remark1,
                        lasttime: moment(resp.lastModifiedDate).format('YYYY-MM-DD'),
                        state: '正常文档',
                        submitTime: moment.utc().format()
                    },
                }
                putdocument({code:this.props.oldfile.code},postData).then(rst => {
                    if(rst && rst.pk){
                        message.success('修改文件成功！');
                    }else{
                        message.error('修改文件失败！');
                    }
                    
                    changeDocs([]);
                    updatevisible(false);
                    getdocument({ code: Datumcode });
                })
            }
        })
    }

}
export default Form.create()(Updatemodal);
