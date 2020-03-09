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
    Row,
    Col,
    Form
} from 'antd';
const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};
class AgainCheckModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            CheckType: '',
            ThinClassLength: 0,
            ThinClass: [], // 勾选中的细班
            thinClassList: [], // 细班列表
            checkStatus: '', // 审核结果
            fileListNew: [], // 附件列表
            loading: false, // 加载
            opinion: '', // 意见
            supervisor: '', // 监理
            owner: '' // 业主
        };
    }
    componentDidMount () {

    }
    handleOk () {
        const { checkRemark, checkStatus } = this.state;
        let param = {
            checkRemark,
            checkStatus
        };
        this.props.handleOk(param);
    }
    handleCheckStatusChange (value) {
        this.setState({
            checkStatus: value
        });
    }
    handleCheckRemark (e) {
        this.setState({
            checkRemark: e.target.value
        });
    }
    render () {
        return (<div>
            <Modal
                title='审核'
                visible={this.props.checkModalVisible}
                onCancel={this.props.handleCancel}
                onOk={this.handleOk.bind(this)}
            >
                <Form {...formItemLayout}>
                    <Form.Item label='审核结果' >
                        <Select
                            allowClear
                            onChange={this.handleCheckStatusChange.bind(this)}
                            style={{ width: 223 }}>
                            <Option value={1}>审核通过</Option>
                            <Option value={0}>审核不通过</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='备注'>
                        <TextArea
                            onChange={this.handleCheckRemark.bind(this)}
                            rows={4}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>);
    }
}
export default Form.create()(AgainCheckModal);
