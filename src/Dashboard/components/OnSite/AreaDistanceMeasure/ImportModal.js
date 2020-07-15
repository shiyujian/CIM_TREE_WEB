import React, { Component } from 'react';
import { Button, Radio, Modal, Tabs, Table, Form, Select, Tree, Spin, Row, Icon, Upload } from 'antd';
import echarts from 'echarts';
import XLSX from 'xlsx';
import './CoverageModal.less';
const TreeNode = Tree.TreeNode;
const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const FormItem = Form.Item;
const Option = Select.Option;
const EchartsColor = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0'];
export default class AreaDistanceMeasure extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleOk () {

    }
    render () {
        const {
        } = this.state;
        let props = {
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
                    this.setState({
                        fileUrl: rep,
                        progress: 1,
                        loading: false,
                        fileListNew
                    });
                });
                return false;
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
                    fileUrl: '',
                    fileListNew: fileList
                });
            }
        };
        return (
            <Modal
                visible
                title='导入范围'
                className='import_modal'
                onCancel={this.handleCancel.bind(this)}
                onOk={this.handleOk.bind(this)}
            >
                <Form {...formItemLayout}>
                    <FormItem label='上传文件'>
                        <Upload {...props}>
                            <Button>
                                <Icon type='upload' /> 上传附件
                            </Button>
                        </Upload>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}