import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Upload,
    Icon,
    Row,
    Col,
    Button,
    Notification,
    Spin,
    TreeSelect
} from 'antd';
import { getUser } from '_platform/auth';
import E from 'wangeditor';
import moment from 'moment';
import 'moment/locale/zh-cn';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
let editor;

class ReceivePageModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileList: [],
            content: '', // 富文本的内容
            progress: 0,
            fileListNew: [], // 附件
            loading: false
        };
    }
    // 如果父级为公司，则可以呗选中，如果为项目，不能呗选中
    static loop (data = [], companyStatus = false) {
        if (companyStatus) {
            return null;
        }
        return data.map(item => {
            if (item && item.OrgCode) {
                if (item.OrgType) {
                    if (item.OrgType.indexOf('单位') !== -1) {
                        companyStatus = true;
                    } else if (item.OrgType === '非公司') {
                        companyStatus = false;
                    }
                };
                if (item && item.OrgPK) {
                    companyStatus = true;
                };
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={`${JSON.stringify(item)}`}
                            disabled={!companyStatus}
                            title={`${item.OrgName}`}
                            value={`${item.ID}`}
                        >
                            {ReceivePageModal.loop(item.children, companyStatus)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${JSON.stringify(item)}`}
                            disabled={!companyStatus}
                            title={`${item.OrgName}`}
                            value={`${item.ID}`}
                        />
                    );
                }
            } else {
                companyStatus = false;
                if (item && item.Orgs && item.Orgs.length > 0) {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            disabled
                            title={`${item.ProjectName}`}
                        >
                            {ReceivePageModal.loop(item.Orgs, companyStatus)}
                        </TreeNode>
                    );
                } else {
                    return (
                        <TreeNode
                            key={`${item.ID}`}
                            value={`${item.ID}`}
                            disabled
                            title={`${item.ProjectName}`}
                        />
                    );
                }
            }
        });
    }
    componentDidMount () {
        const {
            actions: { uploadFileHandler }
        } = this.props;
        const elem = this.refs.editorElem;
        editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                content: html
            });
        };
        editor.customConfig.zIndex = 900;
        editor.customConfig.uploadImgTimeout = 15000;
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
        editor.customConfig.menus = [
            'head', // 标题
            'bold', // 粗体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            // 'quote',  // 引用
            // 'emoticon',  // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            // 'code',  // 插入代码
            'undo', // 撤销
            'redo' // 重复
        ];
        editor.customConfig.customUploadImg = function (files, insert) {
            console.log('files', files);
            console.log('file', files[0]);

            const formdata = new FormData();
            formdata.append('file', files[0]);
            uploadFileHandler({}, formdata).then(rep => {
                if (rep && rep.indexOf('https') !== -1) {
                    insert(rep);
                } else {
                    alert('上传失败');
                }
            });
        };
        editor.create();
    }

    uploadPropsFile = {
        name: 'file',
        showUploadList: true,
        action: '',
        beforeUpload: (file, fileList) => {
            this.setState({
                progress: 0,
                loading: true
            });
            let { fileListNew } = this.state;
            const { uploadFileHandler } = this.props.actions;
            const formdata = new FormData();
            formdata.append('file', fileList[0]);
            uploadFileHandler({}, formdata).then(rep => {
                file.url = rep;
                fileListNew.push(file);
                console.log(fileListNew, '附件');
                this.setState({
                    progress: 1,
                    loading: false,
                    fileListNew
                });
            });
            return false;
        },
        onRemove: file => {
            let { fileListNew } = this.state;
            let fileList = [];
            fileListNew.map(item => {
                if (item.uid !== file.uid) {
                    fileList.push(item);
                }
            });
            this.setState({
                fileListNew: fileList
            });
        },
        onChange: async ({ file, fileList }) => {}
    };

    closeModal () {
        this.props.closeSendModal();
    }

    // 发送文件
    _sendDoc () {
        const {
            actions: {
                postDddDispatch
            },
            form: { validateFields },
            parentOrgID,
            personOrgID,
            receiveRecordDetail
        } = this.props;
        const {
            content,
            fileListNew
        } = this.state;
        validateFields((err, values) => {
            if (!err) {
                if (fileListNew.length === 0) {
                    Notification.warning({
                        message: '请上传文件！',
                        duration: 3
                    });
                    return;
                }
                let fileList = '';
                fileListNew.map(item => {
                    if (item) {
                        if (fileList) {
                            fileList = fileList + ',' + item.url;
                        } else {
                            fileList = item.url;
                        }
                    }
                });
                console.log(fileListNew, '发布');
                let sendData = [{
                    FileName: values.title3,
                    Text: content,
                    Accessories: fileList,
                    ReceivingUnit: receiveRecordDetail.Communicationsunit,
                    CopyUnit: '',
                    Communicationsunit: parentOrgID || personOrgID
                }];
                postDddDispatch({}, sendData).then(rst => {
                    console.log('rst', rst);
                    if (rst && rst.code && rst.code === 1) {
                        Notification.success({
                            message: '回文成功！',
                            duration: 3
                        });
                        this.closeModal();
                    } else {
                        Notification.error({
                            message: '回文失败！',
                            duration: 3
                        });
                    }
                });
            }
        });
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { loading } = this.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        };
        return (
            <Modal
                title={'发文'}
                wrapClassName='edit-box'
                visible
                width='80%'
                maskClosable={false}
                onOk={this._sendDoc.bind(this)}
                onCancel={this.closeModal.bind(this)}
            >
                <Spin spinning={loading}>
                    <Form>
                        <Row>
                            <Col>
                                <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label='文件标题'
                                    >
                                        {getFieldDecorator('title3', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入文件标题'
                                                }
                                            ],
                                            initialValue: ''
                                        })(
                                            <Input
                                                type='text'
                                                placeholder='文件标题'
                                            />
                                        )}
                                    </FormItem>
                                </Row>
                                <Row>
                                    <Col span={21} offset={2}>
                                        <div ref='editorElem' />
                                    </Col>
                                </Row>
                                <Row style={{marginTop: 24}}>
                                    <FormItem
                                        {...formItemLayout}
                                        label='附件上传'
                                    >
                                        {getFieldDecorator('fileList', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请上传文档'
                                                }
                                            ],
                                            initialValue: ''
                                        })(
                                            <Upload
                                                fileList={
                                                    this.state.fileListNew
                                                }
                                                {...this.uploadPropsFile}
                                            >
                                                <Button size='small'>
                                                    <Icon type='upload' />
                                                    上传文档
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(ReceivePageModal);
