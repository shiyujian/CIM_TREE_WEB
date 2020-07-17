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
            fileList: []
        };
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleOk () {
        const { fileList } = this.state;
        const {
            actions: { shapeUploadHandler }
        } = this.props;
        const formdata = new FormData();
        formdata.append('file', fileList[0]);
        shapeUploadHandler({
            name: fileList[0].name.split('.')[0]
        }, formdata).then(rep => {
            console.log('成功', rep);
            // 清除不规范字符
            rep = rep.replace(/\\/g, ' ');
            rep = typeof rep === 'string' ? JSON.parse(rep) : rep;
            if (rep && rep.features) {
                console.log('关闭导入');
                this.props.handleCancel();
                this.props.handlePolygon(rep.features[0].Geom);
            }
        });
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
                    fileList
                });
                return false;
            },
            onRemove: (file) => {
                this.setState({
                    fileList: []
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