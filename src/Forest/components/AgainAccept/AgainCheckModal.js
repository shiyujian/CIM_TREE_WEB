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
import {
    getYsTypeByID,
    getStatusByID
} from './auth';
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
            checkItem: [{
                thinClassLength: 0,
                thinClassList: [],
                CheckType: 0,
                Section: '',
                ThinClass: [],
                TreeType: 0
            }], // 验收项
            progress: 0,
            fileUrl: '', // 附件地址
            fileListNew: [], // 附件列表
            loading: false, // 加载
            opinion: '', // 意见
            supervisor: '', // 监理
            owner: '' // 业主
        };
    }
    componentDidMount () {

    }
    handleOwnerChange (value) {
        this.setState({
            owner: value
        });
    }
    handleSupervisorChange (value) {
        this.setState({
            supervisor: value
        });
    }
    handleOpinionChange (e) {
        this.setState({
            opinion: e.target.value
        });
    }
    handleOk () {
        const { owner, supervisor, opinion, fileUrl, CheckType, thinClassList, ThinClass, ThinClassLength, checkItem } = this.state;
        checkItem.unshift({
            thinClassLength: ThinClassLength,
            thinClassList,
            CheckType,
            Section: '',
            ThinClass,
            TreeType: 0
        });
        let param = {
            owner,
            supervisor,
            opinion,
            fileUrl,
            checkItem
        };
        this.props.handleOk(param);
    }
    onAddCheckItem () {
        const { checkItem } = this.state;
        checkItem.push({
            thinClassLength: 0,
            thinClassList: [],
            CheckType: 0,
            Section: '',
            ThinClass: [],
            TreeType: 0
        });
        this.setState({
            checkItem
        });
    }
    onReduceCheckItem (key) {
        const { checkItem } = this.state;
        let newCheckItem = [];
        checkItem.map((item, index) => {
            if (index === key) {

            } else {
                newCheckItem.push(item);
            }
        });
        this.setState({
            checkItem: newCheckItem
        });
    }
    handleSmallClassChange (key, value) {
        const { checkItem } = this.state;
        if (key === -1) {
            let thinClassList = [];
            this.props.smallClassList.map(item => {
                if (value === item.No) {
                    thinClassList = item.children;
                }
            });
            this.setState({
                thinClassList
            });
        } else {
            let thinClassList = [];
            this.props.smallClassList.map(item => {
                if (value === item.No) {
                    thinClassList = item.children;
                }
            });
            checkItem.map((item, index) => {
                if (index === key) {
                    item.thinClassList = thinClassList;
                }
            });
            this.setState({
                checkItem
            });
        }
    }
    handleThinClassChange (key, value) {
        const { checkItem } = this.state;
        let ThinClassLength = 0;
        let ThinClass = [];
        if (key === -1) {
            ThinClassLength = value.length;
            ThinClass = value;
            this.setState({
                ThinClassLength,
                ThinClass
            });
        } else {
            ThinClassLength = value.length;
            checkItem.map((item, index) => {
                if (index === key) {
                    item.thinClassLength = ThinClassLength;
                    item.ThinClass = value;
                }
            });
            this.setState({
                checkItem
            });
        }
    }
    handleYsTypeChange (key, value) {
        const { checkItem } = this.state;
        if (key === -1) {
            let CheckType = value;
            this.setState({
                CheckType
            });
        } else {
            let CheckType = value;
            checkItem.map((item, index) => {
                if (index === key) {
                    item.CheckType = CheckType;
                }
            });
            this.setState({
                checkItem
            });
        }
    }
    render () {
        // const { getFieldDecorator } = this.props.form;
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
        const { checkItem, ThinClassLength } = this.state;
        return (<div>
            <Modal
                width='750'
                title='请选择重新批量验收的细班'
                okText='提交'
                visible={this.props.againCheckModalVisible}
                onCancel={this.props.handleCancel}
                onOk={this.handleOk.bind(this)}
            >
                <Form {...formItemLayout}>
                    <Row>
                        <Col span={5}>请选择验收类型</Col>
                        <Col span={1} />
                        <Col span={5}>请选择小班</Col>
                        <Col span={8}>请选择细班(已选100个)</Col>
                        <Col span={5} />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={5}>
                            <Select
                                allowClear
                                style={{ width: 120 }}
                                onChange={this.handleYsTypeChange.bind(this, -1)}
                            >
                                {this.props.ystypeoption}
                            </Select>
                        </Col>
                        <Col span={1} />
                        <Col span={5}>
                            <Select
                                allowClear
                                style={{ width: 120 }}
                                showSearch
                                filterOption={
                                    (input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={this.handleSmallClassChange.bind(this, -1)}
                            >
                                {this.props.smallClassList.map(item => {
                                    return (<Option key={item.No} value={item.No}>{item.Name}</Option>);
                                })}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                mode='multiple'
                                allowClear
                                style={{ width: 220 }}
                                showSearch
                                filterOption={
                                    (input, option) =>
                                        option.props.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={this.handleThinClassChange.bind(this, -1)}
                            >
                                {this.state.thinClassList.map(item => {
                                    return (<Option key={item.No} value={item.No}>{item.Name}</Option>);
                                })}
                            </Select>
                        </Col>
                        <Col span={5}>
                            <span style={{float: 'left', height: 30, lineHeight: '30px'}}>已选择{ThinClassLength}个</span>
                            <Button type='primary' icon='plus' onClick={this.onAddCheckItem.bind(this)} style={{float: 'right'}} />
                        </Col>
                    </Row>
                    {
                        checkItem.map((item, index) => {
                            return (
                                <Row style={{marginTop: 10}} key={index}>
                                    <Col span={5}>
                                        <Select
                                            allowClear
                                            style={{ width: 120 }}
                                            onChange={this.handleYsTypeChange.bind(this, index)}
                                        >
                                            {this.props.ystypeoption}
                                        </Select>
                                    </Col>
                                    <Col span={1} />
                                    <Col span={5}>
                                        <Select
                                            allowClear
                                            style={{ width: 120 }}
                                            showSearch
                                            filterOption={
                                                (input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={this.handleSmallClassChange.bind(this, index)}
                                        >
                                            {this.props.smallClassList.map(item => {
                                                return (<Option key={item.No} value={item.No}>{item.Name}</Option>);
                                            })}
                                        </Select>
                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            mode='multiple'
                                            allowClear
                                            style={{ width: 220 }}
                                            showSearch
                                            filterOption={
                                                (input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={this.handleThinClassChange.bind(this, index)}
                                        >
                                            {item.thinClassList.map(item => {
                                                return (<Option key={item.No} value={item.No}>{item.Name}</Option>);
                                            })}
                                        </Select>
                                    </Col>
                                    <Col span={5}>
                                        <span style={{float: 'left', height: 30, lineHeight: '30px'}}>已选择{item.thinClassLength}个</span>
                                        <Button type='primary' icon='minus' onClick={this.onReduceCheckItem.bind(this, index)} style={{float: 'right'}} />
                                    </Col>
                                </Row>
                            );
                        })
                    }
                    <Row style={{marginTop: 10}}>
                        <Col span={10}>
                            <Form.Item label='审核监理' style={{marginBottom: 0}} >
                                <Select
                                    allowClear showSearch
                                    filterOption={
                                        (input, option) => 
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue=''
                                    onChange={this.handleSupervisorChange.bind(this)}
                                    style={{ width: 223 }}>
                                    {this.props.jianliOptions}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={14} />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={10}>
                            <Form.Item label='审核业主' style={{marginBottom: 0}} >
                                <Select
                                    allowClear showSearch
                                    filterOption={
                                        (input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue=''
                                    onChange={this.handleOwnerChange.bind(this)}
                                    style={{ width: 223 }}>
                                    {this.props.yezhuOptions}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={14} />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
                            <TextArea rows={6} onChange={this.handleOpinionChange.bind(this)} />
                            <Upload {...props}>
                                <Button>
                                    <Icon type='upload' /> 上传附件
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>);
    }
}
export default Form.create()(AgainCheckModal);
