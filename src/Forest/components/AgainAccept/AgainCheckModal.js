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
    Row,
    Col,
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
            section: '', // 标段
            CheckType: '',
            ThinClassLength: 0,
            ThinClass: [], // 勾选中的细班
            thinClassList: [], // 细班列表
            checkItem: [{
                thinClassLength: 0,
                thinClassList: [],
                CheckType: '',
                ThinClass: [],
                TreeType: 0
            }], // 验收项
            progress: 0,
            fileUrl: '', // 附件地址
            fileListNew: [], // 附件列表
            loading: false, // 加载
            opinion: '' // 意见
        };
    }
    componentDidMount () {

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
        const { opinion, fileUrl, CheckType, section, thinClassList, ThinClass, ThinClassLength, checkItem } = this.state;
        validateFields((err, values) => {
            console.log('有问题', err);
            if (err) {
                return;
            }
            let newCheckItem = [];
            newCheckItem.push({
                thinClassLength: ThinClassLength,
                thinClassList,
                CheckType,
                ThinClass,
                TreeType: 0
            });
            checkItem.map(item => {
                if (item.CheckType && item.ThinClass && item.ThinClass.length > 0) {
                    newCheckItem.push(item);
                }
            });
            let param = {
                section,
                owner: values.owner,
                supervisor: values.supervisor,
                opinion,
                fileUrl,
                checkItem: newCheckItem
            };
            console.log('传递的参数', param);
            this.props.handleOk(param);
        });
    }
    onAddCheckItem () {
        const { checkItem } = this.state;
        checkItem.push({
            thinClassLength: 0,
            thinClassList: [],
            CheckType: 0,
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
    // 小班改变
    handleSmallClassChange (key, value) {
        console.log('小班', value);
        let sectionArr = value.split('-');
        let section = `${sectionArr[0]}-${sectionArr[1]}-${sectionArr[2]}`;
        const { checkItem } = this.state;
        if (key === -1) {
            // 第一项
            let thinClassList = [];
            this.props.smallClassList.map(item => {
                if (value === item.No) {
                    thinClassList = item.children;
                }
            });
            console.log('细班列表', thinClassList);
            this.setState({
                section,
                thinClassList,
                ThinClass: [],
                ThinClassLength: 0
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
                    item.ThinClass = [];
                    item.ThinClassLength = 0;
                }
            });
            console.log('小班改变', checkItem);
            this.setState({
                section,
                checkItem
            });
        }
    }
    handleThinClassChange (key, value) {
        console.log('细班号', value);
        const { checkItem } = this.state;
        let ThinClassLength = 0;
        if (key === -1) {
            // 第一项
            ThinClassLength = value.length;
            this.setState({
                ThinClassLength,
                ThinClass: value
            });
        } else {
            console.log('细班号', value, checkItem);
            ThinClassLength = value.length;
            checkItem.map((item, index) => {
                if (index === key) {
                    item.thinClassLength = ThinClassLength;
                    item.ThinClass = value;
                }
            });
            console.log('细班号', value, checkItem);
            this.setState({
                checkItem
            });
        }
    }
    // 验收类型
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
        const { checkItem, ThinClassLength, ThinClass } = this.state;
        const {
            form: {
                getFieldDecorator
            },
            ysTypeList
        } = this.props;
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
                        <Col span={8}>请选择细班</Col>
                        <Col span={5} />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={5}>
                            <Select
                                allowClear
                                style={{ width: 120 }}
                                onChange={this.handleYsTypeChange.bind(this, -1)}
                            >
                                {
                                    ysTypeList.map(item => {
                                        return <Option key={item.value} value={item.value}>{item.label}</Option>;
                                    })
                                }
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
                                value={ThinClass}
                                optionLabelProp='value'
                                onChange={this.handleThinClassChange.bind(this, -1)}
                            >
                                {this.state.thinClassList.map(item => {
                                    return (<Option key={item.No} value={item.name}>{item.Name}</Option>);
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
                                            {
                                                ysTypeList.map(item => {
                                                    return <Option key={item.value} value={item.value}>{item.label}</Option>;
                                                })
                                            }
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
                                            value={item.ThinClass}
                                            optionLabelProp='value'
                                            onChange={this.handleThinClassChange.bind(this, index)}
                                        >
                                            {item.thinClassList.map(item => {
                                                return (<Option key={item.No} value={item.name}>{item.Name}</Option>);
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
                            <Form.Item
                                label='审核监理'
                                style={{marginBottom: 0}}
                            >
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
                                            style={{ width: 223 }}>
                                            {this.props.jianliOptions}
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={14} />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={10}>
                            <Form.Item label='审核业主' style={{marginBottom: 0}} >
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
                                            style={{ width: 223 }}>
                                            {this.props.yezhuOptions}
                                        </Select>
                                    )
                                }
                            </Form.Item>
                        </Col>
                        <Col span={14} />
                    </Row>
                    <Row style={{marginTop: 10}}>
                        <Col span={24}>
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
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>);
    }
}
export default Form.create()(AgainCheckModal);
