import React, {
    Component
} from 'react';
import {
    Icon,
    Button,
    Input,
    Modal,
    Select,
    Upload,
    message,
    Form
} from 'antd';
const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
class AgainCheckModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 0,
            fileUrl: '', // 附件地址
            fileListNew: [], // 附件列表
            loading: false, // 加载
            opinion: '', // 意见
            treeType: [] // 树种数组
        };
    }
    componentDidMount () {

    }
    onTreeTypeChange () {

    }
    handleTreeTypeChange (value) {
        console.log('树种', value);
        this.setState({
            treeType: value
        });
    }
    handleOpinionChange (e) {
        this.setState({
            opinion: e.target.value
        });
    }
    handleOk () {
        const {
            form: { validateFields }
        } = this.props;
        const { treeType, opinion, fileUrl } = this.state;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            let param = {
                treeType,
                owner: values.owner,
                supervisor: values.supervisor,
                opinion,
                fileUrl
            };
            this.props.handleOk(param);
        });
    }
    render () {
        const {
            form: {
                getFieldDecorator
            }
        } = this.props;
        const props = {
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
                    console.log(rep, '附件');
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
        return (<div>
            <Modal
                title='重新验收'
                okText='提交'
                visible={this.props.againCheckModalVisible}
                onCancel={this.props.handleCancel}
                onOk={this.handleOk.bind(this)}
            >
                <Form {...formItemLayout}>
                    <Form.Item label='重新验收树种'>
                        <Select
                            mode='multiple'
                            allowClear showSearch
                            filterOption={
                                (input, option) => {
                                    return option.props.children[1].toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                            }
                            onChange={this.handleTreeTypeChange.bind(this)}
                            style={{ width: 240 }}>
                            {this.props.treetypeoption}
                        </Select>
                    </Form.Item>
                    <Form.Item label='审核监理'>
                        {
                            getFieldDecorator('supervisor', {
                                rules: [{ required: true, message: '请选择' }],
                                initialValue: ''
                            })(
                                <Select
                                    allowClear showSearch
                                    filterOption={
                                        (input, option) => {
                                            return option.props.children[0]
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0;
                                        }
                                    }
                                    style={{ width: 240 }}>
                                    {this.props.jianliOptions}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item label='审核业主'>
                        {
                            getFieldDecorator('owner', {
                                rules: [{ required: true, message: '请选择' }],
                                initialValue: ''
                            })(
                                <Select
                                    allowClear showSearch
                                    filterOption={
                                        (input, option) => {
                                            return option.props.children[0]
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0;
                                        }
                                    }
                                    style={{ width: 240 }}>
                                    {this.props.yezhuOptions}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <TextArea
                        rows={6}
                        maxLength={200}
                        allowClear
                        onChange={this.handleOpinionChange.bind(this)} />
                    <Upload {...props}>
                        <Button>
                            <Icon type='upload' /> 上传附件
                        </Button>
                    </Upload>
                </Form>
            </Modal>
        </div>);
    }
}
export default Form.create()(AgainCheckModal);
