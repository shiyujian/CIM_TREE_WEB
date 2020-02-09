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

        };
    }
    componentDidMount () {

    }
    onTreeTypeChange () {

    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const props = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text',
            },
            onChange (info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
        };
        const {
            treeTypeName
        } = this.state;
        return (<div>
            <Modal
                title='重新验收'
                okText='提交'
                visible={this.props.againCheckModalVisible}
                onCancel={this.props.handleCancel}
                onOk={this.props.handleOk}
            >
                
            </Modal>
        </div>);
    }
}
export default Form.create()(AgainCheckModal);
