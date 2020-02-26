import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Icon,
    Button,
    Table,
    Modal,
    Select,
    DatePicker,
    Upload,
    Notification,
    Popconfirm
} from 'antd';
import moment from 'moment';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
    }
};
const formItemLayoutTwo = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
class ModalAdd extends Component {
    constructor (props) {
        super(props);
        this.state = {
            FileName: '', // 附件名称
            CheckFile: '', // 附件地址
            dataList: [], // 导入后产生数据
            isSuperAdmin: false, // 是否是超级管理员
            page: 1,
            total: 0
        };
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    componentDidMount () {
        // 设置发起人等信息
        this.setStarter();
    }
    setStarter () {
        let userInfo = getUser();
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({
            Section: userInfo.section,
            Starter: userInfo.name,
            StarterPhone: userInfo.phone,
            constructionOrg: userInfo.orgObj && userInfo.orgObj.OrgName,
            StarterTime: moment()
        });
    }
    handleOk () {
        const {
            flowID,
            flowName,
            originNodeID,
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        const { CheckFile, FileName } = this.state;
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [
                    {
                        Key: 'Summary', // 洽商概要
                        FieldType: 0,
                        Val: values.Summary
                    },
                    {
                        Key: 'Content', // 洽商内容
                        FieldType: 0,
                        Val: values.Content
                    },
                    {
                        Key: 'CheckFile', // 附件地址
                        FieldType: 0,
                        Val: CheckFile
                    },
                    {
                        Key: 'FileName', // 附件名称
                        FieldType: 0,
                        Val: FileName
                    }
                ];
                let params = {
                    FlowID: flowID, // 模板ID
                    FlowName: flowName, // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: originNodeID
                    },
                    NextExecutor: values.TdataReview, // 下一节点执行人
                    Starter: getUser().ID, // 发起人
                    Title: values.Title, // 任务标题
                    WFState: 1 // 流程状态 1运行中
                };
                console.log(123, JSON.stringify(params));
                postStartwork({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '发起洽商申请成功'
                        });
                        this.props.getWorkList();
                        this.props.handleCancel();
                    } else {
                        Notification.error({
                            message: `操作失败，${rep.msg}`
                        });
                    }
                });
            }
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    render () {
        const { dataList, layerType } = this.state;
        const {
            SupervisorList,
            form: { getFieldDecorator }
        } = this.props;
        const Uploadprops = {
            name: '',
            action: '',
            beforeUpload: (file) => {
                const {
                    actions: { uploadFileHandler }
                } = this.props;
                const formdata = new FormData();
                formdata.append('a_file', file);
                uploadFileHandler({}, formdata).then(rep => {
                    this.setState({
                        FileName: file.name,
                        CheckFile: rep
                    });
                });
                return false;
            }
        };
        return (
            <div>
                <Modal
                    title='工程洽商记录'
                    maskClosable={false}
                    visible={this.props.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='工程名称'
                        >
                            {
                                getFieldDecorator('Title', {

                                })(
                                    <Input style={{width: '100%'}} />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='施工单位'
                        >
                            {
                                getFieldDecorator('constructionOrg', {

                                })(
                                    <Input style={{width: '100%'}} readOnly />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='标段'
                        >
                            {
                                getFieldDecorator('Section', {
                                    
                                })(
                                    <Input
                                        readOnly
                                        style={{width: '100%'}}
                                    />
                                )
                            }
                        </FormItem>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayoutTwo}
                                    label='发起人'
                                >
                                    {
                                        getFieldDecorator('Starter', {

                                        })(
                                            <Input style={{width: 140}} readOnly />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...formItemLayoutTwo}
                                    label='联系电话'
                                >
                                    {
                                        getFieldDecorator('StarterPhone', {

                                        })(
                                            <Input style={{width: 140}} readOnly />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label='发起时间'
                        >
                            {
                                getFieldDecorator('StarterTime', {

                                })(
                                    <DatePicker
                                        disabled
                                        style={{width: '100%'}}
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format={dateTimeFormat}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='洽商概要'
                        >
                            {
                                getFieldDecorator('Summary', {

                                })(
                                    <Input style={{width: '100%'}} />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='洽商内容'
                        >
                            {
                                getFieldDecorator('Content', {

                                })(
                                    <TextArea rows={4} style={{width: '100%'}} />
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='监理选择'
                        >
                            {
                                getFieldDecorator('TdataReview', {
                                    rules: [
                                        { required: true, message: '请选择业主文书' }
                                    ]
                                })(
                                    <Select style={{ width: '100%' }} allowClear>
                                        {
                                            SupervisorList.map(item => {
                                                return <Option
                                                    value={item.id}
                                                    title={`${item.Full_Name}(${item.User_Name})`}
                                                    key={item.id}>
                                                    {`${item.Full_Name}(${item.User_Name})`}
                                                </Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='附件'
                        >
                            <Upload {...Uploadprops}>
                                <Button>
                                    <Icon type='upload' /> 上传附件
                                </Button>
                            </Upload>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(ModalAdd);
