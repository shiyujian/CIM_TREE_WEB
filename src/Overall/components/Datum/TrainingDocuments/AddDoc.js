import React, { Component } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Modal,
    Upload,
    Button,
    Icon,
    Notification,
    Table,
    DatePicker,
    Spin
} from 'antd';
import moment from 'moment';
import {getUser} from '_platform/auth';
const Dragger = Upload.Dragger;

class AddDoc extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            fileListNew: []
        };
    }

    docCols = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '备注',
            render: doc => {
                return <Input onChange={this.remark.bind(this, doc)} />;
            }
        },
        {
            title: '操作',
            render: doc => {
                return <a onClick={this.remove.bind(this, doc)}>删除</a>;
            }
        }
    ];

    cancel () {
        this.props.handleCloseAddDocCancel();
    }

    remark (doc, event) {
        doc.remark = event.target.value;
    }

    remove (doc) {
        let { fileListNew } = this.state;
        let fileList = [];
        fileListNew.map(item => {
            if (item.uid !== doc.uid) {
                fileList.push(item);
            }
        });
        this.setState({
            fileListNew: fileList
        });
    }

    uploadPropsFile = {
        name: 'file',
        showUploadList: true,
        action: '',
        beforeUpload: (file, fileList) => {
            this.setState({
                loading: true
            });
            const { fileListNew } = this.state;
            const {
                actions: {
                    uploadFileHandler
                }
            } = this.props;
            if (fileListNew && fileListNew.length >= 10) {
                Notification.warning({
                    message: '一次最多添加10个！'
                });
                this.setState({
                    loading: false
                });
                return false;
            } else {
                const formdata = new FormData();
                formdata.append('file', fileList[0]);
                uploadFileHandler({}, formdata).then(rep => {
                    file.url = rep;
                    fileListNew.push(file);
                    console.log(fileListNew, '附件');
                    this.setState({
                        loading: false,
                        fileListNew
                    });
                });
                return false;
            }
        },
        onRemove: (file) => {
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
        onChange: async ({file, fileList}) => {

        }
    };
    save = async () => {
        const {
            fileListNew = []
        } = this.state;
        this.props.handleAddDocOk(fileListNew);
    }

    render () {
        const {
            loading,
            fileListNew
        } = this.state;
        return (
            <Modal
                title='新增资料'
                width={920}
                visible
                closable={false}
                footer={null}
                maskClosable={false}
            >
                <Spin spinning={loading}>
                    <Form>
                        <Row gutter={24}>
                            <Col
                                span={24}
                                style={{ marginTop: 16, height: 160 }}
                            >
                                <Dragger
                                    {...this.uploadPropsFile}
                                    fileList={this.state.fileListNew}
                                    showUploadList={false}
                                >
                                    <p className='ant-upload-drag-icon'>
                                        <Icon type='inbox' />
                                    </p>
                                    <p className='ant-upload-text'>
                                        点击或者拖拽开始上传
                                    </p>
                                    {/* <p className='ant-upload-hint'>
                                        支持 pdf、doc、docx 文件
                                    </p> */}
                                </Dragger>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 35 }}>
                            <Col span={24}>
                                <Table
                                    columns={this.docCols}
                                    dataSource={fileListNew}
                                    bordered
                                    rowKey='uid'
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                key='submit'
                                type='primary'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.save.bind(this)}
                            >
                            确定
                            </Button>
                            <Button
                                key='back'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.cancel.bind(this)}>
                            关闭
                            </Button>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
export default Form.create()(AddDoc);
